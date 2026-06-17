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
    <div className="h-[calc(100vh-2rem)] w-full overflow-y-auto overflow-x-hidden bg-gray-200 print:bg-white flex items-start justify-center pt-8 print:p-0 print:h-auto print:w-full print:overflow-visible relative">
      
      {/* Floating Action Buttons (hidden during print) */}
      <div className="print:hidden fixed top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-2 md:gap-4 z-50">
        {/* Zoom Controls */}
        <div className="flex bg-white border-2 md:border-4 border-black shadow-[4px_4px_0_0_#0F0F0F] md:shadow-[8px_8px_0_0_#0F0F0F] items-center text-black font-black scale-90 origin-right md:scale-100">
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 md:p-3 hover:bg-gray-200 border-r-2 md:border-r-4 border-black transition-colors">
            <MagnifyingGlassMinus size={20} weight="bold" className="md:w-6 md:h-6" />
          </button>
          <div className="px-2 md:px-4 text-xs md:text-sm w-12 md:w-20 text-center">{Math.round(zoom * 100)}%</div>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 md:p-3 hover:bg-gray-200 border-l-2 md:border-l-4 border-black transition-colors">
            <MagnifyingGlassPlus size={20} weight="bold" className="md:w-6 md:h-6" />
          </button>
          <button onClick={fitToScreen} className="p-2 md:p-3 bg-accent hover:bg-yellow-400 border-l-2 md:border-l-4 border-black transition-colors" title="Fit to Screen">
            <CornersOut size={20} weight="bold" className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-row gap-2 md:gap-4 items-center">
          <Link 
            href="/admin/invoices"
            className="bg-white text-black font-black uppercase tracking-widest px-3 py-2 md:px-6 md:py-4 flex items-center gap-2 border-2 md:border-4 border-black shadow-[4px_4px_0_0_#0F0F0F] md:shadow-[8px_8px_0_0_#0F0F0F] hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft weight="bold" size={20} className="md:w-6 md:h-6" /> 
            <span className="text-xs md:text-base hidden sm:block">Back</span>
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-black text-white font-black uppercase tracking-widest px-4 py-2 md:px-6 md:py-4 flex items-center gap-2 border-2 md:border-4 border-black shadow-[4px_4px_0_0_#F7DF1E] md:shadow-[8px_8px_0_0_#F7DF1E] hover:bg-gray-900 transition-colors"
          >
            <Printer weight="bold" size={20} className="md:w-6 md:h-6" /> 
            <span className="text-xs md:text-base">Print</span>
          </button>
        </div>
      </div>

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .preview-container { transform: none !important; margin: 0 !important; }
        }
      `}} />

      {/* A4 Paper Container */}
      <div 
        className="preview-container bg-white w-[210mm] min-h-[290mm] print:w-[210mm] print:min-h-[290mm] shadow-2xl print:shadow-none mx-auto relative flex flex-col box-border transition-transform duration-200"
        style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top center',
          marginBottom: `${(zoom - 1) * 1096}px`
        }}
      >
        
        {/* Brutalist Header Bar */}
        <div className="h-4 w-full bg-accent mb-4 shrink-0"></div>

        <div className="px-10 py-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 border-b-8 border-black pb-4 shrink-0">
            <div className="max-w-sm">
              <div className="mb-4">
                <img src="/assets/logo/logo.svg" alt="NOM STUDIO" className="h-12 md:h-16 object-contain" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Creative Studio & IT Solutions<br/>
                West Java, Indonesia<br/>
                admin@nomstudio.com
              </p>
            </div>
            <div className="text-right">
              <div className="bg-black text-white text-4xl md:text-5xl font-display font-black uppercase tracking-tighter px-6 py-3 inline-block transform rotate-3 shadow-[8px_8px_0_0_#F7DF1E] border-4 border-black mb-6">
                INVOICE
              </div>
              <div className="mt-2 text-sm font-black uppercase tracking-widest text-black">
                Invoice No: <span className="font-display text-xl ml-2 bg-gray-200 px-2 py-1">{invoice.invoice_number}</span>
              </div>
              <div className="mt-2 text-sm font-black uppercase tracking-widest text-black">
                Date: <span className="font-display text-xl ml-2">{new Date(invoice.issue_date).toLocaleDateString('en-GB')}</span>
              </div>
              <div className="mt-2 text-sm font-black uppercase tracking-widest text-black">
                Due: <span className="font-display text-xl ml-2 bg-red-500 text-white px-2 py-1 shadow-[4px_4px_0_0_#0F0F0F] border-2 border-black">{new Date(invoice.due_date).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-4 flex justify-between border-4 border-black p-4 shadow-[6px_6px_0_0_#F7DF1E] bg-white relative shrink-0 break-inside-avoid">
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-black"></div>
            <div>
              <h3 className="text-xs font-display font-black uppercase tracking-widest bg-black text-white inline-block px-2 py-1 mb-2 shadow-[3px_3px_0_0_#0F0F0F] transform -rotate-2">Billed To</h3>
              <div className="text-2xl font-display font-black uppercase tracking-tight text-black">{invoice.client_name}</div>
              {invoice.client_email && <div className="text-sm font-bold mt-1 text-black border-b-2 border-dashed border-black inline-block">{invoice.client_email}</div>}
            </div>
            <div className="text-right border-l-4 border-black pl-4 flex flex-col items-end justify-center">
              <h3 className="text-xs font-display font-black uppercase tracking-widest bg-black text-white inline-block px-2 py-1 mb-2 shadow-[3px_3px_0_0_#0F0F0F] transform rotate-2">Project</h3>
              <div className="text-xl font-display font-black uppercase tracking-tight text-black max-w-[250px] leading-tight">{invoice.project_name}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4 flex-1">
            <table className="w-full text-left border-collapse border-4 border-black shadow-[6px_6px_0_0_#0F0F0F]">
              <thead>
                <tr className="bg-black text-white text-xs font-display font-black uppercase tracking-widest break-inside-avoid">
                  <th className="p-3 border-r-4 border-black w-1/2">Description</th>
                  <th className="p-3 border-r-4 border-black text-center whitespace-nowrap">Qty</th>
                  <th className="p-3 border-r-4 border-black text-right whitespace-nowrap">Price</th>
                  <th className="p-3 text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b-4 border-black last:border-b-0 break-inside-avoid">
                    <td className="p-3 font-bold text-black border-r-4 border-black text-base">{item.description}</td>
                    <td className="p-3 text-center font-display font-black text-xl text-black border-r-4 border-black bg-gray-100">{item.quantity}</td>
                    <td className="p-3 text-right font-bold text-black border-r-4 border-black whitespace-nowrap text-base">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                    <td className="p-3 text-right font-display font-black text-xl text-black whitespace-nowrap bg-[#F7DF1E]">Rp {new Intl.NumberFormat('id-ID').format(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex justify-end mb-4 shrink-0 break-inside-avoid">
            <div className="w-full md:w-[75%] bg-white p-4 border-4 border-black shadow-[8px_8px_0_0_#0F0F0F] relative">
              <div className="absolute top-0 right-0 w-6 h-6 bg-accent border-l-4 border-b-4 border-black"></div>
              <div className="flex justify-between mb-3 text-xs font-black uppercase tracking-widest text-black">
                <span>Subtotal</span>
                <span className="font-display text-lg">Rp {new Intl.NumberFormat('id-ID').format(invoice.subtotal)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between mb-3 text-xs font-black uppercase tracking-widest text-black border-b-4 border-dashed border-black pb-3">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span className="font-display text-lg">Rp {new Intl.NumberFormat('id-ID').format(invoice.subtotal * (invoice.tax_rate / 100))}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-lg md:text-xl font-display font-black uppercase tracking-tighter text-black mt-3 pt-3 border-t-8 border-black">
                <span>Total Due</span>
                <span className="bg-black text-white px-3 py-1 transform rotate-1 shadow-[3px_3px_0_0_#F7DF1E]">Rp {new Intl.NumberFormat('id-ID').format(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-auto border-t-8 border-black pt-4 shrink-0 break-inside-avoid">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-xs font-display font-black uppercase tracking-widest bg-black text-white inline-block px-2 py-1 mb-2">Payment Instructions</h4>
                <p className="text-sm font-bold text-black border-l-4 border-accent pl-3 mt-1">Bank BCA: <span className="font-display font-black text-lg">5260 703 953</span> a/n Adrian Suryana</p>
                <p className="text-xs font-bold text-black mt-1">Please include the Invoice Number in the transfer notes.</p>
              </div>
              <div className="text-right">
                <h4 className="text-4xl font-display font-black text-gray-200 uppercase tracking-tighter transform -rotate-6 scale-110">Thank You!</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Brutalist Footer Bar */}
        <div className="h-4 w-full bg-black shrink-0 mt-2"></div>
        
        {/* Status Stamp (if Paid) */}
        {invoice.status === 'paid' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 opacity-20 pointer-events-none">
            <div className="border-8 border-emerald-500 text-emerald-500 text-[120px] font-black uppercase tracking-tighter px-8 py-4 mix-blend-multiply">
              PAID
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
