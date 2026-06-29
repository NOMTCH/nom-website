'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash, Pencil, Eye, Heart, X, Check, LinkBreak } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Invitation, getInvitations, deleteInvitation, createInvitation, updateInvitation } from '@/lib/data/invitations';
import { DEFAULT_DUMMY_DATA } from '@/components/invitation/InvitationEngine';

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newTheme, setNewTheme] = useState('classic-gold');
  const [creating, setCreating] = useState(false);
  
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const data = await getInvitations();
      setInvitations(data);
    } catch (e) {
      toast.error('Gagal memuat data undangan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug.trim()) {
      toast.error('Slug tidak boleh kosong');
      return;
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(newSlug)) {
      toast.error('Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)');
      return;
    }

    setCreating(true);
    try {
      // Check if slug is already used
      const existing = invitations.find(inv => inv.slug === newSlug);
      if (existing) {
        toast.error('Slug sudah digunakan, cari nama lain');
        setCreating(false);
        return;
      }

      const newInv = await createInvitation({
        slug: newSlug.trim().toLowerCase(),
        theme_id: newTheme,
        status: 'draft',
        data: DEFAULT_DUMMY_DATA,
        customer_id: null
      });

      toast.success('Undangan baru berhasil dibuat!');
      setIsCreateOpen(false);
      setNewSlug('');
      fetchInvitations();
    } catch (err) {
      toast.error('Gagal membuat undangan. Cek apakah slug sudah ada.');
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!invitationToDelete) return;
    try {
      await deleteInvitation(invitationToDelete);
      toast.success('Undangan berhasil dihapus!');
      fetchInvitations();
    } catch (e) {
      toast.error('Gagal menghapus undangan');
    } finally {
      setInvitationToDelete(null);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: 'draft' | 'published' | 'expired') => {
    try {
      let newStatus: 'draft' | 'published' | 'expired' = 'draft';
      if (currentStatus === 'draft') newStatus = 'published';
      else if (currentStatus === 'published') newStatus = 'expired';
      else newStatus = 'draft';

      await updateInvitation(id, { 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      });
      toast.success(`Status diperbarui menjadi ${newStatus.toUpperCase()}`);
      fetchInvitations();
    } catch (e) {
      toast.error('Gagal memperbarui status');
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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Heart weight="bold" className="text-red-500 animate-pulse" /> Invitations
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-2">Kelola data undangan nikah, pantau kehadiran RSVP, jeung edit isi ucapan kasep.</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
          >
            <Plus weight="bold" size={20} /> Buat Undangan
          </button>
        </div>

        {/* Table List */}
        <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 font-semibold uppercase tracking-wider text-xs border-b border-gray-100">
                <th className="p-4 border-b border-gray-100 whitespace-nowrap">Undangan</th>
                <th className="hidden md:table-cell p-4 border-b border-gray-100">Slug / Link</th>
                <th className="hidden md:table-cell p-4 border-b border-gray-100">Tema</th>
                <th className="p-4 border-b border-gray-100">Status</th>
                <th className="p-4 border-b border-gray-100">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted font-bold text-lg uppercase tracking-widest">
                    Belum ada undangan yang dibuat.
                  </td>
                </tr>
              ) : (
                invitations.map((inv) => {
                  const groomName = inv.data?.groom?.name || 'Groom';
                  const brideName = inv.data?.bride?.name || 'Bride';
                  return (
                    <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <td className="p-3 md:p-4 font-black text-base md:text-lg align-top">
                        {groomName} & {brideName}
                        <div className="text-[10px] md:text-xs text-muted font-bold mt-1 uppercase">Dibuat: {inv.created_at ? new Date(inv.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</div>
                        
                        {/* Mobile Only Info */}
                        <div className="md:hidden mt-2 pt-2 border-t border-dashed border-border">
                          <div className="text-xs font-bold text-accent-dark">/inv/{inv.slug}</div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell p-4 font-bold align-top text-blue-600 hover:underline">
                        <Link href={`/inv/${inv.slug}`} target="_blank">
                          /inv/{inv.slug}
                        </Link>
                      </td>
                      <td className="hidden md:table-cell p-4 font-bold text-sm align-top">
                        <span className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg font-semibold text-[10px] uppercase">
                          {inv.theme_id}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 align-top">
                        <button 
                          onClick={() => handleStatusToggle(inv.id, inv.status)}
                          className={`px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-border rounded-xl transition-all ${
                            inv.status === 'published' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 
                            inv.status === 'draft' ? 'bg-amber-500 text-white hover:bg-amber-600' : 
                            'bg-red-500 text-white hover:bg-red-600'
                          }`}
                          title="Klik untuk ubah status"
                        >
                          {inv.status}
                        </button>
                      </td>
                      <td className="p-3 md:p-4 align-top">
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/invitations/${inv.id}`}
                            className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-600 rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0"
                            title="Edit Data & Lihat RSVP"
                          >
                            <Pencil weight="bold" size={18} />
                          </Link>
                          <Link 
                            href={`/inv/${inv.slug}`}
                            target="_blank"
                            className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-600 rounded-lg flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all shrink-0"
                            title="Buka Undangan"
                          >
                            <Eye weight="bold" size={18} />
                          </Link>
                          <button 
                            onClick={() => setInvitationToDelete(inv.id)}
                            className="w-9 h-9 bg-gray-50 border border-gray-200/80 text-gray-500 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-white hover:border-red-500 transition-all shrink-0"
                            title="Hapus Undangan"
                          >
                            <Trash weight="bold" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Create Invitation */}
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-foreground hover:text-red-500"
              >
                <X weight="bold" size={24} />
              </button>
              
              <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-6">
                Buat Undangan Baru
              </h2>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-foreground">
                    URL Slug Undangan
                  </label>
                  <div className="flex border border-border rounded-2xl">
                    <span className="bg-gray-200 px-3 py-3 border-border text-sm font-bold text-gray-600 flex items-center">
                      /inv/
                    </span>
                    <input 
                      type="text" 
                      placeholder="romeo-juliet"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="w-full p-3 text-sm focus:outline-none font-bold"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">
                    Hanya boleh huruf kecil, angka, dan tanda hubung (-)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2 text-foreground">
                    Pilih Tema Undangan
                  </label>
                  <select 
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full p-3 border border-border rounded-2xl text-sm font-bold bg-white focus:outline-none"
                  >
                    <option value="classic-gold">Classic Gold (Premium Boho Art Deco)</option>
                    <option value="modern-minimalist">Modern Minimalist</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {creating ? 'Membuat...' : 'Buat Undangan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Delete */}
        {invitationToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center">
              <h3 className="text-xl font-display font-black uppercase tracking-tight mb-4 text-red-500">
                Hapus Undangan?
              </h3>
              <p className="text-sm font-bold text-gray-600 mb-6 uppercase">
                Tindakan ini tidak bisa dibatalkan. Semua data undangan dan tanggapan RSVP tamu akan terhapus permanen.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setInvitationToDelete(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
