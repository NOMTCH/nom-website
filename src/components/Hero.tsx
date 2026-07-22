'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export function Hero() {
  const [activeTab, setActiveTab] = useState<'code' | 'design'>('code');

  return (
    <section className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-background text-foreground pt-20 pb-16 md:pt-24 md:pb-24">
      
      {/* Modern Interactive Background: Grid + Glowing Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Grid Overlay with mask */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(to right, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 50%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 95%)'
          }}
        />
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-accent/18 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Main Hero Container - 2 Column Split Grid Layout */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-7xl pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Text, Title, Badge & CTA (Left Aligned) */}
          <div className="lg:col-span-6 text-left flex flex-col items-start">
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-surface shadow-sm mb-6 text-xs md:text-sm font-semibold text-foreground"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-muted font-medium">Studio Kreatif &amp; IT Engineering</span>
              <span className="text-border">/</span>
              <span className="text-accent font-semibold">Indonesia &amp; Worldwide</span>
              <span className="sr-only">Jasa Web Development, Desain Grafis, Studio Foto &amp; Servis IT di Cianjur, Jawa Barat, Indonesia</span>
            </motion.div>

            {/* Main Title - HIGH IMPACT & DIRECT */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.08] text-foreground mb-6 uppercase"
            >
              Build Better. <br />
              Look Better. <br />
              <span className="text-accent">
                Grow Faster.
              </span>
            </motion.h1>

            {/* Subtitle Left Aligned */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted font-normal leading-relaxed mb-8 max-w-xl"
            >
              Modern websites, powerful software, AI automation, and visual identities designed to move your business forward.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-6"
            >
              <Link 
                href="/portfolio" 
                className="px-7 py-3.5 bg-accent text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:bg-accent/90 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                View Portfolio
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </Link>
              <a 
                href="#tools" 
                className="px-7 py-3.5 bg-surface text-foreground border border-border shadow-sm rounded-xl font-semibold text-sm sm:text-base hover:border-accent hover:text-accent transition-all duration-200 flex items-center justify-center gap-2"
              >
                Free Web Tools
              </a>
            </motion.div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted pt-3 border-t border-border w-full">
              <span className="flex items-center gap-1.5 text-foreground">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                Next.js &amp; Laravel Full-Stack
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                High Performance &amp; SEO
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                Creative Visual Suite
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: Solid Surface Workspace Card */}
          <div className="lg:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full bg-surface border border-border shadow-xl rounded-2xl md:rounded-3xl p-4 md:p-5 text-left relative overflow-hidden"
            >
              {/* Window Bar & Tab Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-xs text-muted font-mono ml-2 hidden sm:inline">nomstd-core.config.ts</span>
                </div>

                {/* Workspace Tabs */}
                <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border self-end sm:self-auto">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'code' 
                        ? 'bg-accent text-white shadow-sm' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    &lt;/&gt; Web Dev Engine
                  </button>
                  <button
                    onClick={() => setActiveTab('design')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'design' 
                        ? 'bg-accent text-white shadow-sm' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    ✨ Creative Canvas
                  </button>
                </div>
              </div>

              {/* Code / Design Editor Area */}
              {activeTab === 'code' ? (
                <motion.div 
                  key="code-panel"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background text-foreground rounded-xl p-4 md:p-5 font-mono text-xs md:text-sm overflow-x-auto shadow-inner border border-border"
                >
                  <div className="flex items-center justify-between text-muted text-xs mb-3 border-b border-border pb-2">
                    <span className="text-foreground font-semibold">src/app/page.tsx</span>
                    <span className="text-accent flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Compiled 100%
                    </span>
                  </div>
                  <pre className="leading-relaxed text-foreground">
                    <code>
                      <span className="text-accent">import</span> &#123; <span className="text-sky-300">NextApp</span>, <span className="text-sky-300">LaravelEngine</span> &#125; <span className="text-accent">from</span> <span className="text-amber-300">&apos;@/nomstd/core&apos;</span>;<br /><br />
                      <span className="text-accent">export default function</span> <span className="text-yellow-300">NOMSTDHub</span>() &#123;<br />
                      &nbsp;&nbsp;<span className="text-accent">return</span> (<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-sky-400">NextApp</span> <span className="text-muted">theme</span>=<span className="text-amber-300">&quot;Emerald Charcoal&quot;</span> <span className="text-muted">accent</span>=<span className="text-amber-300">&quot;#4E9F3D&quot;</span>&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-sky-400">LaravelEngine</span> <span className="text-muted">stack</span>=<span className="text-amber-300">&quot;Full-Stack&quot;</span> /&gt;<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-sky-400">NextApp</span>&gt;<br />
                      &nbsp;&nbsp;);<br />
                      &#125;
                    </code>
                  </pre>
                </motion.div>
              ) : (
                <motion.div 
                  key="design-panel"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 text-foreground"
                >
                  <div className="flex items-center justify-between text-xs text-muted mb-3.5 border-b border-border pb-2">
                    <span className="font-semibold text-foreground">Creative Visual Studio Suite</span>
                    <span className="bg-accent text-white font-bold px-2.5 py-0.5 rounded-md">Design &amp; Motion</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-surface rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
                      <div className="w-9 h-9 rounded-lg bg-accent text-white font-black flex items-center justify-center text-xs mb-1.5 shadow-sm">Ai</div>
                      <span className="font-bold text-xs text-foreground">Graphic Design</span>
                      <span className="text-[10px] text-muted">Branding &amp; Vector</span>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
                      <div className="w-9 h-9 rounded-lg bg-accent text-white font-black flex items-center justify-center text-xs mb-1.5 shadow-sm">Ps</div>
                      <span className="font-bold text-xs text-foreground">Photography</span>
                      <span className="text-[10px] text-muted">Retouch &amp; Studio</span>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
                      <div className="w-9 h-9 rounded-lg bg-accent text-white font-black flex items-center justify-center text-sm mb-1.5 shadow-sm">Pr</div>
                      <span className="font-bold text-xs text-foreground">Videography</span>
                      <span className="text-[10px] text-muted">Cinematic Edit</span>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
                      <div className="w-9 h-9 rounded-lg bg-accent text-white font-black flex items-center justify-center text-xs mb-1.5 shadow-sm">Ae</div>
                      <span className="font-bold text-xs text-foreground">Motion Graphics</span>
                      <span className="text-[10px] text-muted">Visual Effects</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bottom Tech Bar */}
              <div className="mt-3.5 pt-2.5 border-t border-border flex flex-wrap items-center justify-start gap-1.5 text-xs">
                <span className="text-muted font-medium text-[11px] mr-1">Stack:</span>
                {['Next.js 16', 'Laravel', 'React 19', 'PHP', 'TypeScript', 'Tailwind', 'PostgreSQL / MySQL', 'Figma', 'Photoshop'].map(tech => (
                  <span key={tech} className="px-2 py-0.5 bg-background hover:bg-accent hover:text-white border border-border rounded-md text-foreground font-semibold text-[10px] transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Modern Desktop Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="hidden md:flex flex-col items-center justify-center absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer group"
        onClick={() => {
          const servicesSection = document.getElementById('services');
          if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }
        }}
      >
        <div className="flex items-center gap-3 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-border/80 shadow-lg group-hover:border-accent group-hover:shadow-accent/10 transition-all duration-300">
          <div className="w-4 h-7 border-2 border-muted group-hover:border-accent rounded-full flex items-start justify-center p-1 transition-colors">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-accent"
            />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
            Scroll to Explore
          </span>
          <svg className="w-3.5 h-3.5 text-muted group-hover:text-accent group-hover:translate-y-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
