
"use client"

import React, { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, History, User, ChevronRight, Filter, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ARTICLES } from '@/lib/mock-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, limit } from 'firebase/firestore'

export default function RevisionHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const db = useFirestore()
  
  // 1. Fetch real-time revisions from Firestore for this specific article (slug used as articleId)
  const revisionsQuery = useMemoFirebase(() => {
    return query(
      collection(db, 'articles_published', slug, 'revisions'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [db, slug]);
  
  const { data: realTimeRevisions, isLoading } = useCollection(revisionsQuery);

  // Fallback to static article info
  const article = ARTICLES.find(a => a.slug === slug) || ARTICLES[0]

  // Default mock revisions if Firestore is empty
  const defaultRevisions = [
    { id: "rev-1", username: "Admin Explorer", createdAt: new Date().toISOString(), changesSummary: "Refined the geographical data for the district.", revisionNumber: 1.4 },
    { id: "rev-2", username: "Priya M.", createdAt: new Date(Date.now() - 86400000).toISOString(), changesSummary: "Added historical timeline and new high-res imagery.", revisionNumber: 1.3 },
    { id: "rev-3", username: "Arjun S.", createdAt: new Date(Date.now() - 259200000).toISOString(), changesSummary: "Corrected spelling of local landmarks.", revisionNumber: 1.2 },
  ]

  const revisions = (realTimeRevisions && realTimeRevisions.length > 0) ? realTimeRevisions : defaultRevisions;

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
              {isLoading ? '...' : revisions.length} Snapshots
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-primary font-black uppercase tracking-widest text-[10px]">Accessing History...</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {revisions.map((rev, i) => (
                  <div key={rev.id} className="p-10 hover:bg-white/5 transition-all group flex flex-col md:flex-row gap-8 md:items-center">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all shrink-0">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary/50">Ver</span>
                      <span className="text-lg font-black text-white">{rev.revisionNumber}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <User className="h-3 w-3" />
                        </div>
                        <span className="font-bold text-white text-lg">{rev.username || 'Contributor'}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/70 italic font-light leading-relaxed">"{rev.changesSummary}"</p>
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
            )}
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
            This article has maintained a high verification score. All claims are tracked and versioned for full transparency.
          </p>
        </div>
      </div>
    </div>
  )
}
