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

  // Fetch and filter pricing packages from DB
  const dbPackages = await getPricingPackages();
  const categoryName = getCategoryNameFromSlug(categoryId);
  const filteredPackages = dbPackages.filter(p => p.category === categoryName);

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

          {/* Pricing Highlight Section */}
          {filteredPackages.length > 0 && (
            <section className="mt-32 pt-20 border-t border-border">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <span className="text-accent font-bold text-sm uppercase tracking-wider inline-block px-4 py-1.5 bg-accent/10 rounded-full mb-4">
                  Pricelist Highlight
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mb-4">
                  Paket & Layanan Kami
                </h2>
                <p className="text-lg text-muted font-medium">
                  Harga transparan untuk mewujudkan ide brutal lu. Detail fitur lengkap tersedia di halaman layanan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`
                      relative p-8 md:p-10 flex flex-col h-full rounded-[2.5rem] transition-all duration-300
                      ${pkg.is_popular
                        ? 'bg-foreground text-white border-none shadow-[0_20px_40px_rgba(0,0,0,0.15)] scale-100 lg:scale-105 z-10'
                        : 'bg-white text-foreground border border-border shadow-sm hover:shadow-xl hover:-translate-y-2'
                      }
                    `}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded-full shadow-lg flex items-center gap-2 z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,29.53,0L165.7,81.24l59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg> 
                        Paling Laris
                      </div>
                    )}

                    <div className="mb-8 text-center">
                      <h3 className={`text-2xl font-bold tracking-tight mb-3 ${pkg.is_popular ? 'text-white' : 'text-foreground'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-sm h-12 leading-relaxed ${pkg.is_popular ? 'text-gray-300' : 'text-muted'}`}>
                        {pkg.description}
                      </p>
                    </div>

                    <div className="mb-10 text-center">
                      <div className="flex items-start justify-center gap-1 mb-2">
                        <span className="text-xl md:text-2xl font-bold mt-2">Rp</span>
                        <span className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                          {!isNaN(Number(pkg.price)) && pkg.price.trim() !== ''
                            ? new Intl.NumberFormat('id-ID').format(Number(pkg.price))
                            : pkg.price.replace(/Rp\.?\s?/i, '')}
                        </span>
                      </div>
                    </div>

                    {/* Features Snippet (Highlight only 2) */}
                    <div className="flex-1 mb-10">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${pkg.is_popular ? 'text-white' : 'text-muted'}`}>
                        Highlight Fitur:
                      </p>
                      <ul className="space-y-4">
                        {pkg.features.slice(0, 2).map((feat, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="mt-0.5 shrink-0 text-accent">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 256 256" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"><polyline points="216 72.005 104 184 48 128.005"></polyline></svg>
                            </div>
                            <span className={`font-semibold text-sm leading-relaxed line-clamp-1 ${pkg.is_popular ? 'text-gray-200' : 'text-foreground'}`}>
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href={`/services/${categoryId}`}
                        className={`
                          block w-full py-4 px-6 text-center font-bold text-sm uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2
                          ${pkg.is_popular
                            ? 'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-lg hover:-translate-y-1'
                            : 'bg-surface border border-border text-foreground hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-1 shadow-sm hover:shadow-md'
                          }
                        `}
                      >
                        Lihat Fitur Lengkap
                      </Link>
                      <a
                        href={`https://wa.me/6282130704794?text=Halo%20min,%20aku%20mau%20pesen%20paket%20${encodeURIComponent(pkg.name)}%20dong!%20%F0%9F%90%BE`}
                        target="_blank"
                        rel="noreferrer"
                        className={`
                          block w-full py-3 px-6 text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 border
                          ${pkg.is_popular
                            ? 'bg-transparent text-white/70 border-white/20 hover:text-white hover:bg-white/10'
                            : 'bg-transparent text-muted border-transparent hover:text-foreground hover:bg-gray-50'
                          }
                        `}
                      >
                        Pesan Cepat via WA
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <Footer />
    </main>
  );
}
