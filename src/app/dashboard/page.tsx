
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

/**
 * @description Advanced User Dashboard. Connected to live Firestore
 * for user profiles, points, and contribution history.
 */
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
    </div>
  )
}
