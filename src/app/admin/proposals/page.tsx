'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Printer, Trash, FileText, Pencil } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Proposal, getProposals, deleteProposal, updateProposalStatus } from '@/lib/data/proposals';
import Portal from '@/components/Portal';

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalToDelete, setProposalToDelete] = useState<string | null>(null);

  const fetchProposals = async () => {
    setLoading(true);
    const data = await getProposals();
    setProposals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const confirmDelete = async () => {
    if (!proposalToDelete) return;
    try {
      await deleteProposal(proposalToDelete);
      toast.success('Proposal berhasil dihapus!');
      fetchProposals();
    } catch (e) {
      toast.error('Gagal menghapus proposal');
    } finally {
      setProposalToDelete(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Proposal['status']) => {
    try {
      await updateProposalStatus(id, newStatus);
      toast.success(`Status diganti jadi ${newStatus.toUpperCase()}`);
      fetchProposals();
    } catch (e) {
      toast.error('Gagal update status');
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'accepted': return 'bg-accent/20 text-accent border-accent/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-background text-muted border-border';
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
              <FileText weight="bold" className="text-accent" /> Proposals
            </h1>
            <p className="text-sm font-semibold text-muted mt-2">Create custom client proposals, track agreement status, and export PDFs.</p>
          </div>
          <Link 
            href="/admin/proposals/create"
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
          >
            <Plus weight="bold" size={20} /> Create Proposal
          </Link>
        </div>

        <div className="bg-surface border border-border/80 shadow-xl rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 text-muted font-semibold uppercase tracking-widest text-xs border-b border-border/80">
                <th className="p-4 whitespace-nowrap">Proposal #</th>
                <th className="hidden md:table-cell p-4">Client</th>
                <th className="hidden md:table-cell p-4">Issue Date</th>
                <th className="hidden lg:table-cell p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted font-bold text-lg uppercase tracking-widest">
                    No Proposals Found
                  </td>
                </tr>
              ) : (
                proposals.map((prop) => (
                  <tr key={prop.id} className="border-b border-border/40 hover:bg-background/50 transition-colors">
                    <td className="p-3 md:p-4 font-black text-base md:text-lg align-top text-foreground">
                      {prop.proposal_number}
                      <div className="text-[10px] md:text-xs text-muted font-bold mt-1 uppercase truncate max-w-[120px] md:max-w-[200px]">{prop.project_name}</div>
                      
                      {/* Mobile Only Info */}
                      <div className="md:hidden mt-3 pt-3 border-t border-border/40">
                        <div className="text-xs font-bold truncate max-w-[120px] text-foreground">{prop.client_name}</div>
                        <div className="text-xs text-accent font-bold mt-1">Rp {new Intl.NumberFormat('id-ID').format(prop.total)}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold align-top text-foreground">
                      {prop.client_name}
                      {prop.client_company && <div className="text-xs text-muted font-normal mt-1">{prop.client_company}</div>}
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold text-sm align-top text-muted">
                      {new Date(prop.issue_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="hidden lg:table-cell p-4 font-black text-lg text-accent align-top">
                      Rp {new Intl.NumberFormat('id-ID').format(prop.total)}
                    </td>
                    <td className="p-3 md:p-4 align-top">
                      <select 
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value as Proposal['status'])}
                        className={`text-[10px] md:text-xs font-bold uppercase tracking-widest border rounded-xl px-2.5 py-1.5 cursor-pointer hover:scale-105 transition-all outline-none ${getStatusColor(prop.status)}`}
                      >
                        <option value="draft" className="bg-surface text-foreground">DRAFT</option>
                        <option value="sent" className="bg-surface text-foreground">SENT</option>
                        <option value="accepted" className="bg-surface text-foreground">ACCEPTED</option>
                        <option value="rejected" className="bg-surface text-foreground">REJECTED</option>
                      </select>
                    </td>
                    <td className="p-3 md:p-4 align-top h-full">
                      <div className="flex flex-col sm:flex-row gap-2 h-full">
                        <Link 
                          href={`/admin/proposals/${prop.id}/edit`}
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Edit"
                        >
                          <Pencil weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <Link 
                          href={`/admin/proposals/${prop.id}/print`}
                          target="_blank"
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Print / PDF"
                        >
                          <Printer weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <button 
                          onClick={() => setProposalToDelete(prop.id)}
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
      {proposalToDelete && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden text-foreground animate-scale-in">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 mx-auto rounded-2xl flex items-center justify-center mb-6">
                  <Trash weight="fill" size={32} />
                </div>
                <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2 text-foreground">Delete Proposal?</h2>
                <p className="font-semibold text-muted mb-8 text-sm">Are you sure you want to delete this proposal? This action cannot be undone.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setProposalToDelete(null)}
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
