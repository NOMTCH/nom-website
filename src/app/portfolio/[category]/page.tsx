import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/portfolio/Breadcrumbs';
import { PortfolioGrid, GridItem } from '@/components/portfolio/PortfolioGrid';
import { getCategory } from '@/lib/data/portfolio';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = await getCategory(categoryId);
  
  if (!category) {
    notFound();
  }

  // Fetch real projects from Supabase
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('category', categoryId)
    .order('created_at', { ascending: false });

  // Map to GridItem
  const items: GridItem[] = (projects || []).map((p: any) => {
    const coverMedia = p.media && p.media.length > 0 ? p.media[0] : null;
    return {
      id: p.id,
      title: p.title,
      description: p.description || '',
      coverImage: coverMedia ? coverMedia.url : '/assets/images/placeholder.jpg',
      mediaType: coverMedia ? coverMedia.type : 'image',
      mediaItems: p.media || [],
      href: p.video_url || '#' 
    };
  });

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
        </div>

        <Footer />
    </main>
  );
}
