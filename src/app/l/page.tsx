"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { InstagramLogo, TiktokLogo, TwitterLogo, YoutubeLogo, FacebookLogo, LinkedinLogo, GithubLogo, ShoppingBag, ShoppingCart, Globe, ArrowUpRight } from "@phosphor-icons/react";

type LinkItem = {
  t: string; // title
  u: string; // url
};

type LinkData = {
  n: string; // name
  b: string; // bio
  a: string; // avatar
  l: LinkItem[]; // links
  th: string; // theme
};

function getIconForUrl(url: string) {
  if (!url) return <Globe size={24} weight="bold" />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('instagram.com')) return <InstagramLogo size={24} weight="bold" />;
  if (lowerUrl.includes('tiktok.com')) return <TiktokLogo size={24} weight="bold" />;
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return <TwitterLogo size={24} weight="bold" />;
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return <YoutubeLogo size={24} weight="bold" />;
  if (lowerUrl.includes('facebook.com')) return <FacebookLogo size={24} weight="bold" />;
  if (lowerUrl.includes('linkedin.com')) return <LinkedinLogo size={24} weight="bold" />;
  if (lowerUrl.includes('github.com')) return <GithubLogo size={24} weight="bold" />;
  if (lowerUrl.includes('shopee.')) return <ShoppingBag size={24} weight="bold" />;
  if (lowerUrl.includes('tokopedia.com')) return <ShoppingCart size={24} weight="bold" />;
  return <Globe size={24} weight="bold" />;
}

