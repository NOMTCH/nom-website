'use client';

import { motion } from 'framer-motion';

export function PainPoints() {
  const painPoints = [
    "Ingin terlihat profesional, tapi bingung harus mulai dari mana.",
    "Sudah punya bisnis, tapi visual & branding belum konsisten.",
    "Bingung buat konten foto/video yang menarik untuk sosmed.",
    "Belum punya website modern yang bisa bikin calon klien percaya.",
    "Terkendala masalah teknis & IT yang bikin operasional terhambat."
  ];

  const solutions = [
    "Identitas visual & UI/UX profesional yang berkarakter.",
    "Foto & video komersial cinematic untuk promosi & engagement.",
    "Website super cepat & responsif (Next.js, Supabase, & Laravel).",
    "Pengelolaan Cloud VPS & otomatisasi IT yang efisien.",
    "Pendampingan & strategi digital penuh dari tim developer."
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-background text-foreground relative overflow-hidden">
      {/* Background Soft Pattern */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-border) 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          
          {/* Left Column: The Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex-1 bg-surface border border-border shadow-md rounded-2xl p-6 md:p-8 relative flex flex-col justify-between"
          >
            <div>
              <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Tantangan Bisnis
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black leading-tight text-foreground mb-3 tracking-tight">
                Pernah Mengalami <span className="text-accent">Hal Ini?</span>
              </h2>
              <p className="text-muted text-xs md:text-sm font-medium mb-6 leading-relaxed">
                Banyak bisnis stagnan hanya karena masalah eksekusi visual &amp; IT.
              </p>
              
              <ul className="space-y-3">
                {painPoints.map((point, i) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    key={i} 
                    className="flex items-start gap-3 p-3.5 border border-border bg-background rounded-xl hover:border-red-500/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs">⚡</span>
                    </div>
                    <span className="font-semibold text-xs md:text-sm text-foreground leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column: The Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex-1 bg-surface border border-border/80 shadow-md rounded-2xl p-6 md:p-8 relative flex flex-col justify-between hover:border-accent/60 transition-colors"
          >
            <div>
              <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Solusi NOMSTD
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black leading-tight text-foreground mb-3 tracking-tight">
                Tenang, Kami Siap <span className="text-accent">Eksekusi.</span>
              </h2>
              <p className="text-muted text-xs md:text-sm font-medium mb-6">
                Semua kebutuhan tech &amp; kreatif Anda ditangani oleh satu tim berpengalaman.
              </p>
              
              <ul className="space-y-3">
                {solutions.map((point, i) => (
                  <motion.li 
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    key={i} 
                    className="flex items-start gap-3 p-3.5 border border-border bg-background rounded-xl hover:border-accent transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs">✨</span>
                    </div>
                    <span className="font-bold text-xs md:text-sm text-foreground leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 p-4 bg-background border border-border rounded-xl shadow-sm">
              <p className="font-bold text-xs md:text-sm tracking-tight leading-relaxed text-foreground italic">
                &ldquo;Fokus pada pertumbuhan bisnis Anda, sisanya biarkan tim NOMSTD yang urus.&rdquo;
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
