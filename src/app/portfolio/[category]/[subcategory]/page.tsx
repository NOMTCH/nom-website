import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { PortfolioGrid, GridItem } from '@/components/portfolio/PortfolioGrid';
import { getSubcategory } from '@/lib/data/portfolio';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string, subcategory: string }> }): Promise<Metadata> {
  const { category, subcategory } = await params;
  const subcat = await getSubcategory(category, subcategory);
  if (!subcat) {
    return { title: 'Subcategory Not Found | NOMSTD' };
  }

  return {
    title: `${subcat.title} - Portfolio | NOMSTD`,
    description: `Koleksi galeri karya terbaik untuk subkategori ${subcat.title}. ${subcat.description}`,
    keywords: [subcat.title.toLowerCase(), "karya kreatif", "nomstd agency", subcategory],
  };
}

export default async function SubcategoryPage({ params }: { params: Promise<{ category: string, subcategory: string }> }) {
  const { category, subcategory } = await params;
  const subcat = await getSubcategory(category, subcategory);
  
  if (!subcat) {
    notFound();
  }

  const items: GridItem[] = subcat.albums.map(a => ({
    id: a.id,
    title: a.title,
    description: a.date,
    coverImage: a.coverImage,
    href: `/portfolio/${category}/${subcategory}/${a.id}`
  }));

  return (
    <main className="min-h-screen bg-background pt-[80px]">
      <Navbar />
        <div className="container mx-auto px-6 md:px-12 pb-32">
          <Breadcrumbs />
          
          <header className="mb-16 mt-8">
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-foreground">{subcat.title}</h1>
            <p className="text-xl text-muted max-w-2xl">
              {subcat.description}
            </p>
          </header>

          <PortfolioGrid items={items} />
        </div>
        <Footer />
    </main>
  );
}
