
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ChevronRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { STATES } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const filteredStates = STATES.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetter = !selectedLetter || state.name.startsWith(selectedLetter)
    return matchesSearch && matchesLetter
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-headline font-bold text-primary">Geographical Directory</h1>
        <p className="text-muted-foreground">Browse all 28 states and 8 union territories of India alphabetically.</p>
      </div>

      <div className="flex flex-col gap-6 bg-card p-6 rounded-2xl border shadow-sm sticky top-20 z-10 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Quick search states..." 
            className="pl-10 h-12 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1 justify-center">
          <Button 
            variant={selectedLetter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedLetter(null)}
            className="w-10 h-10 p-0"
          >
            All
          </Button>
          {alphabet.map(letter => (
            <Button 
              key={letter}
              variant={selectedLetter === letter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
              className="w-10 h-10 p-0"
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredStates.length > 0 ? (
          filteredStates.map((state) => (
            <Link 
              key={state.code} 
              href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group flex items-center justify-between p-5 bg-card hover:bg-primary hover:text-white rounded-2xl border border-primary/5 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center font-bold text-primary group-hover:text-white transition-colors">
                  {state.code}
                </div>
                <span className="font-medium">{state.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Filter className="h-8 w-8" />
            </div>
            <p className="text-xl font-medium">No states found matching your criteria</p>
            <Button variant="outline" onClick={() => {setSearchTerm(''); setSelectedLetter(null)}}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
