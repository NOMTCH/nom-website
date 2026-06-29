import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { PortfolioGrid, GridItem } from '@/components/portfolio/PortfolioGrid';
import { getCategories } from '@/lib/data/portfolio';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio Karya Kreatif & Solusi IT | NOMSTD',
  description: 'Eksplorasi karya-karya terbaik kami di bidang desain grafis, fotografi, videografi, website development, dan solusi IT. Bukti nyata dari inovasi kami.',
  keywords: ['portfolio nomstd', 'galeri karya', 'jasa desain grafis', 'hasil web development', 'corporate photography', 'cinematic video'],
};

export default async function PortfolioPage() {
  const categories = await getCategories();
  
  const iconMap: Record<string, string> = {
    'graphic-design': '/assets/icons/Portfolio Icon/design.svg',
    'photography': '/assets/icons/Portfolio Icon/camera.svg',
    'videography': '/assets/icons/Portfolio Icon/video.svg',
    'web-development': '/assets/icons/Portfolio Icon/web.svg',
    'it-solutions': '/assets/icons/Portfolio Icon/laptop.svg'
  };

  const items: GridItem[] = categories.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    coverImage: c.coverImage,
    href: `/portfolio/${c.id}`,
    icon: iconMap[c.id] || undefined
  }));

  return (
    <main className="min-h-screen bg-background pt-[80px]">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pb-32">
        <Breadcrumbs />
        
        <header className="mb-16 mt-8">
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6">Our Work</h1>
          <p className="text-xl text-muted max-w-2xl">
            Explore our creative portfolio categorized by our core services. From branding to visual storytelling.
          </p>
        </header>

        <PortfolioGrid items={items} disableModal={true} />
      </div>

      <Footer />
    </main>
  );
}
