'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { createProposal, ProposalItem } from '@/lib/data/proposals';
import Link from 'next/link';

const PROPOSAL_TEMPLATES = [
  {
    id: 'web-profile',
    name: 'Website Company Profile',
    projectName: 'Pembuatan Website Company Profile',
    projectDescription: 'Desain dan pengembangan website company profile yang modern, interaktif, responsif, dan SEO friendly untuk meningkatkan kehadiran digital perusahaan.',
    items: [
      { id: '1', description: 'UI/UX Design (Figma - Max 5 Halaman)', quantity: 1, price: 3500000, total: 3500000 },
      { id: '2', description: 'Frontend Development (Next.js & Tailwind CSS)', quantity: 1, price: 5000000, total: 5000000 },
      { id: '3', description: 'Domain & Cloud Hosting (1 Tahun)', quantity: 1, price: 1500000, total: 1500000 }
    ],
    notes: 'Ketentuan:\n1. Pembayaran DP 50% sebelum pengerjaan.\n2. Revisi desain maksimal 3 kali (Minor).\n3. Waktu pengerjaan estimasi 2-3 minggu.'
  },
  {
    id: 'web-saas',
    name: 'Web App / Admin Dashboard',
    projectName: 'Pengembangan Web App & Admin Dashboard Terintegrasi',
    projectDescription: 'Pembuatan sistem aplikasi berbasis web (SaaS/Dashboard) lengkap dengan manajemen user, database, dan API menggunakan arsitektur modern (Next.js, Drizzle ORM, Supabase/PostgreSQL).',
    items: [
      { id: '1', description: 'System Architecture & Database Design', quantity: 1, price: 5000000, total: 5000000 },
      { id: '2', description: 'UI/UX Design Web App & Dashboard', quantity: 1, price: 7500000, total: 7500000 },
      { id: '3', description: 'Fullstack Development (Next.js, API, DB)', quantity: 1, price: 15000000, total: 15000000 },
      { id: '4', description: 'Cloud Setup & Deployment Configuration', quantity: 1, price: 2500000, total: 2500000 }
    ],
    notes: 'Ketentuan:\n1. Pembayaran DP 50% di awal, sisa 50% saat rilis.\n2. Estimasi pengerjaan 4-6 minggu.\n3. Gratis bug-fixing & maintenance selama 1 bulan pertama.'
  },
  {
    id: 'graphic-branding',
    name: 'Graphic Design & Brand Identity',
    projectName: 'Branding & Visual Identity Design',
    projectDescription: 'Pembuatan identitas visual merek (Brand Identity) yang profesional dan berkarakter, mencakup logo, panduan gaya, dan aset marketing sosial media.',
    items: [
      { id: '1', description: 'Logo Design (3 Konsep Alternatif)', quantity: 1, price: 3500000, total: 3500000 },
      { id: '2', description: 'Brand Guidelines Book (PDF)', quantity: 1, price: 2000000, total: 2000000 },
      { id: '3', description: 'Social Media Kit (9 Feeds, 3 Stories)', quantity: 1, price: 2500000, total: 2500000 }
    ],
    notes: 'Ketentuan:\n1. DP 50% sebelum pengerjaan.\n2. Hak cipta logo sepenuhnya diserahkan ke klien setelah pelunasan.\n3. Revisi logo maksimal 3 kali.'
  },
  {
    id: 'travel-agency-app',
    name: 'Travel Agency Web App',
    projectName: 'Pengembangan Travel Agency Web App & CMS',
    projectDescription: 'Pembuatan platform aplikasi travel modern (contoh: TG Holiday Tour) dengan fitur portal destinasi, blog rohani, galeri, dan Admin Dashboard terintegrasi untuk manajemen sistem (Next.js, Tailwind, PostgreSQL).',
    items: [
      { id: '1', description: 'System Architecture & UI/UX Design (Travel)', quantity: 1, price: 6000000, total: 6000000 },
      { id: '2', description: 'Frontend Development (Animasi, Responsif, SEO)', quantity: 1, price: 12000000, total: 12000000 },
      { id: '3', description: 'Backend & Admin Dashboard (CMS, Manajemen Tour)', quantity: 1, price: 15000000, total: 15000000 },
      { id: '4', description: 'Server Setup, Domain & Database (1 Tahun)', quantity: 1, price: 2500000, total: 2500000 }
    ],
    notes: 'Ketentuan:\n1. Pembayaran DP 50% di awal, pelunasan 50% saat rilis.\n2. Estimasi pengerjaan 4-8 minggu.\n3. Termasuk panduan penggunaan (training) dan gratis maintenance selama 1 bulan pertama.'
  }
];

