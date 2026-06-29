'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tag } from '@phosphor-icons/react';

const serviceLinks = {
  creative: [
    { name: 'Graphic Design', href: '/services/graphic-design', video: '/assets/videos/Graphic.mp4' },
    { name: 'Web Design & Dev', href: '/services/web-development', video: '/assets/videos/Web.mp4' },
    { name: 'Photography', href: '/services/photography', video: '/assets/videos/Photo.mp4' },
    { name: 'Videography', href: '/services/videography', video: '/assets/videos/Video.mp4' }
  ],
  it: [
    { name: 'Laptop Repair', href: '/services/it-solutions', video: '/assets/videos/Laptop.mp4' },
    { name: 'PC Build & Servicing', href: '/services/it-solutions', video: '/assets/videos/Laptop.mp4' }
  ]
};

export function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState('/assets/videos/Graphic.mp4');
  const [isScrolled, setIsScrolled] = useState(false);
  const [promo, setPromo] = useState<{ title: string; code: string | null } | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      const { data } = await supabase
        .from('promos')
        .select('title, code')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setPromo(data);
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const getPortfolioLinkFromVideo = (videoPath: string) => {
    if (videoPath.includes('Graphic')) return '/portfolio/graphic-design';
    if (videoPath.includes('Web')) return '/portfolio/web-development';
    if (videoPath.includes('Photo')) return '/portfolio/photography';
    if (videoPath.includes('Video')) return '/portfolio/videography';
    if (videoPath.includes('Laptop')) return '/portfolio/it-solutions';
    return '/portfolio';
  };

  return (
    <>
      {/* Promo Banner - Top edge if available */}
      {promo && !isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-accent text-white font-bold uppercase text-xs sm:text-sm py-2 px-4 overflow-hidden whitespace-nowrap flex items-center w-full">
          <div className="animate-[marquee_20s_linear_infinite] inline-block w-full text-center">
            <span className="inline-flex items-center gap-2">
              <Tag weight="fill" size={16} /> 
              {promo.title} 
              {promo.code && <span className="bg-white/20 px-2 py-0.5 rounded-md ml-2">CODE: {promo.code}</span>}
            </span>
          </div>
        </div>
      )}

      {/* Floating Pill Navbar */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        onMouseLeave={() => setIsServicesOpen(false)}
        className={`fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center transition-all duration-500 w-[calc(100%-2rem)] max-w-5xl ${
          isScrolled || promo ? 'top-4' : 'top-6'
        } ${
          isMobileMenuOpen 
            ? 'bg-transparent shadow-none' 
            : 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full'
        }`}
      >
        <div className="w-full h-[70px] flex items-center justify-between px-6 md:px-8 relative z-20">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 group hover:scale-105 transition-transform">
            {/* Always use dark logo for light theme */}
            <img src="/assets/logo/logo2.svg" alt="NOMSTD Logo" className="h-8 md:h-10 w-auto transition-opacity duration-300" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <Link href="/" onMouseEnter={() => setIsServicesOpen(false)} className="text-sm font-semibold text-muted hover:text-foreground transition-colors py-2">
              Home
            </Link>
            <Link href="/about" onMouseEnter={() => setIsServicesOpen(false)} className="text-sm font-semibold text-muted hover:text-foreground transition-colors py-2">
              About Us
            </Link>
            <Link href="/blog" onMouseEnter={() => setIsServicesOpen(false)} className="text-sm font-semibold text-muted hover:text-foreground transition-colors py-2">
              Blog
            </Link>
            
            <div 
              className="h-full flex items-center cursor-pointer group relative"
              onMouseEnter={() => setIsServicesOpen(true)}
            >
              <span className={`text-sm font-semibold transition-colors flex items-center gap-1 py-2 ${isServicesOpen ? 'text-accent-secondary' : 'text-muted hover:text-foreground'}`}>
                Services
                <motion.svg animate={{ rotate: isServicesOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </motion.svg>
              </span>
            </div>

            <Link href="/#tools" onMouseEnter={() => setIsServicesOpen(false)} className="text-sm font-semibold text-muted hover:text-foreground transition-colors flex items-center gap-2 py-2">
              Free Tools 
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent">New</span>
            </Link>
          </nav>

          <Link href="/#contact" className="hidden md:flex items-center justify-center px-6 py-2.5 font-bold text-sm text-white bg-foreground hover:bg-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-full">
            Start a Project
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-surface shadow-sm border border-border z-50 relative"
          >
            <motion.div animate={isMobileMenuOpen ? "open" : "closed"} className="w-5 h-4 flex flex-col justify-between">
              <motion.span 
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }} 
                className="w-full h-[2px] bg-foreground rounded-full origin-center transition-all" 
              />
              <motion.span 
                variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} 
                className="w-full h-[2px] bg-foreground rounded-full transition-all" 
              />
              <motion.span 
                variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }} 
                className="w-full h-[2px] bg-foreground rounded-full origin-center transition-all" 
              />
            </motion.div>
          </button>
        </div>

        {/* Desktop Apple-style Popover Menu */}
        <AnimatePresence>
          {isServicesOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block fixed inset-0 top-[80px] z-0 h-screen"
                onMouseEnter={() => setIsServicesOpen(false)}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className="hidden md:block absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-[800px] bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_24px_48px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden z-10"
              >
                <div className="p-6 flex gap-8">
                  {/* Dynamic Video Preview */}
                  <Link 
                    href={getPortfolioLinkFromVideo(activeVideo)} 
                    onClick={() => setIsServicesOpen(false)}
                    className="w-[320px] flex-shrink-0 block group cursor-pointer"
                  >
                    <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-surface">
                      <video 
                        key={activeVideo} 
                        src={activeVideo}
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <span className="text-white font-bold drop-shadow-md text-sm">Explore Portfolio</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white group-hover:text-black text-white transition-all">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Menu Columns */}
                  <div className="flex-1 grid grid-cols-2 gap-8 pt-2">
                    {/* Creative Studio */}
                    <div>
                      <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Creative Studio</h4>
                      <div className="flex flex-col gap-1">
                        {serviceLinks.creative.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.href}
                            onMouseEnter={() => setActiveVideo(item.video)}
                            onClick={() => setIsServicesOpen(false)}
                            className="group flex items-center px-4 py-2.5 -mx-4 rounded-xl text-sm font-semibold text-foreground hover:bg-accent/5 hover:text-accent transition-all duration-300"
                          >
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* IT Solutions */}
                    <div>
                      <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">IT Solutions</h4>
                      <div className="flex flex-col gap-1">
                        {serviceLinks.it.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.href}
                            onMouseEnter={() => setActiveVideo(item.video)}
                            onClick={() => setIsServicesOpen(false)}
                            className="group flex items-center px-4 py-2.5 -mx-4 rounded-xl text-sm font-semibold text-foreground hover:bg-accent/5 hover:text-accent transition-all duration-300"
                          >
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="md:hidden fixed inset-0 h-[100svh] w-full bg-white/95 backdrop-blur-xl z-40 overflow-y-auto pt-28"
          >
            <div className="flex flex-col px-8 pb-12 gap-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-display font-black text-foreground">
                Home
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-display font-black text-foreground">
                About Us
              </Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-display font-black text-foreground">
                Blog
              </Link>
              
              {/* Services Accordion */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex items-center justify-between text-3xl font-display font-black text-foreground"
                >
                  Services
                  <motion.svg animate={{ rotate: isMobileServicesOpen ? 180 : 0 }} className="w-6 h-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M6 9l6 6 6-6"/>
                  </motion.svg>
                </button>
                
                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col pl-4 mt-6 border-l-2 border-border"
                    >
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Creative Studio</span>
                      {serviceLinks.creative.map(link => (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2.5 text-lg font-semibold text-foreground hover:text-accent"
                        >
                          {link.name}
                        </Link>
                      ))}
                      
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-6 mb-3">IT Solutions</span>
                      {serviceLinks.it.map(link => (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-2.5 text-lg font-semibold text-foreground hover:text-accent"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/#tools" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-display font-black text-foreground flex items-center gap-3">
                Free Tools
                <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">New</span>
              </Link>

              <div className="mt-8 pt-8">
                <Link 
                  href="/#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center px-6 py-4 bg-foreground text-white rounded-2xl font-bold text-lg hover:bg-accent transition-colors"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
