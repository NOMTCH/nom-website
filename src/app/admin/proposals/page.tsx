'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Printer, Trash, FileText, Pencil } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Proposal, getProposals, deleteProposal, updateProposalStatus } from '@/lib/data/proposals';

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
      case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
              <FileText weight="bold" /> Proposals
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-2">Buat proposal keren, ajuin ke klien, dan deal project dengan mudah.</p>
          </div>
          <Link 
            href="/admin/proposals/create"
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
          >
            <Plus weight="bold" size={20} /> Buat Proposal
          </Link>
        </div>

        <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-100">
                <th className="p-4 border-b border-gray-100 whitespace-nowrap">Proposal #</th>
                <th className="hidden md:table-cell p-4 border-b border-gray-100">Client</th>
                <th className="hidden md:table-cell p-4 border-b border-gray-100">Date</th>
                <th className="hidden lg:table-cell p-4 border-b border-gray-100">Total</th>
                <th className="p-4 border-b border-gray-100">Status</th>
                <th className="p-4 border-b border-gray-100">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted font-bold text-lg uppercase tracking-widest">
                    Belum ada proposal yang dibuat.
                  </td>
                </tr>
              ) : (
                proposals.map((prop) => (
                  <tr key={prop.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                    <td className="p-3 md:p-4 font-black text-base md:text-lg align-top">
                      {prop.proposal_number}
                      <div className="text-[10px] md:text-xs text-muted font-bold mt-1 uppercase truncate max-w-[120px] md:max-w-[200px]">{prop.project_name}</div>
                      
                      {/* Mobile Only Info */}
                      <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs font-bold truncate max-w-[120px]">{prop.client_name}</div>
                        <div className="text-xs text-emerald-600 mt-1">Rp {new Intl.NumberFormat('id-ID').format(prop.total)}</div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold align-top">
                      {prop.client_name}
                      {prop.client_company && <div className="text-xs text-muted font-normal mt-1">{prop.client_company}</div>}
                    </td>
                    <td className="hidden md:table-cell p-4 font-bold text-sm align-top">
                      {new Date(prop.issue_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="hidden lg:table-cell p-4 font-black text-lg text-emerald-600 align-top">
                      Rp {new Intl.NumberFormat('id-ID').format(prop.total)}
                    </td>
                    <td className="p-3 md:p-4 align-top">
                      <select 
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value as Proposal['status'])}
                        className={`text-[10px] md:text-xs font-bold uppercase tracking-widest border rounded-xl px-2.5 py-1.5 cursor-pointer hover:scale-105 transition-all outline-none ${getStatusColor(prop.status)}`}
                      >
                        <option value="draft">DRAFT</option>
                        <option value="sent">SENT</option>
                        <option value="accepted">ACCEPTED</option>
                        <option value="rejected">REJECTED</option>
                      </select>
                    </td>
                    <td className="p-3 md:p-4 align-top h-full">
                      <div className="flex flex-col sm:flex-row gap-2 h-full">
                        <Link 
                          href={`/admin/proposals/${prop.id}/edit`}
                          className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-600 rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Edit"
                        >
                          <Pencil weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <Link 
                          href={`/admin/proposals/${prop.id}/print`}
                          target="_blank"
                          className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-600 rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                          title="Print / PDF"
                        >
                          <Printer weight="bold" size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <button 
                          onClick={() => setProposalToDelete(prop.id)}
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

      {/* Delete Modal */}
      {proposalToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PROPOSAL IEU?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Proposal moal bisa balik deui nya!</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setProposalToDelete(null)}
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
