'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash, Tag, SpinnerGap, PencilSimple, CheckCircle, XCircle, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

type Promo = {
  id: string;
  title: string;
  description: string;
  code: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

export default function PromosDashboard() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<{ id: string; imageUrl: string } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [existingImage, setExistingImage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const fetchPromos = async () => {
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPromos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const openModal = (promo?: Promo | any) => {
    if (promo) {
      setEditingId(promo.id);
      setTitle(promo.title);
      setDescription(promo.description || '');
      setCode(promo.code);
      setIsActive(promo.is_active);
      setExistingImage(promo.image_url || '');
      setFile(null);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setCode('');
      setIsActive(true);
      setExistingImage('');
    }
    setFile(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setUploading(true);

    try {
      let finalImageUrl = existingImage;

      // Upload new file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `promos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      const payload = {
        title,
        description,
        code,
        image_url: finalImageUrl,
        is_active: isActive
      };

      if (editingId) {
        const { error: dbError } = await supabase
          .from('promos')
          .update(payload)
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from('promos')
          .insert([payload]);
        if (dbError) throw dbError;
      }

      setShowModal(false);
      fetchPromos();
      toast.success('Promo saved successfully!');
    } catch (error: any) {
      toast.error('Save failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!promoToDelete) return;
    try {
      if (promoToDelete.imageUrl) {
        const pathParts = promoToDelete.imageUrl.split('/portfolio/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from('portfolio').remove([filePath]);
        }
      }

      await supabase.from('promos').delete().eq('id', promoToDelete.id);
      fetchPromos();
      setPromoToDelete(null);
      toast.success('PROMO GEUS DIHAPUS!');
    } catch (error: any) {
      toast.error('Gagal ngahapus: ' + error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('promos')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    
    if (!error) fetchPromos();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-2">Vouchers / Promos</h1>
          <p className="text-muted text-sm">Manage promotional codes, discounts, and visual banners.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
        >
          <Plus weight="bold" size={20} />
          Create Promo
        </button>
      </header>

      {/* Data Grid */}
      {loading ? (
        <div className="flex justify-center p-12">
          <SpinnerGap className="animate-spin text-accent" size={48} />
        </div>
      ) : promos.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-3xl p-12 text-center text-muted font-semibold uppercase tracking-widest bg-gray-50/50">
          No Promos Found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((p) => (
            <div key={p.id} className="bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative">
              <div className="relative aspect-[21/9] border-b border-gray-100 overflow-hidden bg-black">
                {p.image_url ? (
                  <img src={p.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="relative aspect-[21/9] bg-accent border-b border-gray-100 flex items-center justify-center">
                    <Tag weight="fill" size={48} className="text-black opacity-50" />
                  </div>
                )}
                
                {/* Status Badge */}
                <button 
                  onClick={() => toggleActive(p.id, p.is_active)}
                  className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 border border-border rounded-lg uppercase tracking-wider flex items-center gap-1 transition-all ${
                    p.is_active ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {p.is_active ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}
                  {p.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter line-clamp-1">{p.title}</h3>
                  {p.code && (
                    <span className="bg-white border border-border rounded-xl px-2 py-0.5 text-xs font-black flex items-center gap-1 whitespace-nowrap">
                      <Tag weight="bold" /> {p.code}
                    </span>
                  )}
                </div>
                
                <p className="text-sm font-bold text-gray-500 line-clamp-2 mb-4">{p.description}</p>
                
                <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                  <button onClick={() => openModal(p)} className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase hover:bg-accent/10 hover:text-accent hover:border-accent transition-all flex items-center justify-center gap-1.5">
                    <PencilSimple weight="bold" /> Edit
                  </button>
                  <button onClick={() => setPromoToDelete({ id: p.id, imageUrl: p.image_url || '' })} className="py-2 px-3.5 bg-red-50 text-red-600 border border-transparent rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center">
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl w-full max-w-2xl my-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute -top-3 -right-3 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-all">
              <X weight="bold" size={24} />
            </button>
            
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-3xl">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight text-gray-900">
                {editingId ? 'Edit Promo' : 'New Promo'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Promo Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Promo Code (Optional)</label>
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. NOMSTD2026"
                    className="w-full px-4 py-3 bg-[#F5F5F5] border border-border rounded-xl font-mono text-sm uppercase focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-start">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Status</label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-xl bg-white hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-5 h-5 accent-accent border border-border rounded-xl"
                    />
                    <span className="font-bold uppercase text-sm">Set as Active</span>
                  </label>
                </div>
              </div>

              {/* Existing Image Display */}
              {existingImage && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Current Banner Image</label>
                  <div className="relative aspect-[21/9] bg-black border border-border rounded-xl group max-w-sm">
                    <img src={existingImage} className="w-full h-full object-cover opacity-60" />
                    <button 
                      type="button"
                      onClick={() => setExistingImage('')}
                      className="absolute inset-0 bg-red-500/80 text-white font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      REMOVE BANNER
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Upload New Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200/80 rounded-xl py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-gray-50 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-accent text-white border border-border rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all disabled:opacity-50 flex justify-center items-center gap-1.5"
                >
                  {uploading ? <SpinnerGap className="animate-spin" size={20} /> : 'Save Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brutal Delete Modal */}
      {promoToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            
            
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PROMO IEU?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Datana bakal leungit salawasna.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setPromoToDelete(null)}
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
