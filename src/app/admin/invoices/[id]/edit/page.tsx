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
    return sub + (sub * (taxRate / 100));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === 'description') {
      item.description = value as string;
    } else {
      (item as any)[field] = Number(value);
      if (field === 'quantity' || field === 'price') {
        item.total = item.quantity * item.price;
      }
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
        <div className="w-12 h-12 border-4 border-foreground border-t-accent rounded-full animate-spin"></div>
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
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mb-8 pb-4 border-b-4 border-foreground">
          Edit Invoice
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-surface border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest bg-foreground text-white inline-block px-4 py-2 transform -rotate-2 -ml-2 mb-4 shadow-[4px_4px_0_0_#F7DF1E]">
              Client Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Invoice Number</label>
                <input 
                  type="text" required value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)}
                  className="w-full bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Project Name</label>
                <input 
                  type="text" required value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                  placeholder="e.g. Redesign Logo UMKM"
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Client Name</label>
                <input 
                  type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                  className="w-full bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                  placeholder="e.g. PT Maju Mundur"
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Client Email</label>
                <input 
                  type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                  placeholder="e.g. bos@majumundur.com"
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Issue Date</label>
                <input 
                  type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)}
                  className="w-full bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Due Date</label>
                <input 
                  type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] p-8 space-y-6">
            <div className="flex items-center justify-between border-b-4 border-foreground pb-4 mb-4">
              <h2 className="text-2xl font-black uppercase tracking-widest text-foreground">
                Line Items
              </h2>
              <button 
                type="button" onClick={handleAddItem}
                className="bg-accent text-black font-black uppercase tracking-widest px-4 py-2 flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_#0F0F0F] active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                <Plus weight="bold" /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 border-4 border-dashed border-border relative group">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted">Description</label>
                    <input 
                      type="text" required value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-surface border-2 border-foreground p-2 font-bold focus:outline-none focus:border-accent"
                      placeholder="e.g. Logo Design"
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted">Qty</label>
                    <input 
                      type="number" required min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-surface border-2 border-foreground p-2 font-bold focus:outline-none focus:border-accent text-center"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted">Price (Rp)</label>
                    <input 
                      type="number" required min="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)}
                      className="w-full bg-surface border-2 border-foreground p-2 font-bold focus:outline-none focus:border-accent"
                    />
                  </div>
                  <button 
                    type="button" onClick={() => handleRemoveItem(idx)}
                    className={`w-11 h-11 shrink-0 bg-red-500 text-white flex items-center justify-center border-2 border-foreground hover:bg-red-600 transition-colors ${items.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={items.length === 1}
                  >
                    <Trash weight="bold" size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t-4 border-foreground grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest mb-2">Tax Rate (%)</label>
                <input 
                  type="number" min="0" max="100" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full md:w-1/2 bg-white border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                />
              </div>
              <div className="bg-foreground text-white p-6 flex flex-col gap-3 font-black text-lg tracking-widest uppercase relative shadow-[8px_8px_0_0_#F7DF1E]">
                <div className="flex justify-between border-b-2 border-dashed border-gray-600 pb-2">
                  <span>Subtotal:</span>
                  <span>Rp {new Intl.NumberFormat('id-ID').format(calculateSubtotal())}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between border-b-2 border-dashed border-gray-600 pb-2 text-accent">
                    <span>Tax ({taxRate}%):</span>
                    <span>Rp {new Intl.NumberFormat('id-ID').format(calculateSubtotal() * (taxRate / 100))}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl pt-2 text-accent">
                  <span>Total:</span>
                  <span>Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-accent text-black font-black text-xl uppercase tracking-widest py-6 flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all border-4 border-black shadow-[8px_8px_0_0_#0F0F0F] active:translate-y-2 active:translate-x-2 active:shadow-none disabled:opacity-50"
          >
            {loading ? <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div> : <FloppyDisk weight="bold" size={28} />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
