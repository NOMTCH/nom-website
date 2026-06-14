'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Palette, Camera, VideoCamera, Code, Desktop } from '@phosphor-icons/react';

const services = [
  {
    id: '01',
    title: 'Graphic Design',
    desc: 'Logo, Branding, Brosur, Social Media Management. Bikin identitas visual yang nancep di kepala audiens. (Note: We focus on layout and branding, no hand-drawn illustration).',
    color: 'text-[#F7DF1E]',
    icon: Palette,
    href: '/portfolio/graphic-design'
  },
  {
    id: '02',
    title: 'Photography',
    desc: 'Dari momen epic Wedding, Corporate Event, Perpisahan Sekolah, sampai foto Produk komersial dengan lighting mahal.',
    color: 'text-emerald-400',
    icon: Camera,
    href: '/portfolio/photography'
  },
  {
    id: '03',
    title: 'Videography',
    desc: 'Shooting dan video editing profesional. Cinematic wedding, aftermovie event, sampai paket Reels/TikTok yang hook-nya dapet banget.',
    color: 'text-orange-500',
    icon: VideoCamera,
    href: '/portfolio/videography'
  },
  {
    id: '04',
    title: 'Web Development',
    desc: 'Bikin Landing Page, Company Profile, atau web app kekinian yang ngebut dan responsif (Powered by modern stacks).',
    color: 'text-pink-500',
    icon: Code,
    href: '/portfolio/web-development'
  },
  {
    id: '05',
    title: 'IT Solutions',
    desc: 'Service laptop lemot, upgrade SSD/RAM, rakit PC custom idaman, dan maintenance jaringan buat kantor lo.',
    color: 'text-cyan-400',
    icon: Desktop,
    href: '/portfolio/it-solutions'
  }
];

export function Services() {
  const router = useRouter();

  return (
    <section id="services" className="py-32 px-6 bg-surface relative">
      <div className="container mx-auto">
        <div className="mb-20">
          <span className="text-accent font-bold text-sm mb-2 block">— Our Expertise</span>
          <h2 className="text-5xl md:text-7xl font-display font-black leading-tight text-foreground">
            Creative Studio.<br/>
            <span className="text-accent-secondary">& IT Solutions.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <motion.div 
              key={srv.id}
              onClick={() => router.push(srv.href)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex flex-col bg-surface neo-brutalist overflow-hidden h-[450px] cursor-pointer"
            >
              {/* Top Half: Vector Icon */}
              <div className="relative h-[200px] w-full border-b-4 border-foreground overflow-hidden bg-black flex items-center justify-center">
                {/* Brutalist Vector Halftone Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px] z-10" />
                
                {/* Massive Brutalist Icon */}
                <div className={`transform transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12 ${srv.color}`}>
                  <srv.icon weight="duotone" size={120} />
                </div>
                
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-accent transition-colors duration-300 pointer-events-none z-20" />
              </div>
              
              {/* Bottom Half: Content */}
              <div className="relative flex-1 p-6 flex flex-col bg-surface group-hover:bg-accent transition-colors duration-300 overflow-hidden">
                {/* Giant Brutalist Number */}
                <span className="absolute -bottom-4 -right-2 text-[120px] font-display font-black text-foreground opacity-5 group-hover:opacity-20 transition-all duration-300 pointer-events-none select-none leading-none">
                  {srv.id}
                </span>

                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-3 text-foreground group-hover:text-black transition-colors uppercase tracking-tight">{srv.title}</h3>
                    <p className="text-muted group-hover:text-black/80 font-bold leading-relaxed text-sm line-clamp-3 transition-colors">{srv.desc}</p>
                  </div>
                  
                  {/* Chunky Persistent Button */}
                  <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] text-sm font-black uppercase tracking-wider text-foreground w-full group-hover:bg-black group-hover:text-white group-hover:shadow-[2px_2px_0_0_#FFFFFF] transition-all duration-300 active:translate-y-1 active:translate-x-1 active:shadow-none">
                    <span>Explore</span>
                    <svg className="group-hover:translate-x-2 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
