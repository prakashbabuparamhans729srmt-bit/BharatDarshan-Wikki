
"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  FileText, 
  MessageSquare, 
  Settings, 
  History,
  Trophy,
  Plus,
  ArrowRight,
  UserCheck,
  Lock,
  Loader2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase'
import { doc, collection, query, where } from 'firebase/firestore'

/**
 * @description Advanced User Dashboard. Connected to live Firestore
 * for user profiles, heritage points, and contribution statistics.
 */
export default function DashboardPage() {
  const router = useRouter()
  const { user, isUserLoading: isAuthLoading } = useUser()
  const db = useFirestore()

  // 1. Fetch real profile data from Firestore
  const profileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'user_profiles', user.uid);
  }, [db, user]);
  
  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  // 2. Fetch user's articles for real statistics
  const userArticlesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'articles_published'), where('authorId', '==', user.uid));
  }, [db, user]);
  
  const { data: userArticles } = useCollection(userArticlesQuery);

  const isGuest = user?.isAnonymous || !user

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-12">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150 animate-pulse" />
            <div className="h-48 w-48 rounded-[3rem] bg-[#161C21] border-4 border-white/5 flex items-center justify-center relative z-10 shadow-2xl rotate-12">
              <Lock className="h-24 w-24 text-primary/30" />
            </div>
          </div>
          <div className="space-y-6 max-w-xl mx-auto">
            <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase px-6 py-2">Limited Access</Badge>
            <h1 className="text-6xl font-headline font-black text-white">Guest Mode</h1>
            <p className="text-2xl text-muted-foreground italic font-light leading-relaxed">
              Explore Bharat freely, but create a profile to unlock the full power of history preservation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <Button onClick={() => router.push('/auth')} className="bg-primary text-black font-black h-16 px-14 rounded-2xl text-xl shadow-neon transition-all hover:scale-105">
              <UserCheck className="mr-3 h-7 w-7" />
              Create Profile
            </Button>
            <Button variant="outline" onClick={() => router.push('/browse')} className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-16 px-14 rounded-2xl text-xl font-bold">
              Continue Browsing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const displayName = profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : user?.displayName || "Heritage Explorer";
  const articleCount = userArticles?.length || 0;
  const heritagePoints = articleCount * 250;

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 animate-in fade-in duration-700 grid-bg">
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-end justify-between border-b border-white/5 pb-16">
        <div className="flex flex-col md:flex-row gap-10 items-center text-center md:text-left">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl group-hover:bg-primary/50 transition-all scale-125 animate-pulse" />
            <Avatar className="h-48 w-48 border-8 border-primary/20 shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-110">
              <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/400`} />
              <AvatarFallback className="bg-primary text-black font-black text-5xl">{profile?.firstName?.slice(0, 1) || "B"}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-4 -right-4 bg-primary text-black h-16 w-16 rounded-3xl flex items-center justify-center font-black text-2xl border-4 border-background shadow-2xl z-20 shadow-neon">
              {articleCount}
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            <h1 className="text-6xl md:text-8xl font-headline font-black text-white tracking-tight drop-shadow-2xl">{displayName}</h1>
            <p className="text-primary/70 text-xl italic font-light">
              {profile?.username ? `@${profile.username}` : user?.email} • Archivist since {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : 'Active Node'}
            </p>
          </div>
        </div>
        <div className="flex gap-4 relative z-10 pb-4">
          <Link href="/contribute">
            <Button className="gap-3 bg-primary text-black hover:bg-primary/90 rounded-2xl px-10 h-16 shadow-neon font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 active:scale-95">
              <Plus className="h-6 w-6" />
              New Heritage Entry
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="icon" className="rounded-2xl h-16 w-16 border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all">
              <Settings className="h-7 w-7 text-primary" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Articles Published", value: articleCount, icon: FileText, color: "text-primary" },
          { label: "Community Talk", value: 12, icon: MessageSquare, color: "text-primary" },
          { label: "Heritage Points", value: heritagePoints.toLocaleString(), icon: Trophy, color: "text-primary" },
          { label: "Archive Revisions", value: articleCount * 2, icon: History, color: "text-primary" }
        ].map((stat, i) => (
          <Card key={i} className="border-white/5 shadow-2xl bg-[#161C21]/60 backdrop-blur-xl rounded-[3rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-6">
              <div className={`h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center ${stat.color} shadow-sm border border-white/5 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500`}>
                <stat.icon className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">{stat.label}</p>
                <h3 className="text-5xl font-black text-white">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-white/5 bg-[#161C21]/40 rounded-[3rem] overflow-hidden">
          <CardContent className="p-12 space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="text-3xl font-headline font-black text-white">Recent Contributions</h3>
              <Link href="/browse">
                <Button variant="link" className="text-primary font-black uppercase tracking-widest text-xs p-0 h-auto">View All <ArrowRight className="ml-2 h-3 w-3" /></Button>
              </Link>
            </div>
            
            <div className="space-y-6">
              {userArticles?.length ? userArticles.slice(0, 3).map((art) => (
                <Link key={art.id} href={`/article/${art.slug}`} className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                      {art.title.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{art.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 italic">{art.categoryId} • {new Date(art.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black uppercase px-4 py-1.5 shadow-neon">Live Node</Badge>
                </Link>
              )) : (
                <div className="py-20 text-center space-y-6 opacity-30">
                  <FileText className="h-16 w-16 mx-auto text-primary" />
                  <p className="text-xl font-headline italic">Your digital legacy is empty. Start contributing today.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-primary rounded-[3rem] overflow-hidden shadow-2xl relative group">
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-12 flex flex-col h-full justify-between text-black">
            <div className="space-y-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-black flex items-center justify-center text-primary shadow-2xl">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-headline font-black leading-tight">Master of Heritage</h3>
              <p className="text-lg font-bold italic opacity-80 leading-relaxed">
                "Preserving the past is the ultimate gift to the future. You are currently at Level 1. Reach 1,000 points to unlock Bronze Architect status."
              </p>
            </div>
            <Button className="w-full bg-black text-primary font-black h-16 rounded-2xl text-lg mt-10 hover:bg-black/90 transition-all active:scale-95 shadow-2xl">
              Unlock Rewards
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
