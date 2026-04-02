
"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, ChevronRight, Filter, BookOpen, Clock, Tag, Loader2, Sparkles, Database, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ARTICLES, STATES } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, where } from 'firebase/firestore'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const [isCrawling, setIsCrawling] = useState(true)
  const [progress, setProgress] = useState(0)
  const db = useFirestore()

  // 1. Fetch live articles that might match
  // Firestore doesn't support full-text search directly without 3rd party,
  // so we fetch all and filter on client for this advance simulation
  const liveArticlesQuery = useMemoFirebase(() => collection(db, 'articles_published'), [db]);
  const { data: liveArticles } = useCollection(liveArticlesQuery);

  // Simulation of a "Deep Search Crawl"
  useEffect(() => {
    setIsCrawling(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCrawling(false)
          return 100
        }
        return prev + 5
      })
    }, 50)
    return () => clearInterval(interval)
  }, [queryParam])

  const results = useMemo(() => {
    if (!queryParam) return []
    const q = queryParam.toLowerCase()
    
    // Combine mock data and live Firestore data
    const allArticles = [...ARTICLES, ...(liveArticles || [])];
    
    // Unique by slug
    const uniqueArticles = Array.from(new Map(allArticles.map(a => [a.slug, a])).values());

    const articleResults = uniqueArticles.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q) ||
      (a.tags && a.tags.some((t: string) => t.toLowerCase().includes(q))) ||
      (a.tagIds && a.tagIds.some((t: string) => t.toLowerCase().includes(q))) ||
      a.category?.toLowerCase().includes(q)
    ).map(a => ({ ...a, type: 'article' }))

    const stateResults = STATES.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q)
    ).map(s => ({ 
      title: s.name, 
      slug: s.name.toLowerCase().replace(/\s+/g, '-'), 
      category: 'State', 
      content: `Official wiki entry for the state of ${s.name} (${s.code}). Exploration of cultural geography and administrative heritage.`,
      image: `https://picsum.photos/seed/${s.code}/400/300`,
      type: 'state',
      tags: ['State', 'Territory']
    }))

    // Consolidate and sort (States first)
    const combined = [...stateResults, ...articleResults];
    const seen = new Set();
    return combined.filter(item => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
  }, [queryParam, liveArticles])

  if (isCrawling) {
    return (
      <div className="max-w-4xl mx-auto py-32 space-y-8 flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="relative h-24 w-24">
          <Database className="h-24 w-24 text-primary animate-pulse opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-4 w-full max-w-md">
          <h2 className="text-3xl font-headline font-black text-white tracking-widest uppercase">Deep Crawling...</h2>
          <p className="text-muted-foreground italic font-medium">Scanning BharatDarshan Wiki archives for "{queryParam}"</p>
          <Progress value={progress} className="h-2 bg-white/5" />
          <div className="flex justify-between text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
            <span>Indexing Nodes</span>
            <span>{progress}% Complete</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 border-l-4 border-primary pl-8">
        <div className="flex items-center gap-3 text-primary">
          <Search className="h-8 w-8" />
          <h1 className="text-5xl font-headline font-black text-white">Crawl Results</h1>
        </div>
        <p className="text-muted-foreground text-xl font-light italic">
          Advanced crawling finished. Found {results.length} heritage entries for <span className="text-primary font-bold">"{queryParam}"</span>.
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {results.map((item: any, idx) => (
            <Link key={idx} href={`/article/${item.slug}`} className="group">
              <Card className="bg-[#161C21]/60 backdrop-blur-xl border-white/5 hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-80 h-64 relative shrink-0 overflow-hidden">
                    <Image 
                      src={item.image || `https://picsum.photos/seed/${item.slug}/600/400`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-primary text-black font-black text-[10px] uppercase tracking-widest px-4 py-1.5 shadow-xl">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-10 flex-1 space-y-6 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-3xl font-headline font-black text-white group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-6 mt-3 text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-primary" />
                            Bharat / India
                          </span>
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Heritage Verified
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all border border-primary/20 shadow-neon">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-muted-foreground/80 line-clamp-2 leading-relaxed font-light text-lg">
                      {item.content}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {item.tagIds?.length > 0 ? (
                        item.tagIds.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] font-black text-primary/50 uppercase tracking-widest">#{tag}</span>
                        ))
                      ) : item.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-black text-primary/50 uppercase tracking-widest">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-10 bg-[#161C21]/40 rounded-[3.5rem] border-2 border-dashed border-white/10 glass-card">
          <div className="relative h-32 w-32 mx-auto">
            <Search className="h-32 w-32 text-white/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <X className="h-12 w-12 text-primary/20" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-headline font-black text-white">Zero Nodes Indexed</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg font-light italic">
              Our crawling engine reached the end of the current archive without a match. Try searching for broader heritage terms like "Temple" or "Empire".
            </p>
          </div>
          <Link href="/">
            <Button className="bg-primary text-black font-black px-12 h-16 rounded-2xl text-lg neon-glow transition-all hover:scale-105 active:scale-95">
              Re-scan Archives
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
