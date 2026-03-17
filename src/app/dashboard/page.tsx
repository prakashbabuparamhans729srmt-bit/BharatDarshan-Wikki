
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
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  
  const contributions = [
    { title: "Taj Mahal", date: "2 days ago", action: "Edited Content", status: "Published" },
    { title: "Agra Fort", date: "1 week ago", action: "Added Images", status: "Under Review" },
    { title: "Uttar Pradesh", date: "2 weeks ago", action: "Created Article", status: "Published" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl">
            <AvatarImage src="https://picsum.photos/seed/user1/200" />
            <AvatarFallback>BD</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-headline font-bold text-primary">Explorer Profile</h1>
            <p className="text-muted-foreground">Joined BharatDarshan in October 2023</p>
            <div className="flex gap-2 justify-center md:justify-start pt-2">
              <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase">Level 4 Contributor</Badge>
              <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase">History Buff</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/contribute">
            <Button className="gap-2 bg-primary text-black hover:bg-primary/90 rounded-full px-6 h-12 neon-glow font-black uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-white/10 bg-white/5">
              <Settings className="h-5 w-5 text-primary" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Articles Created", value: "12", icon: FileText, color: "text-primary" },
          { label: "Total Edits", value: "148", icon: History, color: "text-primary" },
          { label: "Points Earned", value: "2.4k", icon: Trophy, color: "text-primary" },
          { label: "Talk Topics", value: "5", icon: MessageSquare, color: "text-primary" }
        ].map((stat, i) => (
          <Card key={i} className="border-white/5 shadow-sm bg-[#161C21]/60 backdrop-blur-xl rounded-[2rem]">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-black mt-1 text-white">{stat.value}</h3>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} shadow-sm border border-white/5`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-white/5 shadow-md bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5 p-8">
            <CardTitle className="text-2xl font-headline font-black text-white">Recent Contributions</CardTitle>
            <CardDescription className="text-white/40">Your latest activity across the wiki archives.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {contributions.map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{item.action} • {item.date}</p>
                    </div>
                  </div>
                  <Badge className={item.status === 'Published' ? 'bg-primary text-black font-black' : 'bg-white/10 text-white font-bold'}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white/5 text-center border-t border-white/5">
              <Button 
                variant="ghost" 
                onClick={() => toast({ title: "Full History", description: "Loading your complete contribution archive..." })}
                className="text-primary font-black uppercase tracking-widest text-xs w-full h-12 hover:bg-primary/10"
              >
                View Full Contribution History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-white/5 shadow-md overflow-hidden bg-[#161C21]/60 backdrop-blur-xl rounded-[2.5rem]">
            <CardHeader className="bg-primary p-8">
              <CardTitle className="text-2xl font-headline font-black text-black flex items-center gap-3">
                <TrendingUp className="h-6 w-6" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/60 mb-1">
                  <span>Knowledge Points</span>
                  <span className="text-primary">2,400 / 3,000</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-primary neon-glow" style={{ width: '80%' }} />
                </div>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] text-right">600 pts to level up</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Badges Earned</h4>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(b => (
                    <div key={b} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group hover:border-primary/50 transition-colors" title="Achievement Badge">
                      <Trophy className="h-6 w-6 text-primary/20 group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary p-8 rounded-[2.5rem] text-black border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
              <Sparkles className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-6 text-center">
              <h3 className="font-headline font-black text-3xl leading-tight">AI Insights</h3>
              <p className="text-black/70 text-base font-bold italic">
                Unlock automated translations and style suggestions for your articles.
              </p>
              <Button 
                onClick={() => router.push('/settings')}
                className="w-full bg-black text-primary hover:bg-black/90 font-black h-14 rounded-2xl text-lg shadow-xl"
              >
                Upgrade Explorer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
