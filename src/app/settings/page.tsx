"use client"

import React from 'react'
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Globe, 
  Bell, 
  Shield, 
  Smartphone,
  Check,
  ChevronRight,
  Palette,
  Volume2,
  ShieldCheck
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppTheme } from '@/context/ThemeContext'
import { useAppLanguage } from '@/context/LanguageContext'
import { INDIAN_LANGUAGES } from '@/lib/languages'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { theme, setTheme } = useAppTheme()
  const { currentLanguage, setLanguage } = useAppLanguage()
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been successfully updated.",
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest uppercase px-3 py-1 mb-2">
            Control Center
          </Badge>
          <h1 className="text-5xl font-headline font-black text-foreground">Advanced Settings</h1>
          <p className="text-muted-foreground text-lg">Tailor your BharatDarshan experience with precision.</p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-primary text-black font-black rounded-full px-8 h-12 neon-glow transition-all hover:scale-105"
        >
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-foreground/5 bg-foreground/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden sticky top-24">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {[
                  { id: 'appearance', label: 'Appearance', icon: Palette, active: true },
                  { id: 'language', label: 'Language & Region', icon: Globe },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'privacy', label: 'Security & Privacy', icon: ShieldCheck },
                  { id: 'mobile', label: 'Mobile Sync', icon: Smartphone }
                ].map((item) => (
                  <Button 
                    key={item.id} 
                    variant="ghost" 
                    className={`w-full justify-between h-14 rounded-2xl group transition-all ${
                      item.active 
                        ? 'bg-primary text-black font-black' 
                        : 'text-foreground/60 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`h-5 w-5 ${item.active ? 'text-black' : 'text-primary'}`} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 opacity-30 group-hover:opacity-100 ${item.active ? 'text-black' : ''}`} />
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {/* Appearance Section */}
          <Card className="border-foreground/5 bg-foreground/5 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-10 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Palette className="h-5 w-5" />
                </div>
                <CardTitle className="text-3xl font-headline font-black text-foreground">Appearance</CardTitle>
              </div>
              <CardDescription className="text-foreground/50 text-base">Customize the visual journey through India's past.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-10">
              <div className="space-y-6">
                <Label className="text-xs font-black uppercase tracking-[0.3em] text-primary/70">Theme Engine</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Sunlight', icon: Sun, desc: 'High visibility' },
                    { id: 'dark', label: 'Heritage Night', icon: Moon, desc: 'Neon focus' },
                    { id: 'system', label: 'Device Default', icon: Monitor, desc: 'OS adaptive' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={`flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden group ${
                        theme === t.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-foreground/5 bg-foreground/5 hover:bg-foreground/10'
                      }`}
                    >
                      <t.icon className={`h-10 w-10 transition-transform duration-500 group-hover:scale-110 ${theme === t.id ? 'text-primary' : 'text-foreground/40'}`} />
                      <div className="text-center">
                        <span className={`block font-black text-sm uppercase tracking-widest ${theme === t.id ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
                        <span className="text-[10px] text-foreground/30 font-bold uppercase mt-1">{t.desc}</span>
                      </div>
                      {theme === t.id && (
                        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-foreground/5" />

              <div className="flex items-center justify-between p-6 rounded-3xl bg-foreground/5 border border-foreground/5 transition-all hover:bg-foreground/10">
                <div className="space-y-1">
                  <h4 className="font-black text-foreground text-lg">Neon Accent Glow</h4>
                  <p className="text-sm text-foreground/50 italic">Enable glowing borders and neon lighting across the UI.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Localization Section */}
          <Card className="border-foreground/5 bg-foreground/5 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-10 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <CardTitle className="text-3xl font-headline font-black text-foreground">Language & Region</CardTitle>
              </div>
              <CardDescription className="text-foreground/50 text-base">Choose your lens into India's multilingual history.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-8">
              <div className="space-y-6">
                <Label className="text-xs font-black uppercase tracking-[0.3em] text-primary/70">Master Language</Label>
                <Select value={currentLanguage} onValueChange={setLanguage}>
                  <SelectTrigger className="h-16 rounded-2xl border-foreground/10 bg-foreground/5 text-lg font-bold">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px] rounded-3xl border-foreground/10 bg-background text-foreground">
                    {INDIAN_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.name} value={lang.name} className="h-14 focus:bg-primary focus:text-black rounded-xl m-1">
                        <div className="flex items-center justify-between w-full gap-20">
                          <span className="font-black text-lg">{lang.native}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4 items-start animate-in fade-in duration-1000">
                  <Volume2 className="h-6 w-6 text-primary shrink-0" />
                  <p className="text-xs text-foreground/70 leading-relaxed italic">
                    <span className="text-primary font-black uppercase tracking-widest mr-2">Note:</span>
                    When you change the language, Bharat Assistant will automatically attempt to translate the entire wiki database in real-time using Gemini AI models.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}