function LinkViewer() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<LinkData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const jsonString = decodeURIComponent(atob(dataParam));
        const parsedData = JSON.parse(jsonString) as LinkData;
        setData(parsedData);
      } catch (err) {
        console.error("Failed to parse link data", err);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-display font-black uppercase mb-4">Invalid Link</h1>
        <p className="text-muted font-bold mb-8">This link seems broken or doesn't contain any data.</p>
        <a href="/tools/link-builder" className="px-6 py-3 bg-accent text-white font-black uppercase tracking-widest border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:bg-surface hover:text-foreground transition-colors">
          Create Your Own
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-foreground border-t-accent rounded-full"></div>
      </div>
    );
  }

  const { n: name, b: bio, a: avatar, l: links, th: theme } = data;

  return (
    <div className={`min-h-screen flex flex-col items-center py-16 px-4 md:px-6 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-50' : 
      theme === 'brutal-red' ? 'bg-rose-950 text-rose-100' : 
      theme === 'brutal-blue' ? 'bg-slate-900 text-sky-100' : 
      theme === 'brutal-green' ? 'bg-emerald-950 text-emerald-100' : 
      theme === 'brutal-cyberpunk' ? 'bg-indigo-950 text-indigo-50' : 
      'bg-neutral-50 text-neutral-900'
    }`}>
      {/* Pattern Background Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        theme === 'dark' ? 'opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]' : 
        theme === 'brutal-green' ? 'opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]' : 
        theme === 'brutal-cyberpunk' ? 'opacity-15 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:20px_20px]' : 
        'opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]'
      }`}></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-32 h-32 rounded-full border-4 overflow-hidden mb-6 bg-surface flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg ${
            theme === 'dark' ? 'border-zinc-800' : 
            theme === 'brutal-red' ? 'border-rose-800' : 
            theme === 'brutal-green' ? 'border-emerald-800' : 
            theme === 'brutal-cyberpunk' ? 'border-indigo-800' : 
            theme === 'brutal-blue' ? 'border-sky-800/50' :
            'border-neutral-200'
          }`}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className={`font-bold text-5xl ${theme === 'brutal-yellow' || !theme ? 'text-neutral-400' : 'text-foreground/40'}`}>
                {name ? name.charAt(0).toUpperCase() : '?'}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <p className={`text-sm font-medium mt-3 max-w-sm px-4 ${
            theme === 'dark' ? 'text-zinc-400' : 
            theme === 'brutal-red' ? 'text-rose-300' : 
            theme === 'brutal-green' ? 'text-emerald-300' : 
            theme === 'brutal-cyberpunk' ? 'text-indigo-300' : 
            theme === 'brutal-blue' ? 'text-sky-300' : 
            'text-neutral-500'
          }`}>
            {bio}
          </p>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {links && links.map((link, idx) => (
            link.t && link.u && (
              <a 
                key={idx}
                href={link.u.startsWith('http') ? link.u : `https://${link.u}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between w-full py-4 px-6 text-left border font-semibold text-sm transition-all hover:-translate-y-0.5 rounded-xl shadow-sm hover:shadow-md ${
                  theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border-zinc-800' : 
                  theme === 'brutal-red' ? 'bg-rose-900/30 hover:bg-rose-900/50 text-rose-100 border-rose-800/50 backdrop-blur-md' : 
                  theme === 'brutal-green' ? 'bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-100 border-emerald-800/50 backdrop-blur-md' : 
                  theme === 'brutal-cyberpunk' ? 'bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-100 border-indigo-800/30 backdrop-blur-md' : 
                  theme === 'brutal-blue' ? 'bg-slate-800/40 hover:bg-slate-800/60 text-sky-100 border-slate-700/50 backdrop-blur-md' : 
                  'bg-white hover:bg-neutral-100/50 text-neutral-800 border-neutral-200'
                }`}
              >
                <span className="flex items-center gap-4 overflow-hidden">
                  {getIconForUrl(link.u)}
                  <span className="truncate">{link.t}</span>
                </span>
                <ArrowUpRight size={18} weight="bold" className="flex-shrink-0 ml-2 opacity-60" />
              </a>
            )
          ))}
        </div>

        {/* Branding Footer */}
        <div className="mt-20 flex justify-center">
          <a 
            href="/tools/link-builder" 
            className={`inline-flex flex-col items-center hover:scale-105 transition-transform ${
              theme === 'dark' ? 'text-zinc-500 hover:text-zinc-300' : 
              theme === 'brutal-red' ? 'text-rose-400 hover:text-rose-200' : 
              theme === 'brutal-green' ? 'text-emerald-400 hover:text-emerald-200' : 
              theme === 'brutal-cyberpunk' ? 'text-indigo-400 hover:text-indigo-200' : 
              theme === 'brutal-blue' ? 'text-sky-400 hover:text-sky-200' : 
              'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-60">Built with</span>
            <span className="px-3 py-1 font-bold text-xs uppercase tracking-widest border border-current rounded-md">
              NOMSTD
            </span>
          </a>
        </div>

        {/* AdSense Placement at the bottom of dynamic links */}
        <div className={`mt-10 mx-auto w-full max-w-[300px] border border-dashed p-3 text-center text-[10px] font-semibold relative rounded-xl ${
          theme === 'dark' ? 'border-zinc-800 text-zinc-600 bg-zinc-950/50' :
          theme === 'brutal-red' ? 'border-rose-900/30 text-rose-400/50 bg-rose-950/40' :
          theme === 'brutal-green' ? 'border-emerald-800/30 text-emerald-400/50 bg-emerald-950/40' :
          theme === 'brutal-cyberpunk' ? 'border-indigo-800/30 text-indigo-400/50 bg-indigo-950/40' :
          theme === 'brutal-blue' ? 'border-slate-800/30 text-sky-400/50 bg-slate-900/40' :
          'border-neutral-200 text-neutral-400 bg-white/50'
        }`}>
          <span className={`absolute -top-2.5 left-4 px-1.5 py-0.5 text-[8px] uppercase tracking-widest rounded border ${
            theme === 'dark' ? 'bg-zinc-950 text-zinc-600 border-zinc-800' :
            theme === 'brutal-red' ? 'bg-rose-950 text-rose-400/50 border-rose-900/30' :
            theme === 'brutal-green' ? 'bg-emerald-950 text-emerald-400/50 border-emerald-800/30' :
            theme === 'brutal-cyberpunk' ? 'bg-indigo-950 text-indigo-400/50 border-indigo-800/30' :
            theme === 'brutal-blue' ? 'bg-slate-900 text-sky-400/50 border-slate-800/30' :
            'bg-neutral-50 text-neutral-400 border-neutral-200'
          }`}>Ads</span>
          <span>Space Iklan Sponsor (NOMSTD Premium)</span>
        </div>

      </div>
    </div>
  );
}

export default function LinkViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-foreground border-t-accent rounded-full"></div>
      </div>
    }>
      <LinkViewer />
    </Suspense>
  );
}
