'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      
      {/* Dot Pattern & Massive Text Background */}
      <div className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.02] select-none">
        <div className="text-[25vw] font-display font-black leading-none whitespace-nowrap -rotate-6 text-black tracking-tighter">
          NOM<span className="text-transparent" style={{ WebkitTextStroke: '4px black' }}>STD</span>
        </div>
      </div>

      {/* Floating Tech Stack Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Left Side Elements */}
        {/* Graphic Design: Adobe Illustrator (Ai) */}
        <motion.div 
          className="absolute top-[8%] md:top-[15%] left-[2%] md:left-[8%] opacity-60 md:opacity-80 scale-75 md:scale-100"
          animate={{ y: [0, -15, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FF9A00] border-4 border-foreground shadow-[6px_6px_0_0_#0F0F0F] rounded-xl flex items-center justify-center">
            <span className="font-black text-2xl md:text-3xl text-[#330000]">Ai</span>
          </div>
        </motion.div>

        {/* Web Dev Small: HTML */}
        <motion.div 
          className="absolute top-[40%] left-[3%] md:left-[6%] opacity-60 hidden md:block"
          animate={{ y: [0, -15, 0], rotate: [0, -15, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <div className="w-12 h-12 bg-[#E34F26] border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] rounded-md flex items-center justify-center">
            <span className="font-black text-sm text-white tracking-tighter">HTML</span>
          </div>
        </motion.div>

        {/* Photo/Design: Adobe Photoshop (Ps) */}
        <motion.div 
          className="absolute top-[75%] md:top-[65%] left-[2%] md:left-[10%] opacity-60 md:opacity-80 scale-75 md:scale-100"
          animate={{ y: [0, 25, 0], rotate: [0, 10, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#31A8FF] border-4 border-foreground shadow-[6px_6px_0_0_#0F0F0F] rounded-xl flex items-center justify-center">
            <span className="font-black text-2xl md:text-3xl text-[#001E36]">Ps</span>
          </div>
        </motion.div>

        {/* Web Dev: React Logo */}
        <motion.div 
          className="absolute top-[85%] left-[10%] md:left-[15%] opacity-70 hidden md:block"
          animate={{ y: [0, -15, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 bg-surface border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] rounded-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="#00D8FF" strokeWidth="2">
              <circle cx="0" cy="0" r="2.05" fill="#00D8FF"/>
              <g stroke="#00D8FF" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2"/>
                <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Web Dev: Next.js */}
        <motion.div 
          className="absolute top-[12%] md:top-[28%] right-[5%] md:left-[18%] md:right-auto opacity-70 md:opacity-80 scale-[0.65] md:scale-100"
          animate={{ x: [0, 20, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <div className="px-4 py-3 bg-black border-4 border-foreground shadow-[6px_6px_0_0_#0F0F0F] rounded-xl flex items-center justify-center">
            <span className="font-black text-xl text-white tracking-tighter">NEXT.js</span>
          </div>
        </motion.div>


        {/* Right Side Elements */}
        {/* Web Dev Small: Node.js */}
        <motion.div 
          className="absolute top-[12%] right-[15%] md:right-[18%] opacity-60 hidden md:block"
          animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.1 }}
        >
          <div className="px-3 py-1 bg-[#339933] border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] rounded-full flex items-center justify-center">
            <span className="font-black text-xs text-white">Node</span>
          </div>
        </motion.div>

        {/* Video: Adobe Premiere Pro (Pr) */}
        <motion.div 
          className="absolute top-[82%] md:top-[22%] right-[2%] md:right-[8%] opacity-60 md:opacity-80 scale-75 md:scale-100"
          animate={{ y: [0, -25, 0], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#EA77FF] border-4 border-foreground shadow-[6px_6px_0_0_#0F0F0F] rounded-xl flex items-center justify-center">
            <span className="font-black text-2xl md:text-3xl text-[#2D0031]">Pr</span>
          </div>
        </motion.div>

        {/* General Tool: Camera */}
        <motion.div 
          className="absolute top-[45%] right-[3%] md:right-[6%] opacity-80 hidden md:block"
          animate={{ y: [0, -20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="#FF6138" stroke="#0F0F0F" strokeWidth="1.5" className="drop-shadow-[6px_6px_0_rgba(15,15,15,1)]">
            <rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><circle cx="12" cy="14" r="3"/>
          </svg>
        </motion.div>

        {/* Web Dev Small: JS */}
        <motion.div 
          className="absolute top-[55%] right-[18%] md:right-[22%] opacity-60 hidden md:block"
          animate={{ y: [0, 15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <div className="w-12 h-12 bg-[#F7DF1E] border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] flex items-end justify-end p-1">
            <span className="font-black text-lg text-black leading-none">JS</span>
          </div>
        </motion.div>

        {/* IT Solutions: Windows Logo */}
        <motion.div 
          className="absolute top-[70%] right-[8%] md:right-[12%] opacity-70 hidden md:block"
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-20 h-20 bg-[#00A4EF] border-4 border-foreground shadow-[6px_6px_0_0_#0F0F0F] rounded-xl flex flex-wrap items-center justify-center p-3 gap-1">
            <div className="w-[45%] h-[45%] bg-white border-2 border-foreground" />
            <div className="w-[45%] h-[45%] bg-white border-2 border-foreground" />
            <div className="w-[45%] h-[45%] bg-white border-2 border-foreground" />
            <div className="w-[45%] h-[45%] bg-white border-2 border-foreground" />
          </div>
        </motion.div>

        {/* Video: Adobe After Effects (Ae) */}
        <motion.div 
          className="absolute top-[85%] right-[15%] md:right-[20%] opacity-80 hidden md:flex"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#9999FF] border-4 border-foreground shadow-[6px_6px_0_0_#0F0F0F] rounded-xl flex items-center justify-center">
            <span className="font-black text-2xl md:text-3xl text-[#00005B]">Ae</span>
          </div>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center pt-24 pb-32 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white border-4 border-foreground shadow-[12px_12px_0_0_#0F0F0F] md:shadow-[24px_24px_0_0_#0F0F0F] p-8 md:p-16 max-w-5xl mx-auto w-full relative z-10"
        >
          {/* Decorative Corner Elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent border-4 border-foreground" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-accent-secondary border-4 border-foreground" />
          <span className="px-4 py-2 bg-accent text-white font-bold text-sm neo-brutalist mb-8 inline-block">
            NOMSTD Creative Studio
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-[1.1] mb-6 text-foreground">
            Desain. Konten. <br/>
            <span className="text-accent-secondary">
              Teknologi.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Menyediakan layanan desain grafis, foto & video, website, dan solusi IT untuk membantu bisnis dan kreator tampil lebih profesional di dunia digital.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full md:w-auto">
            <Link href="/portfolio" className="w-full md:w-auto justify-center px-8 py-4 bg-accent text-white font-bold flex items-center gap-2 neo-brutalist">
              Explore Services
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </Link>
            <a href="#tools" className="w-full md:w-auto justify-center px-8 py-4 bg-surface text-foreground font-bold flex items-center gap-2 neo-brutalist">
              Free Tools
            </a>
          </div>
        </motion.div>
      </div>

      {/* Cute Brutalist Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 cursor-pointer"
        onClick={() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <div className="bg-[#FFD700] border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] px-4 py-1.5 rounded-full -rotate-6 hover:rotate-0 transition-transform">
          <span className="font-black text-xs uppercase tracking-widest text-foreground">Scroll Pls</span>
        </div>
        <div className="w-8 h-12 bg-white border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] rounded-full flex justify-center pt-2">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-3 bg-accent rounded-full"
          />
        </div>
      </motion.div>

    </section>
  );
}
