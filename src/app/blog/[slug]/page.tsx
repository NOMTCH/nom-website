import { getBlogPostBySlug, getBlogPosts } from '@/lib/data/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, WhatsappLogo, TwitterLogo, FacebookLogo } from '@phosphor-icons/react/dist/ssr';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { AudioPlayer } from '@/components/blog/AudioPlayer';
import { NeoAdSlot } from '@/components/blog/NeoAdSlot';
import { InlineTextTool } from '@/components/blog/InlineTool';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | NOMSTD Blog`,
    description: post.content.substring(0, 160).replace(/[#*]/g, ''),
    openGraph: {
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  
  if (!post || !post.is_published) {
    notFound();
  }

  const headersList = await headers();
  const domain = headersList.get('host') || 'nomstd.com';
  const protocol = headersList.get('x-forwarded-proto') || (domain.includes('localhost') ? 'http' : 'https');
  const shareUrl = `${protocol}://${domain}/blog/${post.slug}`;

  // Fetch other posts for the bottom section
  const allPosts = await getBlogPosts(true);
  const otherPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main className="min-h-screen bg-background pt-[120px] pb-0 relative text-foreground selection:bg-accent selection:text-white">
        
        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          
          <Link href="/blog" className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] text-muted hover:text-accent transition-colors mb-12 bg-surface px-5 py-2.5 rounded-full border border-border/80 shadow-md">
            <ArrowLeft weight="bold" size={16} /> Kembali ke Blog
          </Link>

          {/* Header */}
          <header className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-accent/10 border border-accent/20 text-accent px-3.5 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm">
                {post.category}
              </span>
              <time className="font-mono text-xs font-bold uppercase tracking-widest text-muted">
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.15] text-foreground text-balance mb-12">
              {post.title}
            </h1>

            {post.cover_image && (
              <div className="w-full aspect-[21/9] md:aspect-video border border-border/80 rounded-[2.5rem] shadow-2xl bg-surface overflow-hidden relative">
                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
          </header>

          <AudioPlayer content={post.content} title={post.title} />
          <NeoAdSlot format="horizontal" />

          {/* Prose Content */}
          <article className="prose prose-invert md:prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground prose-a:text-accent hover:prose-a:text-accent/80 prose-a:font-bold prose-img:border prose-img:border-border prose-img:shadow-xl prose-img:rounded-3xl max-w-none prose-p:font-sans prose-p:text-muted prose-p:leading-[1.8] prose-p:font-medium prose-strong:text-foreground prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-surface prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:font-bold prose-blockquote:text-foreground prose-blockquote:rounded-r-3xl mb-16">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
                p: ({ node, children, ...props }) => {
                  if (typeof children === 'string' && children.includes('[TOOL:text]')) {
                    return (
                      <>
                        <p {...props}>{children.replace('[TOOL:text]', '')}</p>
                        <InlineTextTool />
                      </>
                    );
                  }
                  if (Array.isArray(children)) {
                    const hasTool = children.some(child => typeof child === 'string' && child.includes('[TOOL:text]'));
                    if (hasTool) {
                      const filtered = children.map(child => 
                        typeof child === 'string' ? child.replace('[TOOL:text]', '') : child
                      );
                      return (
                        <>
                          <p {...props}>{filtered}</p>
                          <InlineTextTool />
                        </>
                      );
                    }
                  }
                  return <p {...props}>{children}</p>;
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          <NeoAdSlot format="horizontal" />

          {/* Share Section */}
          <div className="pt-12 border-t border-border/80 mb-24">
            <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-foreground mb-6 text-center sm:text-left">Share Article</h3>
            <div className="flex flex-row justify-center sm:justify-start gap-4">
              <a 
                href={`https://wa.me/?text=Check out this article: ${post.title} - ${shareUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-14 h-14 flex items-center justify-center bg-[#25D366] text-white rounded-2xl shadow-lg hover:scale-105 transition-all"
                aria-label="Share to WhatsApp"
              >
                <WhatsappLogo weight="fill" size={28} />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=Check out this article: ${post.title}&url=${shareUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-14 h-14 flex items-center justify-center bg-surface border border-border text-foreground hover:border-accent hover:text-accent rounded-2xl shadow-lg hover:scale-105 transition-all"
                aria-label="Share to X (Twitter)"
              >
                <TwitterLogo weight="fill" size={28} />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-14 h-14 flex items-center justify-center bg-[#1877F2] text-white rounded-2xl shadow-lg hover:scale-105 transition-all"
                aria-label="Share to Facebook"
              >
                <FacebookLogo weight="fill" size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Other Articles Section */}
        {otherPosts.length > 0 && (
          <div className="py-24 border-t border-border bg-surface/50">
             <div className="container mx-auto px-6 max-w-7xl">
                <h3 className="font-display font-black text-4xl uppercase tracking-tighter text-foreground mb-12">Related Insights</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((other) => (
                    <Link 
                      href={`/blog/${other.slug}`} 
                      key={other.id} 
                      className="group flex flex-col bg-surface border border-border/80 hover:border-accent shadow-lg rounded-[2.5rem] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-[16/10] w-full border-b border-border/50 relative overflow-hidden bg-background">
                        {other.cover_image ? (
                          <img src={other.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={other.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display font-black text-muted/30 text-2xl">NOMSTD</div>
                        )}
                        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-border px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest text-accent shadow-sm">
                          {other.category}
                        </div>
                      </div>
                      
                      <div className="p-6 md:p-8 flex flex-col flex-1 relative">
                        <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent mb-3">
                          {new Date(other.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        
                        <h2 className="text-xl font-display font-black tracking-tight leading-snug text-foreground text-balance group-hover:text-accent transition-colors mb-6">
                          {other.title}
                        </h2>
                        
                        <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">Read Article</span>
                          <ArrowRight weight="bold" className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
             </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
