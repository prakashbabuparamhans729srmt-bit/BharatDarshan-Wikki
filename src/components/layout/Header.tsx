
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, User, Globe, MessageSquare, Mic, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { VoiceSearchDialog } from '@/components/ai/VoiceSearchDialog'
import { useAppLanguage } from '@/context/LanguageContext'
import { INDIAN_LANGUAGES } from '@/lib/languages'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { toggleSidebar } = useSidebar()
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const { currentLanguage, setLanguage } = useAppLanguage()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new updates on your followed articles.",
    })
  }

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
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(7,241,214,0.3)]">B</div>
          <span className="text-2xl font-bold font-headline text-white tracking-tight group-hover:text-primary transition-colors">BharatDarshan Wiki</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-auto hidden md:flex relative group px-12">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for states, districts, or monuments..." 
            className="w-full h-12 pl-12 pr-12 bg-white/5 focus-visible:ring-primary/50 border-white/10 focus-visible:bg-white/10 transition-all rounded-full placeholder:text-muted-foreground/50 font-medium"
          />
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-primary text-muted-foreground transition-all hover:scale-110"
            onClick={() => setShowVoiceSearch(true)}
            title="Voice Search"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary transition-all">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto w-[220px] bg-[#161C21] border-white/10 p-2 rounded-2xl">
            {INDIAN_LANGUAGES.map((lang) => (
              <DropdownMenuItem 
                key={lang.name} 
                className={`flex justify-between items-center cursor-pointer h-12 rounded-xl px-4 m-1 transition-colors ${currentLanguage === lang.name ? 'text-black font-black bg-primary' : 'text-white/70 hover:bg-primary/10 hover:text-primary'}`}
                onClick={() => setLanguage(lang.name)}
              >
                <span className="font-bold">{lang.native}</span>
                <span className="text-[10px] uppercase font-black opacity-40">{lang.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/contribute">
          <Button variant="ghost" className="hidden sm:flex gap-2 text-white/80 hover:text-primary hover:bg-primary/5 rounded-full px-5 transition-all h-10 border border-transparent hover:border-primary/20">
            <MessageSquare className="h-4 w-4" />
            <span className="font-black uppercase tracking-widest text-[10px]">Contribute</span>
          </Button>
        </Link>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNotificationClick}
          className="relative text-white/80 hover:text-primary transition-all h-10 w-10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(7,241,214,1)] animate-pulse" />
        </Button>
        
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:border-primary bg-white/5 hover:bg-primary/10 transition-all group h-10 w-10">
            <User className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          </Button>
        </Link>
      </div>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </header>
  )
}
