'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Printer, Trash, Receipt, CaretRight, Pencil } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Invoice, getInvoices, deleteInvoice, updateInvoiceStatus } from '@/lib/data/invoices';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    const data = await getInvoices();
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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
        <div className="w-12 h-12 border border-border rounded-2xl border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Receipt weight="bold" /> Invoices
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-2">Atur duit asup, pantau cuan nunggak, jeung print invoice super kasep.</p>
          </div>
          <Link 
            href="/admin/invoices/create"
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
          >
            <Plus weight="bold" size={20} /> Buat Invoice
          </Link>
        </div>

        <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-100">
                <th className="p-4 border-b border-gray-100 whitespace-nowrap">Invoice #</th>
                <th className="hidden md:table-cell p-4 border-b border-gray-100">Client</th>
                <th className="hidden md:table-cell p-4 border-b border-gray-100">Date</th>
                <th className="hidden lg:table-cell p-4 border-b border-gray-100">Total</th>
                <th className="p-4 border-b border-gray-100">Status</th>
                <th className="p-4 border-b border-gray-100">Aksi</th>
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
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                    <td className="p-3 md:p-4 font-black text-base md:text-lg align-top">
                      {inv.invoice_number}
                      <div className="text-[10px] md:text-xs text-muted font-bold mt-1 uppercase truncate max-w-[120px] md:max-w-[200px]">{inv.project_name}</div>
                      
                      {/* Mobile Only Info */}
                      <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs font-bold truncate max-w-[120px]">{inv.client_name}</div>
                        <div className="text-xs text-emerald-600 mt-1">Rp {new Intl.NumberFormat('id-ID').format(inv.total)}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold align-top">
                      {inv.client_name}
                      {inv.client_email && <div className="text-xs text-muted font-normal mt-1">{inv.client_email}</div>}
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold text-sm align-top">
                      {new Date(inv.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="hidden lg:table-cell p-4 font-black text-lg text-emerald-600 align-top">
                      Rp {new Intl.NumberFormat('id-ID').format(inv.total)}
                    </td>
                    <td className="p-3 md:p-4 align-top">
                      <button 
                        onClick={() => handleStatusToggle(inv.id, inv.status)}
                        className={`px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-xs font-black uppercase tracking-widest border border-border rounded-xl hover:scale-105 transition-transform ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-1 text-xs font-semibold' : 'bg-red-50 text-red-700 border border-red-100 rounded-full px-2.5 py-1 text-xs font-semibold'}`}
                      >
                        {inv.status}
                      </button>
                    </td>
                    <td className="p-3 md:p-4 align-top h-full">
                      <div className="flex flex-col sm:flex-row gap-2 h-full">
                        <Link 
                          href={`/admin/invoices/${inv.id}/edit`}
                          className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-600 rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Edit"
                        >
                          <Pencil weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <Link 
                          href={`/admin/invoices/${inv.id}/print`}
                          target="_blank"
                          className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-600 rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Print / PDF"
                        >
                          <Printer weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <button 
                          onClick={() => setInvoiceToDelete(inv.id)}
                          className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shrink-0"
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
          <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            
            
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS INVOICE IEU?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Sakabeh duit nu can dibayar kumaha tah?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setInvoiceToDelete(null)}
                  className="flex-1 py-3.5 bg-gray-50 border border-gray-200/80 rounded-xl font-bold uppercase text-xs tracking-wider text-gray-700 hover:bg-gray-100 hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  TEU JADI
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-red-700 hover:-translate-y-0.5 transition-all"
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
