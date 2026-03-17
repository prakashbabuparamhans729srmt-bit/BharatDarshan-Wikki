
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, User, Globe, MessageSquare, Mic, Bell, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { VoiceSearchDialog } from '@/components/ai/VoiceSearchDialog'
import { Badge } from '@/components/ui/badge'
import { useAppLanguage } from '@/context/LanguageContext'
import { INDIAN_LANGUAGES } from '@/lib/languages'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { toggleSidebar } = useSidebar()
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const { currentLanguage, setLanguage } = useAppLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center border-b border-white/5 bg-background/80 backdrop-blur-2xl px-6 md:px-8 lg:px-12">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hover:bg-primary/10 text-primary transition-all active:scale-95"
        >
          <Menu className="h-7 w-7" />
        </Button>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-xl group-hover:rotate-12 transition-transform">B</div>
          <span className="text-2xl font-bold font-headline text-white tracking-tight group-hover:text-primary transition-colors">BharatDarshan Wiki</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-auto hidden md:flex relative group px-12">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search for states, districts, or monuments..." 
            className="w-full h-12 pl-12 pr-12 bg-white/5 focus-visible:ring-primary/50 border-white/10 focus-visible:bg-white/10 transition-all rounded-full placeholder:text-muted-foreground/50"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-primary text-muted-foreground transition-all hover:scale-110"
            onClick={() => setShowVoiceSearch(true)}
            title="Voice Search"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary transition-all">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto w-[180px] bg-card border-white/10">
            {INDIAN_LANGUAGES.map((lang) => (
              <DropdownMenuItem 
                key={lang.name} 
                className={`flex justify-between items-center cursor-pointer ${currentLanguage === lang.name ? 'text-primary font-bold bg-primary/10' : ''}`}
                onClick={() => setLanguage(lang.name)}
              >
                <span>{lang.native}</span>
                <span className="text-[10px] opacity-50">{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/contribute">
          <Button variant="ghost" className="hidden sm:flex gap-2 text-white/80 hover:text-primary hover:bg-primary/5 rounded-full px-5 transition-all">
            <MessageSquare className="h-4 w-4" />
            <span className="font-bold uppercase tracking-widest text-[10px]">Contribute</span>
          </Button>
        </Link>

        <Button variant="ghost" size="icon" className="relative text-white/80 hover:text-primary transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full neon-glow" />
        </Button>
        
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:border-primary bg-white/5 hover:bg-primary/10 transition-all group">
            <User className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          </Button>
        </Link>
      </div>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </header>
  )
}
