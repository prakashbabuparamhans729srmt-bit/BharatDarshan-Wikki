
"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, ChevronRight, Filter, Loader2, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { STATES } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, where } from 'firebase/firestore'

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const db = useFirestore()

  // Fetch live States from Firestore to show contribution counts
  const liveStatesQuery = useMemoFirebase(() => query(collection(db, 'articles_published'), where('category', '==', 'State')), [db]);
  const { data: liveStates, isLoading: isLiveLoading } = useCollection(liveStatesQuery);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const displayStates = useMemo(() => {
    // Combine mock states with live data (ensuring no duplicates)
    const combined = [...STATES];
    if (liveStates) {
      liveStates.forEach(ls => {
        if (!combined.find(s => s.name.toLowerCase() === ls.title.toLowerCase())) {
          combined.push({ name: ls.title, code: 'WIKI' });
        }
      });
    }
    return combined.sort((a, b) => a.name.localeCompare(b.name));
  }, [liveStates]);

  const filteredStates = displayStates.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetter = !selectedLetter || state.name.startsWith(selectedLetter)
    return matchesSearch && matchesLetter
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Database className="h-10 w-10" />
          <h1 className="text-4xl font-headline font-bold">Geographical Directory</h1>
        </div>
        <p className="text-muted-foreground">Browse all 28 states and 8 union territories of India alphabetically. Contributions from the community are marked as verified nodes.</p>
      </div>

      <div className="flex flex-col gap-6 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 sticky top-20 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Quick search states..." 
            className="pl-10 h-12 text-lg bg-black/20 border-white/10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1 justify-center">
          <Button 
            variant={selectedLetter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedLetter(null)}
            className={`w-10 h-10 p-0 rounded-lg ${selectedLetter === null ? 'bg-primary text-black' : 'border-white/10'}`}
          >
            All
          </Button>
          {alphabet.map(letter => (
            <Button 
              key={letter}
              variant={selectedLetter === letter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
              className={`w-10 h-10 p-0 rounded-lg transition-all ${selectedLetter === letter ? 'bg-primary text-black' : 'border-white/10 hover:border-primary/50'}`}
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>

      {isLiveLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredStates.length > 0 ? (
            filteredStates.map((state) => (
              <Link 
                key={state.code + state.name} 
                href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex items-center justify-between p-5 bg-[#161C21]/60 hover:bg-primary hover:text-black rounded-2xl border border-white/5 transition-all shadow-xl hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 group-hover:bg-black/20 flex items-center justify-center font-bold text-primary group-hover:text-black transition-colors">
                    {state.code}
                  </div>
                  <span className="font-bold">{state.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-6 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Filter className="h-8 w-8 text-primary/20" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-white">No states found</p>
                <p className="text-sm text-muted-foreground italic">Our crawling engine couldn't find a matching heritage node.</p>
              </div>
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary" onClick={() => {setSearchTerm(''); setSelectedLetter(null)}}>Clear Filters</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
