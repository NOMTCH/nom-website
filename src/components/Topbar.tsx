'use client';

import { DownloadSimple, Tag } from '@phosphor-icons/react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function Topbar({ onExport }: { onExport?: () => void }) {
  const [promo, setPromo] = useState<{ title: string; code: string | null } | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      const { data } = await supabase
        .from('promos')
        .select('title, code')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setPromo(data);
    };
    fetchPromo();
  }, []);

  return (
    <>
      {/* Promo Banner */}
      {promo && (
        <div className="bg-accent text-black font-black uppercase text-xs sm:text-sm py-2 px-4 border-b-4 border-foreground overflow-hidden whitespace-nowrap flex items-center">
          <div className="animate-[marquee_20s_linear_infinite] inline-block w-full text-center">
            <span className="inline-flex items-center gap-2">
              <Tag weight="fill" size={16} /> 
              {promo.title} 
              {promo.code && <span className="bg-white px-2 py-0.5 border-2 border-foreground ml-2">CODE: {promo.code}</span>}
            </span>
          </div>
        </div>
      )}

      {/* Main Topbar */}
      <header className="h-[70px] border-b-4 border-foreground flex items-center justify-between px-6 bg-surface z-50 shadow-[0_4px_0_0_#0F0F0F] relative">
        <Link href="/" className="flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
          <img src="/assets/logo/logo.svg" alt="NOMSTD STUDIO" className="h-8 md:h-10 w-auto" />
          <div className="h-6 w-1 bg-foreground hidden sm:block" />
          <span className="font-black text-xl tracking-tight uppercase text-foreground hidden sm:block mt-1">CV Generator</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:flex items-center gap-3 bg-white px-4 py-1.5 border-2 border-foreground shadow-[2px_2px_0_0_#0F0F0F]">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
              Semoga Lolos HRD! 🙏 Kalo berguna...
            </span>
            <a 
              href="https://trakteer.id/nomstd" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400 border border-foreground hover:bg-yellow-300 transition-colors font-black text-[10px] text-black uppercase"
            >
              <span>☕</span> Traktir Kopi
            </a>
          </div>
          
          {/* Mobile Coffee Button (Icon Only) */}
          <a 
            href="https://trakteer.id/nomstd" 
            target="_blank" 
            rel="noreferrer" 
            className="flex lg:hidden items-center justify-center w-10 h-10 bg-yellow-400 border-2 border-foreground shadow-[2px_2px_0_0_#0F0F0F] hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#0F0F0F] transition-all"
            title="Traktir Kopi"
          >
            ☕
          </a>

          <button onClick={onExport} className="flex items-center gap-2 px-6 py-2 bg-accent border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all font-bold text-sm text-black uppercase tracking-wider">
            <DownloadSimple weight="bold" size={18} />
            Export PDF
          </button>
        </div>
      </header>
    </>
  );
}
