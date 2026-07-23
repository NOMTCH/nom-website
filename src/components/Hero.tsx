'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const CODE_SNIPPETS = [
  {
    filename: 'src/app/managed-dev/page.tsx',
    content: `import { ManagedDevTeam, SupabaseCloud } from '@nomstd/core';

export default function ClientProject() {
  const team = useManagedTeam({
    engineers: "Full-Stack Senior",
    infrastructure: "IDCloudHost VPS",
    status: "Active & Scalable"
  });

  return <ManagedDevTeam config={team} />;
}`
  },
  {
    filename: 'deploy/vps-automation.ts',
    content: `// Automated IDCloudHost Deployment Engine
const vps = await initIDCloudHostVPS({
  cores: 4, ram: "8GB", nvme: "160GB"
});

await deployDockerContainer(vps, "nom-website");
console.log("🟢 STATUS: ONLINE [103.150.191.89]");`
  },
  {
    filename: 'lib/supabase/realtime.ts',
    content: `// Supabase Managed Auth & Realtime Cluster
const { data, error } = await supabase
  .from('deployments')
  .select('*')
  .eq('status', 'running');

toast.success('Live Monitoring Active!');`
  }
];

export function Hero() {
  const [activeTab, setActiveTab] = useState<'code' | 'vps' | 'design'>('code');
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Character-by-character real-time code typewriter
  useEffect(() => {
    if (activeTab !== 'code') return;

    let timer: NodeJS.Timeout;
    const currentFullText = CODE_SNIPPETS[snippetIndex].content;

    if (isTyping) {
      if (displayText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 30);
      } else {
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 3500);
      }
    } else {
      setSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
      setDisplayText('');
      setIsTyping(true);
    }

    return () => clearTimeout(timer);
  }, [displayText, isTyping, snippetIndex, activeTab]);

  const codeScrollRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeScrollRef.current) {
      codeScrollRef.current.scrollTop = codeScrollRef.current.scrollHeight;
    }
  }, [displayText]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background text-foreground py-12 md:py-16 lg:py-20">
      
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
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-10 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Text, Title, Badge & CTA (Left Aligned) */}
          <div className="lg:col-span-6 text-left flex flex-col items-start">
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border bg-surface shadow-sm mb-4 md:mb-6 text-xs md:text-sm font-semibold text-foreground"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-muted font-medium">Digital Tech &amp; Design Studio</span>
              <span className="text-border">/</span>
              <span className="text-accent font-semibold">Managed Engineering Team</span>
              <span className="sr-only">Managed Developer Studio &amp; IT Infrastructure Services</span>
            </motion.div>

            {/* Main Title - ULTRA CLEAN SINGLE HEADLINE */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-black tracking-tight leading-[1.08] text-foreground mb-4 md:mb-6 uppercase"
            >
              YOUR DEV <br />
              <span className="text-accent">
                TEAM.
              </span>
            </motion.h1>

            {/* Subtitle Left Aligned */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted font-normal leading-relaxed mb-8 max-w-xl"
            >
              Focus on scaling your brand. We design, build, and manage your full-stack web applications, UI/UX, and cloud server infrastructure.
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
                className="px-7 py-3.5 bg-accent text-white rounded-xl font-bold text-sm sm:text-base shadow-md hover:bg-accent/90 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Lihat Hasil Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7"/>
                </svg>
              </Link>
              <a 
                href="#contact" 
                className="px-7 py-3.5 bg-surface text-foreground border border-border shadow-sm rounded-xl font-semibold text-sm sm:text-base hover:border-accent hover:text-accent transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Konsultasi Project
              </a>
            </motion.div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted pt-3 border-t border-border w-full">
              <span className="flex items-center gap-1.5 text-foreground">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                Fully Managed Dev &amp; VPS
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                Dedicated Full-Stack Engineers
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                Full Maintenance &amp; SLA
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Animated IDE Workspace Card */}
          <div className="lg:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.3 },
                y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
              }}
              className="w-full bg-surface border border-border shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-5 text-left relative overflow-hidden group hover:border-accent/50 transition-colors"
            >
              {/* Top Glow Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-emerald-400 to-sky-400 opacity-80" />

              {/* Window Bar & Tab Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-3 mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-accent/80 shadow-sm" />
                  <span className="text-xs text-muted font-mono ml-2 hidden sm:inline">nomstd-core.engine.ts</span>
                </div>

                {/* Workspace Tabs */}
                <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border self-end sm:self-auto shadow-inner">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'code' 
                        ? 'bg-accent text-white shadow-md' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    &lt;/&gt; Code Engine
                  </button>
                  <button
                    onClick={() => setActiveTab('vps')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'vps' 
                        ? 'bg-accent text-white shadow-md' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    ⚡ VPS &amp; Infra
                  </button>
                  <button
                    onClick={() => setActiveTab('design')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'design' 
                        ? 'bg-accent text-white shadow-md' 
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    ✨ Design
                  </button>
                </div>
              </div>

              {/* TAB 1: CODE ENGINE WITH LIVE TYPEWRITER */}
              {activeTab === 'code' && (
                <motion.div 
                  key="code-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background text-foreground rounded-xl p-4 md:p-5 font-mono text-xs md:text-sm shadow-inner border border-border/80 relative h-[250px] max-h-[250px] overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-muted text-xs mb-3 border-b border-border/80 pb-2 shrink-0">
                    <span className="text-foreground font-semibold flex items-center gap-2">
                      <span className="text-sky-400">⚡</span> {CODE_SNIPPETS[snippetIndex].filename}
                    </span>
                    <span className="text-accent flex items-center gap-1.5 font-bold text-[11px] bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Live Coding
                    </span>
                  </div>
                  <pre ref={codeScrollRef} className="leading-relaxed text-foreground whitespace-pre-wrap font-mono overflow-y-auto custom-scrollbar flex-1 max-h-[175px]">
                    <code>
                      {displayText}
                      <span className="inline-block w-2 h-4 bg-accent ml-1 align-middle animate-pulse shadow-[0_0_8px_#4E9F3D]" />
                    </code>
                  </pre>
                </motion.div>
              )}

              {/* TAB 2: VPS & INFRASTRUCTURE TERMINAL */}
              {activeTab === 'vps' && (
                <motion.div 
                  key="vps-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/90 text-emerald-400 rounded-xl p-4 md:p-5 font-mono text-xs md:text-sm shadow-inner border border-emerald-500/30 space-y-3"
                >
                  {/* VPS Provider & Tech Logos Header */}
                  <div className="flex items-center justify-between text-xs border-b border-emerald-500/20 pb-2 text-muted">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                      <span className="text-emerald-400 font-bold">root@idcloudhost-vps-id01:~</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold">
                        🇮🇩 IDCloudHost
                      </span>
                      <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] px-2 py-0.5 rounded font-bold">
                        🐳 Docker
                      </span>
                    </div>
                  </div>

                  {/* Realtime Resource Usage Meters */}
                  <div className="grid grid-cols-3 gap-2 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20 text-[11px]">
                    <div>
                      <div className="text-muted text-[10px] uppercase font-bold flex justify-between"><span>CPU</span> <span className="text-emerald-400">12%</span></div>
                      <div className="w-full bg-emerald-950 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[12%] animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="text-muted text-[10px] uppercase font-bold flex justify-between"><span>RAM</span> <span className="text-emerald-400">1.4/4GB</span></div>
                      <div className="w-full bg-emerald-950 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[35%]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-muted text-[10px] uppercase font-bold flex justify-between"><span>DISK</span> <span className="text-emerald-400">18GB/80GB</span></div>
                      <div className="w-full bg-emerald-950 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[22%]" />
                      </div>
                    </div>
                  </div>

                  {/* Terminal Log Stream */}
                  <div className="space-y-1 text-xs">
                    <p className="text-muted"><span className="text-emerald-400 font-bold">$</span> docker compose up -d --build</p>
                    <p className="text-sky-300">[+] Container Clusters Running (6/6)</p>
                    <p className="text-muted pl-2">✔ postgres-db      <span className="text-emerald-400">Started (PostgreSQL 16)</span></p>
                    <p className="text-muted pl-2">✔ supabase-auth    <span className="text-emerald-400">Started (GoTrue Engine)</span></p>
                    <p className="text-muted pl-2">✔ nextjs-app-prod  <span className="text-emerald-400">Started (Port 3000)</span></p>
                    <p className="text-emerald-300 font-bold pt-1">$ nginx -t &amp;&amp; systemctl reload nginx</p>
                    <p className="text-emerald-400 font-bold">$ echo &quot;STATUS: PRODUCTION ONLINE (103.150.191.89)&quot;</p>
                    <p className="text-accent font-bold animate-pulse">&gt; Ready for client traffic _</p>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: ADOBE ILLUSTRATOR / FIGMA VECTOR EDITOR MOCKUP */}
              {activeTab === 'design' && (
                <motion.div 
                  key="design-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-background border border-border rounded-xl p-3 md:p-4 text-foreground relative overflow-hidden select-none"
                >
                  {/* Illustrator / Figma Top Control Bar */}
                  <div className="flex items-center justify-between text-[11px] text-muted mb-2.5 pb-2 border-b border-border font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-accent/10 text-accent font-bold rounded border border-accent/20">
                        🎨 Illustrator AI
                      </span>
                      <span className="hidden sm:inline text-foreground font-semibold">Artboard 1 (1920x1080)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-bold">125% Zoom</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-accent border border-white" title="Fill Color" />
                        <span className="w-3 h-3 rounded-sm bg-transparent border-2 border-accent" title="Stroke" />
                      </div>
                    </div>
                  </div>

                  {/* Main Editor UI: Toolbar + Canvas + Layers */}
                  <div className="grid grid-cols-12 gap-2 h-44 md:h-48 relative">
                    
                    {/* Left Mini Toolbar */}
                    <div className="col-span-1 bg-surface border border-border rounded-lg p-1 flex flex-col items-center justify-between text-muted text-xs shadow-inner">
                      <div className="w-6 h-6 rounded bg-accent text-white flex items-center justify-center font-bold text-[10px] shadow-sm cursor-pointer" title="Selection Tool (V)">
                        ↖
                      </div>
                      <div className="w-6 h-6 rounded hover:bg-background flex items-center justify-center text-foreground cursor-pointer" title="Pen Tool (P)">
                        ✒️
                      </div>
                      <div className="w-6 h-6 rounded hover:bg-background flex items-center justify-center text-foreground cursor-pointer" title="Rectangle (M)">
                        ▢
                      </div>
                      <div className="w-6 h-6 rounded hover:bg-background flex items-center justify-center text-foreground cursor-pointer" title="Type Tool (T)">
                        T
                      </div>
                    </div>

                    {/* Center Canvas Artboard */}
                    <div className="col-span-8 bg-surface/60 border border-border/80 rounded-lg p-3 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                      {/* Grid background on canvas */}
                      <div 
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
                          backgroundSize: '12px 12px'
                        }}
                      />

                      {/* Vector Logo Outline / Anchor Box */}
                      <div className="relative p-4 border-2 border-dashed border-accent bg-accent/5 rounded-xl flex items-center justify-center shadow-lg group">
                        {/* Vector Anchor Points Handles */}
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-accent border border-white rounded-sm shadow" />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-accent border border-white rounded-sm shadow" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-accent border border-white rounded-sm shadow" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-accent border border-white rounded-sm shadow" />
                        
                        <div className="text-center font-display font-black text-lg md:text-xl tracking-wider text-foreground">
                          NOM<span className="text-accent">STD</span>
                          <span className="block text-[9px] font-mono text-muted uppercase tracking-widest font-normal">Vector Branding</span>
                        </div>

                        {/* Animated Selection Cursor Mouse */}
                        <motion.div 
                          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          className="absolute -bottom-4 -right-4 z-10 pointer-events-none drop-shadow-md"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E9F3D" strokeWidth="2" className="text-accent fill-accent">
                            <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                          </svg>
                        </motion.div>
                      </div>
                    </div>

                    {/* Right Layers Panel */}
                    <div className="col-span-3 bg-surface border border-border rounded-lg p-2 flex flex-col justify-between text-[10px] font-mono shadow-inner">
                      <div>
                        <div className="font-bold text-foreground mb-1.5 border-b border-border pb-1 text-[11px] flex items-center justify-between">
                          <span>Layers (3)</span>
                          <span className="text-accent">👁️</span>
                        </div>
                        <div className="space-y-1">
                          <div className="p-1 rounded bg-accent/10 text-accent font-bold flex items-center gap-1 border border-accent/20 truncate">
                            <span>✦</span> Logo Vector
                          </div>
                          <div className="p-1 rounded bg-background text-muted flex items-center gap-1 border border-border/60 truncate">
                            <span>✦</span> Text Mesh
                          </div>
                          <div className="p-1 rounded bg-background text-muted flex items-center gap-1 border border-border/60 truncate">
                            <span>✦</span> BG Canvas
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-border text-muted text-[9px] flex justify-between">
                        <span>Opacity: 100%</span>
                        <span className="text-accent font-bold">Normal</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Live Status Bar */}
              <div className="mt-3.5 pt-2.5 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3 text-[11px] text-muted font-semibold">
                  <span className="flex items-center gap-1.5 text-accent">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Live VPS: 12ms
                  </span>
                  <span className="text-foreground">⚡ Next.js 16</span>
                  <span className="text-foreground">🔒 SSL Active</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md">
                  Active Managed Engine
                </span>
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
