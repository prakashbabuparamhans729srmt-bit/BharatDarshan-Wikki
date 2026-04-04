
"use client"

import React, { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, MapPin, Share2, History, Bookmark, MessageSquare, ChevronRight, User, Send, Lock, Loader2 } from 'lucide-react'
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
import { collection, query, orderBy, doc } from 'firebase/firestore'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'

/**
 * @description Advanced Article Page. Pulls live data from Firestore /articles_published
 * using the slug as the document ID. Supports live Talk Page (Comments).
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
    // Advanced Flow: Pass the slug as an 'edit' parameter to the contribute page
    router.push(`/contribute?edit=${slug}`)
  }

  if (isArticleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Scanning Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 px-4">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/browse" className="hover:text-primary transition-colors">Directory</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start px-4">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-neon">
                {article.category || 'Heritage'}
              </Badge>
              {article.parent && (
                <>
                  <span className="text-foreground/20">/</span>
                  <Link href={`/article/${article.parent.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-bold text-primary hover:underline capitalize tracking-widest">
                    {article.parent}
                  </Link>
                </>
              )}
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-white leading-tight drop-shadow-2xl">{article.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleEditClick}
              className="gap-2 rounded-full bg-primary text-black hover:bg-primary/90 font-black px-8 h-12 shadow-neon transition-all hover:scale-105"
            >
              {isGuest ? <Lock className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              Edit Archive
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/article/${slug}/history`)}
              className="gap-2 rounded-full border-primary/10 bg-primary/5 hover:bg-primary/10 text-primary font-black h-12 px-6"
            >
              <History className="h-4 w-4" />
              History
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleBookmark} className="rounded-full border-foreground/10 bg-foreground/5 hover:text-primary h-12 w-12 transition-all hover:scale-110">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full border-foreground/10 bg-foreground/5 hover:text-primary h-12 w-12 transition-all hover:scale-110">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[450px] h-[450px] relative rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-foreground/5 group">
          <Image 
            src={article.image || `https://picsum.photos/seed/${slug}/800/600`}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-background/60 backdrop-blur-md border border-foreground/10">
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">{article.title}, India</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-foreground/5" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 px-4">
        <div className="lg:col-span-2 space-y-12">
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="bg-foreground/5 p-1 rounded-2xl border border-foreground/5 h-14">
              <TabsTrigger value="read" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">Read</TabsTrigger>
              <TabsTrigger value="tools" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">AI Tools</TabsTrigger>
              <TabsTrigger value="discussion" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">Talk Page</TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="mt-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose prose-invert max-w-none">
                <p className="text-2xl leading-[1.7] text-foreground/90 font-light selection:bg-primary/20 article-dropcap">
                  {article.content}
                </p>
                <p className="text-xl leading-[1.8] text-foreground/70 font-light mt-8 italic">
                  The history of {article.title} is deeply intertwined with the cultural evolution of the Indian subcontinent. 
                  Recent records maintained by BharatDarshan contributors highlight its strategic importance 
                  across eras and its role as a beacon of heritage and learning.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TranslatorTool content={article.content} />
                <AudioGuide text={article.content} title={article.title} />
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="bg-[#161C21]/60 p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-xl">
                  <h3 className="text-2xl font-headline font-black text-white">Community Talk</h3>
                  <div className="flex gap-4">
                    <Input 
                      placeholder={isGuest ? "Login to join the discussion..." : "Add a fact or share your perspective..."} 
                      className="bg-black/20 border-white/10 rounded-xl h-12"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isGuest}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    />
                    <Button className="bg-primary text-black rounded-xl px-8 font-black shadow-neon h-12" onClick={handleCommentSubmit}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {realTimeComments?.map((c: any) => (
                      <div key={c.id} className="bg-[#161C21]/40 p-8 rounded-[2rem] border border-primary/20 space-y-4 animate-in fade-in group hover:bg-[#161C21]/60 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="font-black text-sm text-white block">{c.username}</span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[8px] border-primary/20 text-primary uppercase font-black tracking-[0.2em] px-3">Verified Node</Badge>
                        </div>
                        <p className="text-lg text-foreground/80 leading-relaxed italic font-light">"{c.content}"</p>
                      </div>
                    ))}
                    {!realTimeComments?.length && (
                      <div className="py-24 text-center space-y-6 opacity-30">
                        <MessageSquare className="h-16 w-16 mx-auto text-primary" />
                        <p className="font-headline text-2xl italic text-white">The Talk page is silent. Be the first to speak.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-10">
          <div className="bg-[#161C21]/80 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-10 sticky top-24">
            <h3 className="font-headline font-black text-2xl text-white border-b border-white/5 pb-6">Related Heritage</h3>
            <div className="space-y-8">
              {ARTICLES.filter(a => a.slug !== slug).slice(0, 3).map(related => (
                <Link key={related.slug} href={`/article/${related.slug}`} className="flex gap-4 group items-center">
                  <div className="h-16 w-16 rounded-2xl relative overflow-hidden shrink-0 border border-white/10">
                    <Image src={related.image} alt={related.title} fill className="object-cover transition-transform group-hover:scale-125" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">{related.title}</h4>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">{related.category}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" onClick={() => router.push('/browse')} className="w-full text-primary font-black uppercase tracking-[0.3em] text-[10px] hover:bg-primary/10 rounded-xl h-14">
              Explore Full Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
