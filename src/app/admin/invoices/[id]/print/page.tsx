'use client';

import { useEffect, useState } from 'react';
import { getInvoiceById, Invoice } from '@/lib/data/invoices';
import { notFound, usePathname } from 'next/navigation';
import { Printer, ArrowLeft, MagnifyingGlassPlus, MagnifyingGlassMinus, CornersOut } from '@phosphor-icons/react';
import Link from 'next/link';

export default function PrintInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const pathname = usePathname();
  const id = pathname.split('/')[3]; // Extract ID from URL since it's a client component

  const fitToScreen = () => {
    const availableHeight = window.innerHeight - 120; // 120px buffer for padding
    const availableWidth = window.innerWidth - 32; // 32px buffer for side padding
    const targetHeight = 1096; // 290mm in pixels
    const targetWidth = 793; // 210mm in pixels
    const zoomHeight = availableHeight / targetHeight;
    const zoomWidth = availableWidth / targetWidth;
    // Scale by whichever is smaller so it fits completely without scrolling
    const newZoom = Math.min(1.5, Math.max(0.2, Math.min(zoomHeight, zoomWidth)));
    setZoom(newZoom);
  };

  useEffect(() => {
    async function load() {
      const data = await getInvoiceById(id);
      if (!data) notFound();
      setInvoice(data);
      setLoading(false);
      
      // Handled by layout metadata for better production support

      
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

  if (!invoice) return null;

  return (
    <div className="h-[calc(100vh-2rem)] w-full overflow-y-auto overflow-x-hidden bg-gray-100 print:bg-white flex items-start justify-center pt-8 print:p-0 print:h-auto print:w-full print:overflow-visible relative">
      
      {/* Floating Action Buttons (hidden during print) */}
      <div className="print:hidden fixed top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-2 md:gap-4 z-50">
        {/* Zoom Controls */}
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

        {/* Action Buttons Row */}
        <div className="flex flex-row gap-2 md:gap-3 items-center">
          <Link 
            href="/admin/invoices"
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

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          .preview-container { transform: none !important; margin: 0 !important; box-shadow: none !important; }
        }
      `}} />

      {/* A4 Paper Container */}
      <div 
        className="preview-container bg-white w-[210mm] min-h-[290mm] print:w-[210mm] print:min-h-[290mm] shadow-lg print:shadow-none mx-auto relative flex flex-col box-border transition-transform duration-200 rounded-xl print:rounded-none overflow-hidden"
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top center',
          marginBottom: `${(zoom - 1) * 1096}px`
        }}
      >
        
        {/* Top Header Bar */}
        <div className="h-1.5 w-full bg-gray-900 mb-4 shrink-0"></div>

        <div className="px-12 py-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6 shrink-0">
            <div className="max-w-sm">
              <div className="mb-4">
                <img src="/assets/logo/logo.svg" alt="NOM STUDIO" className="h-10 md:h-12 object-contain" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-relaxed">
                Creative Studio & IT Solutions<br/>
                West Java, Indonesia<br/>
                admin@nomstudio.com
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-gray-900 mb-4">
                INVOICE
              </div>
              <div className="space-y-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <div>Invoice No: <span className="font-display text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded ml-1">{invoice.invoice_number}</span></div>
                <div>Date: <span className="font-display text-sm font-bold text-gray-900 ml-1">{new Date(invoice.issue_date).toLocaleDateString('en-GB')}</span></div>
                <div>Due Date: <span className="font-display text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded ml-1">{new Date(invoice.due_date).toLocaleDateString('en-GB')}</span></div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-6 flex justify-between border border-gray-100 p-6 rounded-2xl bg-gray-50/50 relative shrink-0 break-inside-avoid">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Billed To</h3>
              <div className="text-xl font-display font-black uppercase tracking-tight text-gray-900">{invoice.client_name}</div>
              {invoice.client_email && <div className="text-xs font-semibold text-gray-500 mt-1">{invoice.client_email}</div>}
            </div>
            <div className="text-right pl-4 flex flex-col items-end justify-center">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Project</h3>
              <div className="text-lg font-display font-black uppercase tracking-tight text-gray-900 max-w-[250px] leading-tight">{invoice.project_name}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 flex-1">
            <table className="w-full text-left border-collapse border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100 break-inside-avoid">
                  <th className="p-3.5 w-1/2">Description</th>
                  <th className="p-3.5 text-center whitespace-nowrap">Qty</th>
                  <th className="p-3.5 text-right whitespace-nowrap">Price</th>
                  <th className="p-3.5 text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-b-0 break-inside-avoid hover:bg-gray-50/30 transition-colors">
                    <td className="p-3.5 font-bold text-gray-800 text-sm">{item.description}</td>
                    <td className="p-3.5 text-center font-display font-black text-sm text-gray-700">{item.quantity}</td>
                    <td className="p-3.5 text-right font-semibold text-gray-600 whitespace-nowrap text-sm">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                    <td className="p-3.5 text-right font-display font-black text-sm text-gray-900 whitespace-nowrap">Rp {new Intl.NumberFormat('id-ID').format(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex justify-end mb-6 shrink-0 break-inside-avoid">
            <div className="w-full md:w-[60%] bg-white p-5 border border-gray-100 shadow-sm rounded-2xl hover:shadow-none transition-all duration-300">
              <div className="flex justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span className="font-display font-bold text-gray-700 text-sm">Rp {new Intl.NumberFormat('id-ID').format(invoice.subtotal)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-dashed border-gray-100 pb-3">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span className="font-display font-bold text-gray-700 text-sm">Rp {new Intl.NumberFormat('id-ID').format(invoice.subtotal * (invoice.tax_rate / 100))}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider text-gray-900 mt-3 pt-3 border-t border-gray-100">
                <span>Total Due</span>
                <span className="font-display font-black text-lg text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">Rp {new Intl.NumberFormat('id-ID').format(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-auto border-t border-gray-100 pt-6 shrink-0 break-inside-avoid">
            <div className="flex justify-between items-end">
              <div className="max-w-md bg-blue-50/50 border border-blue-100/50 rounded-xl p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-800 mb-2">Payment Instructions</h4>
                <p className="text-xs font-semibold text-gray-700">Bank BCA: <span className="font-display font-black text-sm text-blue-900">5260 703 953</span> a/n Adrian Suryana</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wide">Please include the Invoice Number in the transfer notes.</p>
              </div>
              <div className="text-right">
                <h4 className="text-3xl font-display font-black text-gray-200 uppercase tracking-tight select-none">Thank You!</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="h-1.5 w-full bg-gray-900 shrink-0 mt-4"></div>
        
        {/* Status Stamp (if Paid) */}
        {invoice.status === 'paid' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-15 pointer-events-none">
            <div className="border-[6px] border-emerald-500 text-emerald-500 text-[100px] font-black uppercase tracking-tighter px-8 py-3 mix-blend-multiply rounded-2xl">
              PAID
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
