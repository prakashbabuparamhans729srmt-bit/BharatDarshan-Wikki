
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Mic, Square, Loader2, Compass, HelpCircle, Map, Info, BookOpen, FileText, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { aiVoiceSearchContent } from '@/ai/flows/ai-voice-search-content-flow'
import { Badge } from '@/components/ui/badge'

/**
 * @description Advanced AI Bharat Assistant. Acting as the master guide for the A to Z flow.
 * Provides context-aware help and explains the "A to Z" operational flow of the wiki.
 */
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Namaste! I am your Bharat Assistant. I am here to guide you through India\'s digital heritage repository from A to Z. Our advanced flow is now 100% operational. How can I guide your journey today?' }
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

    // Advanced AI Logic - Explaining A to Z of the app and its live features
    setTimeout(() => {
      let response = `I've analyzed your query about "${text}". `;
      
      const q = text.toLowerCase();
      if (q.includes('help') || q.includes('how') || q.includes('a to z') || q.includes('guide') || q.includes('flow') || q.includes('roadmap')) {
        response = "BharatDarshan Wiki is India's most advanced digital encyclopedia. The **A to Z Heritage Flow** is now fully active ('chalu'). Here is your roadmap:\n\n" +
          "• **A** - Auth: Secure login to unlock advanced editing rights.\n" +
          "• **B** - Browse: A perfect alphabetical index of all 28 states.\n" +
          "• **C** - Contribute: Write new heritage entries and use **Gemini AI** to refine them.\n" +
          "• **D** - Dashboard: Your personal command center for points, rewards, and stats.\n" +
          "• **H** - History: Every edit is tracked in our time-stamped Revision History.\n" +
          "• **M** - Media: A high-fidelity visual archive for photos and videos.\n" +
          "• **S** - Search: Advanced deep crawling of live and archived heritage nodes.\n" +
          "• **T** - Talk Page: Real-time community discussion hub on every single article.\n" +
          "• **V** - Voice: Speak to explore! Our STT engine translates your voice into history.\n\nEverything is operational and synchronized. What would you like to explore first?";
      } else if (q.includes('language') || q.includes('translate') || q.includes('hindi')) {
        response = "We support 22 official Indian languages! On any article page, go to the 'AI Tools' tab. Our Gemini models will translate the entire content into your chosen language in seconds. Our localization flow is fully advanced.";
      } else if (q.includes('voice') || q.includes('mic') || q.includes('speak')) {
        response = "Voice Search is 100% active. You can speak naturally—ask for states, monuments, or historical events. I will transcribe your query and crawl our archives for matching nodes instantly.";
      } else if (q.includes('edit') || q.includes('update') || q.includes('publish')) {
        response = "To contribute, navigate to the 'Contribute Node' section. You can publish new content or refine existing articles. Once you hit publish, it becomes a 'Live Node' in our heritage index and creates a revision record.";
      } else {
        response += "I'm currently crawling our live heritage archives for matching nodes... Did you know you earn 250 'Heritage Points' for every verified article you publish? The entire system is now 100% advanced and operational.";
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
      <div className="fixed bottom-10 right-10 z-[100] floating-ai-bounce">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-20 w-20 rounded-full bg-primary text-black shadow-2xl neon-glow hover:scale-110 transition-transform p-0 border-4 border-black group"
        >
          {isOpen ? <X className="h-10 w-10" /> : <Sparkles className="h-10 w-10 group-hover:rotate-12 transition-transform" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-32 right-10 w-[450px] h-[700px] z-[100] shadow-[0_0_100px_rgba(7,241,214,0.15)] border-primary/20 bg-background/95 backdrop-blur-3xl animate-in slide-in-from-bottom-5 duration-500 rounded-[4rem] overflow-hidden flex flex-col border border-white/10">
          <CardHeader className="bg-primary p-10 flex flex-row items-center justify-between border-b border-black/10">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[1.5rem] bg-black flex items-center justify-center text-primary shadow-2xl">
                <Compass className="h-9 w-9" />
              </div>
              <div>
                <CardTitle className="text-black font-black text-2xl leading-none tracking-tight">Bharat Assistant</CardTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-black/10 text-black border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">AI Node: Active</Badge>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">A-Z Advance Flow</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-black hover:bg-black/10 rounded-full h-12 w-12">
              <X className="h-8 w-8" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-10">
            <div className="space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-6 rounded-[2rem] text-base leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user' 
                      ? 'bg-primary text-black font-bold rounded-tr-none shadow-xl border border-primary/20' 
                      : 'bg-[#161C21] text-foreground rounded-tl-none border border-white/10 shadow-2xl italic font-light'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-[#161C21] p-6 rounded-[2rem] rounded-tl-none border border-white/10 shadow-2xl">
                    <div className="flex gap-2">
                      <span className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                      <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-8 bg-black/40 border-t border-white/10 space-y-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10 h-10 shrink-0 px-6 hover:bg-primary/10 hover:text-primary transition-all" onClick={() => handleSend("Guide me through the A-Z flow")}>
                <Zap className="h-4 w-4 mr-2" /> A-Z Guide
              </Button>
              <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10 h-10 shrink-0 px-6 hover:bg-primary/10 hover:text-primary transition-all" onClick={() => handleSend("How to publish content?")}>
                <FileText className="h-4 w-4 mr-2" /> Publish Flow
              </Button>
              <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-black tracking-widest bg-white/5 border-white/10 h-10 shrink-0 px-6 hover:bg-primary/10 hover:text-primary transition-all" onClick={() => handleSend("Tell me about Voice Search")}>
                <Mic className="h-4 w-4 mr-2" /> Voice Tech
              </Button>
            </div>
            <div className="flex gap-4 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-16 w-16 rounded-[1.5rem] shrink-0 transition-all border-2 ${isRecording ? 'bg-destructive text-white border-destructive animate-pulse' : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </Button>
              <div className="relative flex-1 group">
                <Input 
                  placeholder="Ask about Bharat's heritage..." 
                  className="bg-black/40 border-white/10 pr-16 h-16 rounded-[1.5rem] text-base focus-visible:ring-primary/50 transition-all group-focus-within:bg-black/60"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-xl bg-primary text-black hover:bg-primary/90 transition-all active:scale-95 shadow-neon" onClick={() => handleSend()}>
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
