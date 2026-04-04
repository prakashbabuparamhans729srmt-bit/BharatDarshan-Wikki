
"use client"

import React, { useState, useEffect, Suspense } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { doc, collection, getDoc } from 'firebase/firestore'
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates'

/**
 * @description Advanced Contribution Page. Allows users to create/edit articles,
 * refine them with AI, and publish them to the live wiki database with version history.
 */
function ContributeForm() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('edit')
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('Place')
  const [parent, setParent] = useState('')
  const [tags, setTags] = useState('')
  const [version, setVersion] = useState(1.0)
  
  const [isRefining, setIsRefining] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AiRefineAndSummarizeContentOutput | null>(null)
  
  const { toast } = useToast()
  const router = useRouter()

  // Load existing article if in edit mode
  useEffect(() => {
    if (editSlug && db) {
      const fetchArticle = async () => {
        const docRef = doc(db, 'articles_published', editSlug)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()
          setTitle(data.title || '')
          setContent(data.content || '')
          setCategoryId(data.categoryId || 'Place')
          setParent(data.parent || '')
          setTags((data.tagIds || []).join(', '))
          setVersion(data.version || 1.0)
        }
      }
      fetchArticle()
    }
  }, [editSlug, db])

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
        description: "Could not refine content at this time.",
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
      toast({ title: "Missing Information", description: "Every heritage entry requires a title and descriptive content.", variant: "destructive" })
      return
    }

    setIsPublishing(true)

    // Generate stable slug for Wiki node
    const slug = editSlug || title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const articleId = slug; 
    const articleRef = doc(db, 'articles_published', articleId);

    const newVersion = editSlug ? parseFloat((version + 0.1).toFixed(1)) : 1.0;

    const articleData = {
      id: articleId,
      title,
      slug,
      content,
      categoryId,
      parent: parent || null,
      authorId: user.uid,
      createdAt: editSlug ? (new Date().toISOString()) : (new Date().toISOString()), 
      updatedAt: new Date().toISOString(),
      version: newVersion,
      isPublished: true,
      tagIds: tags.split(',').map(t => t.trim()).filter(t => !!t),
      image: `https://picsum.photos/seed/${slug}/800/600` 
    };

    setDocumentNonBlocking(articleRef, articleData, { merge: true });

    // Track every publication node in revision history
    const revisionsColRef = collection(db, 'articles_published', articleId, 'revisions');
    addDocumentNonBlocking(revisionsColRef, {
      articleId,
      userId: user.uid,
      username: user.displayName || user.email?.split('@')[0] || 'Heritage Architect',
      revisionNumber: newVersion,
      contentSnapshot: content,
      changesSummary: editSlug ? `Refined archive to version ${newVersion}.` : "Initial publication of the heritage node.",
      createdAt: new Date().toISOString()
    });

    toast({ 
      title: editSlug ? "Archive Updated" : "Archive Published", 
      description: `"${title}" has been successfully added to the global wiki.` 
    })
    
    setTimeout(() => {
      router.push(`/article/${slug}`)
    }, 1500)
  }

  if (user?.isAnonymous || !user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8 animate-in fade-in duration-700">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary shadow-neon">
          <Lock className="h-12 w-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-black text-white">Advanced Access Required</h1>
          <p className="text-muted-foreground text-xl max-w-md mx-auto italic leading-relaxed font-light">
            To maintain historical accuracy, only verified contributors can create live wiki entries.
          </p>
        </div>
        <div className="flex gap-4 justify-center pt-6">
          <Button variant="outline" className="rounded-xl px-8 border-white/10 hover:bg-white/5 h-14" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Link>
          </Button>
          <Button className="bg-primary text-black font-black rounded-xl px-12 h-14 shadow-neon transition-all hover:scale-105" asChild>
            <Link href="/auth">Join the Collective</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-headline font-black text-white">{editSlug ? 'Refine Heritage' : 'Contribute Node'}</h1>
          <p className="text-muted-foreground text-xl font-light italic">Building the digital timeline of India's legacy.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handlePublish} 
            disabled={isPublishing}
            className="gap-3 bg-primary text-black hover:bg-primary/90 font-black rounded-xl shadow-neon h-14 px-10 text-lg transition-all hover:scale-105"
          >
            {isPublishing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {editSlug ? 'Update Wiki' : 'Publish Entry'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/5 bg-[#161C21]/60 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-2xl">
            <CardContent className="p-12 space-y-10">
              <div className="space-y-4">
                <Label htmlFor="title" className="text-xs font-black uppercase tracking-[0.3em] text-primary/70 ml-1">Archive Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Shore Temple, Mahabalipuram" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-20 bg-black/20 border-white/10 text-3xl font-headline font-black text-white focus-visible:ring-primary/50 rounded-2xl p-8"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="content" className="text-xs font-black uppercase tracking-[0.3em] text-primary/70">Heritage Content</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary gap-2 hover:bg-primary/10 rounded-lg px-4 font-black uppercase text-[10px] tracking-widest"
                    onClick={handleRefine}
                    disabled={isRefining}
                  >
                    {isRefining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    AI Refinement
                  </Button>
                </div>
                <Textarea 
                  id="content" 
                  placeholder="Describe the historical significance, architecture, and legends..." 
                  className="min-h-[500px] bg-black/20 border-white/10 text-xl leading-[1.8] font-light italic focus-visible:ring-primary/50 rounded-3xl p-10 selection:bg-primary/20"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {aiFeedback && (
            <Card className="border-primary/20 bg-primary/5 rounded-[3.5rem] overflow-hidden animate-in slide-in-from-bottom-8 duration-700 shadow-neon">
              <CardHeader className="flex flex-row items-center justify-between p-12 pb-6">
                <div>
                  <CardTitle className="text-3xl font-headline font-black text-primary flex items-center gap-4">
                    <Sparkles className="h-8 w-8" />
                    Assistant Intelligence
                  </CardTitle>
                  <CardDescription className="text-white/40 text-lg italic mt-2">Historical composition analysis complete.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-12 pt-0 space-y-12">
                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/70">Abstract Summary</h4>
                  <p className="text-2xl italic font-light text-white/90 border-l-4 border-primary/40 pl-8 leading-relaxed">"{aiFeedback.summary}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/70">Refinement Log</h4>
                  <div className="p-8 bg-black/40 rounded-[2rem] border border-white/10 text-base leading-relaxed whitespace-pre-wrap font-medium text-white/70 italic">
                    {aiFeedback.suggestions}
                  </div>
                </div>

                {aiFeedback.factCheckAreas.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary/70">Factual Verifications</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiFeedback.factCheckAreas.map((area, i) => (
                        <li key={i} className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 text-sm font-bold italic group hover:border-primary/30 transition-all">
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

        <div className="space-y-8">
          <Card className="border-white/5 bg-[#161C21]/60 backdrop-blur-xl rounded-[3rem] shadow-xl overflow-hidden">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-2xl font-headline font-black text-white">Advanced Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-0 space-y-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Heritage Node Type</Label>
                <div className="flex flex-wrap gap-2">
                  {['State', 'District', 'Place'].map(cat => (
                    <Badge 
                      key={cat} 
                      variant={cat === categoryId ? 'default' : 'outline'} 
                      onClick={() => setCategoryId(cat)}
                      className={`cursor-pointer px-6 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${cat === categoryId ? 'bg-primary text-black shadow-neon' : 'border-white/10 hover:border-primary/40'}`}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="parent" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Parent Territory</Label>
                <Input 
                  id="parent" 
                  placeholder="e.g., Uttar Pradesh" 
                  className="bg-black/20 border-white/10 h-16 rounded-2xl px-6 focus-visible:ring-primary/50 text-white font-bold"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Knowledge Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="temple, ancient, architecture" 
                  className="bg-black/20 border-white/10 h-16 rounded-2xl px-6 focus-visible:ring-primary/50 text-white font-bold"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary p-12 rounded-[3.5rem] text-black border-none shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-[-30px] right-[-30px] opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-1000">
              <FileText className="h-48 w-48" />
            </div>
            <div className="flex items-center gap-4">
              <Sparkles className="h-8 w-8" />
              <h4 className="font-black uppercase tracking-[0.3em] text-sm">A-Z Flow Guide</h4>
            </div>
            <ul className="text-base space-y-6 font-bold italic opacity-90 list-none leading-relaxed relative z-10">
              <li className="flex gap-4"><span className="text-black/30 font-black">01</span> All content must be cross-verified for accuracy.</li>
              <li className="flex gap-4"><span className="text-black/30 font-black">02</span> Avoid political bias or promotional phrasing.</li>
              <li className="flex gap-4"><span className="text-black/30 font-black">03</span> Use standard ISO spellings for regional names.</li>
              <li className="flex gap-4"><span className="text-black/30 font-black">04</span> Every change is tracked in Revision History.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ContributePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-16 w-16 text-primary animate-spin" /></div>}>
      <ContributeForm />
    </Suspense>
  )
}
