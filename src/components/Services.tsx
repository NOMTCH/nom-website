'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const services = [
  {
    id: '01',
    title: 'Graphic Design',
    desc: 'Logo, Branding, Brosur, Social Media Management. Bikin identitas visual yang nancep di kepala audiens. (Note: We focus on layout and branding, no hand-drawn illustration).',
    color: 'from-blue-500 to-cyan-400',
    video: '/assets/videos/Graphic.mp4',
    href: '/portfolio/graphic-design'
  },
  {
    id: '02',
    title: 'Photography',
    desc: 'Dari momen epic Wedding, Corporate Event, Perpisahan Sekolah, sampai foto Produk komersial dengan lighting mahal.',
    color: 'from-accent to-emerald-400',
    video: '/assets/videos/Photo.mp4',
    href: '/portfolio/photography'
  },
  {
    id: '03',
    title: 'Videography',
    desc: 'Shooting dan video editing profesional. Cinematic wedding, aftermovie event, sampai paket Reels/TikTok yang hook-nya dapet banget.',
    color: 'from-amber-400 to-orange-500',
    video: '/assets/videos/Video.mp4',
    href: '/portfolio/videography'
  },
  {
    id: '04',
    title: 'Web Development',
    desc: 'Bikin Landing Page, Company Profile, atau web app kekinian yang ngebut dan responsif (Powered by modern stacks).',
    color: 'from-purple-500 to-pink-500',
    video: '/assets/videos/Web.mp4',
    href: '/portfolio/web-development'
  },
  {
    id: '05',
    title: 'IT Solutions',
    desc: 'Service laptop lemot, upgrade SSD/RAM, rakit PC custom idaman, dan maintenance jaringan buat kantor lo.',
    color: 'from-rose-500 to-red-500',
    video: '/assets/videos/Laptop.mp4',
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
              {/* Top Half: Video */}
              <div className="relative h-[200px] w-full border-b-4 border-foreground overflow-hidden bg-black">
                <video 
                  src={srv.video} 
                  autoPlay loop muted playsInline 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-accent transition-colors duration-300 pointer-events-none z-10" />
                
                {/* Brutalist Vector Halftone Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:10px_10px] group-hover:opacity-0 transition-opacity duration-500 z-10" />
                
                {/* Decorative Brutalist Star Vector */}
                <div className="absolute -top-4 -left-4 z-20 text-accent opacity-100 md:opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 transform -rotate-12 group-hover:rotate-12">
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="#F7DF1E" stroke="#0F0F0F" strokeWidth="6" className="drop-shadow-[4px_4px_0_rgba(15,15,15,1)]">
                     <polygon points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35" />
                  </svg>
                </div>
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
