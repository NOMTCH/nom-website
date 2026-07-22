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
    <section id="contact" className="py-24 md:py-32 px-4 bg-background text-foreground relative">
      <div className="container mx-auto max-w-5xl bg-surface p-8 md:p-16 relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-border">
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <span className="text-accent font-bold text-sm uppercase tracking-wider inline-block px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-2">
              Let&apos;s Talk
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-[1.1] text-foreground tracking-tight">
              Got an Idea?<br/>
              <span className="text-accent">Let&apos;s Make It Happen.</span>
            </h2>
            <p className="text-muted font-medium text-lg leading-relaxed">
              Isi form di samping untuk mulai ngobrolin project lo, atau langsung hubungi via WhatsApp untuk fast response.
            </p>
            
            <div className="pt-8 space-y-6">
              <div>
                <a 
                  href="https://wa.me/6282130704794" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:bg-[#20bd5a] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
                >
                  <WhatsappLogo weight="fill" size={28} />
                  <span>Chat WhatsApp</span>
                  <ArrowUpRight weight="bold" size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Or via Email</div>
                <a href="mailto:admin@nomstudio.com" className="inline-flex items-center gap-2 text-lg font-bold text-foreground hover:text-accent transition-colors">
                  <EnvelopeSimple weight="bold" size={24} />
                  admin@nomstudio.com
                </a>
              </div>
            </div>
          </div>

          {status === 'success' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background border border-border rounded-2xl">
              <CheckCircle weight="fill" size={64} className="text-accent mb-6" />
              <h3 className="text-2xl font-bold tracking-tight mb-3 text-foreground">Message Sent!</h3>
              <p className="font-medium text-muted mb-8 leading-relaxed">Thanks for reaching out. Our team will get back to you shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="py-3 px-8 bg-accent text-white rounded-full font-bold hover:bg-accent/90 transition-all"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 space-y-5">
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block tracking-wide">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl p-3.5 focus:outline-none focus:border-accent text-foreground" 
                  placeholder="Nama Kamu" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block tracking-wide">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl p-3.5 focus:outline-none focus:border-accent text-foreground" 
                  placeholder="email@kamu.com" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block tracking-wide">Project Details</label>
                <textarea 
                  required
                  value={formData.project_details}
                  onChange={(e) => setFormData({...formData, project_details: e.target.value})}
                  className="w-full h-32 resize-none bg-background border border-border rounded-xl p-3.5 focus:outline-none focus:border-accent text-foreground" 
                  placeholder="Ceritain sedikit tentang project lo..."
                ></textarea>
              </div>
              {status === 'error' && (
                <p className="text-red-400 font-bold text-sm bg-red-900/20 p-3 rounded-xl border border-red-800">Oops! Something went wrong. Please try again.</p>
              )}
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 mt-2 flex items-center justify-center gap-2 bg-accent text-white rounded-2xl font-bold hover:bg-accent/90 transition-all duration-300 disabled:opacity-50"
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
