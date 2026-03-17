
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Mic, Square, Loader2, Compass, HelpCircle, Map, Info, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiVoiceSearchContent } from '@/ai/flows/ai-voice-search-content-flow'
import { Badge } from '@/components/ui/badge'

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Namaste! I am your Bharat Assistant. I am here to guide you through India\'s digital heritage repository from A to Z. How can I help you today?' }
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

    // Advanced AI Logic - Explaining A to Z of the app
    setTimeout(() => {
      let response = `I've analyzed your query about "${text}". `;
      
      const q = text.toLowerCase();
      if (q.includes('help') || q.includes('how') || q.includes('a to z')) {
        response = "BharatDarshan Wiki is India's most advanced digital encyclopedia. Here is the A to Z guide:\n\n" +
          "• **A** - Auth: Secure login for contributors.\n" +
          "• **B** - Browse: Explore 28 states alphabetically.\n" +
          "• **C** - Contribute: Write and refine history with AI.\n" +
          "• **D** - Dashboard: Track your points and impact.\n" +
          "• **H** - History: Track every revision of a monument.\n" +
          "• **L** - Languages: Translate everything into 22 Indian languages.\n" +
          "• **S** - Search: Advanced crawling for monuments and districts.\n" +
          "• **V** - Voice: Search just by speaking!\n\nHow can I guide your journey further?";
      } else if (q.includes('language') || q.includes('translate')) {
        response = "Our AI supports 22 official Indian languages including Hindi, Marathi, Tamil, Bengali, and more. Use the Globe icon in the Header or go to the 'AI & Tools' tab on any article to translate it instantly.";
      } else if (q.includes('voice') || q.includes('mic') || q.includes('speak')) {
        response = "You can use Voice Search! Just click the Mic icon in the search bar or right here in my chat window. I will listen, transcribe, and find the heritage site you are looking for.";
      } else if (q.includes('monument') || q.includes('heritage')) {
        response = "We have thousands of indexed nodes! Try searching for 'Taj Mahal', 'Agra Fort', or browse by State to see hidden gems in your region.";
      } else {
        response += "I'm searching our heritage archives... Did you know that BharatDarshan indexes data from over 700 districts across India? You can explore them all in the 'Browse' section.";
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: response 
      }])
      setIsProcessing(false)
    }, 1200)
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
          className="h-16 w-16 rounded-full bg-primary text-black shadow-2xl neon-glow hover:scale-110 transition-transform p-0 border-4 border-black"
        >
          {isOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-28 right-8 w-[400px] h-[600px] z-[100] shadow-2xl border-primary/20 bg-background/95 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 rounded-[3rem] overflow-hidden flex flex-col border border-white/5">
          <CardHeader className="bg-primary p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center text-primary shadow-xl">
                <Compass className="h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-black font-black text-xl leading-none">Bharat Assistant</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/60">A-Z Heritage Expert</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-black hover:bg-black/10 rounded-full">
              <X className="h-6 w-6" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-8">
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user' 
                      ? 'bg-primary text-black font-bold rounded-tr-none shadow-lg' 
                      : 'bg-[#161C21] text-foreground rounded-tl-none border border-white/10 shadow-xl italic'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-[#161C21] p-5 rounded-[1.5rem] rounded-tl-none border border-white/10 shadow-xl">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-6 bg-black/40 border-t border-white/5 space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10 h-8 shrink-0" onClick={() => handleSend("Tell me the A to Z guide")}>
                <HelpCircle className="h-3 w-3 mr-2" /> A-Z Guide
              </Button>
              <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10 h-8 shrink-0" onClick={() => handleSend("How to use Voice Search?")}>
                <Mic className="h-3 w-3 mr-2" /> Voice Info
              </Button>
              <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10 h-8 shrink-0" onClick={() => handleSend("Explore Monuments")}>
                <BookOpen className="h-3 w-3 mr-2" /> Monuments
              </Button>
            </div>
            <div className="flex gap-3 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-12 w-12 rounded-xl shrink-0 transition-all ${isRecording ? 'bg-destructive text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
              <Input 
                placeholder="Talk to Bharat Assistant..." 
                className="bg-black/20 border-white/10 pr-14 h-12 rounded-xl text-sm focus-visible:ring-primary/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg bg-primary text-black hover:bg-primary/90 transition-all active:scale-95 shadow-neon"
                onClick={() => handleSend()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
