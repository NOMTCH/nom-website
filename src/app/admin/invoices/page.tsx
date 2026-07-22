'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Printer, Trash, Receipt, CaretRight, Pencil } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Invoice, getInvoices, deleteInvoice, updateInvoiceStatus } from '@/lib/data/invoices';
import Portal from '@/components/Portal';

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
            <h1 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight flex items-center gap-3">
              <Receipt weight="bold" className="text-accent" /> Invoices
            </h1>
            <p className="text-sm font-semibold text-muted mt-2">Manage client billing, payment statuses, and export invoices.</p>
          </div>
          <Link 
            href="/admin/invoices/create"
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
          >
            <Plus weight="bold" size={20} /> Create Invoice
          </Link>
        </div>

        <div className="bg-surface border border-border/80 shadow-xl rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 text-muted font-semibold uppercase tracking-widest text-xs border-b border-border/80">
                <th className="p-4 whitespace-nowrap">Invoice #</th>
                <th className="hidden md:table-cell p-4">Client</th>
                <th className="hidden md:table-cell p-4">Issue Date</th>
                <th className="hidden lg:table-cell p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted font-bold text-lg uppercase tracking-widest">
                    No Invoices Found
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/40 hover:bg-background/50 transition-colors">
                    <td className="p-3 md:p-4 font-black text-base md:text-lg align-middle text-foreground">
                      {inv.invoice_number}
                      <div className="text-[10px] md:text-xs text-muted font-bold mt-1 uppercase truncate max-w-[120px] md:max-w-[200px]">{inv.project_name}</div>
                      
                      {/* Mobile Only Info */}
                      <div className="md:hidden mt-3 pt-3 border-t border-border/40">
                        <div className="text-xs font-bold truncate max-w-[120px] text-foreground">{inv.client_name}</div>
                        <div className="text-xs text-accent font-bold mt-1">Rp {new Intl.NumberFormat('id-ID').format(inv.total)}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold align-middle text-foreground">
                      {inv.client_name}
                      {inv.client_email && <div className="text-xs text-muted font-normal mt-1">{inv.client_email}</div>}
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold text-sm align-middle text-muted">
                      {new Date(inv.issue_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="hidden lg:table-cell p-4 font-black text-lg text-accent align-middle">
                      Rp {new Intl.NumberFormat('id-ID').format(inv.total)}
                    </td>
                    <td className="p-3 md:p-4 align-middle">
                      <button 
                        onClick={() => handleStatusToggle(inv.id, inv.status)}
                        className={`px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${inv.status === 'paid' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                      >
                        {inv.status}
                      </button>
                    </td>
                    <td className="p-3 md:p-4 align-middle h-full">
                      <div className="flex flex-col sm:flex-row items-center gap-2 h-full">
                        <Link 
                          href={`/admin/invoices/${inv.id}/edit`}
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Edit"
                        >
                          <Pencil weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <Link 
                          href={`/admin/invoices/${inv.id}/print`}
                          target="_blank"
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Print / PDF"
                        >
                          <Printer weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <button 
                          onClick={() => setInvoiceToDelete(inv.id)}
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all shrink-0"
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

      {/* Delete Modal */}
      {invoiceToDelete && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden text-foreground animate-scale-in">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 mx-auto rounded-2xl flex items-center justify-center mb-6">
                  <Trash weight="fill" size={32} />
                </div>
                <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2 text-foreground">Delete Invoice?</h2>
                <p className="font-semibold text-muted mb-8 text-sm">Are you sure you want to delete this invoice? This action cannot be undone.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setInvoiceToDelete(null)}
                    className="flex-1 py-3.5 bg-background border border-border rounded-xl font-bold uppercase text-xs tracking-wider text-muted hover:text-foreground transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
