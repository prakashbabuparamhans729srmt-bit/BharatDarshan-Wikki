
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, User, Globe, MessageSquare, Mic, Bell, Sparkles, Image as ImageIcon, History, Star } from 'lucide-react'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Header() {
  const { toggleSidebar } = useSidebar()
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const { currentLanguage, setLanguage } = useAppLanguage()

  const notifications = [
    { id: 1, title: "New Edit on Taj Mahal", time: "2m ago", type: "edit", unread: true },
    { id: 2, title: "Achievement Unlocked: Master Editor", time: "1h ago", type: "award", unread: true },
    { id: 3, title: "New Comment in Talk: Agra", time: "3h ago", type: "talk", unread: false },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center border-b border-white/5 bg-secondary/80 backdrop-blur-2xl px-6 md:px-8 lg:px-12">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hover:bg-primary/10 text-primary transition-all active:scale-95 h-12 w-12 rounded-xl"
        >
          <Menu className="h-7 w-7" />
        </Button>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-xl group-hover:rotate-12 transition-transform shadow-neon">B</div>
          <span className="text-2xl font-bold font-headline text-white tracking-tight group-hover:text-primary transition-colors hidden sm:inline">BharatDarshan Wiki</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-auto hidden md:flex relative group px-12">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search India's Heritage..." 
            className="w-full h-12 pl-12 pr-12 bg-white/5 focus-visible:ring-primary/50 border-white/10 focus-visible:bg-white/10 transition-all rounded-full placeholder:text-muted-foreground/50 font-medium text-white"
          />
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-primary text-muted-foreground transition-all hover:scale-110 h-10 w-10 rounded-full"
            onClick={() => setShowVoiceSearch(true)}
            title="Voice Search"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-primary transition-all h-11 w-11 rounded-xl hover:bg-primary/10">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto w-[220px] bg-[#161C21] border-white/10 p-2 rounded-2xl shadow-2xl">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white/80 hover:text-primary transition-all h-11 w-11 rounded-xl hover:bg-primary/10"
            >
              <Bell className="h-5 w-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full shadow-[0_0_10px_rgba(7,241,214,1)] animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] bg-[#161C21] border-white/10 p-0 rounded-[2rem] shadow-2xl overflow-hidden">
            <DropdownMenuLabel className="p-6 bg-primary text-black font-black text-lg flex items-center justify-between">
              Notifications
              <Badge variant="outline" className="border-black/20 text-black font-bold text-[10px]">{notifications.filter(n => n.unread).length} New</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 m-0" />
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="p-4 rounded-2xl flex flex-col items-start gap-1 cursor-pointer hover:bg-white/5 focus:bg-white/10 group transition-all">
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-bold text-sm ${n.unread ? 'text-primary' : 'text-white'}`}>{n.title}</span>
                      {n.unread && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </ScrollArea>
            <DropdownMenuSeparator className="bg-white/5 m-0" />
            <Button variant="ghost" className="w-full h-12 text-primary font-black uppercase text-[10px] tracking-widest rounded-none hover:bg-primary/10">View All Alerts</Button>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="rounded-xl border-primary/20 hover:border-primary bg-white/5 hover:bg-primary/10 transition-all group h-11 w-11">
            <User className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          </Button>
        </Link>
      </div>

      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </header>
  )
}
