
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Sparkles, BookOpen, Mic, ArrowRight, Loader2, Compass, History, MessageSquare, TrendingUp, Award, Activity, Database, Globe, Zap, ShieldCheck } from 'lucide-react'
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

  // Expanded A to Z Roadmap steps
  const roadmapSteps = [
    { title: "Browse Index", desc: "Discover all 28 states alphabetically.", icon: BookOpen, link: "/browse", letter: "A" },
    { title: "Voice Search", desc: "Speak to find hidden heritage nodes.", icon: Mic, action: () => setShowVoiceSearch(true), letter: "V" },
    { title: "Contribute Node", desc: "Write new entries for the live wiki.", icon: Sparkles, link: "/contribute", letter: "C" },
    { title: "Community Talk", desc: "Discuss facts on live Talk Pages.", icon: MessageSquare, link: "/browse", letter: "T" },
    { title: "Archive History", desc: "Track every edit across the timeline.", icon: History, link: "/dashboard", letter: "Z" }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative rounded-[4rem] overflow-hidden border-2 border-primary/30 bg-black neon-glow group shadow-[0_0_50px_rgba(7,241,214,0.1)]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1542708993627-b6e5bbae43c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxJbmRpYSUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzIwOTIxMDd8MA&ixlib=rb-4.1.0&q=80&w=1200"
            alt="Beautiful landscape of India"
            fill
            className="object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 px-8 py-24 md:py-48 text-center space-y-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black tracking-[0.4em] uppercase animate-pulse backdrop-blur-md">
            <Zap className="h-4 w-4 fill-current" />
            A to Z Advanced Flow: Operational
          </div>
          <h1 className="text-7xl md:text-9xl font-headline font-black leading-[0.85] text-white drop-shadow-2xl selection:bg-primary/20">
            Explore the <span className="text-primary italic">Infinity</span> of Bharat
          </h1>
          
          <div className="max-w-3xl mx-auto relative group">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-8 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monuments, history, or territories..." 
                className="h-24 pl-20 pr-24 bg-black/50 backdrop-blur-2xl border-2 border-white/10 focus-visible:ring-primary/50 text-2xl rounded-full shadow-2xl font-light italic text-white placeholder:text-white/20"
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="absolute right-6 h-14 w-14 bg-primary text-black hover:bg-primary/90 rounded-full transition-all hover:scale-110 shadow-neon"
                onClick={() => setShowVoiceSearch(true)}
              >
                <Mic className="h-8 w-8" />
              </Button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10">
            <Link href="/browse">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-16 h-20 text-2xl font-black rounded-full shadow-neon transition-all hover:scale-105 active:scale-95">
                A to Z Directory
                <ArrowRight className="ml-4 h-7 w-7" />
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline" className="bg-white/5 border-2 border-white/20 hover:bg-white/10 text-white px-16 h-20 text-2xl font-bold backdrop-blur-md rounded-full transition-all hover:border-primary/50">
                Join Archive
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* A to Z Heritage Roadmap - The "Chalu" Flow */}
      <section className="space-y-16 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-6xl font-headline font-black text-white">Heritage Roadmap</h2>
            <p className="text-muted-foreground text-2xl italic font-light max-w-2xl">The complete A to Z flow for every explorer, archivist, and researcher.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <Badge className="bg-primary/10 text-primary border border-primary/20 font-black px-8 py-3 uppercase tracking-[0.4em] text-xs shadow-sm">
              Flow Operational: 100%
            </Badge>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Sync ID: DARSHAN-AZ-PRO</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 px-4">
          {roadmapSteps.map((step, i) => (
            <div key={i} className="group relative">
              {i < roadmapSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-[2px] bg-gradient-to-r from-primary/20 to-transparent z-0" />
              )}
              {step.link ? (
                <Link href={step.link}>
                  <Card className="h-full bg-[#161C21]/60 backdrop-blur-xl border-white/5 hover:border-primary/50 transition-all duration-500 rounded-[3rem] p-10 text-center space-y-8 hover:scale-105 cursor-pointer relative z-10 shadow-2xl group-hover:bg-primary/5">
                    <div className="absolute top-6 right-8 text-5xl font-black text-white/5 select-none transition-colors group-hover:text-primary/10">{step.letter}</div>
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto group-hover:rotate-12 transition-all shadow-sm border border-primary/5">
                      <step.icon className="h-10 w-10" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-black text-white text-xl leading-tight group-hover:text-primary transition-colors">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed italic font-light">{step.desc}</p>
                    </div>
                  </Card>
                </Link>
              ) : (
                <button className="w-full text-left h-full" onClick={step.action}>
                  <Card className="h-full bg-[#161C21]/60 backdrop-blur-xl border-white/5 hover:border-primary/50 transition-all duration-500 rounded-[3rem] p-10 text-center space-y-8 hover:scale-105 cursor-pointer relative z-10 shadow-2xl group-hover:bg-primary/5">
                    <div className="absolute top-6 right-8 text-5xl font-black text-white/5 select-none transition-colors group-hover:text-primary/10">{step.letter}</div>
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto group-hover:rotate-12 transition-all shadow-sm border border-primary/5">
                      <step.icon className="h-10 w-10" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-black text-white text-xl leading-tight group-hover:text-primary transition-colors">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed italic font-light">{step.desc}</p>
                    </div>
                  </Card>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="space-y-16 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2 border-l-8 border-primary pl-10">
          <div className="space-y-4">
            <h2 className="text-6xl font-headline font-black text-white leading-none">Featured Heritage</h2>
            <p className="text-muted-foreground text-2xl italic font-light">Direct nodes from the live digital encyclopedia.</p>
          </div>
          <Link href="/browse">
            <Button variant="outline" className="rounded-2xl border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest text-xs h-16 px-12 group hover:bg-primary hover:text-black transition-all">
              Full Archive Index
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>

        {isLiveLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="h-20 w-20 text-primary animate-spin" />
            <p className="text-primary font-black uppercase tracking-[0.5em] text-xs animate-pulse">Scanning Cloud Archives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredArticles.map((article: any) => (
              <Link href={`/article/${article.slug}`} key={article.slug || article.id} className="group">
                <Card className="h-full border border-white/5 bg-[#161C21]/40 hover:border-primary/50 transition-all duration-700 overflow-hidden rounded-[3.5rem] group shadow-2xl relative">
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image 
                      src={article.image || `https://picsum.photos/seed/${article.slug || article.id}/800/600`}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161C21] to-transparent opacity-80" />
                    <div className="absolute top-8 left-8">
                      <Badge className="bg-primary text-black font-black uppercase text-[10px] tracking-widest px-6 py-2 shadow-neon rounded-xl">
                        {article.category || article.categoryId || 'Heritage'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-12 space-y-8">
                    <h3 className="text-4xl font-headline font-black text-white group-hover:text-primary transition-colors leading-tight drop-shadow-lg">{article.title}</h3>
                    <p className="text-muted-foreground text-lg line-clamp-3 leading-relaxed font-light italic opacity-80">
                      {article.content}
                    </p>
                    <div className="pt-8 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Node Verified</span>
                      </div>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Archive v{article.version || '1.0'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Global Status Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
        {[
          { label: "Active Contributors", value: "4.2k", icon: Award, sub: "Verified Authors" },
          { label: "Heritage Nodes", value: "12.5k", icon: Database, sub: "Indexed Content" },
          { label: "Live Talk Pages", value: "8.1k", icon: Globe, sub: "Community Knowledge" }
        ].map((stat, i) => (
          <Card key={i} className="bg-primary p-16 rounded-[4rem] border-none shadow-neon text-black flex flex-col items-center justify-center text-center gap-6 transition-all hover:scale-[1.02] group relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:rotate-45 transition-transform duration-1000">
               <stat.icon className="h-40 w-40" />
            </div>
            <stat.icon className="h-12 w-12 mb-2 group-hover:scale-110 transition-transform" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-7xl font-black leading-none">{stat.value}</h3>
              <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">{stat.label}</p>
              <p className="text-[8px] font-black uppercase tracking-widest mt-2 bg-black/10 px-4 py-1 rounded-full">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </section>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </div>
  )
}
