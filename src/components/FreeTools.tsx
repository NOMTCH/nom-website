'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function FreeTools() {
  return (
    <section id="tools" className="py-32 px-6 bg-background relative border-t-2 border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1 space-y-6">
            <span className="text-accent font-bold text-sm">— CSR & Community</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-6 uppercase tracking-tighter">
              We Build &quot;Free&quot; Tools <br/>For Community
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Walaupun bayarannya cuma lewat &quot;Saweria&quot;, ngebantu orang dapet kerja atau mempermudah hidup mereka itu gratis. Cobain tools gratis buatan NOMSTD!
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/tools/cv-generator" target="_blank" className="px-8 py-4 bg-surface text-foreground font-bold text-center neo-brutalist hover:bg-accent hover:text-white">
                Open CV Generator
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm">
            <div className="p-8 bg-[#F7DF1E] border-4 border-foreground text-center relative group shadow-[12px_12px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[4px_4px_0_0_#0F0F0F] transition-all">
              <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(45deg,#0F0F0F,#0F0F0F_10px,#F7DF1E_10px,#F7DF1E_20px)] border-b-4 border-foreground" />
              
              <div className="relative z-10 pt-6">
                <h3 className="text-3xl font-black mb-2 text-foreground uppercase tracking-widest">TRAKTIR KOPI ☕</h3>
                <p className="text-sm font-bold text-foreground mb-6 uppercase">
                  Dukung server NOMSTD biar terus nyala! Sawer seikhlasnya, pahala seluas-luasnya.
                </p>
                {/* Actual QR Code UI */}
                <div className="w-48 h-48 mx-auto bg-white p-2 border-4 border-foreground mb-6 group-hover:-rotate-3 transition-transform flex items-center justify-center shadow-[8px_8px_0_0_#0F0F0F]">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://saweria.co/iammonoz" 
                    alt="Saweria QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <a href="https://saweria.co/iammonoz" target="_blank" rel="noreferrer" className="block w-full py-4 bg-accent text-black font-black uppercase tracking-widest border-4 border-foreground hover:bg-white transition-colors shadow-[4px_4px_0_0_#0F0F0F] active:translate-y-1 active:shadow-none">
                  SAWER LEWAT SINI
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
