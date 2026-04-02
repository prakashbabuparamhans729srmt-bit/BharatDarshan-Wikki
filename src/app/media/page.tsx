
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Search, Filter, Image as ImageIcon, Camera, Play, Download, ExternalLink, Sparkles, MapPin, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy } from 'firebase/firestore'
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates'
import { useToast } from '@/hooks/use-toast'

export default function MediaGalleryPage() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isUploading, setIsUploading] = useState(false)

  // 1. Fetch real media assets from Firestore (owned by user)
  const userMediaQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'user_media_assets', user.uid), orderBy('uploadedAt', 'desc'));
  }, [db, user]);
  
  const { data: realMedia, isLoading } = useCollection(userMediaQuery);

  // Fallback/Demo assets
  const demoAssets = [
    { imageUrl: "https://images.unsplash.com/photo-1526711657229-e7e080ed7aa1", description: "Taj Mahal - Ivory White Marble", type: "image", location: "Agra, UP", uploadedAt: "2023-10-15" },
    { imageUrl: "https://images.unsplash.com/photo-1671512226229-e05294dd1970", description: "Varanasi Ghats at Sunset", type: "image", location: "Varanasi, UP", uploadedAt: "2023-10-12" },
    { imageUrl: "https://images.unsplash.com/photo-1624554305378-0f440dd3a8c1", description: "Kerala Backwaters Serenity", type: "video", location: "Alappuzha, KL", uploadedAt: "2023-10-10" },
  ]

  const mediaItems = [...(realMedia || []), ...demoAssets]

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || item.type === activeTab
    return matchesSearch && matchesTab
  })

  const handleUploadClick = () => {
    if (!user || user.isAnonymous) {
      toast({ title: "Login Required", description: "Guests cannot upload assets.", variant: "destructive" })
      return
    }
    
    setIsUploading(true)
    // Simulating a media asset creation in the user's collection
    const mediaRef = collection(db, 'user_media_assets', user.uid);
    addDocumentNonBlocking(mediaRef, {
      filename: `heritage-asset-${Date.now()}.jpg`,
      mimeType: "image/jpeg",
      url: `https://picsum.photos/seed/${Date.now()}/800/600`,
      altText: "New Heritage Asset",
      description: "Community contributed visual asset for Bharat Wiki.",
      uploadedByUserId: user.uid,
      uploadedAt: new Date().toISOString(),
      type: "image",
      location: "India (Verified Node)"
    });

    setTimeout(() => {
      setIsUploading(false)
      toast({ title: "Asset Uploaded", description: "Your image has been archived and indexed." })
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <ImageIcon className="h-10 w-10" />
            <h1 className="text-5xl font-headline font-black text-white">Media Archives</h1>
          </div>
          <p className="text-muted-foreground text-xl font-light italic">
            Visual record of Bharat's timeless heritage.
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-primary text-black font-black rounded-full h-12 px-8 neon-glow"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Camera className="mr-2 h-5 w-5" />}
            Upload Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[#161C21]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 space-y-8">
            <div className="space-y-4">
              <Label className="text-xs font-black text-primary/70 uppercase tracking-[0.3em]">Quick Filter</Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search assets..." 
                  className="pl-10 bg-black/20 border-white/10 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black text-primary/70 uppercase tracking-[0.3em]">Asset Type</Label>
              <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/10 h-12 p-1 rounded-xl">
                  <TabsTrigger value="all" className="text-[10px] font-black uppercase">All</TabsTrigger>
                  <TabsTrigger value="image" className="text-[10px] font-black uppercase">Images</TabsTrigger>
                  <TabsTrigger value="video" className="text-[10px] font-black uppercase">Videos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3 mb-3 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-black text-[10px] uppercase tracking-widest">AI Curation</span>
                </div>
                <p className="text-xs text-white/50 italic leading-relaxed">
                  Our AI is currently indexing 4,200+ heritage assets for high-fidelity retrieval.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">Decrypting Archives...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMedia.map((item, idx) => (
                <Card key={idx} className="bg-[#161C21]/40 border-white/5 hover:border-primary/40 transition-all duration-500 rounded-[2rem] overflow-hidden group shadow-xl">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <Image 
                        src={item.imageUrl || item.url || `https://picsum.photos/seed/${idx}/800/600`}
                        alt={item.description}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-primary font-black text-[10px] uppercase px-3 py-1">
                          {item.type}
                        </Badge>
                      </div>
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center text-primary shadow-neon group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 fill-current" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Button variant="outline" size="icon" className="rounded-xl bg-black/40 border-white/20 h-10 w-10 hover:text-primary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl bg-black/40 border-white/20 h-10 w-10 hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors truncate">{item.description}</h4>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-primary" />
                          {item.location}
                        </div>
                        <span>{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : 'Active Node'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
