
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Sparkles, BookOpen, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ARTICLES, STATES } from '@/lib/mock-data'

export default function Home() {
  const featuredArticles = ARTICLES.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-primary/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/india-hero/1200/600"
            alt="Beautiful landscape of India"
            fill
            className="object-cover brightness-[0.4]"
            data-ai-hint="India landscape"
          />
        </div>
        <div className="relative z-10 px-6 py-16 md:py-24 text-center text-white max-w-3xl mx-auto space-y-6">
          <Badge className="bg-primary/90 text-white border-none px-4 py-1 text-sm font-medium tracking-wide uppercase">
            India's Digital Encyclopedia
          </Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">
            Discover the Heritage of Bharat Darshan
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
            Explore states, districts, and ancient monuments through a collaborative open-source platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/browse">
              <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg font-medium shadow-lg rounded-full">
                Explore States
              </Button>
            </Link>
            <Link href="/contribute">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/40 hover:bg-white/20 text-white px-8 py-6 text-lg font-medium backdrop-blur-sm rounded-full">
                Join Contributors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-primary/10 pb-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">Featured Heritage</h2>
            <p className="text-muted-foreground">Handpicked historical articles for you.</p>
          </div>
          <Link href="/browse">
            <Button variant="ghost" className="text-primary hover:text-primary/80">View all articles</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group">
              <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 overflow-hidden group">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/80 backdrop-blur-sm border-none">{article.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-headline font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.slice(0, 2).map(tag => (
                      <Badge variant="secondary" key={tag} className="text-[10px] font-normal uppercase tracking-wider">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* States Quick Links */}
      <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold text-primary">Browse by State</h2>
            <p className="text-muted-foreground">Directly access information for any Indian State</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {STATES.slice(0, 15).map(state => (
              <Link 
                key={state.code} 
                href={`/article/${state.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-3 bg-background hover:bg-primary hover:text-white rounded-xl border border-primary/10 text-sm font-medium transition-all text-center"
              >
                {state.name}
              </Link>
            ))}
            <Link 
              href="/browse"
              className="p-3 bg-primary text-white rounded-xl border border-primary/10 text-sm font-bold transition-all text-center flex items-center justify-center"
            >
              Browse All
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Sparkles, title: "AI-Powered", desc: "Translate, summarize, and search using advanced AI tools." },
          { icon: Users, title: "Collaborative", desc: "Join thousands of editors contributing to the knowledge of Bharat." },
          { icon: Globe, title: "22+ Languages", desc: "Read heritage information in your preferred Indian language." }
        ].map((feat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <feat.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-headline font-bold">{feat.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
