
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
import { Mic, Square, Loader2, Search, X } from 'lucide-react'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Voice Search</DialogTitle>
          <DialogDescription>
            Speak to search for places, states, or history in India.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 gap-6">
          <div className={`relative flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}>
            {isRecording && (
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            )}
            <Button
              size="lg"
              className={`h-20 w-20 rounded-full shadow-xl transition-all ${
                isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
              }`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isRecording ? (
                <Square className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>

          <p className="text-sm font-medium">
            {isProcessing ? 'Transcribing your voice...' : isRecording ? 'Listening...' : 'Tap to start speaking'}
          </p>

          {result && (
            <div className="w-full mt-4 p-4 rounded-lg bg-muted border animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Search className="h-4 w-4" />
                <span className="font-bold">You said:</span>
              </div>
              <p className="italic text-foreground mb-4">"{result.queryText}"</p>
              <div className="p-3 bg-background rounded border border-primary/10 text-sm leading-relaxed">
                {result.results}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