export default function CreateProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [proposalNumber, setProposalNumber] = useState(() => `PRP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Valid for 14 days
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState<ProposalItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, total: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(0);

  const applyTemplate = (templateId: string) => {
    if (!templateId) return;
    const t = PROPOSAL_TEMPLATES.find(x => x.id === templateId);
    if (t) {
      setProjectName(t.projectName);
      setProjectDescription(t.projectDescription);
      setItems(t.items.map(i => ({ ...i, id: Math.random().toString() })));
      setNotes(t.notes);
      toast.success(`Template "${t.name}" berhasil diaplikasikan!`);
    }
  };

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

    setLoading(true);
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
        status: 'draft' as const
      };

      await createProposal(proposalData);
      toast.success('Proposal sukses dibuat!');
      router.push('/admin/proposals');
    } catch (error) {
      console.error(error);
      toast.error('Gagal bikin proposal, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/admin/proposals"
          className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm mb-8 hover:text-accent transition-colors"
        >
          <ArrowLeft weight="bold" /> Back to Proposals
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mb-8 pb-4 border-b-4 border-accent flex flex-col md:flex-row md:items-center justify-between gap-4">
          <span>Create Proposal</span>
          
          <select 
            onChange={(e) => applyTemplate(e.target.value)}
            className="text-sm font-bold uppercase tracking-wider bg-accent text-white border border-accent rounded-xl px-4 py-2.5 cursor-pointer hover:bg-accent/90 transition-all outline-none appearance-none"
          >
            <option value="" className="bg-surface text-foreground">✨ Auto-Fill Template</option>
            {PROPOSAL_TEMPLATES.map(t => (
              <option key={t.id} value={t.id} className="bg-surface text-foreground">{t.name}</option>
            ))}
          </select>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-surface border border-border shadow-xl rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-muted mb-6 pb-2 border-b border-border/80">
              Project & Client Info
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Proposal Number</label>
                <input 
                  type="text" required value={proposalNumber} onChange={e => setProposalNumber(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Project Name</label>
                <input 
                  type="text" required value={projectName} onChange={e => setProjectName(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Project Background / Description</label>
                <textarea 
                  value={projectDescription} onChange={e => setProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent resize-none"
                  placeholder="Brief description of the client's needs and our proposed solution..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Client Name (PIC)</label>
                <input 
                  type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                  placeholder="e.g. Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Client Company</label>
                <input 
                  type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                  placeholder="e.g. PT Maju Mundur"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Client Email</label>
                <input 
                  type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                  placeholder="e.g. bos@majumundur.com"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Issue Date</label>
                  <input 
                    type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)}
                    className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-muted mb-2">Valid Until</label>
                  <input 
                    type="date" required value={validUntil} onChange={e => setValidUntil(e.target.value)}
                    className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
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
                      placeholder="e.g. UI/UX Design (3 Pages)"
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
                    placeholder="e.g. Pembayaran DP 50% diawal..."
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
            type="submit" disabled={loading}
            className="w-full bg-accent text-white font-bold text-sm uppercase tracking-wider py-4 flex items-center justify-center gap-2 hover:bg-accent/90 transition-all shadow-lg rounded-xl disabled:opacity-50 cursor-pointer border border-accent"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FloppyDisk weight="bold" size={20} />}
            {loading ? 'Saving Proposal...' : 'Save Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
}
