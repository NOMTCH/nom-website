'use client';

import { useEffect, useState } from 'react';
import { getProposalById, Proposal } from '@/lib/data/proposals';
import { notFound, usePathname } from 'next/navigation';
import { Printer, ArrowLeft, MagnifyingGlassPlus, MagnifyingGlassMinus, CornersOut } from '@phosphor-icons/react';
import Link from 'next/link';

export default function PrintProposalPage() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const pathname = usePathname();
  const id = pathname.split('/')[3]; 

  const fitToScreen = () => {
    const availableHeight = window.innerHeight - 120;
    const availableWidth = window.innerWidth - 32;
    const targetHeight = 1096;
    const targetWidth = 793;
    const zoomHeight = availableHeight / targetHeight;
    const zoomWidth = availableWidth / targetWidth;
    const newZoom = Math.min(1.5, Math.max(0.2, Math.min(zoomHeight, zoomWidth)));
    setZoom(newZoom);
  };

  useEffect(() => {
    async function load() {
      const data = await getProposalById(id);
      if (!data) notFound();
      setProposal(data);
      setLoading(false);
      
      setTimeout(fitToScreen, 100);
    }
    if (id) load();

    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <div className="h-[calc(100vh-2rem)] w-full overflow-y-auto overflow-x-hidden bg-gray-100 print:bg-white flex items-start justify-center pt-8 print:p-0 print:h-auto print:w-full print:overflow-visible relative">
      
      {/* Floating Action Buttons */}
      <div className="print:hidden fixed top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-2 md:gap-4 z-50">
        <div className="flex bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-md rounded-2xl items-center text-gray-700 font-bold scale-90 origin-right md:scale-100 overflow-hidden">
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2.5 md:p-3.5 hover:bg-gray-100 transition-colors border-r border-gray-100">
            <MagnifyingGlassMinus size={18} weight="bold" className="md:w-5 md:h-5 text-gray-600" />
          </button>
          <div className="px-2 md:px-4 text-xs md:text-sm w-12 md:w-16 text-center select-none">{Math.round(zoom * 100)}%</div>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2.5 md:p-3.5 hover:bg-gray-100 transition-colors border-l border-gray-100">
            <MagnifyingGlassPlus size={18} weight="bold" className="md:w-5 md:h-5 text-gray-600" />
          </button>
          <button onClick={fitToScreen} className="p-2.5 md:p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors border-l border-gray-100" title="Fit to Screen">
            <CornersOut size={18} weight="bold" className="md:w-5 md:h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-row gap-2 md:gap-3 items-center">
          <Link 
            href="/admin/proposals"
            className="bg-white text-gray-700 font-bold uppercase tracking-wider text-xs px-4 py-3 flex items-center gap-2 border border-gray-200/80 shadow-sm rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft weight="bold" size={16} /> 
            <span className="hidden sm:block">Back</span>
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-gray-900 text-white font-bold uppercase tracking-wider text-xs px-5 py-3 flex items-center gap-2 border border-gray-900 shadow-md rounded-xl hover:bg-gray-800 transition-all duration-200 cursor-pointer"
          >
            <Printer weight="bold" size={16} /> 
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          .preview-container { transform: none !important; margin: 0 !important; box-shadow: none !important; }
        }
      `}} />

      {/* A4 Paper Container */}
      <div 
        className="preview-container bg-white w-[210mm] h-[297mm] print:w-[210mm] print:h-[280mm] print:min-h-0 shadow-lg print:shadow-none mx-auto relative flex flex-col box-border transition-transform duration-200 rounded-xl print:rounded-none overflow-hidden"
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top center',
          marginBottom: `${(zoom - 1) * 1096}px`
        }}
      >
        <div className="h-2 w-full bg-accent mb-2 shrink-0"></div>

        <div className="px-8 py-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-2 border-b border-gray-100 pb-2 shrink-0">
            <div className="max-w-sm">
              <div className="mb-4">
                <img src="/assets/logo/logo.svg" alt="NOM STUDIO" className="h-10 md:h-12 object-contain filter grayscale" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-relaxed">
                Creative Studio & IT Solutions<br/>
                West Java, Indonesia<br/>
                admin@nomstudio.com
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-gray-900 mb-4">
                PROPOSAL
              </div>
              <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <div>Ref: <span className="font-display text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded ml-1">{proposal.proposal_number}</span></div>
                <div>Date: <span className="font-display text-sm font-bold text-gray-900 ml-1">{new Date(proposal.issue_date).toLocaleDateString('en-GB')}</span></div>
                <div>Valid Until: <span className="font-display text-sm font-bold text-gray-900 ml-1">{new Date(proposal.valid_until).toLocaleDateString('en-GB')}</span></div>
              </div>
            </div>
          </div>

          {/* Prepared For & Project Info */}
          <div className="mb-2 grid grid-cols-2 gap-4 shrink-0 break-inside-avoid">
            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Prepared For</h3>
              <div className="text-base font-display font-black uppercase tracking-tight text-gray-900 leading-none">{proposal.client_name}</div>
              {proposal.client_company && <div className="text-xs font-bold text-gray-700 mt-1">{proposal.client_company}</div>}
              {proposal.client_email && <div className="text-[10px] font-semibold text-gray-500 mt-0.5">{proposal.client_email}</div>}
            </div>
            <div className="border border-gray-100 p-4 rounded-xl bg-white shadow-sm flex flex-col justify-center">
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-accent mb-1">Project Overview</h3>
              <div className="text-sm font-display font-black uppercase tracking-tight text-gray-900 mb-1 leading-tight">{proposal.project_name}</div>
              {proposal.project_description && (
                <div className="text-[10px] font-medium text-gray-600 leading-snug">
                  {proposal.project_description}
                </div>
              )}
            </div>
          </div>

          {/* Scope of Work Table */}
          <div className="mb-2 flex-1">
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1">Scope of Work & Investment</h3>
            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-wider border-b border-gray-200 break-inside-avoid">
                  <th className="py-1.5 px-2 w-1/2">Deliverable</th>
                  <th className="py-1.5 px-2 text-center whitespace-nowrap">Qty</th>
                  <th className="py-1.5 px-2 text-right whitespace-nowrap">Unit Price</th>
                  <th className="py-1.5 px-2 text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {proposal.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-b-0 break-inside-avoid hover:bg-gray-50/50 transition-colors">
                    <td className="py-1.5 px-2 font-bold text-gray-800 text-xs leading-tight">{item.description}</td>
                    <td className="py-1.5 px-2 text-center font-display font-black text-xs text-gray-700">{item.quantity}</td>
                    <td className="py-1.5 px-2 text-right font-semibold text-gray-600 whitespace-nowrap text-[11px]">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                    <td className="py-1.5 px-2 text-right font-display font-black text-xs text-gray-900 whitespace-nowrap">Rp {new Intl.NumberFormat('id-ID').format(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="flex flex-col md:flex-row justify-between mb-2 shrink-0 break-inside-avoid gap-4">
            <div className="flex-1">
              {proposal.notes && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 h-full">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Terms & Conditions</h4>
                  <p className="text-[10px] font-semibold text-gray-700 leading-snug whitespace-pre-wrap">{proposal.notes}</p>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-[45%] bg-gray-900 text-white p-4 rounded-xl shadow-md border border-gray-800">
              <div className="flex justify-between mb-2.5 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span className="font-display font-bold text-gray-300 text-xs">Rp {new Intl.NumberFormat('id-ID').format(proposal.subtotal)}</span>
              </div>
              {proposal.tax_rate > 0 && (
                <div className="flex justify-between mb-2.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-dashed border-gray-700 pb-2.5">
                  <span>Tax ({proposal.tax_rate}%)</span>
                  <span className="font-display font-bold text-gray-300 text-xs">Rp {new Intl.NumberFormat('id-ID').format(proposal.subtotal * (proposal.tax_rate / 100))}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white mt-2 pt-2 border-t border-gray-700">
                <span>Total Investment</span>
                <span className="font-display font-black text-lg text-emerald-400 leading-none">Rp {new Intl.NumberFormat('id-ID').format(proposal.total)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-auto pt-2 border-t border-gray-100 flex justify-between px-6 shrink-0 break-inside-avoid">
            <div className="text-center flex flex-col items-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-8">Proposed By</div>
              <div className="w-32 border-b border-gray-300 mb-1.5"></div>
              <div className="font-bold text-gray-800 text-xs">Adrian Suryana</div>
              <div className="text-[10px] font-semibold text-gray-500">NOM Studio</div>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-8">Accepted By</div>
              <div className="w-32 border-b border-gray-300 mb-1.5"></div>
              <div className="font-bold text-gray-800 text-xs">{proposal.client_name}</div>
              <div className="text-[10px] font-semibold text-gray-500">{proposal.client_company || 'Client'}</div>
            </div>
          </div>
        </div>
        
        {/* Status Stamps */}
        {proposal.status === 'accepted' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-10 pointer-events-none">
            <div className="border-[8px] border-emerald-500 text-emerald-500 text-[100px] font-black uppercase tracking-tighter px-12 py-4 mix-blend-multiply rounded-3xl">
              ACCEPTED
            </div>
          </div>
        )}
        {proposal.status === 'rejected' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-10 pointer-events-none">
            <div className="border-[8px] border-red-500 text-red-500 text-[100px] font-black uppercase tracking-tighter px-12 py-4 mix-blend-multiply rounded-3xl">
              REJECTED
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
