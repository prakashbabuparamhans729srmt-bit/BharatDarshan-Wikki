
"use client"

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, ChevronRight, Filter, BookOpen, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ARTICLES, STATES } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!query) return []

    const q = query.toLowerCase()
    
    // Search in Articles
    const articleResults = ARTICLES.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    ).map(a => ({ ...a, type: 'article' }))

    // Search in States
    const stateResults = STATES.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q)
    ).map(s => ({ 
      title: s.name, 
      slug: s.name.toLowerCase().replace(/\s+/g, '-'), 
      category: 'State', 
      content: `Official wiki entry for the state of ${s.name} (${s.code}).`,
      image: `https://picsum.photos/seed/${s.code}/400/300`,
      type: 'state'
    }))

    return [...stateResults, ...articleResults]
  }, [query])

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Search className="h-6 w-6" />
          <h1 className="text-4xl font-headline font-bold">Search Results</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Crawled all wiki archives for <span className="text-white font-bold italic">"{query}"</span>. 
          Found {results.length} relevant entries.
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {results.map((item, idx) => (
            <Link key={idx} href={`/article/${item.slug}`} className="group">
              <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-all rounded-[2rem] overflow-hidden group">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 relative shrink-0">
                    <Image 
                      src={item.image || `https://picsum.photos/seed/${idx}/400/300`}
                      alt={item.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-black font-black text-[10px] uppercase tracking-widest">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-headline font-bold text-white group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            India
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Verified
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-6 w-6 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed font-light">
                      {item.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-8 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
          <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
            <Search className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-headline font-bold text-white">No matches found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our crawler couldn't find any documents matching your query. Try searching for broader terms like "State" or "Palace".
            </p>
          </div>
          <Link href="/">
            <Button className="bg-primary text-black font-black px-10 h-14 rounded-full neon-glow">
              Return Home
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
