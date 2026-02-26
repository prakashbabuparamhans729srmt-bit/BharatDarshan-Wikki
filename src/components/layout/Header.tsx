
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, User, Globe, MessageSquare, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { VoiceSearchDialog } from '@/components/ai/VoiceSearchDialog'

export function Header() {
  const { toggleSidebar } = useSidebar()
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b bg-background/80 backdrop-blur-md px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hover:bg-primary/10 text-primary"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-headline text-primary tracking-tight">BharatDarshan Wiki</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-auto hidden md:flex relative group">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for states, districts, or monuments..." 
            className="w-full pl-10 pr-10 bg-muted/50 focus-visible:ring-primary border-transparent focus-visible:bg-background transition-all"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 hover:text-primary"
            onClick={() => setShowVoiceSearch(true)}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowVoiceSearch(true)}>
          <Search className="h-5 w-5" />
        </Button>
        
        <Link href="/contribute">
          <Button variant="ghost" className="hidden sm:flex gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Contribute</span>
          </Button>
        </Link>
        
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </Button>
        </Link>
      </div>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </header>
  )
}
