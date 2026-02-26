
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Sparkles, BookOpen, Users, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ARTICLES, STATES } from '@/lib/mock-data'

export default function Home() {
  const featuredArticles = ARTICLES.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden border border-primary/20 bg-black neon-glow group">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/india-hero-dark/1200/600"
            alt="Beautiful landscape of India"
            fill
            className="object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
            data-ai-hint="India landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 px-8 py-20 md:py-32 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
            <Sparkles className="h-3 w-3" />
            India's Digital Encyclopedia
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold leading-[1.1] text-white drop-shadow-2xl">
            Discover the Heritage of <span className="text-primary italic">Bharat Darshan</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
            Explore states, districts, and ancient monuments through a collaborative open-source platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
            <Link href="/browse">
              <Button size="lg" className="bg-primary text-black hover:bg-primary/90 px-10 py-7 text-lg font-bold rounded-full neon-glow transition-all hover:scale-105">
                Explore States
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10 text-white px-10 py-7 text-lg font-medium backdrop-blur-md rounded-full transition-all">
                Join Contributors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="space-y-10">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-4xl font-headline font-bold text-white">Featured Heritage</h2>
            <p className="text-muted-foreground text-lg italic">Handpicked historical articles for you.</p>
          </div>
          <Link href="/browse">
            <Button variant="link" className="text-primary text-lg group">
              View all articles
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group">
              <Card className="h-full border border-white/10 glass-card hover:border-primary/40 transition-all duration-500 overflow-hidden rounded-3xl group">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-black font-bold px-3 py-1">{article.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-2xl font-headline font-bold group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground text-base line-clamp-3 leading-relaxed font-light">
                    {article.content}
                  </p>
                  <div className="pt-4 flex flex-wrap gap-2 border-t border-white/5">
                    {article.tags.slice(0, 2).map(tag => (
                      <Badge variant="outline" key={tag} className="text-[10px] border-white/10 text-white/60 font-medium uppercase tracking-widest">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* States Quick Links */}
      <section className="bg-secondary rounded-[3rem] p-10 md:p-16 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-headline font-bold text-white">Browse by State</h2>
            <p className="text-muted-foreground text-lg italic">Directly access information for any Indian State</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {STATES.slice(0, 17).map(state => (
              <Link 
                key={state.code} 
                href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-4 bg-white/5 hover:bg-primary hover:text-black rounded-2xl border border-white/5 text-sm font-bold transition-all text-center flex items-center justify-center min-h-[60px]"
              >
                {state.name}
              </Link>
            ))}
            <Link 
              href="/browse"
              className="p-4 bg-primary text-black rounded-2xl border border-primary/20 text-sm font-black transition-all text-center flex items-center justify-center neon-glow hover:scale-105"
            >
              Browse All
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: Sparkles, title: "AI-Powered", desc: "Translate, summarize, and search using advanced AI tools powered by Gemini." },
          { icon: Users, title: "Collaborative", desc: "Join thousands of editors contributing to the knowledge of Bharat." },
          { icon: Globe, title: "22+ Languages", desc: "Read heritage information in your preferred Indian language including Hindi, Marathi, and Tamil." }
        ].map((feat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-8 space-y-5 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary neon-glow">
              <feat.icon className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-white">{feat.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed font-light">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
