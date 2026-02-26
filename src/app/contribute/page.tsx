
"use client"

import React, { useState } from 'react'
import { FileText, Save, Eye, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { aiRefineAndSummarizeContent, AiRefineAndSummarizeContentOutput } from '@/ai/flows/ai-refine-and-summarize-content'
import { useToast } from '@/hooks/use-toast'

export default function ContributePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AiRefineAndSummarizeContentOutput | null>(null)
  const { toast } = useToast()

  const handleRefine = async () => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-primary">Create New Article</h1>
          <p className="text-muted-foreground">Contribute your knowledge to the BharatDarshan Wiki ecosystem.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Publish Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/10">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Shore Temple, Mahabalipuram" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-headline"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary gap-2 hover:bg-primary/10"
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
                  className="min-h-[400px] text-base leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {aiFeedback && (
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-headline text-accent">AI Content Analysis</CardTitle>
                  <CardDescription>Suggestions to improve your article quality.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setAiFeedback(null)}>
                  <AlertCircle className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-accent mb-2">Summary Suggestion</h4>
                  <p className="text-sm italic">{aiFeedback.summary}</p>
                </div>

                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-accent mb-2">Style Improvements</h4>
                  <div className="p-3 bg-background rounded-lg border border-accent/10 text-sm whitespace-pre-wrap">
                    {aiFeedback.suggestions}
                  </div>
                </div>

                {aiFeedback.factCheckAreas.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-accent mb-2">Fact Check Areas</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {aiFeedback.factCheckAreas.map((area, i) => (
                        <li key={i}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Classification</Label>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">State</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">District</Badge>
                  <Badge variant="default" className="bg-primary cursor-pointer">Place</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Parent Territory</Label>
                <Input id="parent" placeholder="Parent state or district" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="temple, ancient, south india" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-none shadow-none">
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold">Guidelines</h4>
              <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
                <li>Ensure all content is factual and neutral.</li>
                <li>Cite your sources where possible.</li>
                <li>Avoid promotional or biased language.</li>
                <li>Use standard spellings for Indian places.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
