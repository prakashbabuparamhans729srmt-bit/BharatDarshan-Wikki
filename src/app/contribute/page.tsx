
"use client"

import React, { useState, useEffect } from 'react'
import { FileText, Save, Eye, Sparkles, AlertCircle, Loader2, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { aiRefineAndSummarizeContent, AiRefineAndSummarizeContentOutput } from '@/ai/flows/ai-refine-and-summarize-content'
import { useToast } from '@/hooks/use-toast'
import { useUser, useFirestore } from '@/firebase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { doc, collection, serverTimestamp } from 'firebase/firestore'
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates'

/**
 * @description Advanced Contribution Page. Allows users to create new articles,
 * refine them with AI, and publish them to the live wiki database with version history.
 */
export default function ContributePage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('Place')
  const [parent, setParent] = useState('')
  const [tags, setTags] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AiRefineAndSummarizeContentOutput | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isUserLoading && user?.isAnonymous) {
      toast({
        title: "Registration Required",
        description: "Guests cannot create articles. Please sign up for full access to the wiki builder.",
        variant: "destructive"
      })
    }
  }, [user, isUserLoading, toast])

  const handleRefine = async () => {
    if (!user || user.isAnonymous) {
      toast({ title: "Login Required", description: "Only registered members can use AI refinement tools.", variant: "destructive" })
      return
    }
    if (!content || content.length < 50) {
      toast({
        title: "Content too short",
        description: "Please write at least 50 characters before calling the AI Assistant.",
        variant: "destructive"
      })
      return
    }

    setIsRefining(true)
    try {
      const response = await aiRefineAndSummarizeContent({ content })
      setAiFeedback(response)
    } catch (err) {
      toast({
        title: "AI Analysis Failed",
        description: "Could not refine content at this time. Our AI models are busy indexing heritage.",
        variant: "destructive"
      })
    } finally {
      setIsRefining(false)
    }
  }

  const handlePublish = () => {
    if (!user || user.isAnonymous) {
      toast({ title: "Access Denied", description: "You must be a registered member to publish live entries.", variant: "destructive" })
      return
    }
    if (!title || !content) {
      toast({ title: "Missing Information", description: "Every legacy entry requires a title and descriptive content.", variant: "destructive" })
      return
    }

    setIsPublishing(true)

    // Generate a permanent URL-friendly slug
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const articleId = slug; 
    const articleRef = doc(db, 'articles_published', articleId);

    const articleData = {
      id: articleId,
      title,
      slug,
      content,
      categoryId,
      parent: parent || null,
      authorId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1.0,
      isPublished: true,
      tagIds: tags.split(',').map(t => t.trim()).filter(t => !!t),
      image: `https://picsum.photos/seed/${slug}/800/600`
    };

    // Save Article to Published Collection
    setDocumentNonBlocking(articleRef, articleData, { merge: true });

    // Initialize Revision History
    const revisionsColRef = collection(db, 'articles_published', articleId, 'revisions');
    addDocumentNonBlocking(revisionsColRef, {
      articleId,
      userId: user.uid,
      username: user.displayName || user.email?.split('@')[0] || 'Heritage Architect',
      revisionNumber: 1.0,
      contentSnapshot: content,
      changesSummary: "Initial publication of the heritage node.",
      createdAt: new Date().toISOString()
    });

    toast({ 
      title: "Archive Published", 
      description: `"${title}" has been added to BharatDarshan Wiki.` 
    })
    
    // Redirect to the new article page
    setTimeout(() => {
      router.push(`/article/${slug}`)
    }, 1500)
  }

  if (user?.isAnonymous) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-700">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Lock className="h-12 w-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-black text-white">Advanced Access Required</h1>
          <p className="text-muted-foreground text-xl max-w-md mx-auto italic leading-relaxed">
            To maintain the high standards of India's digital history, only verified contributors can create live wiki entries.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="rounded-xl px-8 border-white/10 hover:bg-white/5" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Link>
          </Button>
          <Button className="bg-primary text-black font-black rounded-xl px-8 neon-glow transition-all hover:scale-105" asChild>
            <Link href="/auth">Sign Up for Full Access</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 border-l-4 border-primary pl-6">
          <h1 className="text-5xl font-headline font-black text-white">Draft Archive</h1>
          <p className="text-muted-foreground text-lg italic">Constructing new knowledge nodes for the Bharat ecosystem.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 h-12">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing}
            className="gap-2 bg-primary text-black hover:bg-primary/90 font-black rounded-xl neon-glow h-12 px-8"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Publish to Wiki
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardContent className="p-10 space-y-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 ml-1">Archive Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Shore Temple, Mahabalipuram" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-16 bg-black/20 border-white/10 text-2xl font-headline font-bold focus-visible:ring-primary/50 rounded-2xl p-6"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="content" className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Heritage Content</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary gap-2 hover:bg-primary/10 rounded-lg px-4 font-black uppercase text-[10px]"
                    onClick={handleRefine}
                    disabled={isRefining}
                  >
                    {isRefining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    AI Refine & Summarize
                  </Button>
                </div>
                <Textarea 
                  id="content" 
                  placeholder="Tell the story of this heritage point..." 
                  className="min-h-[500px] bg-black/20 border-white/10 text-lg leading-relaxed focus-visible:ring-primary/50 rounded-3xl p-8"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {aiFeedback && (
            <Card className="border-primary/20 bg-primary/5 rounded-[3rem] overflow-hidden animate-in slide-in-from-bottom-6 duration-700 shadow-neon">
              <CardHeader className="flex flex-row items-center justify-between p-10 pb-6 border-b border-primary/10">
                <div>
                  <CardTitle className="text-3xl font-headline font-black text-primary flex items-center gap-3">
                    <Sparkles className="h-8 w-8" />
                    Assistant Intelligence
                  </CardTitle>
                  <CardDescription className="text-white/40 italic">Refining the narrative for historical accuracy and flow.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setAiFeedback(null)} className="rounded-full hover:bg-primary/10 text-primary">
                  <AlertCircle className="h-6 w-6" />
                </Button>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/70">Suggested Abstract</h4>
                  <p className="text-xl italic font-light text-white/80 border-l-4 border-primary/40 pl-8 leading-relaxed">"{aiFeedback.summary}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/70">Composition Improvements</h4>
                  <div className="p-8 bg-black/40 rounded-[2rem] border border-white/10 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {aiFeedback.suggestions}
                  </div>
                </div>

                {aiFeedback.factCheckAreas.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/70">Fact Check Nodes</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiFeedback.factCheckAreas.map((area, i) => (
                        <li key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold italic group hover:border-primary/30 transition-all">
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 group-hover:animate-ping" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-white/5 bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-headline font-bold text-white">Legacy Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Wiki Category</Label>
                <div className="flex flex-wrap gap-2">
                  {['State', 'District', 'Place'].map(cat => (
                    <Badge 
                      key={cat} 
                      variant={cat === categoryId ? 'default' : 'outline'} 
                      onClick={() => setCategoryId(cat)}
                      className={`cursor-pointer px-5 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${cat === categoryId ? 'bg-primary text-black' : 'border-white/10 hover:border-primary/40'}`}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="parent" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Territory Map</Label>
                <Input 
                  id="parent" 
                  placeholder="Parent state or district" 
                  className="bg-black/20 border-white/10 h-14 rounded-2xl px-6 focus-visible:ring-primary/50"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-primary/40">Heritage Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="temple, ancient, south india" 
                  className="bg-black/20 border-white/10 h-14 rounded-2xl px-6 focus-visible:ring-primary/50"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary p-10 rounded-[2.5rem] text-black border-none shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-1000">
              <Sparkles className="h-32 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-7 w-7" />
              <h4 className="font-black uppercase tracking-[0.2em] text-xs">A-Z Guidelines</h4>
            </div>
            <ul className="text-sm space-y-4 font-bold italic opacity-90 list-none leading-relaxed">
              <li className="flex gap-3"><span className="text-black/40 font-black">01</span> Ensure all historical content is cross-verified.</li>
              <li className="flex gap-3"><span className="text-black/40 font-black">02</span> Avoid promotional or biased language.</li>
              <li className="flex gap-3"><span className="text-black/40 font-black">03</span> Use standard ISO spellings for Indian names.</li>
              <li className="flex gap-3"><span className="text-black/40 font-black">04</span> Link to parent territories for better mapping.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
