
"use client"

import React from 'react'
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
  History
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

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-white/5 bg-[#070707] shadow-2xl">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(7,241,214,0.3)] group-hover:rotate-6 transition-transform">
            <Compass className="h-7 w-7" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-headline font-black text-xl leading-tight text-white whitespace-nowrap">Explore India</h2>
            <p className="text-[10px] text-primary/70 font-bold uppercase tracking-[0.2em]">Wiki of Heritage</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Home" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                <Link href="/">
                  <Home className="h-5 w-5" />
                  <span className="font-bold">Main Page</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="font-bold">Your Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Browse All" className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                <Link href="/browse">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-bold">Browse Index</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 font-black uppercase text-[10px] tracking-widest px-3 mb-2">States of India</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {STATES.slice(0, 8).map((state) => (
                <SidebarMenuItem key={state.code}>
                  <SidebarMenuButton asChild className="h-10 text-white/60 hover:text-primary hover:bg-white/5 px-3 rounded-lg transition-colors">
                    <Link href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <MapPin className="h-3 w-3 opacity-30" />
                      <span className="text-xs font-medium">{state.name}</span>
                      <ChevronRight className="h-3 w-3 ml-auto opacity-20" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-primary font-black hover:bg-primary/5 transition-colors h-10 mt-2">
                  <Link href="/browse">
                    <span className="text-xs px-1">View All 28 States...</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 font-black uppercase text-[10px] tracking-widest px-3 mb-2">Tools & Editor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
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
                    <span className="font-bold">Translator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                  <Link href="/dashboard">
                    <Star className="h-5 w-5" />
                    <span className="font-bold">Achievements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-white/5 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 font-black uppercase text-[10px] tracking-widest px-3 mb-2">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
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

      <SidebarFooter className="p-4 border-t border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group border border-white/5">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user-side/100" />
            <AvatarFallback className="bg-primary text-black font-black">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Admin Explorer</p>
            <p className="text-[10px] text-primary/70 font-black uppercase tracking-widest">Lvl 48</p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}
