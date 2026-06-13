'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tag } from '@phosphor-icons/react';

const serviceLinks = {
  creative: [
    { name: 'Graphic Design', href: '/portfolio/graphic-design', video: '/assets/videos/Graphic.mp4' },
    { name: 'Web Design & Dev', href: '/portfolio/web-development', video: '/assets/videos/Web.mp4' },
    { name: 'Photography', href: '/portfolio/photography', video: '/assets/videos/Photo.mp4' },
    { name: 'Videography', href: '/portfolio/videography', video: '/assets/videos/Video.mp4' }
  ],
  it: [
    { name: 'Laptop Repair', href: '/portfolio/it-solutions', video: '/assets/videos/Laptop.mp4' },
    { name: 'PC Build & Servicing', href: '/portfolio/it-solutions', video: '/assets/videos/Laptop.mp4' }
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

  // Styles logic
  let headerClasses = "fixed top-0 left-0 right-0 z-50 flex flex-col items-center transition-all duration-300 ";
  if (isServicesOpen || isMobileMenuOpen) {
    // FUN Orange background blending with the menu
    headerClasses += "bg-accent";
  } else if (isScrolled) {
    // Orange background when scrolled
    headerClasses += "bg-accent border-b-4 border-border shadow-[0_4px_0_0_#0F0F0F]";
  } else {
    headerClasses += "bg-transparent border-b-4 border-transparent " + (promo ? "" : "pt-2");
  }

  const navTextClass = isScrolled && !isServicesOpen ? "text-black/70 hover:text-black" : (isServicesOpen ? "text-black/70 hover:text-black" : "text-muted hover:text-accent-secondary");
  const activeNavTextClass = isScrolled && !isServicesOpen ? "text-black" : (isServicesOpen ? "text-black font-black" : "text-foreground hover:text-accent");
  
  // Use logo2.svg when the navbar background turns orange (scrolled or menu open)
  const logoSrc = (isScrolled || isServicesOpen || isMobileMenuOpen) ? "/assets/logo/logo2.svg" : "/assets/logo/logo.svg";

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      onMouseLeave={() => setIsServicesOpen(false)}
      className={headerClasses}
    >
      {/* Promo Banner */}
      {promo && !isScrolled && (
        <div className="bg-accent text-black font-black uppercase text-xs sm:text-sm py-2 px-4 border-b-4 border-foreground overflow-hidden whitespace-nowrap flex items-center w-full">
          <div className="animate-[marquee_20s_linear_infinite] inline-block w-full text-center">
            <span className="inline-flex items-center gap-2">
              <Tag weight="fill" size={16} /> 
              {promo.title} 
              {promo.code && <span className="bg-white px-2 py-0.5 border-2 border-foreground ml-2 shadow-[2px_2px_0_0_#0F0F0F]">CODE: {promo.code}</span>}
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto h-[80px] flex items-center justify-between px-6 relative z-20">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 group hover:scale-105 transition-transform">
          <img src={logoSrc} alt="NOMSTD Logo" className="h-10 md:h-12 w-auto transition-opacity duration-300" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 h-full">
          <Link href="/" onMouseEnter={() => setIsServicesOpen(false)} className={`relative group text-sm uppercase tracking-wider font-bold transition-colors py-2 ${navTextClass}`}>
            Home
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-current group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/about" onMouseEnter={() => setIsServicesOpen(false)} className={`relative group text-sm uppercase tracking-wider font-bold transition-colors py-2 ${navTextClass}`}>
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-current group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          <div 
            className="h-full flex items-center cursor-pointer group relative"
            onMouseEnter={() => setIsServicesOpen(true)}
          >
            <span className={`text-sm uppercase tracking-wider font-bold transition-colors flex items-center gap-1 py-2 ${isServicesOpen ? 'text-accent-secondary' : activeNavTextClass}`}>
              Services
              <motion.svg animate={{ rotate: isServicesOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </motion.svg>
              <span className={`absolute bottom-0 left-0 h-1 bg-current transition-all duration-300 ${isServicesOpen ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </span>
          </div>

          <Link href="#tools" onMouseEnter={() => setIsServicesOpen(false)} className={`relative group text-sm uppercase tracking-wider font-bold transition-colors flex items-center gap-2 py-2 ${navTextClass}`}>
            Free Tools 
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${isServicesOpen || isScrolled ? 'bg-black text-white' : 'bg-accent text-white'}`}>New</span>
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-current group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        <Link href="#contact" className={`hidden md:block px-6 py-2.5 font-bold text-sm neo-brutalist transition-colors ${isScrolled || isServicesOpen ? 'bg-surface text-foreground hover:bg-foreground hover:text-white' : 'bg-accent text-white hover:bg-surface hover:text-foreground'}`}>
          Start a Project
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-surface neo-brutalist z-50 relative"
        >
          <motion.div animate={isMobileMenuOpen ? "open" : "closed"} className="w-6 h-5 flex flex-col justify-between">
            <motion.span 
              variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 8 } }} 
              className="w-full h-[3px] bg-foreground rounded-full origin-center transition-all" 
            />
            <motion.span 
              variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} 
              className="w-full h-[3px] bg-foreground rounded-full transition-all" 
            />
            <motion.span 
              variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -8 } }} 
              className="w-full h-[3px] bg-foreground rounded-full origin-center transition-all" 
            />
          </motion.div>
        </button>
      </div>

      {/* Desktop Apple-style Full Width Dropdown Panel */}
      <AnimatePresence>
        {isServicesOpen && (
          <>
            {/* Backdrop overlay for the rest of the page */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden md:block fixed inset-0 top-[80px] bg-black/40 backdrop-blur-sm z-0 h-screen"
              onMouseEnter={() => setIsServicesOpen(false)}
            />
            
            <motion.div 
              initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              transition={{ type: "spring", bounce: 0, duration: 0.6 }}
              className="hidden md:block absolute top-[80px] left-0 w-full bg-accent border-b-4 border-foreground shadow-[0_12px_0_0_rgba(15,15,15,1)] overflow-hidden z-10"
            >
              <div className="container mx-auto max-w-6xl px-8 py-12 flex gap-16">
                
                {/* Dynamic Video Preview */}
                <div className="w-[400px] flex-shrink-0">
                  <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-white border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] group">
                    <video 
                      key={activeVideo} /* Re-render on change to trigger autoplay */
                      src={activeVideo}
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <span className="text-white font-black drop-shadow-md text-xl">Explore Portfolio</span>
                      <div className="w-10 h-10 rounded-xl bg-accent border-2 border-foreground shadow-[2px_2px_0_0_#0F0F0F] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                        <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Columns */}
                <div className="flex-1 grid grid-cols-2 gap-12 pt-4 pl-8 border-l-4 border-foreground border-dotted">
                  {/* Creative Studio */}
                  <div>
                    <h4 className="text-xs font-black text-black/50 uppercase tracking-widest mb-4">Creative Studio</h4>
                    <div className="flex flex-col gap-2">
                      {serviceLinks.creative.map((item) => (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          onMouseEnter={() => setActiveVideo(item.video)}
                          onClick={() => setIsServicesOpen(false)}
                          className="group flex items-center px-4 py-3 -mx-4 rounded-xl text-base font-bold text-foreground border-2 border-transparent hover:border-foreground hover:bg-white hover:shadow-[4px_4px_0_0_#0F0F0F] hover:-translate-y-1 transition-all duration-300"
                        >
                          <span className="transform transition-transform duration-300">{item.name}</span>
                          <svg className="w-5 h-5 ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12h16m-7-7 7 7-7 7"/>
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* IT Solutions */}
                  <div>
                    <h4 className="text-xs font-black text-black/50 uppercase tracking-widest mb-4">IT Solutions</h4>
                    <div className="flex flex-col gap-2">
                      {serviceLinks.it.map((item) => (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          onMouseEnter={() => setActiveVideo(item.video)}
                          onClick={() => setIsServicesOpen(false)}
                          className="group flex items-center px-4 py-3 -mx-4 rounded-xl text-base font-bold text-foreground border-2 border-transparent hover:border-foreground hover:bg-white hover:shadow-[4px_4px_0_0_#0F0F0F] hover:-translate-y-1 transition-all duration-300"
                        >
                          <span className="transform transition-transform duration-300">{item.name}</span>
                          <svg className="w-5 h-5 ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12h16m-7-7 7 7-7 7"/>
                          </svg>
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

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="md:hidden fixed inset-0 top-[80px] h-[calc(100vh-80px)] w-full bg-accent z-40 overflow-y-auto border-t-4 border-foreground"
          >
            <div className="flex flex-col px-6 py-10 gap-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black text-foreground hover:translate-x-2 transition-transform">
                Home
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black text-foreground hover:translate-x-2 transition-transform">
                About Us
              </Link>
              
              {/* Services Accordion */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex items-center justify-between text-4xl font-display font-black text-foreground hover:translate-x-2 transition-transform"
                >
                  Services
                  <motion.svg animate={{ rotate: isMobileServicesOpen ? 180 : 0 }} className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M6 9l6 6 6-6"/>
                  </motion.svg>
                </button>
                
                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col pl-4 mt-4 border-l-4 border-foreground"
                    >
                      <span className="text-xs font-black text-black/50 uppercase tracking-widest mt-2 mb-2">Creative Studio</span>
                      {serviceLinks.creative.map(link => (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-3 text-xl font-bold text-foreground hover:text-surface"
                        >
                          {link.name}
                        </Link>
                      ))}
                      
                      <span className="text-xs font-black text-black/50 uppercase tracking-widest mt-6 mb-2">IT Solutions</span>
                      {serviceLinks.it.map(link => (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-3 text-xl font-bold text-foreground hover:text-surface"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="#tools" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black text-foreground flex items-center gap-3 hover:translate-x-2 transition-transform">
                Free Tools
                <span className="px-3 py-1 bg-black text-white text-sm rounded-lg">New</span>
              </Link>

              <div className="mt-8 pt-8 border-t-4 border-foreground">
                <Link 
                  href="#contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center px-6 py-4 bg-surface text-foreground font-black text-xl neo-brutalist"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
