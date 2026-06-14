'use client';

import { useState } from 'react';
import { WhatsappLogo, ArrowUpRight, EnvelopeSimple, SpinnerGap, CheckCircle } from '@phosphor-icons/react';
import { submitContactMessage } from '../lib/data/messages';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', project_details: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', project_details: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };
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

          {status === 'success' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F]">
              <CheckCircle weight="fill" size={64} className="text-green-500 mb-4" />
              <h3 className="text-2xl font-black uppercase mb-2">Message Sent!</h3>
              <p className="font-bold text-gray-600 mb-6">Thanks for reaching out. Our team will get back to you shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="py-3 px-6 bg-accent text-black font-black uppercase tracking-widest border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:bg-white active:translate-y-1 active:shadow-none transition-all"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-widest">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full" 
                  placeholder="Nama Kamu" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full" 
                  placeholder="email@kamu.com" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block uppercase tracking-widest">Project Details</label>
                <textarea 
                  required
                  value={formData.project_details}
                  onChange={(e) => setFormData({...formData, project_details: e.target.value})}
                  className="w-full h-32 resize-none" 
                  placeholder="Ceritain sedikit tentang project lo..."
                ></textarea>
              </div>
              {status === 'error' && (
                <p className="text-red-500 font-bold text-sm">Oops! Something went wrong. Please try again.</p>
              )}
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 flex items-center justify-center gap-2 bg-accent text-black font-black uppercase tracking-widest border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:bg-white active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
              >
                {status === 'loading' ? <SpinnerGap className="animate-spin" size={24} /> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
