
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Sparkles, BookOpen, Users, Globe, ArrowRight, Mic, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ARTICLES } from '@/lib/mock-data'
import { VoiceSearchDialog } from '@/components/ai/VoiceSearchDialog'
import { useRouter } from 'next/navigation'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, limit } from 'firebase/firestore'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const router = useRouter()
  const db = useFirestore()

  // 1. Fetch live articles from Firestore for the "Featured Heritage" section
  const latestArticlesQuery = useMemoFirebase(() => {
    return query(collection(db, 'articles_published'), limit(6));
  }, [db]);
  const { data: liveArticles, isLoading: isLiveLoading } = useCollection(latestArticlesQuery);

  // Hybrid approach: use live data if available, otherwise fallback to mock data
  const featuredArticles = liveArticles && liveArticles.length > 0 
    ? liveArticles 
    : ARTICLES.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20">
      {/* Hero Section - A to Z Advance */}
      <section className="relative rounded-[2.5rem] overflow-hidden border border-primary/20 bg-black neon-glow group">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxJbmRpYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzIwOTIxMDd8MA&ixlib=rb-4.1.0&q=80&w=1200"
            alt="Beautiful landscape of India"
            fill
            className="object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
            data-ai-hint="India landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 px-8 py-20 md:py-32 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
            <Sparkles className="h-3 w-3" />
            India's Digital Encyclopedia
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold leading-[1.1] text-white drop-shadow-2xl">
            Discover the Heritage of <span className="text-primary italic">Bharat Darshan</span>
          </h1>
          
          {/* Advanced Search Bar - Integrated with Voice */}
          <div className="max-w-2xl mx-auto relative group">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-6 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monuments, states, districts..." 
                className="h-16 pl-16 pr-16 bg-black/40 backdrop-blur-xl border-white/20 focus-visible:ring-primary/50 text-xl rounded-full neon-glow"
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute right-4 h-10 w-10 text-primary hover:bg-primary/10 rounded-full"
                onClick={() => setShowVoiceSearch(true)}
              >
                <Mic className="h-6 w-6" />
              </Button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
            <Link href="/browse">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-10 py-7 text-lg font-bold rounded-full neon-glow transition-all hover:scale-105">
                Explore States
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white px-10 py-7 text-lg font-medium backdrop-blur-md rounded-full transition-all">
                Join Contributors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid - Real-time Wiki Updates */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-white">Featured Heritage</h2>
            <p className="text-muted-foreground text-lg italic">Handpicked historical articles for you.</p>
          </div>
          <Link href="/browse">
            <Button variant="link" className="text-primary text-lg group">
              View all articles
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLiveLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article: any) => (
              <Link href={`/article/${article.slug}`} key={article.slug} className="group">
                <Card className="h-full border border-white/10 glass-card hover:border-primary/40 transition-all duration-500 overflow-hidden rounded-3xl group">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={article.image || `https://picsum.photos/seed/${article.slug}/800/600`}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-black font-bold px-3 py-1">{article.category || 'Heritage'}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <h3 className="text-2xl font-headline font-bold group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground text-base line-clamp-3 leading-relaxed font-light">
                      {article.content}
                    </p>
                    <div className="pt-4 flex flex-wrap gap-2 border-t border-white/5">
                      {article.tagIds?.length > 0 ? (
                        article.tagIds.slice(0, 2).map((tagId: string) => (
                          <Badge variant="outline" key={tagId} className="text-[10px] border-white/10 text-white/60 font-medium uppercase tracking-widest">#{tagId}</Badge>
                        ))
                      ) : article.tags?.length > 0 ? (
                        article.tags.slice(0, 2).map((tag: string) => (
                          <Badge variant="outline" key={tag} className="text-[10px] border-white/10 text-white/60 font-medium uppercase tracking-widest">#{tag}</Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-white/10 text-white/60 font-medium uppercase tracking-widest">Heritage Node</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </div>
  )
}
