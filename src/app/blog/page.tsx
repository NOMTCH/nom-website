import { getBlogPosts } from '@/lib/data/blog';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights & Stories | NOMSTD Blog',
  description: 'Catatan teknis, sudut pandang kreatif, dan insight berharga dari dapur NOMSTD Creative Agency. Pelajari UI/UX, Web Dev, dan Digital Marketing di sini.',
  keywords: ['blog nomstd', 'artikel ui ux', 'web development blog', 'tech insights indonesia', 'creative agency blog'],
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogListingPage() {
  const blogs = await getBlogPosts(true);

  return (
    <main className="min-h-screen bg-background pt-[120px] pb-32 relative text-foreground selection:bg-accent selection:text-white">
      <Navbar />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-accent font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 bg-accent/10 border border-accent/20 rounded-full inline-block mb-4">
            INSIGHTS &amp; STORIES
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-foreground uppercase mb-6">
            ENGINEERING &amp; <br />
            <span className="text-accent">DESIGN INSIGHTS.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted font-medium max-w-2xl leading-relaxed">
            Technical notes, design perspectives, and digital strategy directly from the NOMSTD engineering team.
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="py-20 border border-border text-center bg-surface shadow-xl rounded-3xl max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-black tracking-tight text-foreground mb-4">No Articles Found</h2>
            <p className="text-muted font-medium text-sm">New articles are currently being prepared by the NOMSTD team.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            
            {/* FEATURED POST (Latest) */}
            {blogs[0] && (
              <Link 
                href={`/blog/${blogs[0].slug}`} 
                className="group flex flex-col md:flex-row w-full bg-surface border border-border/80 shadow-2xl hover:shadow-accent/5 rounded-[2.5rem] hover:border-accent hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="w-full md:w-1/2 aspect-[16/10] md:aspect-auto relative overflow-hidden bg-background">
                  {blogs[0].cover_image ? (
                    <img src={blogs[0].cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={blogs[0].title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display font-black text-muted/30 text-4xl">NOMSTD</div>
                  )}
                  <div className="absolute top-6 left-6 bg-background/80 backdrop-blur-md border border-border px-3.5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest text-accent shadow-lg">
                    {blogs[0].category}
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-12 xl:p-16 flex flex-col justify-center">
                  <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent mb-4">
                    {new Date(blogs[0].created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-snug text-foreground mb-6 group-hover:text-accent transition-colors text-balance">
                    {blogs[0].title}
                  </h2>
                  <p className="text-muted font-medium leading-relaxed mb-8 line-clamp-3">
                    {blogs[0].content.substring(0, 200).replace(/[#*`>]/g, '')}...
                  </p>
                  <div className="mt-auto inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-foreground group-hover:text-accent transition-colors">
                    Read Full Article <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform text-accent" />
                  </div>
                </div>
              </Link>
            )}

            {/* GRID POSTS */}
            {blogs.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(1).map((post) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id} 
                    className="group flex flex-col bg-surface border border-border/80 shadow-lg hover:shadow-2xl rounded-[2.5rem] hover:border-accent hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[16/10] w-full relative overflow-hidden bg-background border-b border-border/50">
                      {post.cover_image ? (
                        <img src={post.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-display font-black text-muted/30 text-3xl">NOMSTD</div>
                      )}
                      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest text-accent shadow-md">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent mb-3">
                        {new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      
                      <h2 className="text-xl md:text-2xl font-display font-black tracking-tight leading-snug text-foreground text-balance group-hover:text-accent transition-colors mb-6">
                        {post.title}
                      </h2>
                      
                      <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between">
                        <span className="font-bold text-[10px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">Read Article</span>
                        <ArrowRight weight="bold" className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
