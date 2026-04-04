
"use client"

import React, { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, History, User, ChevronRight, Filter, Download, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ARTICLES } from '@/lib/mock-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, limit, doc } from 'firebase/firestore'

/**
 * @description Advanced History Page. Pulls live revision logs from Firestore
 * for a specific article heritage node.
 */
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
  
  const { data: realTimeRevisions, isLoading: isRevisionsLoading } = useCollection(revisionsQuery);

  // 2. Fetch the article document to get the correct title
  const articleRef = useMemoFirebase(() => {
    return doc(db, 'articles_published', slug);
  }, [db, slug]);
  
  const { data: liveArticle, isLoading: isArticleLoading } = useDoc(articleRef);

  // Fallback to static article info
  const staticArticle = ARTICLES.find(a => a.slug === slug) || ARTICLES[0]
  const articleTitle = liveArticle?.title || staticArticle.title

  // Default mock revisions if Firestore is empty
  const defaultRevisions = [
    { id: "rev-1", username: "Admin Explorer", createdAt: new Date().toISOString(), changesSummary: "Refined the geographical data for the district.", revisionNumber: 1.4 },
    { id: "rev-2", username: "Priya M.", createdAt: new Date(Date.now() - 86400000).toISOString(), changesSummary: "Added historical timeline and new high-res imagery.", revisionNumber: 1.3 },
    { id: "rev-3", username: "Arjun S.", createdAt: new Date(Date.now() - 259200000).toISOString(), changesSummary: "Corrected spelling of local landmarks.", revisionNumber: 1.2 },
  ]

  const revisions = (realTimeRevisions && realTimeRevisions.length > 0) ? realTimeRevisions : defaultRevisions;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="space-y-8">
        <Link href={`/article/${slug}`} className="inline-flex items-center text-primary font-black uppercase tracking-widest text-xs hover:underline group">
          <ArrowLeft className="mr-3 h-4 w-4 transition-transform group-hover:-translate-x-2" />
          Return to Archive
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-headline font-black text-white leading-none">Revision History</h1>
            <p className="text-muted-foreground text-2xl font-light italic">
              Tracking the evolution of <span className="text-primary font-bold">"{articleTitle}"</span>
            </p>
          </div>
          <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-primary font-black uppercase tracking-widest text-[10px] h-14 px-8 shadow-sm">
            <Download className="mr-3 h-5 w-5" /> Export Logs
          </Button>
        </div>
      </div>

      <Card className="bg-[#161C21]/80 backdrop-blur-3xl border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
        <CardHeader className="bg-primary p-12 border-b border-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center text-primary shadow-2xl transition-transform hover:rotate-12">
                <History className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-black font-black text-3xl leading-none">Archive Log</CardTitle>
                <p className="text-black/50 text-xs font-black uppercase tracking-widest mt-2">Historical Snapshots</p>
              </div>
            </div>
            <Badge className="bg-black text-primary font-black rounded-xl px-6 py-2 uppercase tracking-[0.2em] text-[10px] shadow-sm">
              {(isRevisionsLoading || isArticleLoading) ? 'Syncing...' : `${revisions.length} Nodes`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[700px]">
            {(isRevisionsLoading || isArticleLoading) ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                </div>
                <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Accessing Time-stamped archives...</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {revisions.map((rev, i) => (
                  <div key={rev.id || i} className="p-12 hover:bg-white/5 transition-all group flex flex-col md:flex-row gap-10 md:items-center relative">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all shrink-0 shadow-sm">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">Ver</span>
                      <span className="text-2xl font-black text-white">{rev.revisionNumber}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/10">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="font-black text-xl text-white tracking-tight">{rev.username || 'Contributor'}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xl text-white/60 italic font-light leading-relaxed">"{rev.changesSummary}"</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:bg-primary/10 rounded-2xl px-8 h-14">
                        View Diff
                      </Button>
                      <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-white/10 hover:border-primary transition-all active:scale-95">
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
