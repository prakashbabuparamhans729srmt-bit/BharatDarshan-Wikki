
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Mic, Square, Loader2, Search, X, ArrowRight } from 'lucide-react'
import { aiVoiceSearchContent } from '@/ai/flows/ai-voice-search-content-flow'
import { useRouter } from 'next/navigation'

interface VoiceSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoiceSearchDialog({ open, onOpenChange }: VoiceSearchDialogProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ queryText: string; results: string } | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const router = useRouter()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = async () => {
          const base64Audio = reader.result as string
          setIsProcessing(true)
          try {
            const response = await aiVoiceSearchContent({ audioDataUri: base64Audio })
            setResult(response)
          } catch (error) {
            console.error('STT Error:', error)
          } finally {
            setIsProcessing(false)
          }
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setResult(null)
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  useEffect(() => {
    if (!open) {
      stopRecording()
      setResult(null)
    }
  }, [open])

  const handleGoToResults = () => {
    if (result) {
      onOpenChange(false)
      router.push(`/search?q=${encodeURIComponent(result.queryText)}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-primary/20 rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary font-black">Voice Explorer</DialogTitle>
          <DialogDescription className="text-white/50">
            Speak to search India's heritage. Our AI will crawl the wiki for you.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-10 gap-8">
          <div className={`relative flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
            {isRecording && (
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
            )}
            <Button
              size="lg"
              className={`h-24 w-24 rounded-full shadow-2xl transition-all neon-glow ${
                isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-10 w-10 animate-spin text-black" />
              ) : isRecording ? (
                <Square className="h-10 w-10 text-white" />
              ) : (
                <Mic className="h-10 w-10 text-black" />
              )}
            </Button>
          </div>

          <p className="text-lg font-bold text-white tracking-wide">
            {isProcessing ? 'AI is crawling wiki data...' : isRecording ? 'Listening to your command...' : 'Tap to speak'}
          </p>

          {result && (
            <div className="w-full mt-2 p-6 rounded-3xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Search className="h-4 w-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Transcription</span>
                </div>
                <p className="text-xl font-bold italic text-white">"{result.queryText}"</p>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-primary/10 text-sm leading-relaxed text-white/70 italic">
                {result.results}
              </div>
              <Button 
                className="w-full bg-primary text-black font-black h-12 rounded-xl neon-glow" 
                onClick={handleGoToResults}
              >
                See Full Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
