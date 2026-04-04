
"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Map, 
  BookOpen, 
  Languages, 
  Search, 
  Settings, 
  LayoutDashboard, 
  FileText,
  Clock,
  ChevronRight,
  Sparkles,
  Info,
  Compass,
  Star,
  MapPin,
  History,
  TrendingUp,
  Award,
  Mic,
  Image as ImageIcon
} from 'lucide-react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter
} from '@/components/ui/sidebar'
import { STATES } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'
import { VoiceSearchDialog } from '@/components/ai/VoiceSearchDialog'
import { useUser } from '@/firebase'

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)

  const isRouteActive = (route: string) => pathname === route

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-foreground/5 bg-background shadow-2xl">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-neon group-hover:rotate-6 transition-all duration-500">
            <Compass className="h-7 w-7" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-headline font-black text-xl leading-tight text-foreground whitespace-nowrap">Explore India</h2>
            <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em]">Wiki of Heritage</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive('/')} tooltip="Home" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                <Link href="/">
                  <Home className="h-5 w-5" />
                  <span className="font-bold">Main Page</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive('/dashboard')} tooltip="Dashboard" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="font-bold">Your Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive('/browse')} tooltip="Browse All" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                <Link href="/browse">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-bold">Browse Index</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive('/media')} tooltip="Media Gallery" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                <Link href="/media">
                  <ImageIcon className="h-5 w-5" />
                  <span className="font-bold">Media Library</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setShowVoiceSearch(true)} tooltip="Voice Explorer" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                <Mic className="h-5 w-5" />
                <span className="font-bold">Voice Explorer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="bg-foreground/5 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground/40 font-black uppercase text-[10px] tracking-widest px-3 mb-2">States of India</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {STATES.slice(0, 8).map((state) => (
                <SidebarMenuItem key={state.code}>
                  <SidebarMenuButton asChild className="h-10 text-foreground/60 hover:text-primary hover:bg-foreground/5 px-3 rounded-lg transition-all">
                    <Link href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <MapPin className="h-3 w-3 opacity-30" />
                      <span className="text-xs font-medium">{state.name}</span>
                      <ChevronRight className="h-3 w-3 ml-auto opacity-20" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-primary font-black hover:bg-primary/5 transition-all h-10 mt-2 rounded-lg">
                  <Link href="/browse">
                    <span className="text-xs px-1">View All 28 States...</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-foreground/5 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground/40 font-black uppercase text-[10px] tracking-widest px-3 mb-2">Tools & Editor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isRouteActive('/contribute')} className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                  <Link href="/contribute">
                    <FileText className="h-5 w-5" />
                    <span className="font-bold">Create Article</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                  <Link href="/settings">
                    <Languages className="h-5 w-5" />
                    <span className="font-bold">AI Translator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-foreground/5 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground/40 font-black uppercase text-[10px] tracking-widest px-3 mb-2">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isRouteActive('/settings')} className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl data-[active=true]:bg-primary/20 data-[active=true]:text-primary">
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span className="font-bold">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                  <Link href="/dashboard">
                    <History className="h-5 w-5" />
                    <span className="font-bold">Your History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-foreground/5 bg-secondary/20">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all cursor-pointer group border border-foreground/5">
          <Avatar className="h-10 w-10 border border-primary/20 shadow-sm transition-transform group-hover:scale-110">
            <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'guest'}/100`} />
            <AvatarFallback className="bg-primary text-black font-black">
              {user?.displayName?.slice(0, 1) || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate">{user?.displayName || (user?.isAnonymous ? 'Guest Mode' : 'Authenticating...')}</p>
            <p className="text-[10px] text-primary/70 font-black uppercase tracking-widest">
              {user ? 'Verified Node' : 'Limited Access'}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all" />
        </Link>
      </SidebarFooter>
      <VoiceSearchDialog open={showVoiceSearch} onOpenChange={setShowVoiceSearch} />
    </Sidebar>
  )
}
