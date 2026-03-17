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
  ChevronRight
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

export default function SettingsPage() {
  const { theme, setTheme } = useAppTheme()
  const { currentLanguage, setLanguage } = useAppLanguage()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-bold text-primary">System Settings</h1>
        <p className="text-muted-foreground">Configure your BharatDarshan experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <nav className="space-y-1">
            {[
              { label: 'Appearance', icon: Monitor, active: true },
              { label: 'Language', icon: Globe },
              { label: 'Notifications', icon: Bell },
              { label: 'Privacy', icon: Shield },
              { label: 'Mobile App', icon: Smartphone }
            ].map((item, i) => (
              <Button 
                key={i} 
                variant="ghost" 
                className={`w-full justify-start gap-3 h-12 rounded-xl ${item.active ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground'}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card className="border-white/5 bg-card/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-headline">Appearance</CardTitle>
              <CardDescription>Customize the visual style of the application.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-black uppercase tracking-[0.2em] text-primary/70">Theme Mode</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Monitor }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                        theme === t.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <t.icon className={`h-8 w-8 ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-sm font-bold ${theme === t.id ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
                      {theme === t.id && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold">Neon Accents</h4>
                  <p className="text-xs text-muted-foreground">Apply a glowing neon effect to primary elements.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-headline">Language & Localization</CardTitle>
              <CardDescription>Choose your preferred language for India's heritage content.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-black uppercase tracking-[0.2em] text-primary/70">Content Language</Label>
                <Select value={currentLanguage} onValueChange={setLanguage}>
                  <SelectTrigger className="h-14 rounded-2xl border-white/10 bg-white/5">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-2xl border-white/10">
                    {INDIAN_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.name} value={lang.name} className="h-12">
                        <div className="flex items-center gap-3">
                          <span className="font-bold">{lang.native}</span>
                          <span className="text-xs text-muted-foreground">({lang.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground italic">
                  * Changing the language will attempt to translate all wiki articles automatically using Gemini AI.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}