"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Mic, Square, Loader2, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiVoiceSearchContent } from '@/ai/flows/ai-voice-search-content-flow'
import { Badge } from '@/components/ui/badge'

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Namaste! I am your BharatDarshan Assistant. How can I help you explore India today?' }
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsProcessing(true)

    // Simulate AI thinking and response for the "Assistant" role
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: `I'm analyzing your request about "${text}". As a heritage assistant, I can help you find historical facts, translate articles, or summarize complex state histories. Please ask me about a specific state or monument!` 
      }])
      setIsProcessing(false)
    }, 1000)
  }

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
            handleSend(response.queryText)
          } catch (error) {
            console.error('STT Error:', error)
          } finally {
            setIsProcessing(false)
          }
        }
      }
      mediaRecorderRef.current.start()
      setIsRecording(true)
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

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] floating-ai-bounce">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-16 w-16 rounded-full bg-primary text-black shadow-2xl neon-glow hover:scale-110 transition-transform p-0"
        >
          {isOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-28 right-8 w-[380px] h-[500px] z-[100] shadow-2xl border-primary/20 bg-background/95 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 rounded-[2rem] overflow-hidden flex flex-col">
          <CardHeader className="bg-primary p-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center text-primary">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-black font-black text-lg">Bharat Assistant</CardTitle>
                <Badge variant="secondary" className="bg-black/10 text-black border-none text-[10px] font-bold uppercase tracking-widest">Online</Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-black hover:bg-black/10">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-black font-bold rounded-tr-none' 
                      : 'bg-muted text-foreground rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-muted/30 border-t border-white/5">
            <div className="flex gap-2 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-10 w-10 shrink-0 ${isRecording ? 'text-destructive animate-pulse' : 'text-primary'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Input 
                placeholder="Ask anything..." 
                className="bg-background border-white/10 pr-12 rounded-xl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary text-black hover:bg-primary/90"
                onClick={() => handleSend()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}