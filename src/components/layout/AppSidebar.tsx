
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
  Sparkles
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
  SidebarSeparator
} from '@/components/ui/sidebar'
import { STATES } from '@/lib/mock-data'

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="border-r border-border/50 bg-sidebar/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg leading-tight">Explore India</h2>
            <p className="text-xs text-muted-foreground">Wiki of Heritage</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Home">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Main Page</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Your Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Browse All">
                <Link href="/browse">
                  <BookOpen className="h-4 w-4" />
                  <span>Alphabetical Browse</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>States of India</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {STATES.slice(0, 8).map((state) => (
                <SidebarMenuItem key={state.code}>
                  <SidebarMenuButton asChild>
                    <Link href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ChevronRight className="h-3 w-3 opacity-50" />
                      <span>{state.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-primary font-medium">
                  <Link href="/browse">
                    <span>View All States...</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contribute">
                    <FileText className="h-4 w-4" />
                    <span>Create Article</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/tools/translate">
                    <Languages className="h-4 w-4" />
                    <span>Multi-Language Tool</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/tools/refine">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Assistant</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Recent History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="opacity-70">
                  <Link href="/article/uttar-pradesh">
                    <Clock className="h-4 w-4" />
                    <span>Uttar Pradesh</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="opacity-70">
                  <Link href="/article/taj-mahal">
                    <Clock className="h-4 w-4" />
                    <span>Taj Mahal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
