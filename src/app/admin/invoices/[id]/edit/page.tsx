'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash, ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { getInvoiceById, updateInvoice, InvoiceItem } from '@/lib/data/invoices';
import Link from 'next/link';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, total: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [downPayment, setDownPayment] = useState(0);

  useEffect(() => {
    async function loadInvoice() {
      try {
        const data = await getInvoiceById(id);
        if (data) {
          setInvoiceNumber(data.invoice_number);
          setClientName(data.client_name);
          setClientEmail(data.client_email || '');
          setProjectName(data.project_name);
          setIssueDate(data.issue_date);
          setDueDate(data.due_date);
          setItems(data.items || []);
          setTaxRate(data.tax_rate || 0);
          setDownPayment(data.down_payment || 0);
        } else {
          toast.error('Invoice tidak ditemukan');
          router.push('/admin/invoices');
        }
      } catch (err) {
        toast.error('Gagal mengambil data invoice');
      } finally {
        setFetchingData(false);
      }
    }
    loadInvoice();
  }, [id, router]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + (sub * (taxRate / 100)) - downPayment;
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === 'description') {
      item.description = value as string;
    } else if (field === 'quantity' || field === 'price') {
      item[field] = Number(value);
      item.total = item.quantity * item.price;
    }
    
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(), description: '', quantity: 1, price: 0, total: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.description || i.price <= 0)) {
      toast.error('Pastikan semua item punya deskripsi dan harga yang valid!');
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        invoice_number: invoiceNumber,
        client_name: clientName,
        client_email: clientEmail,
        project_name: projectName,
        issue_date: issueDate,
        due_date: dueDate,
        items,
        subtotal: calculateSubtotal(),
        tax_rate: taxRate,
        down_payment: downPayment,
        total: calculateTotal(),
      };

      await updateInvoice(id, invoiceData);
      toast.success('Invoice berhasil diupdate!');
      router.push('/admin/invoices');
    } catch (error) {
      console.error(error);
      toast.error('Gagal update invoice, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center">
        <div className="w-12 h-12 border border-border rounded-2xl border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/invoices"
          className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-8 hover:text-accent transition-colors"
        >
          <ArrowLeft weight="bold" /> Back to Invoices
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mb-8 pb-4 border-b border-gray-100">
          Edit Invoice
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500 mb-6 pb-2 border-b border-gray-100">
              Client Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Invoice Number</label>
                <input 
                  type="text" required value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Project Name</label>
                <input 
                  type="text" required value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  placeholder="e.g. Redesign Logo UMKM"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Client Name</label>
                <input 
                  type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  placeholder="e.g. PT Maju Mundur"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Client Email</label>
                <input 
                  type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  placeholder="e.g. bos@majumundur.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Issue Date</label>
                <input 
                  type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Due Date</label>
                <input 
                  type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h2 className="text-xl font-display font-black text-gray-900 uppercase tracking-tight">
                Line Items
              </h2>
              <button 
                type="button" onClick={handleAddItem}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold uppercase text-xs tracking-wider px-4 py-2.5 flex items-center gap-2 shadow-sm rounded-xl transition-all cursor-pointer"
              >
                <Plus weight="bold" /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50/50 p-4 border border-gray-100 rounded-2xl relative group">
                  <div className="flex-1 w-full text-left">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Description</label>
                    <input 
                      type="text" required value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-accent-secondary"
                      placeholder="e.g. Logo Design"
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400 text-center">Qty</label>
                    <input 
                      type="number" required min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-accent-secondary text-center"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Price (Rp)</label>
                    <input 
                      type="number" required min="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-accent-secondary"
                    />
                  </div>
                  <button 
                    type="button" onClick={() => handleRemoveItem(idx)}
                    className={`w-11 h-11 shrink-0 bg-red-50 text-red-600 flex items-center justify-center border border-red-100 rounded-xl hover:bg-red-100 transition-colors ${items.length === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={items.length === 1}
                  >
                    <Trash weight="bold" size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Tax Rate (%)</label>
                  <input 
                    type="number" min="0" max="100" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
                    className="w-full md:w-3/4 bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Down Payment (Rp)</label>
                  <input 
                    type="number" min="0" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))}
                    className="w-full md:w-3/4 bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  />
                </div>
              </div>
              <div className="bg-gray-950 text-white p-6 rounded-2xl flex flex-col gap-3 font-semibold text-xs tracking-wider uppercase relative shadow-md">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-bold font-display text-sm text-white">Rp {new Intl.NumberFormat('id-ID').format(calculateSubtotal())}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Tax ({taxRate}%):</span>
                    <span className="font-bold font-display text-sm text-white">Rp {new Intl.NumberFormat('id-ID').format(calculateSubtotal() * (taxRate / 100))}</span>
                  </div>
                )}
                {downPayment > 0 && (
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Down Payment (DP):</span>
                    <span className="font-bold font-display text-sm text-red-400">- Rp {new Intl.NumberFormat('id-ID').format(downPayment)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">Total</span>
                  <span className="font-display font-black text-xl text-emerald-400">Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white font-bold text-sm uppercase tracking-wider py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md rounded-xl disabled:opacity-50 cursor-pointer"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FloppyDisk weight="bold" size={20} />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
