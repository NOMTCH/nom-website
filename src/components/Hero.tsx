'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-background pt-24 pb-20 md:pt-28 md:pb-24">
      
      {/* Soft Dot Pattern */}
      <div className="absolute inset-0 opacity-30 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #E5E7EB 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Massive Text Background - Softened */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <div className="text-[25vw] font-display font-black leading-none whitespace-nowrap text-foreground tracking-tighter">
          NOMSTD
        </div>
      </div>

      {/* SUPER EYE-CATCHY Floating Elements Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Left Side Elements */}
        {/* Graphic Design: Ai */}
        <motion.div 
          className="absolute top-[12%] md:top-[18%] left-[2%] md:left-[8%] z-20 scale-75 md:scale-100 hidden sm:block"
          animate={{ y: [0, -25, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FF9A00] to-[#FF5D00] shadow-[0_16px_32px_rgba(255,154,0,0.4)] border-2 border-white/20 rounded-[2rem] flex items-center justify-center transform -rotate-12">
            <span className="font-black text-3xl md:text-4xl text-white drop-shadow-md">Ai</span>
          </div>
        </motion.div>

        {/* Web Dev Small: HTML */}
        <motion.div 
          className="absolute top-[45%] left-[5%] md:left-[12%] z-20 hidden md:block"
          animate={{ y: [0, 15, 0], rotate: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-[#E34F26] to-[#F16529] shadow-[0_12px_24px_rgba(227,79,38,0.4)] border border-white/30 rounded-2xl flex items-center justify-center transform rotate-6">
            <span className="font-bold text-sm text-white tracking-tighter">HTML</span>
          </div>
        </motion.div>

        {/* Photo/Design: Ps */}
        <motion.div 
          className="absolute top-[75%] md:top-[68%] left-[4%] md:left-[15%] z-20 scale-75 md:scale-100 hidden sm:block"
          animate={{ y: [0, -20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#31A8FF] to-[#0074FF] shadow-[0_16px_32px_rgba(49,168,255,0.4)] border-2 border-white/20 rounded-[2rem] flex items-center justify-center transform rotate-12">
            <span className="font-black text-3xl md:text-4xl text-white drop-shadow-md">Ps</span>
          </div>
        </motion.div>

        {/* Web Dev: React Logo */}
        <motion.div 
          className="absolute top-[85%] left-[20%] md:left-[25%] z-10 hidden md:block"
          animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-24 h-24 bg-white/80 backdrop-blur-md shadow-[0_12px_32px_rgba(0,216,255,0.2)] border border-white/50 rounded-full flex items-center justify-center">
            <svg width="50" height="50" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="#00D8FF" strokeWidth="2.5">
              <circle cx="0" cy="0" r="2.05" fill="#00D8FF"/>
              <g stroke="#00D8FF" strokeWidth="1.5" fill="none">
                <ellipse rx="11" ry="4.2"/>
                <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Graphic Design Emoji / 3D Asset Alternative */}
        <motion.div 
          className="absolute top-[18%] md:top-[30%] right-[10%] md:left-[28%] md:right-auto z-10 scale-[0.65] md:scale-100 hidden sm:block"
          animate={{ x: [0, 15, 0], y: [0, -10, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <div className="px-6 py-4 bg-white text-black font-black text-xl md:text-2xl rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-border transform rotate-6">
            ✨ Creative
          </div>
        </motion.div>


        {/* Right Side Elements */}
        {/* Web Dev: Next.js */}
        <motion.div 
          className="absolute top-[12%] md:top-[20%] right-[5%] md:right-[15%] z-20 scale-[0.7] md:scale-100 hidden sm:block"
          animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <div className="w-20 h-20 md:w-28 md:h-28 bg-black shadow-[0_16px_32px_rgba(0,0,0,0.3)] border-2 border-white/10 rounded-[2rem] flex items-center justify-center transform rotate-6">
            <span className="font-black text-xl md:text-2xl text-white tracking-tighter">NEXT</span>
          </div>
        </motion.div>

        {/* Video: Pr */}
        <motion.div 
          className="absolute top-[82%] md:top-[45%] right-[5%] md:right-[10%] z-20 scale-75 md:scale-100 hidden sm:block"
          animate={{ y: [0, -30, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#EA77FF] to-[#B026FF] shadow-[0_16px_32px_rgba(234,119,255,0.4)] border-2 border-white/20 rounded-[2rem] flex items-center justify-center transform -rotate-12">
            <span className="font-black text-3xl md:text-4xl text-white drop-shadow-md">Pr</span>
          </div>
        </motion.div>

        {/* Web Dev Small: JS */}
        <motion.div 
          className="absolute top-[55%] right-[18%] md:right-[25%] z-10 hidden md:block"
          animate={{ y: [0, 20, 0], rotate: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#F7DF1E] to-[#E3C300] shadow-[0_12px_24px_rgba(247,223,30,0.4)] border border-white/50 rounded-2xl flex items-center justify-center p-1 transform rotate-12">
            <span className="font-black text-2xl text-black">JS</span>
          </div>
        </motion.div>

        {/* Video: Ae */}
        <motion.div 
          className="absolute top-[85%] right-[15%] md:right-[22%] z-20 hidden md:flex"
          animate={{ y: [0, 15, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#9999FF] to-[#5C5CFF] shadow-[0_16px_32px_rgba(153,153,255,0.4)] border-2 border-white/20 rounded-[2rem] flex items-center justify-center transform rotate-6">
            <span className="font-black text-3xl md:text-4xl text-white drop-shadow-md">Ae</span>
          </div>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <div className="relative max-w-4xl mx-auto w-full">
          
          {/* Paper 1 (Back) */}
          <motion.div 
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: -3 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="absolute inset-0 bg-[#FF9A00]/20 rounded-[2.5rem] md:rounded-[4rem] border border-[#FF9A00]/30 shadow-sm transform -translate-x-2 translate-y-4"
          />
          
          {/* Paper 2 (Middle) */}
          <motion.div 
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 4 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="absolute inset-0 bg-[#31A8FF]/20 rounded-[2.5rem] md:rounded-[4rem] border border-[#31A8FF]/30 shadow-sm transform translate-x-3 -translate-y-2"
          />

          {/* Paper 3 (Front) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="bg-white/70 backdrop-blur-2xl border border-white shadow-[0_24px_80px_rgba(0,0,0,0.08)] p-5 sm:p-10 md:p-12 relative z-10 rounded-[2.5rem] md:rounded-[4rem]"
          >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-3 md:mb-6"
          >
            <span className="px-4 py-1.5 bg-accent text-white font-black text-[10px] md:text-sm rounded-full tracking-wider uppercase shadow-md">
              NOM Creative Studio
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] mb-4 md:mb-6 text-foreground"
          >
            Desain. Konten. <br className="hidden md:block" />
            <span className="text-accent">
              Teknologi.
            </span>
          </motion.h1>

          {/* List of Services - The "Menu" on the front paper */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-1.5 sm:gap-3 mb-6 md:mb-8 max-w-3xl mx-auto"
          >
            {['Graphic Design', 'Web Development', 'Photography', 'Videography', 'IT Solutions', 'Digital Invitation'].map(srv => (
              <span key={srv} className="px-3 py-1.5 bg-white/50 border border-white rounded-full text-[11px] sm:text-xs md:text-sm font-bold text-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-accent hover:text-white hover:border-accent transition-all cursor-default">
                {srv}
              </span>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link href="/portfolio" className="w-full sm:w-auto justify-center px-6 py-3 sm:px-8 sm:py-4 bg-foreground text-white rounded-full font-bold flex items-center gap-2 text-sm sm:text-base hover:bg-accent hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              Explore Services
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </Link>
            <a href="#tools" className="w-full sm:w-auto justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-foreground border border-border shadow-sm rounded-full font-bold flex items-center gap-2 text-sm sm:text-base hover:bg-background hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              Free Tools
            </a>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* Cute Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 z-30 cursor-pointer"
        onClick={() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <div className="bg-accent shadow-[0_8px_16px_rgba(255,59,48,0.4)] px-3 py-1 md:px-4 md:py-1.5 rounded-full -rotate-6 hover:rotate-0 transition-transform">
          <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-white">Scroll Pls</span>
        </div>
        <div className="w-6 h-10 md:w-8 md:h-12 bg-white backdrop-blur-sm border-2 border-accent/20 shadow-md rounded-full flex justify-center pt-1.5 md:pt-2 hover:shadow-lg transition-shadow">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 md:w-1.5 h-2 md:h-3 bg-accent rounded-full"
          />
        </div>
      </motion.div>

    </section>
  );
}
