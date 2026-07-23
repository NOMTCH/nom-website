import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { PortfolioGrid, GridItem } from '@/components/portfolio/PortfolioGrid';
import { getCategories } from '@/lib/data/portfolio';
import { fetchProjectsFromDatabase } from '@/lib/data/projects';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio Karya Kreatif & Solusi IT Cianjur | NOMSTD',
  description: 'Galeri portofolio karya terbaik NOMSTD Cianjur: Desain Grafis, Web Development, Studio Fotografi, Videografi Cinematic, dan Software/IT Solutions.',
  keywords: [
    'portfolio nomstd',
    'galeri karya cianjur',
    'jasa desain grafis cianjur',
    'hasil web development cianjur',
    'corporate photography cianjur',
    'cinematic video cianjur'
  ],
  alternates: {
    canonical: 'https://nomstd.my.id/portfolio',
  },
  openGraph: {
    title: 'Portfolio Karya Kreatif & Solusi IT Cianjur | NOMSTD',
    description: 'Galeri portofolio karya terbaik NOMSTD Cianjur di bidang Desain Grafis, Web Development, Fotografi, dan IT.',
    url: 'https://nomstd.my.id/portfolio',
  }
};

export default async function PortfolioPage() {
  const categories = await getCategories();
  
  const categoryCards = categories.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    coverImage: c.coverImage,
    href: `/portfolio/${c.id}`
  }));

  // Fetch real projects from Supabase database
  const dbProjects = await fetchProjectsFromDatabase();

  const recentProjectItems: GridItem[] = dbProjects.map((p) => {
    const coverMedia = p.media && p.media.length > 0 ? p.media[0] : null;
    return {
      id: p.id,
      title: p.title,
      description: p.description || '',
      coverImage: coverMedia ? coverMedia.url : '/assets/images/placeholder.jpg',
      mediaType: coverMedia ? (coverMedia.type as 'image' | 'video') : 'image',
      mediaItems: p.media || [],
      href: p.video_url || '#'
    };
  });

  return (
    <main className="min-h-screen bg-background pt-[120px] pb-32 relative text-foreground selection:bg-accent selection:text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <Breadcrumbs />
        
        {/* Hero Header */}
        <header className="mb-12 mt-6">
          <span className="text-accent font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 bg-accent/10 border border-accent/20 rounded-full inline-block mb-3">
            PORTFOLIO &amp; SHOWCASE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 text-foreground uppercase tracking-tight leading-none">
            CRAFTED WITH PRECISION. <br />
            <span className="text-accent">BUILT FOR IMPACT.</span>
          </h1>
          <p className="text-xs md:text-sm text-muted max-w-2xl font-medium leading-relaxed">
            A curated portfolio of strategic digital solutions engineered by NOMSTD. Delivering high-performance web applications, brand identities, studio photography, and commercial videography.
          </p>
        </header>

        {/* Categories Grid Section */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-accent font-bold text-xs uppercase tracking-widest px-3 py-1 bg-accent/10 rounded-full inline-block mb-2">EXPLORE CATEGORIES</span>
              <h2 className="text-2xl md:text-3xl font-display font-black uppercase text-foreground">Service Categories</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categoryCards.map((cat) => (
              <Link 
                key={cat.id}
                href={cat.href}
                className="group relative flex flex-col bg-surface border border-border/80 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-accent hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-background">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    style={{ backgroundImage: `url('${cat.coverImage}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                  
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-surface/80 backdrop-blur-md border border-border/80 flex items-center justify-center text-foreground group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 shadow-md">
                    <ArrowUpRight size={18} weight="bold" />
                  </div>
                </div>

                <div className="p-6 md:p-7 flex flex-col flex-1 relative z-10">
                  <h3 className="text-xl font-display font-black text-foreground group-hover:text-accent transition-colors duration-300 uppercase tracking-tight mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-medium text-muted line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Real-time Admin Projects Showcase */}
        {recentProjectItems.length > 0 && (
          <section className="border-t border-border/80 pt-14 md:pt-16">
            <div className="mb-8">
              <span className="text-accent font-bold tracking-widest text-xs uppercase px-3 py-1 bg-accent/10 border border-accent/20 rounded-full inline-block mb-2">
                LIVE PROJECT SHOWCASE
              </span>
              <h2 className="text-2xl md:text-4xl font-display font-black uppercase text-foreground">Recent Featured Work</h2>
              <p className="text-muted font-medium mt-2 text-base">Latest client projects engineered and designed directly by the NOMSTD team.</p>
            </div>
            <PortfolioGrid items={recentProjectItems} disableModal={false} />
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
