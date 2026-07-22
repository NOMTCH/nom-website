'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { getProposalById, updateProposal, ProposalItem } from '@/lib/data/proposals';
import Link from 'next/link';

export default function EditProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [proposalNumber, setProposalNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [taxRate, setTaxRate] = useState(0);

  useEffect(() => {
    const loadProposal = async () => {
      const data = await getProposalById(id);
      if (data) {
        setProposalNumber(data.proposal_number);
        setClientName(data.client_name);
        setClientCompany(data.client_company || '');
        setClientEmail(data.client_email || '');
        setProjectName(data.project_name);
        setProjectDescription(data.project_description || '');
        setIssueDate(data.issue_date);
        setValidUntil(data.valid_until);
        setNotes(data.notes || '');
        setItems(data.items);
        setTaxRate(data.tax_rate);
      } else {
        toast.error('Proposal tidak ditemukan');
        router.push('/admin/proposals');
      }
      setLoading(false);
    };
    loadProposal();
  }, [id, router]);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + (sub * (taxRate / 100));
  };

  const handleItemChange = (index: number, field: keyof ProposalItem, value: string | number) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === 'description') {
      item.description = value as string;
    } else if (field === 'quantity' || field === 'price' || field === 'total') {
      item[field] = Number(value);
      if (field === 'quantity' || field === 'price') {
        item.total = item.quantity * item.price;
      }
    } else if (field === 'id') {
      item.id = value as string;
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
    if (items.some(i => !i.description || i.price < 0)) {
      toast.error('Pastikan semua item punya deskripsi dan harga yang valid!');
      return;
    }

    setSaving(true);
    try {
      const proposalData = {
        proposal_number: proposalNumber,
        client_name: clientName,
        client_company: clientCompany,
        client_email: clientEmail,
        project_name: projectName,
        project_description: projectDescription,
        issue_date: issueDate,
        valid_until: validUntil,
        notes: notes,
        items,
        subtotal: calculateSubtotal(),
        tax_rate: taxRate,
        total: calculateTotal(),
      };

      await updateProposal(id, proposalData);
      toast.success('Proposal sukses diupdate!');
      router.push('/admin/proposals');
    } catch (error) {
      console.error(error);
      toast.error('Gagal update proposal, coba lagi.');
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/proposals"
          className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-8 hover:text-accent transition-colors"
        >
          <ArrowLeft weight="bold" /> Back to Proposals
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mb-8 pb-4 border-b-4 border-foreground">
          Edit Proposal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500 mb-6 pb-2 border-b border-gray-100">
              Project & Client Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Proposal Number</label>
                <input 
                  type="text" required value={proposalNumber} onChange={e => setProposalNumber(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Project Name</label>
                <input 
                  type="text" required value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Project Background / Description</label>
                <textarea 
                  value={projectDescription} onChange={e => setProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Client Name (PIC)</label>
                <input 
                  type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Client Company</label>
                <input 
                  type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Client Email</label>
                <input 
                  type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Issue Date</label>
                  <input 
                    type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)}
                    className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Valid Until</label>
                  <input 
                    type="date" required value={validUntil} onChange={e => setValidUntil(e.target.value)}
                    className="w-full bg-white border border-border rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border shadow-xl rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
              <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">
                Scope of Work & Pricing
              </h2>
              <button 
                type="button" onClick={handleAddItem}
                className="bg-accent text-white hover:bg-accent/90 border border-accent font-bold uppercase text-xs tracking-wider px-4 py-2.5 flex items-center gap-2 shadow-sm rounded-xl transition-all cursor-pointer"
              >
                <Plus weight="bold" /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-end bg-background p-4 border border-border/80 rounded-2xl relative group">
                  <div className="flex-1 w-full text-left">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted">Deliverable / Description</label>
                    <input 
                      type="text" required value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-surface border border-border text-foreground rounded-xl p-2.5 font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted text-center">Qty</label>
                    <input 
                      type="number" required min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-surface border border-border text-foreground rounded-xl p-2.5 font-semibold focus:outline-none focus:border-accent text-center"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-muted">Price (Rp)</label>
                    <input 
                      type="number" required min="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)}
                      className="w-full bg-surface border border-border text-foreground rounded-xl p-2.5 font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                  <button 
                    type="button" onClick={() => handleRemoveItem(idx)}
                    className={`w-11 h-11 shrink-0 bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors ${items.length === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    disabled={items.length === 1}
                  >
                    <Trash weight="bold" size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Tax Rate (%)</label>
                  <input 
                    type="number" min="0" max="100" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}
                    className="w-full md:w-1/2 bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Extra Notes / Terms (Optional)</label>
                  <textarea 
                    value={notes} onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>
              <div className="bg-background border border-border text-foreground p-6 rounded-2xl flex flex-col gap-3 font-semibold text-xs tracking-wider uppercase relative shadow-lg">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="font-bold font-display text-sm text-foreground">Rp {new Intl.NumberFormat('id-ID').format(calculateSubtotal())}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-muted">Tax ({taxRate}%):</span>
                    <span className="font-bold font-display text-sm text-foreground">Rp {new Intl.NumberFormat('id-ID').format(calculateSubtotal() * (taxRate / 100))}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted uppercase text-xs font-bold tracking-wider">Total</span>
                  <span className="font-display font-black text-xl text-accent">Rp {new Intl.NumberFormat('id-ID').format(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={saving}
            className="w-full bg-accent text-white font-bold text-sm uppercase tracking-wider py-4 flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg rounded-xl disabled:opacity-50 cursor-pointer border border-accent"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FloppyDisk weight="bold" size={20} />}
            {saving ? 'Updating...' : 'Update Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
}
