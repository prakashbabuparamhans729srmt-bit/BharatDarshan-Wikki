
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Sparkles, BookOpen, Mic, ArrowRight, Loader2, Compass, History, MessageSquare, TrendingUp, Award, Activity, Database, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ARTICLES } from '@/lib/mock-data'
import { VoiceSearchDialog } from '@/components/ai/VoiceSearchDialog'
import { useRouter } from 'next/navigation'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, limit, orderBy } from 'firebase/firestore'

/**
 * @description Advanced Home Page. Pulls live "Featured Heritage" and "Recent Activity" 
 * from Firestore to provide a true A-Z live wiki experience.
 */
export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const router = useRouter()
  const db = useFirestore()

  // 1. Fetch live articles from Firestore for the "Featured Heritage" section
  const latestArticlesQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'articles_published'), 
      orderBy('updatedAt', 'desc'),
      limit(6)
    );
  }, [db]);
  
  const { data: liveArticles, isLoading: isLiveLoading } = useCollection(latestArticlesQuery);

  const featuredArticles = (liveArticles && liveArticles.length > 0) 
    ? liveArticles 
    : ARTICLES.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const roadmapSteps = [
    { title: "Browse Index", desc: "Discover all 28 states alphabetically.", icon: BookOpen, link: "/browse", letter: "B" },
    { title: "Voice Exploration", desc: "Speak to find hidden heritage nodes.", icon: Mic, action: () => setShowVoiceSearch(true), letter: "V" },
    { title: "Contribute History", desc: "Write new entries for the live wiki.", icon: Sparkles, link: "/contribute", letter: "C" },
    { title: "Community Talk", desc: "Discuss facts on live Talk Pages.", icon: MessageSquare, link: "/browse", letter: "T" },
    { title: "Revision History", desc: "Track every edit across the timeline.", icon: History, link: "/dashboard", letter: "H" }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative rounded-[3rem] overflow-hidden border border-primary/20 bg-black neon-glow group">
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
        <div className="relative z-10 px-8 py-24 md:py-40 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-[0.3em] uppercase animate-pulse">
            <Sparkles className="h-4 w-4" />
            A to Z Heritage Archives
          </div>
          <h1 className="text-6xl md:text-8xl font-headline font-extrabold leading-[1.1] text-white drop-shadow-2xl">
            Uncover the Soul of <span className="text-primary italic">Bharat</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-6 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monuments, states, districts..." 
                className="h-20 pl-16 pr-20 bg-black/40 backdrop-blur-xl border-white/20 focus-visible:ring-primary/50 text-2xl rounded-full neon-glow font-light italic"
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute right-6 h-12 w-12 text-primary hover:bg-primary/10 rounded-full transition-transform hover:scale-110"
                onClick={() => setShowVoiceSearch(true)}
              >
                <Mic className="h-7 w-7" />
              </Button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/browse">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-12 h-16 text-xl font-black rounded-full neon-glow transition-all hover:scale-105">
                Explore States
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white px-12 h-16 text-xl font-bold backdrop-blur-md rounded-full transition-all">
                Contribute Node
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* A to Z Heritage Roadmap */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="space-y-2">
            <h2 className="text-5xl font-headline font-black text-white">Heritage Roadmap</h2>
            <p className="text-muted-foreground text-xl italic font-light">From exploration to preservation—your A to Z guide.</p>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary font-black px-6 py-2 uppercase tracking-[0.3em] text-xs">
            Operational Node: ACTIVE
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-4">
          {roadmapSteps.map((step, i) => (
            <div key={i} className="group relative">
              {i < roadmapSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-primary/10 z-0" />
              )}
              {step.link ? (
                <Link href={step.link}>
                  <Card className="h-full bg-[#161C21]/60 border-white/5 hover:border-primary/40 transition-all rounded-[2.5rem] p-8 text-center space-y-6 hover:scale-105 cursor-pointer relative z-10 shadow-2xl">
                    <div className="absolute top-4 right-6 text-4xl font-black text-white/5 select-none">{step.letter}</div>
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform shadow-sm">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-white text-lg leading-tight">{step.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">{step.desc}</p>
                    </div>
                  </Card>
                </Link>
              ) : (
                <button className="w-full text-left h-full" onClick={step.action}>
                  <Card className="h-full bg-[#161C21]/60 border-white/5 hover:border-primary/40 transition-all rounded-[2.5rem] p-8 text-center space-y-6 hover:scale-105 cursor-pointer relative z-10 shadow-2xl">
                    <div className="absolute top-4 right-6 text-4xl font-black text-white/5 select-none">{step.letter}</div>
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform shadow-sm">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black text-white text-lg leading-tight">{step.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">{step.desc}</p>
                    </div>
                  </Card>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="space-y-12 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="space-y-2 border-l-4 border-primary pl-8">
            <h2 className="text-5xl font-headline font-black text-white">Featured Heritage</h2>
            <p className="text-muted-foreground text-xl italic font-light">Latest verified nodes added to the global archives.</p>
          </div>
          <Link href="/browse">
            <Button variant="outline" className="rounded-full border-primary/20 text-primary font-black uppercase tracking-widest text-xs h-12 px-8 group">
              Browse Full Index
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>

        {isLiveLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Accessing Live Archives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredArticles.map((article: any) => (
              <Link href={`/article/${article.slug}`} key={article.slug || article.id} className="group">
                <Card className="h-full border border-white/5 bg-[#161C21]/40 hover:border-primary/40 transition-all duration-700 overflow-hidden rounded-[3rem] group shadow-2xl">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image 
                      src={article.image || `https://picsum.photos/seed/${article.slug || article.id}/800/600`}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161C21] to-transparent opacity-60" />
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-primary text-black font-black uppercase text-[10px] tracking-widest px-4 py-1.5 shadow-neon">
                        {article.category || article.categoryId || 'Heritage'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-10 space-y-6">
                    <h3 className="text-3xl font-headline font-black text-white group-hover:text-primary transition-colors leading-tight">{article.title}</h3>
                    <p className="text-muted-foreground text-base line-clamp-3 leading-relaxed font-light italic opacity-80">
                      {article.content}
                    </p>
                    <div className="pt-6 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Live Heritage Node</span>
                      </div>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">v{article.version || '1.0'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {[
          { label: "Active Contributors", value: "4,200+", icon: Award },
          { label: "Heritage Nodes", value: "12.5k", icon: Database },
          { label: "Live Talk Pages", value: "8.1k", icon: Globe }
        ].map((stat, i) => (
          <Card key={i} className="bg-primary p-12 rounded-[3.5rem] border-none shadow-neon text-black flex flex-col items-center justify-center text-center gap-4 transition-all hover:scale-[1.02]">
            <stat.icon className="h-10 w-10 mb-2" />
            <h3 className="text-6xl font-black">{stat.value}</h3>
            <p className="font-black uppercase tracking-[0.3em] text-[10px] opacity-60">{stat.label}</p>
          </Card>
        ))}
      </section>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </div>
  )
}
