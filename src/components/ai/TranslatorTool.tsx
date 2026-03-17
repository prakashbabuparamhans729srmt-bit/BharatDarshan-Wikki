
"use client"

import React, { useState, useEffect } from 'react'
import { Languages, Loader2, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { aiTranslateArticleContent } from '@/ai/flows/ai-translate-article-content'
import { useToast } from '@/hooks/use-toast'
import { INDIAN_LANGUAGES } from '@/lib/languages'
import { useAppLanguage } from '@/context/LanguageContext'

export function TranslatorTool({ content }: { content: string }) {
  const { currentLanguage } = useAppLanguage()
  const [targetLang, setTargetLang] = useState(currentLanguage !== "English" ? currentLanguage : "Hindi")
  const [translation, setTranslation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Update selection if global language changes
  useEffect(() => {
    if (currentLanguage !== "English") {
      setTargetLang(currentLanguage);
    }
  }, [currentLanguage]);

  const handleTranslate = async () => {
    setLoading(true)
    try {
      const results = await aiTranslateArticleContent({
        content,
        targetLanguages: [targetLang]
      })
      setTranslation(results[targetLang])
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "There was an error translating the content.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (translation) {
      navigator.clipboard.writeText(translation)
      toast({ title: "Copied to clipboard" })
    }
  }

  return (
    <Card className="border-primary/10 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Translate Article
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_LANGUAGES.filter(l => l.name !== "English").map(lang => (
                <SelectItem key={lang.name} value={lang.name}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleTranslate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Translate"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {translation ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="p-4 bg-background rounded-lg border text-sm leading-relaxed whitespace-pre-wrap font-body">
              {translation}
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              Copy Translation
            </Button>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
            Choose a language and click Translate to see the version.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
