'use client';

import { motion } from 'framer-motion';

export function PainPoints() {
  const painPoints = [
    "Ingin terlihat lebih profesional, tapi belum tahu harus mulai dari mana.",
    "Sudah punya bisnis atau usaha, tapi desain dan tampilan visualnya masih belum konsisten.",
    "Bingung membuat konten foto dan video yang menarik untuk media sosial.",
    "Belum memiliki website atau kehadiran digital yang meyakinkan.",
    "Sering terkendala masalah teknis dan kebutuhan IT yang menghambat pekerjaan."
  ];

  const solutions = [
    "Desain visual yang lebih profesional dan sesuai dengan identitas bisnis Anda.",
    "Produksi foto dan video yang menarik untuk promosi maupun kebutuhan konten.",
    "Website yang modern, cepat, dan mudah digunakan.",
    "Solusi IT yang membantu pekerjaan berjalan lebih efisien.",
    "Pendampingan dan strategi digital yang disesuaikan dengan kebutuhan Anda."
  ];

  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.02] z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col xl:flex-row gap-12">
          
          {/* Left Column: The Problem */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 bg-surface border-4 border-foreground shadow-[12px_12px_0_0_#0F0F0F] p-8 md:p-12 relative"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black leading-tight text-foreground mb-4 uppercase tracking-tighter">
              Kami Paham <br/><span className="text-accent-secondary bg-accent-secondary/10 px-2">Tantangan</span> yang Anda Hadapi.
            </h2>
            <p className="text-muted text-lg font-bold mb-8">
              Karena kami juga sering menemui hal yang sama bersama klien-klien kami. <br className="hidden md:block"/>
              <span className="text-black font-black bg-yellow-200 px-2 mt-2 inline-block">Apakah ini yang sedang Anda alami?</span>
            </p>
            
            <ul className="space-y-4">
              {painPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-4 p-4 border-2 border-foreground bg-white shadow-[4px_4px_0_0_#0F0F0F] hover:shadow-[6px_6px_0_0_#FF6138] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300">
                  <span className="text-2xl shrink-0 mt-0.5">😩</span>
                  <span className="font-bold text-sm md:text-base text-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column: The Solution */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-accent border-4 border-foreground shadow-[12px_12px_0_0_#0F0F0F] p-8 md:p-12 relative flex flex-col justify-between"
          >
            {/* Decorative Vector */}
            <div className="absolute top-6 right-6 opacity-30 pointer-events-none animate-spin-slow" style={{ animationDuration: '15s' }}>
               <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="#0F0F0F" strokeWidth="8">
                 <path d="M50 0 L100 50 L50 100 L0 50 Z" />
               </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-black leading-tight text-foreground mb-4 uppercase tracking-tighter">
                Tenang, Anda berada di <span className="bg-white px-2">tempat yang tepat.</span>
              </h2>
              <p className="text-foreground text-xl font-black mb-8">
                Kami dapat membantu dengan:
              </p>
              
              <ul className="space-y-4">
                {solutions.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 border-2 border-foreground bg-white/60 hover:bg-white shadow-[4px_4px_0_0_#0F0F0F] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300">
                    <span className="text-2xl shrink-0 mt-0.5">✨</span>
                    <span className="font-black text-sm md:text-base text-foreground leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-12 relative z-10 p-6 bg-white border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] -rotate-2 hover:rotate-0 transition-transform duration-300">
              <p className="font-black text-lg md:text-xl uppercase tracking-tight leading-snug text-foreground">
                &quot;Karena setiap bisnis memiliki cerita yang berbeda, dan setiap solusi harus dibuat sesuai dengan tujuan yang ingin dicapai.&quot;
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
