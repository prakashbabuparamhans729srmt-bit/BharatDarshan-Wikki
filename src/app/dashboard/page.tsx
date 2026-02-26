
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
  Clock, 
  History,
  Trophy,
  Plus
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function DashboardPage() {
  const contributions = [
    { title: "Taj Mahal", date: "2 days ago", action: "Edited Content", status: "Published" },
    { title: "Agra Fort", date: "1 week ago", action: "Added Images", status: "Under Review" },
    { title: "Uttar Pradesh", date: "2 weeks ago", action: "Created Article", status: "Published" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
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
              <Badge className="bg-primary/10 text-primary border-none">Level 4 Contributor</Badge>
              <Badge className="bg-accent/10 text-accent border-none">History Buff</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/contribute">
            <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-full px-6">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Articles Created", value: "12", icon: FileText, color: "text-blue-500" },
          { label: "Total Edits", value: "148", icon: History, color: "text-orange-500" },
          { label: "Points Earned", value: "2.4k", icon: Trophy, color: "text-yellow-500" },
          { label: "Talk Topics", value: "5", icon: MessageSquare, color: "text-green-500" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-card/50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-background flex items-center justify-center ${stat.color} shadow-sm border`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-primary/5 shadow-md">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-xl font-headline">Recent Contributions</CardTitle>
            <CardDescription>Your latest activity across the wiki.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {contributions.map((item, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.action} • {item.date}</p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'Published' ? 'default' : 'secondary'} className={item.status === 'Published' ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted/10 text-center border-t">
              <Button variant="ghost" className="text-primary w-full">View Full Contribution History</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-primary/5 shadow-md overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Knowledge Points</span>
                  <span className="font-bold">2,400 / 3,000</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[80%]" />
                </div>
                <p className="text-[10px] text-muted-foreground italic text-right">600 points more for Level 5</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Badges Earned</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5].map(b => (
                    <div key={b} className="aspect-square rounded-full bg-muted/50 border border-primary/5 flex items-center justify-center" title="Achievement Badge">
                      <Trophy className="h-6 w-6 text-primary/40" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent text-white border-none shadow-lg">
            <CardContent className="p-6 space-y-4 text-center">
              <Sparkles className="h-10 w-10 mx-auto" />
              <h3 className="text-xl font-headline font-bold">Try AI Insights</h3>
              <p className="text-white/80 text-sm">
                Unlock advanced editing tools and automatic translations for your articles.
              </p>
              <Button className="w-full bg-white text-accent hover:bg-white/90 font-bold">Upgrade Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
