
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Compass, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff,
  UserCheck,
  Globe,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth, useFirestore } from '@/firebase'
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase/non-blocking-login'
import { useUser } from '@/firebase'
import { doc, serverTimestamp } from 'firebase/firestore'
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates'

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const db = useFirestore()
  const router = useRouter()

  // Create profile in Firestore when a user is detected
  useEffect(() => {
    if (user && !isUserLoading) {
      const profileRef = doc(db, 'user_profiles', user.uid)
      
      const profileData = {
        id: user.uid,
        email: user.email || 'guest@bharatdarshan.wiki',
        firstName: firstName || user.displayName?.split(' ')[0] || 'Explorer',
        lastName: lastName || user.displayName?.split(' ')[1] || '',
        username: user.email?.split('@')[0] || `explorer_${user.uid.slice(0, 5)}`,
        memberSince: serverTimestamp(),
        lastActive: serverTimestamp(),
        themePreference: 'dark',
        preferredLanguageId: 'English'
      }

      setDocumentNonBlocking(profileRef, profileData, { merge: true })
      
      // Redirect after profile initialization
      const timer = setTimeout(() => {
        router.push('/')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, isUserLoading, router, db, firstName, lastName])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    initiateEmailSignIn(auth, email, password)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    initiateEmailSignUp(auth, email, password)
  }

  const handleGuestMode = () => {
    setIsSubmitting(true)
    initiateAnonymousSignIn(auth)
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Compass className="h-12 w-12 text-primary animate-spin" />
          <p className="text-primary font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">Initializing BharatDarshan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center bg-primary rounded-2xl text-black shadow-[0_0_30px_rgba(7,241,214,0.3)] mb-4">
            <Compass className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-headline font-black text-white tracking-tight">BharatDarshan Wiki</h1>
          <p className="text-muted-foreground font-light text-lg italic">The Gateway to India's Heritage</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-2xl h-14 mb-8">
            <TabsTrigger 
              value="login" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase text-xs tracking-widest transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-[#161C21]/60 backdrop-blur-xl border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-white/50">Enter your details to access your dashboard.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="p-8 pt-4 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        required
                        className="bg-white/5 border-white/10 h-12 pl-12 rounded-xl focus-visible:ring-primary/50 focus-visible:bg-white/10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-primary/70">Password</Label>
                      <Button variant="link" className="text-[10px] text-primary h-auto p-0 hover:no-underline font-black uppercase tracking-widest">Forgot?</Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        required
                        className="bg-white/5 border-white/10 h-12 pl-12 pr-12 rounded-xl focus-visible:ring-primary/50 focus-visible:bg-white/10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0 flex flex-col gap-4">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-black font-black h-14 rounded-2xl text-lg neon-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Start Exploring"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-14 rounded-2xl group"
                    onClick={handleGuestMode}
                  >
                    <UserCheck className="mr-2 h-5 w-5 text-primary" />
                    Enter as Guest
                    <Sparkles className="ml-2 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-[#161C21]/60 backdrop-blur-xl border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
                <CardDescription className="text-white/50">Join the collective knowledge of Bharat.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="p-8 pt-4 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Arjun" 
                        required
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Sharma" 
                        required
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">Email Address</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="name@example.com" 
                      required
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-xs font-bold uppercase tracking-widest text-primary/70 ml-1">Password</Label>
                    <Input 
                      id="password-signup" 
                      type="password" 
                      placeholder="••••••••" 
                      required
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-black font-black h-14 rounded-2xl text-lg neon-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Join Community"}
                    {!isSubmitting && <Sparkles className="ml-2 h-5 w-5" />}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground font-medium">
            By continuing, you agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
            <Globe className="h-3 w-3" />
            Empowering India's Voice
          </div>
        </div>
      </div>
    </div>
  )
}
