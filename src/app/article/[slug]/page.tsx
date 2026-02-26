
"use client"

import React, { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit2, MapPin, Share2, History, Bookmark, MessageSquare, Sparkles, ArrowLeft, MoreHorizontal, ChevronRight } from 'lucide-react'
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
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/browse" className="hover:text-primary transition-colors">Directory</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-white font-medium">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[10px] px-3 py-1">
                {article.category}
              </Badge>
              {article.parent && (
                <>
                  <span className="text-white/20">/</span>
                  <Link href={`/article/${article.parent.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-bold text-primary hover:underline capitalize tracking-widest">
                    {article.parent}
                  </Link>
                </>
              )}
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-black text-white leading-tight">{article.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="gap-2 rounded-full bg-primary text-black hover:bg-primary/90 font-bold px-8 h-12 neon-glow">
              <Edit2 className="h-4 w-4" />
              Edit This Page
            </Button>
            <Button variant="outline" className="gap-2 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-12 px-6">
              <History className="h-4 w-4" />
              Revision History
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:text-primary h-12 w-12">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:text-primary h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:text-primary h-12 w-12">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[450px] h-[450px] relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/5 group">
          <Image 
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-3 text-white">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">{article.title}, India</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/5" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <Tabs defaultValue="read" className="w-full">
            <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/5 h-14">
              <TabsTrigger value="read" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">Read Content</TabsTrigger>
              <TabsTrigger value="tools" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">AI & Tools</TabsTrigger>
              <TabsTrigger value="discussion" className="rounded-xl px-10 h-11 data-[state=active]:bg-primary data-[state=active]:text-black font-black text-xs uppercase tracking-widest">Talk Page</TabsTrigger>
            </TabsList>
            
            <TabsContent value="read" className="mt-12 space-y-10">
              <div className="prose prose-invert max-w-none">
                <p className="text-2xl leading-[1.7] text-white/90 font-light selection:bg-primary/20">
                  <span className="text-7xl font-headline font-black text-primary mr-4 float-left leading-none mt-2">
                    {article.content.charAt(0)}
                  </span>
                  {article.content.slice(1)}
                </p>
                <p className="text-xl leading-[1.8] text-white/70 font-light mt-8">
                  The history of {article.title} is deeply intertwined with the cultural evolution of the Indian subcontinent. 
                  Recent archaeological findings and historical archives maintained by BharatDarshan contributors highlight its strategic importance 
                  in ancient trade routes and its role as a center for learning and spiritual enlightenment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card className="bg-white/5 border-white/5 shadow-none rounded-[2rem] p-8 hover:bg-white/10 transition-colors">
                  <div className="flex gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary neon-glow">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold font-headline text-xl text-white">Geographical Data</h4>
                      <p className="text-sm text-primary/70 font-bold mt-1 uppercase tracking-wider">{article.tags[0]}</p>
                      <p className="text-sm text-white/50 mt-1 italic">Type: {article.category} Classification</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-white/5 border-white/5 shadow-none rounded-[2rem] p-8 hover:bg-white/10 transition-colors">
                  <div className="flex gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary neon-glow">
                      <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold font-headline text-xl text-white">Wiki Stats</h4>
                      <p className="text-sm text-white/70 mt-1">Verified by <span className="text-primary font-bold">14+ Experts</span></p>
                      <p className="text-sm text-white/50 mt-1 italic">Last edited 3 hours ago</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="mt-12 space-y-8">
              <TranslatorTool content={article.content} />
              
              <Card className="border-white/5 bg-white/5 rounded-[2rem] overflow-hidden group">
                <div className="p-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary neon-glow">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-headline font-bold text-white">Smart Content Refiner</h3>
                      <p className="text-muted-foreground font-light">Advanced AI analysis for tone, accuracy, and style.</p>
                    </div>
                  </div>
                  <Link href="/tools/refine">
                    <Button variant="outline" className="w-full h-14 border-primary/20 hover:border-primary text-primary font-bold text-lg rounded-2xl group">
                      Launch AI Assistant
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="discussion" className="mt-12">
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border-2 border-dashed border-white/10 rounded-[3rem] bg-white/5">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                  <MessageSquare className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-headline font-bold text-white">Talk Page</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto font-light">Be the first to start a conversation about improving this article's coverage and accuracy.</p>
                </div>
                <Button className="bg-primary text-black font-black px-10 h-14 rounded-full neon-glow">Start A Discussion</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-10">
          <div className="bg-secondary p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8">
            <h3 className="font-headline font-bold text-2xl text-white border-b border-white/5 pb-4">Related Heritage</h3>
            <div className="space-y-6">
              {ARTICLES.filter(a => a.slug !== slug).map(related => (
                <Link key={related.slug} href={`/article/${related.slug}`} className="flex gap-4 group items-center">
                  <div className="h-16 w-16 rounded-2xl relative overflow-hidden shrink-0 border border-white/10">
                    <Image src={related.image} alt={related.title} fill className="object-cover transition-transform group-hover:scale-125" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">{related.title}</h4>
                    <p className="text-xs text-primary font-black uppercase tracking-widest">{related.category}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-primary font-bold hover:bg-primary/5 rounded-xl h-12">
              Explore Full Map
            </Button>
          </div>

          <Card className="bg-primary p-10 rounded-[2.5rem] text-black border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
              <Sparkles className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="font-headline font-black text-3xl leading-tight">Join the Knowledge Revolution</h3>
              <p className="text-black/70 text-lg leading-relaxed font-bold italic">
                Help us map the vast heritage of {article.title}. Your expertise matters.
              </p>
              <Button className="w-full bg-black text-primary hover:bg-black/90 font-black h-16 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                Become An Editor
              </Button>
            </div>
          </Card>
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
