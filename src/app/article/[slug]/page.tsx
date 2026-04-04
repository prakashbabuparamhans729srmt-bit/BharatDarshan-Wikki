"use client"

import React, { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, MapPin, Share2, History, Bookmark, MessageSquare, ChevronRight, User, Send, Lock, Loader2, Sparkles, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ARTICLES } from '@/lib/mock-data'
import { TranslatorTool } from '@/components/ai/TranslatorTool'
import { AudioGuide } from '@/components/ai/AudioGuide'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, doc, where, limit } from 'firebase/firestore'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'

/**
 * @description Advanced Article Page. Pulls live data from Firestore /articles_published
 * using the slug as the document ID. Supports live Talk Page (Comments) and 
 * dynamic Related Heritage.
 */
export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')

  // 1. Fetch Article from Firestore (Direct Access by Slug ID)
  const articleRef = useMemoFirebase(() => {
    return doc(db, 'articles_published', slug);
  }, [db, slug]);
  
  const { data: liveArticle, isLoading: isArticleLoading } = useDoc(articleRef);

  // Fallback to mock data if not found in Firestore yet
  const staticArticle = ARTICLES.find(a => a.slug === slug) || ARTICLES[0];
  const article = liveArticle || staticArticle;

  const isGuest = user?.isAnonymous || !user

  // 2. Real-time comments from Firestore subcollection
  const commentsQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'articles_published', slug, 'comments'),
      orderBy('createdAt', 'desc')
    );
  }, [db, slug]);
  
  const { data: realTimeComments } = useCollection(commentsQuery);

  // 3. Dynamic Related Heritage (Articles in the same category)
  const relatedQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'articles_published'),
      where('categoryId', '==', article.categoryId || article.category || 'Place'),
      limit(5)
    );
  }, [db, article.categoryId, article.category]);

  const { data: relatedHeritage } = useCollection(relatedQuery);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Read about ${article.title} on BharatDarshan Wiki`,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Article URL has been copied to your clipboard.",
      })
    }
  }

  const handleBookmark = () => {
    if (isGuest) {
      toast({
        title: "Login Required",
        description: "Please create an account to bookmark articles.",
        variant: "destructive"
      })
      return
    }
    toast({
      title: "Saved!",
      description: `${article.title} has been added to your bookmarks.`,
    })
  }

  const handleCommentSubmit = () => {
    if (isGuest) {
      toast({
        title: "Access Denied",
        description: "Guests cannot post comments. Please login to contribute to the Talk page.",
        variant: "destructive"
      })
      return
    }
    if (!newComment.trim()) return
    
    const commentsColRef = collection(db, 'articles_published', slug, 'comments');
    addDocumentNonBlocking(commentsColRef, {
      articleId: slug,
      userId: user.uid,
      content: newComment,
      createdAt: new Date().toISOString(),
      isApproved: true,
      username: user.displayName || user.email?.split('@')[0] || 'Heritage Explorer'
    });

    toast({ title: "Comment Posted", description: "Your contribution has been added to the Talk page." })
    setNewComment('')
  }

  const handleEditClick = () => {
    if (isGuest) {
      toast({
        title: "Login Required",
        description: "Only registered members can edit the wiki archives.",
        variant: "destructive"
      })
      return
    }
    router.push(`/contribute?edit=${slug}`)
  }

  if (isArticleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-24 w-24">
            <Loader2 className="h-24 w-24 text-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Scanning Archive Node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <nav className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-4 px-4">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/browse" className="hover:text-primary transition-colors">Directory</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{article.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start px-4">
        <div className="flex-1 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[10px] px-4 py-1.5 shadow-neon">
                {article.categoryId || article.category || 'Heritage'}
              </Badge>
              {article.parent && (
                <>
                  <span className="text-foreground/20">/</span>
                  <Link href={`/article/${article.parent.toLowerCase().replace(/\s+/g, '-')}`} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest opacity-60">
                    {article.parent}
                  </Link>
                </>
              )}
            </div>
            <h1 className="text-6xl md:text-9xl font-headline font-black text-white leading-[0.9] text-balance drop-shadow-2xl">{article.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleEditClick}
              className="gap-3 rounded-2xl bg-primary text-black hover:bg-primary/90 font-black px-10 h-16 shadow-neon transition-all hover:scale-105 active:scale-95 text-lg"
            >
              {isGuest ? <Lock className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
              Edit Archive
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/article/${slug}/history`)}
              className="gap-3 rounded-2xl border-primary/10 bg-primary/5 hover:bg-primary/10 text-primary font-black h-16 px-8 text-lg"
            >
              <History className="h-5 w-5" />
              History
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" onClick={handleBookmark} className="rounded-2xl border-foreground/10 bg-foreground/5 hover:text-primary h-16 w-16 transition-all hover:scale-110">
                <Bookmark className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare} className="rounded-2xl border-foreground/10 bg-foreground/5 hover:text-primary h-16 w-16 transition-all hover:scale-110">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[500px] h-[500px] relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-foreground/5 group">
          <Image 
            src={article.image || `https://picsum.photos/seed/${slug}/800/600`}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 p-8 rounded-[2.5rem] bg-background/60 backdrop-blur-xl border border-foreground/10">
            <div className="flex items-center gap-4 text-foreground">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="font-black text-xl block leading-none">{article.title}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Heritage Verified Node</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-foreground/5" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 px-4">
        <div className="lg:col-span-2 space-y-12">
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="bg-foreground/5 p-1 rounded-2xl border border-foreground/5 h-16 w-full max-w-2xl">
              <TabsTrigger value="read" className="flex-1 rounded-xl h-13 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest transition-all">Read</TabsTrigger>
              <TabsTrigger value="tools" className="flex-1 rounded-xl h-13 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest transition-all">AI Tools</TabsTrigger>
              <TabsTrigger value="discussion" className="flex-1 rounded-xl h-13 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest transition-all">Talk Page</TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <article className="prose prose-invert max-w-none">
                <div className="text-3xl leading-[1.6] text-foreground/90 font-light selection:bg-primary/20 article-dropcap italic whitespace-pre-wrap">
                  {article.content}
                </div>
                <div className="mt-16 p-10 bg-primary/5 rounded-[3rem] border border-primary/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-150">
                    <History className="h-32 w-32" />
                  </div>
                  <h3 className="text-2xl font-headline font-black text-primary mb-4">Historical Context</h3>
                  <p className="text-xl leading-[1.8] text-foreground/70 font-light italic relative z-10">
                    The history of {article.title} is deeply intertwined with the cultural evolution of the Indian subcontinent. 
                    Recent records maintained by BharatDarshan contributors highlight its strategic importance 
                    across eras and its role as a beacon of heritage and learning. Every revision in our database 
                    strengthens the digital timeline of this heritage node.
                  </p>
                </div>
              </article>
            </TabsContent>

            <TabsContent value="tools" className="mt-16 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <TranslatorTool content={article.content} />
                <AudioGuide text={article.content} title={article.title} />
              </div>
              <Card className="bg-[#161C21]/60 p-12 rounded-[3.5rem] border border-white/5 space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <Sparkles className="h-10 w-10" />
                  <h3 className="text-3xl font-headline font-black text-white">AI Analysis</h3>
                </div>
                <p className="text-xl text-muted-foreground font-light italic leading-relaxed">
                  Our advanced Gemini models are currently indexing the architectural motifs and linguistic nuances of this article. 
                  Soon, you will be able to generate immersive 3D walkthroughs directly from text descriptions.
                </p>
                <Button variant="outline" className="h-14 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] px-8">Check Progress</Button>
              </Card>
            </TabsContent>

            <TabsContent value="discussion" className="mt-16 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-8">
                <div className="bg-[#161C21]/60 p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                    <h3 className="text-3xl font-headline font-black text-white">Community Talk</h3>
                  </div>
                  <div className="flex gap-4">
                    <Input 
                      placeholder={isGuest ? "Login to join the discussion..." : "Add a fact or share your perspective..."} 
                      className="bg-black/20 border-white/10 rounded-2xl h-16 text-lg px-8 focus-visible:ring-primary/50"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isGuest}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    />
                    <Button className="bg-primary text-black rounded-2xl px-10 font-black shadow-neon h-16 transition-transform active:scale-95" onClick={handleCommentSubmit}>
                      <Send className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[600px] pr-6">
                  <div className="space-y-6">
                    {realTimeComments?.map((c: any) => (
                      <div key={c.id} className="bg-[#161C21]/40 p-10 rounded-[3rem] border border-primary/10 space-y-6 animate-in fade-in group hover:bg-[#161C21]/60 transition-all shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-sm transition-transform group-hover:rotate-6">
                              <User className="h-7 w-7" />
                            </div>
                            <div>
                              <span className="font-black text-lg text-white block">{c.username}</span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-black tracking-[0.2em] px-4 py-1.5 shadow-sm">Verified Node</Badge>
                        </div>
                        <p className="text-xl text-foreground/80 leading-relaxed italic font-light selection:bg-primary/20">"{c.content}"</p>
                      </div>
                    ))}
                    {!realTimeComments?.length && (
                      <div className="py-32 text-center space-y-8 opacity-20">
                        <MessageSquare className="h-24 w-24 mx-auto text-primary animate-pulse" />
                        <p className="font-headline text-3xl italic text-white max-w-md mx-auto">The Talk page is silent. Be the first to anchor this node in community history.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-12">
          <div className="bg-[#161C21]/80 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-12 sticky top-28">
            <h3 className="font-headline font-black text-3xl text-white border-b border-white/5 pb-8">Related Heritage</h3>
            <div className="space-y-10">
              {(relatedHeritage && relatedHeritage.length > 0 ? relatedHeritage : ARTICLES.filter(a => a.slug !== slug)).slice(0, 4).map((related: any) => (
                <Link key={related.slug || related.id} href={`/article/${related.slug}`} className="flex gap-6 group items-center">
                  <div className="h-20 w-20 rounded-[1.5rem] relative overflow-hidden shrink-0 border border-white/10 shadow-lg">
                    <Image src={related.image || `https://picsum.photos/seed/${related.slug || related.id}/200/200`} alt={related.title} fill className="object-cover transition-transform duration-700 group-hover:scale-125" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors truncate">{related.title}</h4>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 opacity-60">{related.categoryId || related.category}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" onClick={() => router.push('/browse')} className="w-full text-primary font-black uppercase tracking-[0.4em] text-[10px] hover:bg-primary/10 rounded-2xl h-16 shadow-sm border border-primary/5">
              Explore Full Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
