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
    title: 'Graphic Design',
    desc: 'Logo, Branding, Brosur, Social Media Management. Bikin identitas visual yang nancep di kepala audiens. (We focus on layout and branding).',
    color: 'text-accent',
    icon: Palette,
    href: '/services/graphic-design'
  },
  {
    id: '02',
    title: 'Photography',
    desc: 'Dari momen epic Wedding, Corporate Event, Perpisahan Sekolah, sampai foto Produk komersial dengan lighting mahal.',
    color: 'text-accent',
    icon: Camera,
    href: '/services/photography'
  },
  {
    id: '03',
    title: 'Videography',
    desc: 'Shooting dan video editing profesional. Cinematic wedding, aftermovie event, sampai paket Reels/TikTok yang hook-nya dapet banget.',
    color: 'text-accent',
    icon: VideoCamera,
    href: '/services/videography'
  },
  {
    id: '04',
    title: 'Web Development',
    desc: 'Bikin Landing Page, Company Profile, atau web app kekinian yang ngebut dan responsif (Powered by Next.js & Laravel).',
    color: 'text-accent',
    icon: Code,
    href: '/services/web-development'
  },
  {
    id: '05',
    title: 'IT Solutions',
    desc: 'Service laptop lemot, upgrade SSD/RAM, rakit PC custom idaman, dan maintenance jaringan buat kantor lo.',
    color: 'text-accent',
    icon: Laptop,
    href: '/services/it-solutions'
  },
  {
    id: '06',
    title: 'Digital Invitation',
    desc: 'Bikin tamu lo kena mental. Undangan digital eksklusif dengan tema premium, RSVP, kado cashless, dan animasi dewa.',
    color: 'text-accent',
    icon: EnvelopeOpen,
    href: '/services/digital-invitation'
  }
];

export function Services() {
  const router = useRouter();

  return (
    <section id="services" className="py-24 md:py-32 px-4 bg-background text-foreground relative">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold text-sm mb-4 inline-block px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full uppercase tracking-wider"
          >
            Our Expertise
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-black leading-tight text-foreground"
          >
            Creative Studio.<br/>
            <span className="text-accent">
              &amp; IT Solutions.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((srv, idx) => (
            <motion.div 
              key={srv.id}
              onClick={() => router.push(srv.href)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group bg-surface border border-border shadow-md rounded-2xl md:rounded-3xl p-8 md:p-10 cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:border-accent transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-accent transition-all duration-300">
                    <srv.icon size={28} className="text-accent transition-colors duration-300" weight="duotone" />
                  </div>
                  <span className="text-4xl font-display font-black text-muted/30 group-hover:text-accent/40 transition-colors duration-300">
                    {srv.id}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors duration-300">
                  {srv.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm md:text-base font-medium mb-8">
                  {srv.desc}
                </p>
                
                <div className="flex items-center text-sm font-bold text-foreground group-hover:text-accent transition-colors mt-auto">
                  <span>Explore Service</span>
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center ml-4 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 shadow-sm">
                    <svg className="group-hover:translate-x-0.5 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
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
