'use client';

import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";
import { CVCanvas } from "@/components/CVCanvas";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Coffee, DownloadSimple, X } from "@phosphor-icons/react";

export default function CVGenerator() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "CV_NOMSTD",
    pageStyle: "@page { size: A4 portrait; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background relative">
      <Topbar onExport={() => setShowModal(true)} />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <Sidebar />
        <CVCanvas contentRef={contentRef} />
      </div>

      {/* Saweria Modal */}
      {showModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] max-w-lg w-full p-8 relative flex flex-col gap-6">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-black hover:text-accent transition-colors"
            >
              <X weight="bold" size={24} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F7DF1E] border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] flex items-center justify-center">
                <Coffee weight="fill" size={32} className="text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-black">Eh Bentar Bosku!</h2>
                <p className="text-sm font-bold text-gray-500 uppercase">Support developer lokal</p>
              </div>
            </div>

            <p className="text-black font-medium leading-relaxed">
              Kalo CV ini berguna dan ngebantu lo sukses dapet kerjaan yang lo mau, <span className="font-bold">Aamiin!</span> 🙏<br/><br/>
              Jangan lupa traktir gua kopi ya di Saweria biar makin semangat bikin tools gratis kayak gini. Nggak maksa kok, seikhlasnya aja!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a 
                href="https://saweria.co/iammonoz" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowModal(false)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#F7DF1E] border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all font-black text-black"
              >
                <Coffee weight="bold" size={20} />
                Traktir Kopi
              </a>
              <button 
                onClick={() => {
                  setShowModal(false);
                  handlePrint();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all font-black text-black"
              >
                <DownloadSimple weight="bold" size={20} />
                Lanjut Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
