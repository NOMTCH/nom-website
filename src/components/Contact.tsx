'use client';

import { WhatsappLogo, ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';

export function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-surface relative">
      <div className="container mx-auto max-w-4xl bg-surface p-8 md:p-16 relative overflow-hidden neo-brutalist shadow-[12px_12px_0_0_#0F0F0F]">
        
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3 border-4 border-border" />

        <div className="relative z-10 flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-black leading-tight text-foreground uppercase tracking-tighter">
              Got an Idea?<br/>
              <span className="text-accent">Let&apos;s Make It Happen.</span>
            </h2>
            <p className="text-muted font-bold">
              Isi form di samping untuk mulai ngobrolin project lo, atau langsung hubungi via WhatsApp untuk fast response.
            </p>
            <div className="pt-8 space-y-6">
              
              <div>
                <a 
                  href="https://wa.me/6282130704794" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-black border-4 border-foreground font-black uppercase tracking-widest hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0F0F0F] active:translate-y-1 active:shadow-none transition-all group"
                >
                  <WhatsappLogo weight="fill" size={28} />
                  <span>Chat WhatsApp</span>
                  <ArrowUpRight weight="bold" size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-muted mb-2">Or via Email</div>
                <a href="mailto:halo@nomstd.com" className="inline-flex items-center gap-2 text-lg font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors">
                  <EnvelopeSimple weight="bold" size={24} />
                  halo@nomstd.com
                </a>
              </div>
            </div>
          </div>

          <form className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-widest">Name</label>
              <input type="text" className="w-full" placeholder="Nama Kamu" />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-widest">Email</label>
              <input type="email" className="w-full" placeholder="email@kamu.com" />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-widest">Project Details</label>
              <textarea className="w-full h-32 resize-none" placeholder="Ceritain sedikit tentang project lo..."></textarea>
            </div>
            <button type="button" className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:bg-white active:translate-y-1 active:shadow-none transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
