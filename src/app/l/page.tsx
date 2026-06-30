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
    <div className={`min-h-screen flex flex-col items-center py-16 px-4 md:px-6 relative overflow-hidden ${
      theme === 'dark' ? 'bg-black text-white' : 
      theme === 'brutal-red' ? 'bg-[#FF6138] text-black' : 
      theme === 'brutal-blue' ? 'bg-[#00D8FF] text-black' : 
      theme === 'brutal-green' ? 'bg-black text-[#00FF00]' : 
      theme === 'brutal-cyberpunk' ? 'bg-[#FCE100] text-black' : 
      'bg-surface text-black'
    }`}>
      {/* Pattern Background Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        theme === 'dark' ? 'opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]' : 
        theme === 'brutal-green' ? 'opacity-20 bg-[radial-gradient(#00FF00_2px,transparent_2px)] [background-size:24px_24px]' : 
        theme === 'brutal-cyberpunk' ? 'opacity-40 bg-[radial-gradient(#FF00FF_2px,transparent_2px)] [background-size:24px_24px]' : 
        'opacity-[0.05] bg-[radial-gradient(#000000_2px,transparent_2px)] [background-size:24px_24px]'
      }`}></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-32 h-32 rounded-full border-[6px] overflow-hidden mb-6 bg-white flex items-center justify-center hover:scale-105 transition-transform duration-300 ${
            theme === 'dark' ? 'shadow-[8px_8px_0_0_#FFD700] border-[#FFD700]' : 
            theme === 'brutal-green' ? 'shadow-[8px_8px_0_0_#00FF00] border-[#00FF00]' : 
            theme === 'brutal-cyberpunk' ? 'shadow-[8px_8px_0_0_#00FFFF] border-[#FF00FF]' : 
            'shadow-[8px_8px_0_0_#0F0F0F] border-foreground'
          }`}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500 font-black text-5xl">
                {name ? name.charAt(0).toUpperCase() : '?'}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight">{name}</h1>
          <p className={`text-base md:text-lg font-bold mt-2 max-w-sm ${
            theme === 'dark' ? 'text-gray-300' : 
            theme === 'brutal-green' ? 'text-[#00FF00]' : 
            'text-gray-800'
          }`}>
            {bio}
          </p>
        </div>

        {/* Links List */}
        <div className="space-y-5">
          {links && links.map((link, idx) => (
            link.t && link.u && (
              <a 
                key={idx}
                href={link.u.startsWith('http') ? link.u : `https://${link.u}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between w-full py-4 px-6 text-left border-4 font-black uppercase tracking-widest text-sm md:text-base transition-all hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 ${
                  theme === 'dark' ? 'bg-white text-black shadow-[6px_6px_0_0_#FFD700] border-foreground hover:shadow-[10px_10px_0_0_#FFD700]' : 
                  theme === 'brutal-green' ? 'bg-black text-[#00FF00] border-[#00FF00] shadow-[6px_6px_0_0_#00FF00] hover:shadow-[10px_10px_0_0_#00FF00]' : 
                  theme === 'brutal-cyberpunk' ? 'bg-[#FF00FF] text-white border-black shadow-[6px_6px_0_0_#00FFFF] hover:shadow-[10px_10px_0_0_#00FFFF]' : 
                  theme === 'brutal-blue' ? 'bg-white text-black border-black shadow-[6px_6px_0_0_#0F0F0F] hover:shadow-[10px_10px_0_0_#0F0F0F]' : 
                  'bg-white text-black border-foreground shadow-[6px_6px_0_0_#0F0F0F] hover:shadow-[10px_10px_0_0_#0F0F0F] active:shadow-none'
                }`}
              >
                <span className="flex items-center gap-4 overflow-hidden">
                  {getIconForUrl(link.u)}
                  <span className="truncate">{link.t}</span>
                </span>
                <ArrowUpRight size={20} weight="bold" className="flex-shrink-0 ml-2" />
              </a>
            )
          ))}
        </div>

        {/* Branding Footer */}
        <div className="mt-20 flex justify-center">
          <a 
            href="/tools/link-builder" 
            className={`inline-flex flex-col items-center hover:scale-105 transition-transform ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 
              theme === 'brutal-green' ? 'text-[#00FF00] opacity-70 hover:opacity-100' : 
              'text-gray-600 hover:text-black'
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest mb-1">Built with</span>
            <span className={`px-2 py-1 font-black text-xs uppercase tracking-widest border-2 border-current`}>
              NOMSTD
            </span>
          </a>
        </div>

        {/* AdSense Placement at the bottom of dynamic links */}
        <div className={`mt-10 mx-auto w-full max-w-[300px] border-2 border-dashed p-3 text-center text-[10px] font-bold relative rounded-xl ${
          theme === 'dark' ? 'border-zinc-800 text-zinc-600 bg-zinc-950/50' :
          theme === 'brutal-green' ? 'border-[#00FF00]/30 text-[#00FF00]/50 bg-black/40' :
          theme === 'brutal-cyberpunk' ? 'border-black/30 text-black/50 bg-[#FCE100]' :
          'border-gray-200 text-gray-400 bg-white/50'
        }`}>
          <span className={`absolute -top-2.5 left-4 px-1.5 py-0.5 text-[8px] uppercase tracking-widest rounded border ${
            theme === 'dark' ? 'bg-black text-zinc-600 border-zinc-800' :
            theme === 'brutal-green' ? 'bg-black text-[#00FF00]/50 border-[#00FF00]/30' :
            'bg-white text-gray-400 border-gray-200'
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
