'use client';

import { useCVStore } from '@/store/cvStore';
import { useState } from 'react';
import { Template1 } from './templates/Template1';
import { Template2 } from './templates/Template2';
import { Template3 } from './templates/Template3';
import { Template4 } from './templates/Template4';

export function CVCanvas({ contentRef }: { contentRef?: React.Ref<HTMLDivElement> }) {
  const store = useCVStore();
  const [scale, setScale] = useState(0.7);

  // A4 height in pixels (approx)
  const a4HeightPx = 1122;

  // Automatically set smaller scale on mobile
  useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setScale(0.35);
    }
  });

  return (
    <div className="flex-1 bg-background overflow-y-auto relative flex flex-col items-center py-6 custom-scrollbar" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      <style>{`
        .page-gaps {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent calc(297mm - 6px),
            #121212 calc(297mm - 6px),
            #121212 calc(297mm + 6px)
          );
        }
        @media print {
          .page-gaps {
            background-image: none !important;
          }
        }
      `}</style>
      
      {/* Canvas Controls */}
      <div className="sticky top-0 mb-8 flex flex-wrap justify-center items-center gap-2 md:gap-4 bg-white px-4 py-2 border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] z-20 mx-4 md:mx-0">
        <span className="text-[10px] md:text-xs font-black text-black uppercase hidden sm:block">Theme:</span>
        <input 
          type="color" 
          value={store.themeColor} 
          onChange={(e) => store.setThemeColor(e.target.value)}
          className="w-6 h-6 md:w-8 md:h-8 cursor-pointer border-2 border-foreground bg-white"
        />
        <div className="w-px h-6 bg-foreground hidden sm:block" />
        <span className="text-[10px] md:text-xs font-black text-black uppercase">Scale:</span>
        <input 
          type="range" 
          min="0.2" 
          max="1.5" 
          step="0.05" 
          value={scale} 
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className="w-20 md:w-24 accent-black"
        />
        <span className="text-[10px] md:text-xs font-black text-black uppercase w-8 md:w-10">{Math.round(scale * 100)}%</span>
      </div>

      {/* A4 Paper Wrapper */}
      <div 
        className="origin-top"
        style={{ 
          transform: `scale(${scale})`,
          marginBottom: `${a4HeightPx * (scale - 1)}px` 
        }}
      >
        <div 
          ref={contentRef}
          className="bg-white text-black border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] relative page-gaps"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '0',
            boxSizing: 'border-box',
            '--accent-cv': store.themeColor
          } as React.CSSProperties}
        >
          {store.templateId === 1 && <Template1 />}
          {store.templateId === 2 && <Template2 />}
          {store.templateId === 3 && <Template3 />}
          {store.templateId === 4 && <Template4 />}
        </div>
      </div>
    </div>
  );
}
