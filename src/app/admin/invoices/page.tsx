'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Printer, Trash, Receipt, CaretRight } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Invoice, getInvoices, deleteInvoice, updateInvoiceStatus } from '@/lib/data/invoices';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const data = await getInvoices();
    setInvoices(data);
    setLoading(false);
  };

  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      await deleteInvoice(invoiceToDelete);
      toast.success('Invoice berhasil dihapus!');
      fetchInvoices();
    } catch (e) {
      toast.error('Gagal menghapus invoice');
    } finally {
      setInvoiceToDelete(null);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      await updateInvoiceStatus(id, newStatus);
      toast.success(`Status diganti jadi ${newStatus.toUpperCase()}`);
      fetchInvoices();
    } catch (e) {
      toast.error('Gagal update status');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-foreground border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight flex items-center gap-4">
              <Receipt weight="bold" /> Invoices
            </h1>
            <p className="text-muted mt-2 font-bold">Atur duit asup, pantau cuan nunggak, jeung print invoice super kasep.</p>
          </div>
          <Link 
            href="/admin/invoices/create"
            className="bg-accent text-black font-black uppercase tracking-widest px-6 py-4 flex items-center gap-2 hover:bg-black hover:text-accent transition-colors border-4 border-black shadow-[8px_8px_0_0_#0F0F0F] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0_0_#0F0F0F]"
          >
            <Plus weight="bold" size={20} /> Buat Invoice
          </Link>
        </div>

        <div className="bg-surface border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground text-white font-black uppercase tracking-widest text-sm">
                <th className="p-4 border-b-4 border-foreground whitespace-nowrap">Invoice #</th>
                <th className="hidden md:table-cell p-4 border-b-4 border-foreground border-l-4">Client</th>
                <th className="hidden md:table-cell p-4 border-b-4 border-foreground border-l-4">Date</th>
                <th className="hidden lg:table-cell p-4 border-b-4 border-foreground border-l-4">Total</th>
                <th className="p-4 border-b-4 border-foreground border-l-4">Status</th>
                <th className="p-4 border-b-4 border-foreground border-l-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted font-bold text-lg uppercase tracking-widest">
                    Belum ada invoice yang dibuat.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b-4 border-dashed border-border hover:bg-gray-100 transition-colors">
                    <td className="p-3 md:p-4 font-black text-base md:text-lg align-top">
                      {inv.invoice_number}
                      <div className="text-[10px] md:text-xs text-muted font-bold mt-1 uppercase truncate max-w-[120px] md:max-w-[200px]">{inv.project_name}</div>
                      
                      {/* Mobile Only Info */}
                      <div className="md:hidden mt-3 pt-3 border-t-2 border-dashed border-border">
                        <div className="text-xs font-bold truncate max-w-[120px]">{inv.client_name}</div>
                        <div className="text-xs text-emerald-600 mt-1">Rp {new Intl.NumberFormat('id-ID').format(inv.total)}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 border-l-4 border-dashed border-border font-bold align-top">
                      {inv.client_name}
                      {inv.client_email && <div className="text-xs text-muted font-normal mt-1">{inv.client_email}</div>}
                    </td>
                    <td className="hidden md:table-cell p-4 border-l-4 border-dashed border-border font-bold text-sm align-top">
                      {new Date(inv.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="hidden lg:table-cell p-4 border-l-4 border-dashed border-border font-black text-lg text-emerald-600 align-top">
                      Rp {new Intl.NumberFormat('id-ID').format(inv.total)}
                    </td>
                    <td className="p-3 md:p-4 border-l-4 border-dashed border-border align-top">
                      <button 
                        onClick={() => handleStatusToggle(inv.id, inv.status)}
                        className={`px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-xs font-black uppercase tracking-widest border-2 border-foreground hover:scale-105 transition-transform ${inv.status === 'paid' ? 'bg-emerald-400 text-black shadow-[2px_2px_0_0_#0F0F0F] md:shadow-[4px_4px_0_0_#0F0F0F]' : 'bg-red-400 text-white shadow-[2px_2px_0_0_#0F0F0F] md:shadow-[4px_4px_0_0_#0F0F0F]'}`}
                      >
                        {inv.status}
                      </button>
                    </td>
                    <td className="p-3 md:p-4 border-l-4 border-dashed border-border align-top h-full">
                      <div className="flex flex-col sm:flex-row gap-2 h-full">
                        <Link 
                          href={`/admin/invoices/${inv.id}/print`}
                          target="_blank"
                          className="w-8 h-8 md:w-10 md:h-10 bg-surface border-2 border-foreground shadow-[2px_2px_0_0_#0F0F0F] flex items-center justify-center hover:bg-accent hover:text-black transition-colors shrink-0"
                          title="Print / PDF"
                        >
                          <Printer weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <button 
                          onClick={() => setInvoiceToDelete(inv.id)}
                          className="w-8 h-8 md:w-10 md:h-10 bg-surface border-2 border-foreground shadow-[2px_2px_0_0_#0F0F0F] flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shrink-0"
                          title="Delete"
                        >
                          <Trash weight="bold" size={18} className="md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brutal Delete Modal */}
      {invoiceToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border-8 border-foreground shadow-[16px_16px_0_0_#FF6138] w-full max-w-md my-8 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(45deg,#0F0F0F,#0F0F0F_10px,#F7DF1E_10px,#F7DF1E_20px)] border-b-4 border-foreground" />
            
            <div className="p-8 pt-12 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS INVOICE IEU?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Sakabeh duit nu can dibayar kumaha tah?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setInvoiceToDelete(null)}
                  className="flex-1 py-4 bg-white border-4 border-foreground font-black uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_#0F0F0F] active:translate-y-1 active:shadow-[0_0_0_0_#0F0F0F]"
                >
                  TEU JADI
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white border-4 border-foreground font-black uppercase tracking-widest shadow-[4px_4px_0_0_#0F0F0F] hover:bg-red-600 active:translate-y-1 active:shadow-[0_0_0_0_#0F0F0F] transition-all"
                >
                  HAPUS LAH!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
