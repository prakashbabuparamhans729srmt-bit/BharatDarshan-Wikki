"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  History,
  Trophy,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  Zap,
  MapPin
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const impactData = [
  { name: 'Mon', points: 400 },
  { name: 'Tue', points: 300 },
  { name: 'Wed', points: 500 },
  { name: 'Thu', points: 280 },
  { name: 'Fri', points: 590 },
  { name: 'Sat', points: 800 },
  { name: 'Sun', points: 600 },
]

export default function DashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  const contributions = [
    { title: "Taj Mahal", date: "2 days ago", action: "Edited Content", status: "Published" },
    { title: "Agra Fort", date: "1 week ago", action: "Added Images", status: "Under Review" },
    { title: "Uttar Pradesh", date: "2 weeks ago", action: "Created Article", status: "Published" },
  ]

  const achievements = [
    { title: "Day 7 Streak", desc: "Contributed for 7 consecutive days", icon: Clock },
    { title: "Master Editor", desc: "Over 100 quality edits approved", icon: Award },
    { title: "Multilingual", desc: "Translated 10+ heritage articles", icon: Sparkles },
    { title: "District Guide", desc: "Mapped over 50 local districts", icon: MapPin }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700 grid-bg">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all" />
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-2xl relative z-10 transition-transform group-hover:scale-105">
              <AvatarImage src="https://picsum.photos/seed/user1/200" />
              <AvatarFallback>BD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary text-black h-10 w-10 rounded-full flex items-center justify-center font-black border-4 border-background shadow-lg z-20">
              48
            </div>
          </div>
          <div className="space-y-2 relative z-10">
            <h1 className="text-5xl font-headline font-black text-white tracking-tight">Explorer Profile</h1>
            <p className="text-muted-foreground text-lg italic">Joined BharatDarshan in October 2023</p>
            <div className="flex gap-2 justify-center md:justify-start pt-2">
              <Badge className="bg-primary/10 text-primary border border-primary/20 font-black text-[10px] tracking-widest uppercase px-3 py-1">Expert Contributor</Badge>
              <Badge className="bg-primary/10 text-primary border border-primary/20 font-black text-[10px] tracking-widest uppercase px-3 py-1">History Buff</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          <Link href="/contribute">
            <Button className="gap-2 bg-primary text-black hover:bg-primary/90 rounded-2xl px-8 h-14 shadow-neon font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95">
              <Plus className="h-5 w-5" />
              New Entry
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all">
              <Settings className="h-6 w-6 text-primary" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Articles Created", value: "12", icon: FileText, color: "text-primary" },
          { label: "Total Edits", value: "148", icon: History, color: "text-primary" },
          { label: "Points Earned", value: "2.4k", icon: Trophy, color: "text-primary" },
          { label: "Talk Topics", value: "5", icon: MessageSquare, color: "text-primary" }
        ].map((stat, i) => (
          <Card key={i} className="border-white/5 shadow-2xl bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-4xl font-black mt-1 text-white">{stat.value}</h3>
              </div>
              <div className={`h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} shadow-sm border border-white/5 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 mb-8">
              <TabsTrigger value="activity" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest px-8">Activity Hub</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest px-8">Achievements</TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest px-8">Full History</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-white/5 shadow-md bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/5 p-8">
                  <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-headline font-black text-white">Recent Contributions</CardTitle>
                  </div>
                  <CardDescription className="text-white/40">Your latest activity across the wiki archives.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {contributions.map((item, i) => (
                      <div key={i} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:shadow-neon transition-all">
                            <FileText className="h-7 w-7" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{item.title}</h4>
                            <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{item.action} • {item.date}</p>
                          </div>
                        </div>
                        <Badge className={item.status === 'Published' ? 'bg-primary text-black font-black px-4 py-1' : 'bg-white/10 text-white font-bold px-4 py-1'}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="p-8 bg-white/5 text-center border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      onClick={() => toast({ title: "Full History", description: "Loading your complete contribution archive..." })}
                      className="text-primary font-black uppercase tracking-widest text-xs w-full h-14 hover:bg-primary/10 group"
                    >
                      View Full Archive History
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((a, i) => (
                  <Card key={i} className="bg-[#161C21]/60 backdrop-blur-xl border-white/10 rounded-[2.5rem] p-8 group hover:border-primary/50 transition-all">
                    <div className="flex gap-6 items-start">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform shadow-sm">
                        <a.icon className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-white group-hover:text-primary transition-colors">{a.title}</h4>
                        <p className="text-sm text-white/50 leading-relaxed italic">{a.desc}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <Card className="border-white/5 bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] p-12 text-center space-y-6">
                  <History className="h-20 w-20 text-primary/20 mx-auto" />
                  <h3 className="text-2xl font-headline font-black text-white">Full Event Logs</h3>
                  <p className="text-muted-foreground italic">Detailed revision logs for all your edits across 14 states and 48 monuments.</p>
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 font-black h-12 rounded-xl">Download Data Log (JSON)</Button>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Impact Chart & Sidebar */}
        <div className="space-y-8">
          <Card className="border-white/5 shadow-md overflow-hidden bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] group">
            <CardHeader className="bg-primary p-8">
              <CardTitle className="text-2xl font-headline font-black text-black flex items-center gap-3">
                <TrendingUp className="h-7 w-7" />
                Impact Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={impactData}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#07F1D6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#07F1D6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Area 
                      type="monotone" 
                      dataKey="points" 
                      stroke="#07F1D6" 
                      fillOpacity={1} 
                      fill="url(#colorPoints)" 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/60 mb-1">
                  <span>Knowledge Points</span>
                  <span className="text-primary font-bold">2,400 / 3,000</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-primary shadow-neon transition-all duration-1000" style={{ width: '80%' }} />
                </div>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] text-right animate-pulse">600 pts to master level</p>
              </div>

              <div className="space-y-5">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Heritage Badges</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(b => (
                    <div key={b} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group/badge hover:border-primary/50 transition-colors cursor-help" title="Heritage Badge">
                      <Trophy className="h-7 w-7 text-primary/10 group-hover/badge:text-primary transition-colors group-hover/badge:scale-110" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary p-10 rounded-[2.5rem] text-black border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <Sparkles className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-6 text-center">
              <h3 className="font-headline font-black text-3xl leading-tight">AI Insights</h3>
              <p className="text-black/70 text-base font-bold italic">
                Unlock automated translations and style suggestions for your articles.
              </p>
              <Button 
                onClick={() => router.push('/settings')}
                className="w-full bg-black text-primary hover:bg-black/90 font-black h-16 rounded-2xl text-xl shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Launch Assistant
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
