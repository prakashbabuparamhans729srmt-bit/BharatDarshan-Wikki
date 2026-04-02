
"use client"

import React, { use, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, MapPin, Share2, History, Bookmark, MessageSquare, Sparkles, ChevronRight, MoreHorizontal, User, Send, ThumbsUp, Lock, Headphones, Loader2 } from 'lucide-react'
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, where, limit, orderBy } from 'firebase/firestore'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')

  // 1. Fetch Article from Firestore (Live Query by Slug)
  const articleQuery = useMemoFirebase(() => {
    return query(collection(db, 'articles_published'), where('slug', '==', slug), limit(1));
  }, [db, slug]);
  
  const { data: articleDocs, isLoading: isArticleLoading } = useCollection(articleQuery);

  // Fallback to mock data if not found in Firestore yet
  const staticArticle = ARTICLES.find(a => a.slug === slug) || ARTICLES[0];
  const article = (articleDocs && articleDocs.length > 0) ? articleDocs[0] : staticArticle;

  const isGuest = user?.isAnonymous

  // 2. Real-time comments from Firestore
  const commentsQuery = useMemoFirebase(() => {
    // Comments subcollection under the article document
    // Note: We use the unique article slug as the path segment for simplicity in this wiki
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
    if (isGuest || !user) {
      toast({
        title: "Access Denied",
        description: "Guest users cannot post comments. Please login.",
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
        description: "Only registered members can edit the wiki.",
        variant: "destructive"
      })
      return
    }
    router.push('/contribute')
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
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/browse" className="hover:text-primary transition-colors">Directory</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[10px] px-3 py-1">
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
            <h1 className="text-6xl md:text-8xl font-headline font-black text-white leading-tight">{article.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleEditClick}
              className="gap-2 rounded-full bg-primary text-black hover:bg-primary/90 font-bold px-8 h-12 neon-glow transition-all hover:scale-105"
            >
              {isGuest ? <Lock className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              Edit This Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/article/${slug}/history`)}
              className="gap-2 rounded-full border-primary/10 bg-primary/5 hover:bg-primary/10 text-primary font-bold h-12 px-6"
            >
              <History className="h-4 w-4" />
              Revision History
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleBookmark}
                className="rounded-full border-foreground/10 bg-foreground/5 hover:text-primary h-12 w-12 transition-all hover:scale-110"
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
                className="rounded-full border-foreground/10 bg-foreground/5 hover:text-primary h-12 w-12 transition-all hover:scale-110"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-foreground/10 bg-foreground/5 hover:text-primary h-12 w-12 transition-all hover:scale-110">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[450px] h-[450px] relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-foreground/5 group">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="bg-foreground/5 p-1 rounded-2xl border border-foreground/5 h-14">
              <TabsTrigger value="read" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">Read Content</TabsTrigger>
              <TabsTrigger value="tools" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">AI & Tools</TabsTrigger>
              <TabsTrigger value="discussion" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">Talk Page</TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="mt-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose prose-invert max-w-none">
                <p className="text-2xl leading-[1.7] text-foreground/90 font-light selection:bg-primary/20 article-dropcap">
                  {article.content}
                </p>
                <p className="text-xl leading-[1.8] text-foreground/70 font-light mt-8">
                  The history of {article.title} is deeply intertwined with the cultural evolution of the Indian subcontinent. 
                  Recent records maintained by BharatDarshan contributors highlight its strategic importance 
                  across eras and its role as a beacon of heritage and learning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-foreground/5 border border-foreground/5 shadow-none rounded-[2rem] p-8 hover:bg-foreground/10 transition-all hover:scale-[1.02]">
                  <div className="flex gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary neon-glow">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold font-headline text-xl text-foreground">Geographical Data</h4>
                      <p className="text-sm text-primary/70 font-bold mt-1 uppercase tracking-wider">{article.tags?.[0] || article.tagIds?.[0] || 'Heritage'}</p>
                      <p className="text-sm text-foreground/50 mt-1 italic">Classification: {article.category}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-foreground/5 border border-foreground/5 shadow-none rounded-[2rem] p-8 hover:bg-foreground/10 transition-all hover:scale-[1.02]">
                  <div className="flex gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary neon-glow">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold font-headline text-xl text-foreground">Wiki Stats</h4>
                      <p className="text-sm text-foreground/70 mt-1">Verified by <span className="text-primary font-bold">14+ Nodes</span></p>
                      <p className="text-sm text-foreground/50 mt-1 italic">Last edited recently</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TranslatorTool content={article.content} />
                <AudioGuide text={article.content} title={article.title} />
              </div>
              
              <div className="border border-foreground/5 bg-foreground/5 rounded-[2rem] overflow-hidden group">
                <div className="p-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary neon-glow">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-bold text-foreground">Smart Content Refiner</h3>
                      <p className="text-muted-foreground font-light">Advanced AI analysis for tone, accuracy, and style.</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleEditClick}
                    className="w-full h-14 border-primary/20 hover:border-primary text-primary font-bold text-lg rounded-2xl group transition-all"
                  >
                    Launch AI Assistant
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="bg-foreground/5 p-6 rounded-[2rem] border border-foreground/5 space-y-4">
                  <h3 className="text-xl font-headline font-bold text-foreground">Community Discussion</h3>
                  <div className="flex gap-3">
                    <Input 
                      placeholder={isGuest ? "Login to share your thoughts..." : "Share your thoughts or suggest changes..."} 
                      className="bg-background border-foreground/10 rounded-xl"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isGuest}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    />
                    <Button 
                      className="bg-primary text-black rounded-xl px-6 font-bold"
                      onClick={handleCommentSubmit}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {realTimeComments?.map((c: any) => (
                      <div key={c.id} className="bg-foreground/5 p-6 rounded-2xl border border-primary/20 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-sm text-foreground">{c.username}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">Live Contribution</Badge>
                        </div>
                        <p className="text-sm text-foreground/70 leading-relaxed italic">"{c.content}"</p>
                      </div>
                    ))}
                    {!realTimeComments?.length && (
                      <div className="py-20 text-center space-y-4 opacity-30">
                        <MessageSquare className="h-12 w-12 mx-auto" />
                        <p className="font-bold italic">No discussions yet. Be the first to contribute!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-10">
          <div className="bg-secondary p-10 rounded-[2.5rem] border border-foreground/5 shadow-2xl space-y-8">
            <h3 className="font-headline font-bold text-2xl text-foreground border-b border-foreground/5 pb-4">Related Heritage</h3>
            <div className="space-y-6">
              {ARTICLES.filter(a => a.slug !== slug).map(related => (
                <Link key={related.slug} href={`/article/${related.slug}`} className="flex gap-4 group items-center">
                  <div className="h-16 w-16 rounded-2xl relative overflow-hidden shrink-0 border border-foreground/10">
                    <Image src={related.image} alt={related.title} fill className="object-cover transition-transform group-hover:scale-125" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">{related.title}</h4>
                    <p className="text-xs text-primary font-black uppercase tracking-widest">{related.category}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/browse')}
              className="w-full text-primary font-bold hover:bg-primary/5 rounded-xl h-12"
            >
              Explore Full Map
            </Button>
          </div>

          <div className="bg-primary p-10 rounded-[2.5rem] text-black border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
              <Sparkles className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="font-headline font-black text-3xl leading-tight">Join the Knowledge Revolution</h3>
              <p className="text-black/70 text-lg leading-relaxed font-bold italic">
                Help us map the vast heritage of India. Your expertise matters.
              </p>
              <Button 
                onClick={handleEditClick}
                className="w-full bg-black text-primary hover:bg-black/90 font-black h-16 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                {isGuest ? "Sign Up to Edit" : "Become An Editor"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
