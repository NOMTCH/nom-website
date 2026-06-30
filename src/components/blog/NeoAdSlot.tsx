'use client';

import { useEffect } from 'react';

export function NeoAdSlot({ format = "horizontal" }: { format?: "horizontal" | "rectangle" }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error', err);
    }
  }, []);

  return (
    <div className={`relative w-full bg-[#FFCC00]/10 border-4 border-black rounded-3xl shadow-[6px_6px_0_0_#000] p-4 flex flex-col items-center justify-center my-12 overflow-hidden ${format === 'rectangle' ? 'aspect-square max-w-[320px] mx-auto' : 'min-h-[140px]'}`}>
      <div className="absolute top-0 left-6 z-10 bg-black text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-b-lg">
        Sponsor / Traktir Server
      </div>
      
      <div className="w-full h-full relative z-0 flex items-center justify-center overflow-hidden pt-4 min-h-[100px]">
        <ins className="adsbygoogle w-full"
             style={{ display: "block" }}
             data-ad-client="ca-pub-1093659666783969"
             data-ad-slot="1234567890" /* Placeholder: Update this with your actual Ad Unit ID if using Manual Ads */
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
