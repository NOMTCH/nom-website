'use client';

import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";
import { CVCanvas } from "@/components/CVCanvas";
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Coffee, DownloadSimple, X } from "@phosphor-icons/react";

export default function CVGenerator() {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('aside')) {
        lastFocusedRef.current = target;
      }
    };
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);
  
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "CV_NOMSTD",
    pageStyle: "@page { size: A4 portrait; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
  });

  useEffect(() => {
    const previewEl = document.getElementById('cv-preview-section');
    if (!previewEl || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsScrolledDown(true);
        } else {
          setIsScrolledDown(false);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1, // 10% visible to trigger
      }
    );

    observer.observe(previewEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative">
      <Topbar onExport={() => setShowModal(true)} />
      
      {/* Mobile: Scrollable column. Desktop: Hidden overflow, side-by-side */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-col md:flex-row flex-1 md:overflow-hidden overflow-y-auto w-full relative scroll-smooth"
      >
        <Sidebar />
        <div id="cv-preview-section" className="flex-1 w-full flex flex-col min-h-screen md:min-h-0 relative">
          <CVCanvas contentRef={contentRef} />
        </div>
      </div>

      {/* Flexible Floating Button (Mobile Only) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] pointer-events-none">
        <button 
          onClick={() => {
            if (isScrolledDown) {
              // Scroll back to edit
              if (lastFocusedRef.current) {
                lastFocusedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                lastFocusedRef.current.focus();
              } else {
                scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }
            } else {
              // Scroll down to preview
              document.getElementById('cv-preview-section')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`w-full py-3.5 px-6 text-sm font-bold uppercase rounded-full shadow-lg flex items-center justify-center gap-2 pointer-events-auto transition-all ${isScrolledDown ? 'bg-accent-secondary text-white hover:bg-accent' : 'bg-accent text-white animate-bounce hover:bg-accent-secondary'}`}
        >
          {isScrolledDown ? "↑ Balik Ngedit ↑" : "👇 Lihat Hasil 👇"}
        </button>
      </div>

      {/* Saweria Modal */}
      {showModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border shadow-2xl rounded-3xl max-w-lg w-full p-8 relative flex flex-col gap-6">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center hover:scale-110 shadow-md transition-transform z-10"
            >
              <X weight="bold" size={24} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center shrink-0">
                <Coffee weight="fill" size={32} className="text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-foreground">Eh Bentar!</h2>
                <br />
                <p className="text-xs font-bold text-accent uppercase bg-accent/5 border border-accent/20 px-3 py-1 rounded-full mt-2 inline-block">Support developer lokal</p>
              </div>
            </div>

            <div className="text-foreground leading-relaxed bg-background border border-border p-5 rounded-2xl shadow-sm text-sm md:text-base">
              Kalo CV ini ngebantu lo sukses dapet kerja, <span className="font-black text-accent bg-accent/10 px-1.5 py-0.5 rounded">AAMIIN!</span> 🙏<br/><br/>
              Jangan lupa traktir gua kopi di Saweria biar makin semangat bikin tools gratis gini. Nggak maksa kok, seikhlasnya aja!
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a 
                href="https://saweria.co/iammonoz" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowModal(false)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-accent-secondary text-white rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all font-bold text-sm uppercase tracking-widest"
              >
                <Coffee weight="bold" size={20} />
                Traktir Kopi
              </a>
              <button 
                onClick={() => {
                  setShowModal(false);
                  handlePrint();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-foreground text-white rounded-2xl shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all font-bold text-sm uppercase tracking-widest"
              >
                <DownloadSimple weight="bold" size={20} />
                Lanjut PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
