import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { PortfolioGrid, GridItem } from '@/components/portfolio/PortfolioGrid';
import { getCategory } from '@/lib/data/portfolio';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPricingPackages } from '@/lib/data/pricing';

export const dynamic = 'force-dynamic';

function getCategoryNameFromSlug(slug: string): string {
  switch (slug) {
    case 'graphic-design': return 'Graphic Design';
    case 'photography': return 'Photography';
    case 'videography': return 'Videography';
    case 'web-development': return 'Web Development';
    case 'it-solutions': return 'IT Solutions';
    default: return '';
  }
}

function matchCategory(packageCategory: string, slug: string): boolean {
  if (!packageCategory || !slug) return false;
  const pCat = packageCategory.toLowerCase().trim();
  const targetSlug = slug.toLowerCase().trim();

  const pCatSlug = pCat.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const targetSlugClean = targetSlug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (pCat === targetSlug || pCatSlug === targetSlugClean) return true;
  if (targetSlugClean.includes('web') && (pCat.includes('web') || pCat.includes('dev'))) return true;
  if (targetSlugClean.includes('graphic') && (pCat.includes('graphic') || pCat.includes('design') || pCat.includes('brand'))) return true;
  if (targetSlugClean.includes('photo') && (pCat.includes('photo') || pCat.includes('foto'))) return true;
  if (targetSlugClean.includes('video') && (pCat.includes('video') || pCat.includes('cinema'))) return true;
  if (targetSlugClean.includes('it') && (pCat.includes('it') || pCat.includes('hardware') || pCat.includes('laptop') || pCat.includes('pc'))) return true;

  return false;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = await getCategory(categoryId);
  if (!category) {
    return { title: 'Category Not Found | NOMSTD' };
  }

  return {
    title: `Portfolio ${category.title} | NOMSTD`,
    description: `Kumpulan hasil karya terbaik kami untuk kategori ${category.title}. ${category.description}`,
    keywords: [category.title.toLowerCase(), "portfolio kreatif", "karya nomstd", categoryId],
  };
}

import { fetchProjectsFromDatabase } from '@/lib/data/projects';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = await getCategory(categoryId);
  
  if (!category) {
    notFound();
  }

  // Fetch real projects from Supabase database (auto-seeded if DB is empty)
  const dbProjects = await fetchProjectsFromDatabase(categoryId);

  // Map DB projects to GridItem
  const items: GridItem[] = dbProjects.map((p) => {
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

  // Fetch and filter pricing packages from DB with flexible category matching
  const dbPackages = await getPricingPackages();
  const filteredPackages = dbPackages.filter(p => matchCategory(p.category, categoryId));
  const displayPackages = filteredPackages.length > 0 ? filteredPackages : dbPackages;

  return (
    <main className="min-h-screen bg-background pt-[80px]">
      <Navbar />
      <div className="container mx-auto px-6 md:px-12 pb-32">
          <Breadcrumbs />
          
          <header className="mb-16 mt-8">
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 text-foreground">{category.title}</h1>
            <p className="text-xl text-muted max-w-2xl">
              {category.description}
            </p>
          </header>

          <PortfolioGrid items={items} />

          {/* Service & Pricelist CTA Banner */}
          <section className="mt-28 pt-16 border-t border-border text-center">
            <div className="max-w-3xl mx-auto bg-surface border border-border/80 rounded-3xl p-10 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <span className="text-accent font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 bg-accent/10 rounded-full inline-block mb-3">
                PACKAGES &amp; SOLUTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-foreground mb-4">
                Elevate Your Brand Today
              </h2>
              <p className="text-muted text-base font-medium mb-8">
                Discover tailored packages, technical specifications, and project scopes designed for {category.title}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={`/services/${categoryId}`}
                  className="w-full sm:w-auto py-3.5 px-7 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all hover:scale-105"
                >
                  View Services &amp; Pricing
                </Link>
                <a
                  href={`https://wa.me/6282130704794?text=Hello%20NOMSTD,%20I'd%20like%20to%20consult%20about%20${encodeURIComponent(category.title)}%20services!%20%F0%9F%90%BE`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto py-3.5 px-7 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-wider rounded-2xl hover:border-accent hover:text-accent transition-all"
                >
                  Schedule Consultation
                </a>
              </div>
            </div>
          </section>
        </div>

        <Footer />
    </main>
  );
}
