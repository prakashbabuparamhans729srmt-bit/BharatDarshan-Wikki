
"use client"

import React, { useState, useRef } from 'react'
import { Headphones, Play, Pause, Loader2, Volume2, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { aiTextToSpeech } from '@/ai/flows/ai-text-to-speech-flow'
import { useToast } from '@/hooks/use-toast'
import { Slider } from '@/components/ui/slider'

interface AudioGuideProps {
  text: string;
  title: string;
}

export function AudioGuide({ text, title }: AudioGuideProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const handleGenerateAudio = async () => {
    if (audioUrl) {
      togglePlay()
      return
    }

    setIsLoading(true)
    try {
      // Limit text length for TTS to avoid massive payloads in a single flow
      const summaryText = `This is an audio guide for ${title}. ${text.slice(0, 1000)}...`;
      const response = await aiTextToSpeech({ text: summaryText })
      setAudioUrl(response.audioDataUri)
      setIsPlaying(true)
      
      // We'll set the audio ref source and play it in a subsequent effect or directly if possible
    } catch (error) {
      console.error(error)
      toast({
        title: "Audio Error",
        description: "Could not generate the audio guide at this time.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Card className="border-primary/10 bg-foreground/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-xl font-headline font-black text-primary flex items-center gap-3">
          <Headphones className="h-6 w-6" />
          Heritage Audio Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-6">
        <div className="flex flex-col items-center justify-center py-6 bg-black/40 rounded-2xl border border-white/5 space-y-6">
          <div className="relative">
            <div className={`h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 ${isPlaying ? 'animate-pulse scale-110 shadow-neon' : ''} transition-all`}>
              <Volume2 className="h-10 w-10" />
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
            )}
          </div>
          
          <div className="text-center">
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">AI Narrated • Multi-lingual support</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-primary">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              className="h-16 w-16 rounded-full bg-primary text-black hover:bg-primary/90 shadow-neon transition-transform active:scale-95"
              onClick={handleGenerateAudio}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current ml-1" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-primary">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>

          <div className="w-full max-w-xs px-4">
             <Slider defaultValue={[33]} max={100} step={1} className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4" />
          </div>
        </div>

        {audioUrl && (
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            className="hidden" 
            onEnded={() => setIsPlaying(false)}
            autoPlay 
          />
        )}
        
        <p className="text-[10px] text-white/30 text-center italic leading-relaxed">
          Powered by Gemini 2.5 Flash Audio. Our AI narrators provide context-aware insights about historical significance and local legends.
        </p>
      </CardContent>
    </Card>
  )
}
