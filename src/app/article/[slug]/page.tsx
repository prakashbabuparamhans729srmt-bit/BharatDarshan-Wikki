
"use client"

import React, { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, MapPin, Share2, History, Bookmark, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ARTICLES } from '@/lib/mock-data'
import { TranslatorTool } from '@/components/ai/TranslatorTool'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = ARTICLES.find(a => a.slug === slug) || ARTICLES[0]

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Article Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/20 uppercase tracking-widest text-[10px]">{article.category}</Badge>
              {article.parent && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <Link href={`/article/${article.parent.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-muted-foreground hover:text-primary capitalize">
                    {article.parent}
                  </Link>
                </>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">{article.title}</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="gap-2 rounded-full">
              <Edit2 className="h-4 w-4" />
              Edit Article
            </Button>
            <Button variant="outline" className="gap-2 rounded-full">
              <History className="h-4 w-4" />
              History
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full md:w-80 h-64 md:h-80 relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <Image 
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="bg-primary/5 p-1">
              <TabsTrigger value="read" className="data-[state=active]:bg-primary data-[state=active]:text-white">Read Content</TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-primary data-[state=active]:text-white">AI Tools</TabsTrigger>
              <TabsTrigger value="discussion" className="data-[state=active]:bg-primary data-[state=active]:text-white">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="mt-6 space-y-6">
              <div className="prose prose-stone max-w-none text-lg leading-relaxed text-foreground font-body">
                <p className="first-letter:text-5xl first-letter:font-headline first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                  {article.content}
                </p>
                <p className="mt-4">
                  Further research into the geography and history of {article.title} suggests significant contributions to India's tapestry. Our collaborative community continues to add references and primary sources to verify the information presented here.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Card className="bg-primary/5 border-none shadow-none">
                  <div className="p-4 flex gap-4">
                    <MapPin className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold font-headline">Fast Facts</h4>
                      <p className="text-sm text-muted-foreground mt-1">Region: {article.tags[0]}</p>
                      <p className="text-sm text-muted-foreground">Type: {article.category}</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-primary/5 border-none shadow-none">
                  <div className="p-4 flex gap-4">
                    <Sparkles className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold font-headline">Did You Know?</h4>
                      <p className="text-sm text-muted-foreground mt-1">This entry has been edited by over 14 contributors this month.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <TranslatorTool content={article.content} />
                <Card className="border-primary/10 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Content Refiner
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Get AI suggestions to improve this article's clarity, tone, and factual coverage.</p>
                    <Link href="/tools/refine">
                      <Button variant="outline" className="w-full">Open AI Assistant</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border rounded-2xl bg-muted/30">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-headline font-bold">Talk Page</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">No discussions yet for this article. Be the first to start a conversation about improving this page.</p>
                <Button variant="outline">Start Discussion</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <div className="bg-card p-6 rounded-3xl border border-primary/10 shadow-sm space-y-4">
            <h3 className="font-headline font-bold text-lg border-b pb-2">Related Articles</h3>
            <div className="space-y-4">
              {ARTICLES.filter(a => a.slug !== slug).map(related => (
                <Link key={related.slug} href={`/article/${related.slug}`} className="flex gap-3 group">
                  <div className="h-12 w-12 rounded-lg relative overflow-hidden shrink-0">
                    <Image src={related.image} alt={related.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{related.title}</h4>
                    <p className="text-xs text-muted-foreground">{related.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-primary p-6 rounded-3xl text-white space-y-4">
            <h3 className="font-headline font-bold text-lg">Contribute!</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Spotted an error? Have more details about {article.title}? BharatDarshan grows with your knowledge.
            </p>
            <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold">
              Start Editing
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-2xl border ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  )
}

function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`font-headline font-bold ${className}`}>
      {children}
    </h3>
  )
}

function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-4 pt-0 ${className}`}>
      {children}
    </div>
  )
}
