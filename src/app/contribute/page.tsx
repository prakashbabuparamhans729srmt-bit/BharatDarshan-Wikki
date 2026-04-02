
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
import { doc } from 'firebase/firestore'
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates'

export default function ContributePage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('Place')
  const [parent, setParent] = useState('')
  const [tags, setTags] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AiRefineAndSummarizeContentOutput | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isUserLoading && user?.isAnonymous) {
      toast({
        title: "Registration Required",
        description: "Guests cannot create or edit articles. Please sign up for full access.",
        variant: "destructive"
      })
    }
  }, [user, isUserLoading, toast])

  const handleRefine = async () => {
    if (user?.isAnonymous || !user) {
      toast({ title: "Login Required", description: "Only members can use AI tools.", variant: "destructive" })
      return
    }
    if (!content || content.length < 50) {
      toast({
        title: "Content too short",
        description: "Please write at least 50 characters before refining.",
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
        title: "AI error",
        description: "Could not refine content at this time.",
        variant: "destructive"
      })
    } finally {
      setIsRefining(false)
    }
  }

  const handlePublish = () => {
    if (!user || user.isAnonymous) {
      toast({ title: "Access Denied", description: "You must be logged in to publish articles.", variant: "destructive" })
      return
    }
    if (!title || !content) {
      toast({ title: "Missing Fields", description: "Please fill in the title and content.", variant: "destructive" })
      return
    }

    // Generate a URL-friendly slug
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const articleId = `${slug}-${Date.now()}`;
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
      version: 1,
      isPublished: true,
      tagIds: tags.split(',').map(t => t.trim()).filter(t => !!t),
      image: `https://picsum.photos/seed/${slug}/800/600` // Default placeholder
    };

    setDocumentNonBlocking(articleRef, articleData, { merge: true });

    toast({ 
      title: "Success", 
      description: "Your article has been published to the BharatDarshan archives." 
    })
    
    // Smooth transition to the new article
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
          <h1 className="text-4xl font-headline font-black text-white">Full Access Required</h1>
          <p className="text-muted-foreground text-xl max-w-md mx-auto italic">
            To preserve the integrity of Bharat's heritage, only registered members can contribute to the wiki.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" className="rounded-xl px-8" asChild>
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Link>
          </Button>
          <Button className="bg-primary text-black font-black rounded-xl px-8 neon-glow" asChild>
            <Link href="/auth">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-primary">Create New Article</h1>
          <p className="text-muted-foreground">Contribute your knowledge to the BharatDarshan Wiki ecosystem.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handlePublish} className="gap-2 bg-primary text-black hover:bg-primary/90 font-bold rounded-xl neon-glow">
            <Save className="h-4 w-4" />
            Publish Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-white/5 rounded-[2rem] overflow-hidden">
            <CardContent className="p-10 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-primary/70 ml-1">Article Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Shore Temple, Mahabalipuram" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-14 bg-black/20 border-white/10 text-xl font-headline focus-visible:ring-primary/50 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="content" className="text-xs font-black uppercase tracking-widest text-primary/70">Content Body</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary gap-2 hover:bg-primary/10 rounded-lg px-4"
                    onClick={handleRefine}
                    disabled={isRefining}
                  >
                    {isRefining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    AI Refine
                  </Button>
                </div>
                <Textarea 
                  id="content" 
                  placeholder="Start writing your knowledge here..." 
                  className="min-h-[500px] bg-black/20 border-white/10 text-lg leading-relaxed focus-visible:ring-primary/50 rounded-2xl p-6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {aiFeedback && (
            <Card className="border-primary/20 bg-primary/5 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                <div>
                  <CardTitle className="text-2xl font-headline font-black text-primary">AI Content Analysis</CardTitle>
                  <CardDescription className="text-white/40">Suggestions to improve your article quality.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setAiFeedback(null)} className="rounded-full hover:bg-primary/10 text-primary">
                  <AlertCircle className="h-6 w-6" />
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/70">Summary Suggestion</h4>
                  <p className="text-lg italic font-light text-white/80 border-l-4 border-primary/20 pl-6 leading-relaxed">"{aiFeedback.summary}"</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/70">Style Improvements</h4>
                  <div className="p-6 bg-black/40 rounded-2xl border border-white/10 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {aiFeedback.suggestions}
                  </div>
                </div>

                {aiFeedback.factCheckAreas.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/70">Fact Check Areas</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiFeedback.factCheckAreas.map((area, i) => (
                        <li key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-xs font-bold italic">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
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
          <Card className="border-white/5 bg-white/5 rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-headline font-bold">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Classification</Label>
                <div className="flex flex-wrap gap-2">
                  {['State', 'District', 'Place'].map(cat => (
                    <Badge 
                      key={cat} 
                      variant={cat === categoryId ? 'default' : 'outline'} 
                      onClick={() => setCategoryId(cat)}
                      className={`cursor-pointer px-4 py-1.5 rounded-xl transition-all ${cat === categoryId ? 'bg-primary text-black' : 'border-white/10 hover:border-primary/40'}`}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="parent" className="text-[10px] font-black uppercase tracking-widest text-white/40">Parent Territory</Label>
                <Input 
                  id="parent" 
                  placeholder="Parent state or district" 
                  className="bg-black/20 border-white/10 h-12 rounded-xl"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-white/40">Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="temple, ancient, south india" 
                  className="bg-black/20 border-white/10 h-12 rounded-xl"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary p-8 rounded-[2rem] text-black border-none shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              <h4 className="font-black uppercase tracking-widest text-xs">Editor Guidelines</h4>
            </div>
            <ul className="text-xs space-y-3 font-bold italic opacity-80 list-none">
              <li className="flex gap-2"><span className="text-black">•</span> Ensure all content is factual.</li>
              <li className="flex gap-2"><span className="text-black">•</span> Cite your sources where possible.</li>
              <li className="flex gap-2"><span className="text-black">•</span> Avoid promotional language.</li>
              <li className="flex gap-2"><span className="text-black">•</span> Use standard Indian spellings.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
