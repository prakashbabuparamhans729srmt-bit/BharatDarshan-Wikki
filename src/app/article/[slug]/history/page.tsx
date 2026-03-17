
"use client"

import React, { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, History, User, ChevronRight, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ARTICLES } from '@/lib/mock-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RevisionHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = ARTICLES.find(a => a.slug === slug) || ARTICLES[0]

  const revisions = [
    { id: "rev-1", user: "Admin Explorer", date: "3 hours ago", changes: "Refined the geographical data for the district.", version: 1.4 },
    { id: "rev-2", user: "Priya M.", date: "1 day ago", changes: "Added historical timeline and new high-res imagery.", version: 1.3 },
    { id: "rev-3", user: "Arjun S.", date: "3 days ago", changes: "Corrected spelling of local landmarks.", version: 1.2 },
    { id: "rev-4", user: "HistoryBuff99", date: "1 week ago", changes: "Initial expansion of cultural section.", version: 1.1 },
    { id: "rev-5", user: "System AI", date: "Oct 12, 2023", changes: "Automated translation sync for regional support.", version: 1.0 },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="space-y-6">
        <Link href={`/article/${slug}`} className="inline-flex items-center text-primary font-bold hover:underline group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Article
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-black text-white">Revision History</h1>
            <p className="text-muted-foreground text-xl font-light italic">
              Tracking the evolution of <span className="text-primary font-bold">"{article.title}"</span>
            </p>
          </div>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-primary font-black uppercase tracking-widest text-[10px] h-12 px-6">
            <Download className="mr-2 h-4 w-4" /> Export Logs
          </Button>
        </div>
      </div>

      <Card className="bg-[#161C21]/60 backdrop-blur-xl border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <CardHeader className="bg-primary p-10 border-b border-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center text-primary shadow-xl">
                <History className="h-6 w-6" />
              </div>
              <CardTitle className="text-black font-black text-2xl">Archive Log</CardTitle>
            </div>
            <Badge className="bg-black text-primary font-black rounded-lg px-4 py-1.5 uppercase tracking-widest text-[10px]">
              {revisions.length} Snapshots
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y divide-white/5">
              {revisions.map((rev, i) => (
                <div key={rev.id} className="p-10 hover:bg-white/5 transition-all group flex flex-col md:flex-row gap-8 md:items-center">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/50">Ver</span>
                    <span className="text-lg font-black text-white">{rev.version}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="font-bold text-white text-lg">{rev.user}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{rev.date}</span>
                    </div>
                    <p className="text-white/70 italic font-light leading-relaxed">"{rev.changes}"</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl px-6 h-12">
                      View Diff
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:border-primary transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-secondary/50 rounded-[2.5rem] border border-white/5 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Filter className="h-5 w-5" />
            <h4 className="font-black uppercase tracking-widest text-xs">Filter History</h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="border-white/10 hover:border-primary cursor-pointer">Last 24h</Badge>
            <Badge variant="outline" className="border-white/10 hover:border-primary cursor-pointer">Admin Edits</Badge>
            <Badge variant="outline" className="border-white/10 hover:border-primary cursor-pointer">AI Updates</Badge>
          </div>
        </div>
        <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/20 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Clock className="h-5 w-5" />
            <h4 className="font-black uppercase tracking-widest text-xs">Integrity Score</h4>
          </div>
          <p className="text-xs text-white/50 italic leading-relaxed">
            This article has maintained a 98% verification score over 5 major revisions. All claims are cited by community experts.
          </p>
        </div>
      </div>
    </div>
  )
}
