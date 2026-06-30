'use client';

import { Sparkle } from '@phosphor-icons/react/dist/ssr';

export function NeoAdSlot({ format = "horizontal" }: { format?: "horizontal" | "rectangle" }) {
  return (
    <div className={`relative w-full bg-[#FFCC00]/20 border-4 border-black rounded-3xl shadow-[6px_6px_0_0_#000] p-4 flex flex-col items-center justify-center my-12 overflow-hidden ${format === 'rectangle' ? 'aspect-square max-w-[320px] mx-auto' : 'min-h-[140px]'}`}>
      <div className="absolute top-0 left-6 bg-black text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-b-lg">
        Sponsor / Traktir Server
      </div>
      
      <div className="flex flex-col items-center justify-center h-full pt-4">
        <div className="flex items-center gap-2 text-black/50 mb-2">
          <Sparkle size={24} weight="fill" className="animate-pulse text-[#FF9500]" />
          <span className="font-black text-sm uppercase tracking-widest">Space Iklan Tersedia</span>
        </div>
        <p className="text-[10px] font-bold text-black/60 text-center max-w-xs leading-relaxed">
          Slot ini siap dipasang script Google AdSense. Desain neo-brutalist bikin iklan terlihat native & anti di-skip!
        </p>
      </div>
      
      {/* 
        NOTE FOR ADSENSE IMPLEMENTATION:
        Replace the placeholder above with:
        <ins className="adsbygoogle"
             style={{ display: "block" }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      */}
    </div>
  );
}
