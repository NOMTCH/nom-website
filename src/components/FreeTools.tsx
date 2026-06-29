'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function FreeTools() {
  return (
    <section id="tools" className="py-24 md:py-32 px-4 bg-surface relative border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6"
          >
            <span className="text-accent font-bold text-sm uppercase tracking-wider inline-block px-4 py-1.5 bg-accent/10 rounded-full">
              Level Up Your Game
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight text-foreground">
              Premium Tools,<br/>
              <span className="text-accent">
                100% Gratis.
              </span>
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed font-medium">
              Kita bikin tools kualitas premium khusus buat lo. Mulai dari bikin CV keren buat ngelamar kerja, sampai Bio Link bergaya Neo-Pop buat nampang di sosmed. Sikat semua gratis tanpa langganan! (Tapi kalau mau traktir kopi, kita gak nolak kok wkwk).
            </p>
            
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Link href="/tools/cv-generator" target="_blank" className="px-8 py-4 bg-white border border-border text-foreground font-bold text-center rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-accent transition-all duration-300">
                CV Generator
              </Link>
              <Link href="/tools/link-builder" target="_blank" className="px-8 py-4 bg-accent text-white font-bold text-center rounded-2xl shadow-sm hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-1 hover:bg-accent-dark transition-all duration-300">
                Bio Link Builder
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-md"
          >
            <div className="p-8 md:p-10 bg-[#FF9500]/10 border border-[#FFCC00]/30 text-center relative group shadow-sm hover:shadow-xl hover:-translate-y-2 rounded-[2rem] transition-all duration-500">
              {/* Cute top accent pill */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#FF9500] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                Support Us
              </div>
              
              <div className="relative z-10 pt-4">
                <h3 className="text-2xl font-black mb-3 text-foreground tracking-tight">TRAKTIR KOPI ☕</h3>
                <p className="text-sm font-semibold text-muted mb-8 leading-relaxed">
                  Dukung server NOMSTD biar terus nyala! Sawer seikhlasnya, pahala seluas-luasnya.
                </p>
                {/* Clean QR Code UI */}
                <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border border-border mb-8 shadow-sm group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://saweria.co/iammonoz" 
                    alt="Saweria QR Code" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <a href="https://saweria.co/iammonoz" target="_blank" rel="noreferrer" className="block w-full py-4 bg-[#FF9500] text-white font-bold rounded-xl hover:bg-[#E68600] transition-colors shadow-sm hover:shadow-md">
                  SAWER LEWAT SINI
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
