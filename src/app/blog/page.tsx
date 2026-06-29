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
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[120px] pb-32 relative selection:bg-accent selection:text-white">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-gray-900 leading-none mb-6">
              Insights & Stories
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
              Catatan teknis, sudut pandang kreatif, dan insight dari dapur NOMSTD.
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="py-20 border border-border text-center bg-white shadow-sm rounded-3xl max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-black tracking-tight text-gray-900 mb-4">Belum Ada Artikel</h2>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              
              {/* FEATURED POST (Latest) */}
              {blogs[0] && (
                <Link 
                  href={`/blog/${blogs[0].slug}`} 
                  className="group flex flex-col md:flex-row w-full bg-white border border-border shadow-sm hover:shadow-lg rounded-[2.5rem] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto relative overflow-hidden bg-gray-50">
                    {blogs[0].cover_image ? (
                      <img src={blogs[0].cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={blogs[0].title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display font-black text-gray-300 text-3xl">NOMSTD</div>
                    )}
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-900 shadow-sm">
                      {blogs[0].category}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-8 md:p-12 xl:p-16 flex flex-col justify-center">
                    <div className="font-mono text-xs font-bold uppercase tracking-widest text-accent mb-4">
                      {new Date(blogs[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-snug text-gray-900 mb-6 group-hover:text-accent transition-colors text-balance">
                      {blogs[0].title}
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                      {blogs[0].content.substring(0, 200).replace(/[#*`>]/g, '')}...
                    </p>
                    <div className="mt-auto inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-gray-900 group-hover:text-accent transition-colors">
                      Baca Artikel <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
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
                      className="group flex flex-col bg-white border border-border shadow-sm hover:shadow-md rounded-[2.5rem] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-gray-50 border-b border-border">
                        {post.cover_image ? (
                          <img src={post.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display font-black text-gray-300 text-2xl">NOMSTD</div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-900 shadow-sm">
                          {post.category}
                        </div>
                      </div>
                      
                      <div className="p-6 md:p-8 flex flex-col flex-1">
                        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
                          {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        
                        <h2 className="text-xl md:text-2xl font-display font-black tracking-tight leading-snug text-gray-900 text-balance group-hover:text-accent transition-colors mb-6">
                          {post.title}
                        </h2>
                        
                        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-accent transition-colors">Read</span>
                          <ArrowRight weight="bold" className="text-gray-400 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
