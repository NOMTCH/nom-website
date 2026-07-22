'use client';

import { motion } from 'framer-motion';

export function PainPoints() {
  const painPoints = [
    "Ingin terlihat lebih profesional, tapi belum tahu harus mulai dari mana.",
    "Sudah punya bisnis, tapi desain visualnya masih belum konsisten.",
    "Bingung membuat konten foto dan video yang menarik untuk media sosial.",
    "Belum memiliki website atau kehadiran digital yang meyakinkan.",
    "Sering terkendala masalah teknis dan kebutuhan IT yang menghambat."
  ];

  const solutions = [
    "Desain visual yang lebih profesional dan sesuai dengan identitas bisnis Anda.",
    "Produksi foto dan video yang menarik untuk promosi maupun kebutuhan konten.",
    "Website yang modern, cepat, dan mudah digunakan (Powered by Next.js & Laravel).",
    "Solusi IT yang membantu pekerjaan berjalan lebih efisien.",
    "Pendampingan dan strategi digital yang disesuaikan dengan kebutuhan Anda."
  ];

  return (
    <section className="py-24 md:py-32 px-4 bg-background text-foreground relative overflow-hidden">
      {/* Background Soft Pattern */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-border) 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }}></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* Left Column: The Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 bg-surface border border-border shadow-md rounded-2xl md:rounded-3xl p-8 md:p-12 relative"
          >
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight text-foreground mb-4 tracking-tight">
              Kami Paham <br/><span className="text-accent">Tantangan</span> yang Anda Hadapi.
            </h2>
            <p className="text-muted text-base md:text-lg font-medium mb-8 leading-relaxed">
              Karena kami sering menemui hal yang sama bersama klien-klien kami. <br className="hidden md:block"/>
              <span className="text-foreground font-bold mt-2 inline-block">Apakah ini yang sedang Anda alami?</span>
            </p>
            
            <ul className="space-y-4">
              {painPoints.map((point, i) => (
                <motion.li 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-start gap-4 p-5 border border-border bg-background rounded-2xl hover:border-accent transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-lg">😩</span>
                  </div>
                  <span className="font-semibold text-sm md:text-base text-foreground leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column: The Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-surface border border-border shadow-md rounded-2xl md:rounded-3xl p-8 md:p-12 relative flex flex-col justify-between"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-black leading-tight text-foreground mb-4 tracking-tight">
                Tenang, Anda berada di <span className="text-accent">tempat yang tepat.</span>
              </h2>
              <p className="text-foreground text-lg md:text-xl font-bold mb-8">
                Kami dapat membantu dengan:
              </p>
              
              <ul className="space-y-4">
                {solutions.map((point, i) => (
                  <motion.li 
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-start gap-4 p-5 border border-border bg-background rounded-2xl hover:border-accent transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-lg">✨</span>
                    </div>
                    <span className="font-bold text-sm md:text-base text-foreground leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="mt-12 relative z-10 p-6 bg-background border border-border rounded-2xl shadow-sm">
              <p className="font-bold text-base md:text-lg tracking-tight leading-relaxed text-foreground italic">
                &ldquo;Karena setiap bisnis memiliki cerita yang berbeda, dan setiap solusi harus dibuat sesuai dengan tujuan yang ingin dicapai.&rdquo;
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
