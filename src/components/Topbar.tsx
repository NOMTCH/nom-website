'use client';

import { DownloadSimple, Tag } from '@phosphor-icons/react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function Topbar({ onExport }: { onExport?: () => void }) {
  const [promo, setPromo] = useState<{ title: string; code: string | null } | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const { data, error } = await supabase
          .from('promos')
          .select('title, code')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.warn('Promo fetch info:', error.message);
          return;
        }
        if (data) setPromo(data);
      } catch (err) {
        // silent catch for network errors so it doesn't crash
      }
    };
    fetchPromo();
  }, []);

  return (
    <>
      {/* Promo Banner */}
      {promo && (
        <div className="bg-accent text-black font-black uppercase text-xs sm:text-sm py-2 px-4 border-b border-border shadow-sm overflow-hidden whitespace-nowrap flex items-center">
          <div className="animate-[marquee_20s_linear_infinite] inline-block w-full text-center">
            <span className="inline-flex items-center gap-2">
              <Tag weight="fill" size={16} /> 
              {promo.title} 
              {promo.code && <span className="bg-white px-2 py-0.5 border border-border rounded-xl ml-2">CODE: {promo.code}</span>}
            </span>
          </div>
        </div>
      )}

      {/* Main Topbar */}
      <header className="h-[70px] border-b border-border shadow-sm flex items-center justify-between px-6 bg-surface z-50 relative">
        <Link href="/" className="flex items-center gap-3 bg-accent text-white px-4 py-1.5 md:py-2 border border-accent rounded-xl hover:-translate-y-0.5 transition-all">
          <img src="/assets/logo/logo.svg" alt="NOMSTD STUDIO" className="h-6 md:h-8 w-auto filter contrast-200" />
          <div className="h-6 w-1 bg-foreground hidden sm:block" />
          <span className="font-black text-lg md:text-xl tracking-tight uppercase text-foreground hidden sm:block mt-0.5">CV Gen</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Desktop Version */}
          <div className="hidden md:flex items-center gap-3 bg-white px-4 py-1.5 border border-border rounded-xl shadow-sm">
            <span className="text-[11px] font-black text-black uppercase tracking-widest">
              Semoga Lolos HRD! 🙏
            </span>
            <a 
              href="https://saweria.co/iammonoz" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 rounded-lg font-bold text-xs uppercase hover:bg-amber-500 transition-colors"
            >
              <span>☕</span> Traktir Kopi
            </a>
          </div>
          
          {/* Mobile Version: Lolos HRD + Coffee Button */}
          <a 
            href="https://saweria.co/iammonoz" 
            target="_blank" 
            rel="noreferrer" 
            className="flex md:hidden flex-col items-center justify-center px-2 py-1 bg-white border border-border rounded-xl shadow-none hover:-translate-y-0.5 hover:shadow-[1px_1px_0_0_#0F0F0F] transition-all"
            title="Traktir Kopi"
          >
            <span className="text-[7px] font-black text-black uppercase tracking-widest whitespace-nowrap mb-0.5">Semoga Lolos HRD! 🙏</span>
            <span className="text-[9px] font-black text-black bg-yellow-400 px-2 py-0.5 border border-foreground uppercase whitespace-nowrap">☕ Traktir Kopi</span>
          </a>

          <button onClick={onExport} className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-[#FF3B30] rounded-xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all font-bold text-sm md:text-base text-white uppercase tracking-widest">
            <DownloadSimple weight="bold" size={20} />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>
    </>
  );
}
