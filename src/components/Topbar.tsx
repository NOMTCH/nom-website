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
        <Link href="/" className="flex items-center hover:-translate-y-0.5 transition-transform">
          <img src="/assets/logo/logo.svg" alt="NOMSTD STUDIO" className="h-8 md:h-10 w-auto" />
        </Link>
        
        <div className="flex items-center gap-4">
          <button onClick={onExport} className="flex items-center gap-2 px-6 py-2.5 bg-accent border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all font-bold text-sm text-black uppercase tracking-wider">
            <DownloadSimple weight="bold" size={18} />
            Export PDF
          </button>
        </div>
      </header>
    </>
  );
}
