import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { PortfolioGrid, GridItem } from '@/components/portfolio/PortfolioGrid';
import { getCategories } from '@/lib/data/portfolio';

export default async function PortfolioPage() {
  const categories = await getCategories();
  
  const items: GridItem[] = categories.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    coverImage: c.coverImage,
    href: `/portfolio/${c.id}`
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
