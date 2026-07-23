'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Palette, 
  Camera, 
  VideoCamera, 
  Code, 
  Laptop, 
  EnvelopeOpen 
} from "@phosphor-icons/react";

const services = [
  {
    id: '01',
    title: 'Web Development',
    desc: 'Development web app, landing page, dan sistem enterprise modern yang super cepat & responsif (Next.js, Supabase, & Laravel Full-Stack).',
    color: 'text-accent',
    icon: Code,
    href: '/services/web-development'
  },
  {
    id: '02',
    title: 'IT & Cloud Solutions',
    desc: 'Pengelolaan Cloud VPS, deployment server automatasi, maintenance jaringan kantor, rakit PC custom, dan optimasi hardware.',
    color: 'text-accent',
    icon: Laptop,
    href: '/services/it-solutions'
  },
  {
    id: '03',
    title: 'Graphic Design',
    desc: 'Logo, UI/UX Design, Branding System, Brosur & Social Media Kit. Bikin identitas visual kelas atas yang berkarakter.',
    color: 'text-accent',
    icon: Palette,
    href: '/services/graphic-design'
  },
  {
    id: '04',
    title: 'Photography',
    desc: 'Foto produk komersial, Corporate Event, Wedding dokumentasi, dan foto katalog dengan standar lighting profesional.',
    color: 'text-accent',
    icon: Camera,
    href: '/services/photography'
  },
  {
    id: '05',
    title: 'Videography',
    desc: 'Shooting & video editing cinematic, Reels/TikTok engagement tinggi, aftermovie event, dan motion graphics promo.',
    color: 'text-accent',
    icon: VideoCamera,
    href: '/services/videography'
  },
  {
    id: '06',
    title: 'Digital Invitation',
    desc: 'Undangan digital eksklusif dengan animasi halus, fitur RSVP realtime, kado cashless, dan tema kustom interaktif.',
    color: 'text-accent',
    icon: EnvelopeOpen,
    href: '/services/digital-invitation'
  }
];

export function Services() {
  const router = useRouter();

  return (
    <section id="services" className="py-12 md:py-16 px-4 bg-background text-foreground relative">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold text-xs mb-2 inline-block px-3.5 py-1 bg-accent/10 border border-accent/30 rounded-full uppercase tracking-wider"
          >
            Our Core Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-display font-black leading-tight text-foreground"
          >
            Web Engineering.<br/>
            <span className="text-accent">
              &amp; Creative Studio.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((srv, idx) => (
            <motion.div 
              key={srv.id}
              onClick={() => router.push(srv.href)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: idx * 0.06, duration: 0.35, ease: "easeOut" }}
              className="group bg-surface border border-border shadow-sm rounded-xl p-5 md:p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-accent transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                    <srv.icon size={20} className="text-accent transition-colors duration-300" weight="duotone" />
                  </div>
                  <span className="text-2xl font-display font-black text-muted/30 group-hover:text-accent/40 transition-colors duration-300">
                    {srv.id}
                  </span>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground group-hover:text-accent transition-colors duration-300">
                  {srv.title}
                </h3>
                <p className="text-muted leading-relaxed text-xs font-medium mb-5">
                  {srv.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-foreground group-hover:text-accent transition-colors pt-2.5 border-t border-border/50">
                <span>Explore Service</span>
                <div className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center ml-auto group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 shadow-sm">
                  <svg className="group-hover:translate-x-0.5 transition-transform" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
