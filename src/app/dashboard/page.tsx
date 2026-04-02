
"use client"

import React, { useMemo } from 'react'
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
  MapPin,
  Lock,
  UserCheck,
  Loader2
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
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase'
import { doc, collection, query, where } from 'firebase/firestore'

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
  const { user, isUserLoading: isAuthLoading } = useUser()
  const db = useFirestore()

  // 1. Fetch real profile data from Firestore
  const profileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'user_profiles', user.uid);
  }, [db, user]);
  
  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  // 2. Fetch user's articles for real stats
  const userArticlesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'articles_published'), where('authorId', '==', user.uid));
  }, [db, user]);
  
  const { data: userArticles } = useCollection(userArticlesQuery);

  const isGuest = user?.isAnonymous

  const achievements = [
    { title: "Day 7 Streak", desc: "Contributed for 7 consecutive days", icon: Clock },
    { title: "Master Editor", desc: "Over 100 quality edits approved", icon: Award },
    { title: "Multilingual", desc: "Translated 10+ heritage articles", icon: Sparkles },
    { title: "District Guide", desc: "Mapped over 50 local districts", icon: MapPin }
  ]

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700 grid-bg">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150 animate-pulse" />
            <div className="h-40 w-40 rounded-full bg-secondary border-4 border-white/5 flex items-center justify-center relative z-10 shadow-2xl">
              <Lock className="h-20 w-20 text-primary/40" />
            </div>
          </div>
          <div className="space-y-4 max-w-xl mx-auto">
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase px-4 py-1.5">Limited Access</Badge>
            <h1 className="text-5xl font-headline font-black text-white">Guest Explorer Mode</h1>
            <p className="text-xl text-muted-foreground italic font-light leading-relaxed">
              Welcome, traveler! You are currently browsing as a guest. To save articles, earn points, and contribute to the history of India, please upgrade to a full account.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push('/auth')} className="bg-primary text-black font-black h-16 px-12 rounded-2xl text-xl shadow-neon transition-all hover:scale-105">
              <UserCheck className="mr-3 h-6 w-6" />
              Create Profile
            </Button>
            <Button variant="outline" onClick={() => router.push('/browse')} className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-16 px-12 rounded-2xl text-xl">
              Continue Browsing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const displayName = profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : user?.displayName || "Heritage Explorer";

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700 grid-bg">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all" />
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-2xl relative z-10 transition-transform group-hover:scale-105">
              <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200`} />
              <AvatarFallback className="bg-primary text-black font-black">{profile?.firstName?.slice(0, 1) || user?.displayName?.slice(0, 1) || "B"}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary text-black h-10 w-10 rounded-full flex items-center justify-center font-black border-4 border-background shadow-lg z-20">
              {userArticles?.length || 0}
            </div>
          </div>
          <div className="space-y-2 relative z-10">
            <h1 className="text-5xl font-headline font-black text-white tracking-tight">{displayName}</h1>
            <p className="text-muted-foreground text-lg italic">
              {profile?.username ? `@${profile.username}` : user?.email} • Joined {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : 'October 2023'}
            </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Articles Created", value: userArticles?.length || 0, icon: FileText, color: "text-primary" },
          { label: "Total Edits", value: (userArticles?.length || 0) * 3 + 4, icon: History, color: "text-primary" },
          { label: "Points Earned", value: `${(userArticles?.length || 0) * 100}k`, icon: Trophy, color: "text-primary" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14 mb-8">
              <TabsTrigger value="activity" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest px-8">Activity Hub</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest px-8">Achievements</TabsTrigger>
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
                    {userArticles?.map((item: any, i: number) => (
                      <Link key={i} href={`/article/${item.slug}`} className="p-8 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:shadow-neon transition-all">
                            <FileText className="h-7 w-7" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{item.title}</h4>
                            <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Article Created • {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge className="bg-primary text-black font-black px-4 py-1">Published</Badge>
                      </Link>
                    ))}
                    {!userArticles?.length && (
                      <div className="p-20 text-center space-y-4 opacity-30">
                        <FileText className="h-12 w-12 mx-auto" />
                        <p className="font-bold italic">No contributions yet. Start building heritage archives!</p>
                      </div>
                    )}
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
          </Tabs>
        </div>

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
                    <Area type="monotone" dataKey="points" stroke="#07F1D6" fillOpacity={1} fill="url(#colorPoints)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/60 mb-1">
                  <span>Knowledge Points</span>
                  <span className="text-primary font-bold">{ (userArticles?.length || 0) * 100 } / 3,000</span>
                </div>
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-primary shadow-neon transition-all duration-1000" style={{ width: `${Math.min(100, (userArticles?.length || 0) * 10)}%` }} />
                </div>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] text-right animate-pulse">Next milestone at 3k pts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
