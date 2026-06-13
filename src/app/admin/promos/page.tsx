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
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
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

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPromos(data);
    setLoading(false);
  };

  const openModal = (promo?: Promo | any) => {
    if (promo) {
      setEditingId(promo.id);
      setTitle(promo.title);
      setDescription(promo.description || '');
      setCode(promo.code || '');
      setIsActive(promo.is_active !== undefined ? promo.is_active : promo.isActive);
      setExistingImage(promo.image_url || promo.imageUrl || '');
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
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter text-foreground leading-none mb-2">Vouchers / Promos</h1>
          <div className="w-24 h-2 bg-accent" />
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#F7DF1E] border-4 border-foreground font-black uppercase shadow-[6px_6px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all   "
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
        <div className="border-4 border-dashed border-gray-300  p-12 text-center text-gray-500 font-bold uppercase tracking-widest">
          No Promos Found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((p) => (
            <div key={p.id} className="bg-surface border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] flex flex-col group relative">
              <div className="relative aspect-[21/9] border-b-4 border-foreground overflow-hidden bg-black">
                {p.image_url ? (
                  <img src={p.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="relative aspect-[21/9] bg-accent border-b-4 border-foreground flex items-center justify-center">
                    <Tag weight="fill" size={48} className="text-black opacity-50" />
                  </div>
                )}
                
                {/* Status Badge */}
                <button 
                  onClick={() => toggleActive(p.id, p.is_active)}
                  className={`absolute top-2 right-2 text-xs font-black px-2 py-1 border-2 border-foreground uppercase tracking-widest flex items-center gap-1 transition-colors ${
                    p.is_active ? 'bg-accent text-black hover:bg-white' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
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
                    <span className="bg-white border-2 border-foreground px-2 py-0.5 text-xs font-black flex items-center gap-1 whitespace-nowrap">
                      <Tag weight="bold" /> {p.code}
                    </span>
                  )}
                </div>
                
                <p className="text-sm font-bold text-gray-500 line-clamp-2 mb-4">{p.description}</p>
                
                <div className="mt-auto flex gap-2 pt-4 border-t-2 border-dashed border-gray-300">
                  <button onClick={() => openModal(p)} className="flex-1 py-2 bg-black text-white font-bold text-sm uppercase hover:bg-accent hover:text-black transition-colors border-2 border-transparent hover:border-foreground flex items-center justify-center gap-2">
                    <PencilSimple weight="bold" /> Edit
                  </button>
                  <button onClick={() => setPromoToDelete({ id: p.id, imageUrl: p.image_url || '' })} className="py-2 px-4 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors border-2 border-transparent hover:border-foreground flex items-center justify-center">
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
          <div className="bg-surface border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] w-full max-w-2xl my-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute -top-4 -right-4 w-12 h-12 bg-accent border-4 border-foreground flex items-center justify-center hover:translate-y-1 hover:-translate-x-1 transition-transform shadow-[4px_4px_0_0_#0F0F0F]">
              <X weight="bold" size={24} />
            </button>
            
            <div className="p-6 border-b-4 border-foreground bg-accent">
              <h2 className="text-3xl font-display font-black uppercase tracking-tighter">
                {editingId ? 'Edit Promo' : 'New Promo'}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground ">Promo Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-foreground font-mono text-sm focus:outline-none focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground ">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-foreground font-mono text-sm focus:outline-none focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground ">Promo Code (Optional)</label>
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. NOMSTD2026"
                    className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-foreground font-mono text-sm uppercase focus:outline-none focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2 flex flex-col justify-start">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground mb-2">Status</label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-foreground bg-white hover:bg-gray-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-5 h-5 accent-accent border-2 border-foreground"
                    />
                    <span className="font-bold uppercase text-sm">Set as Active</span>
                  </label>
                </div>
              </div>

              {/* Existing Image Display */}
              {existingImage && (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground ">Current Banner Image</label>
                  <div className="relative aspect-[21/9] bg-black border-2 border-foreground group max-w-sm">
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
                <label className="text-xs font-black uppercase tracking-widest text-foreground ">Upload New Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border-2 border-foreground font-mono text-sm focus:outline-none focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-4 border-foreground font-black uppercase hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-accent border-4 border-foreground font-black uppercase text-black shadow-[6px_6px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all active:translate-y-2 disabled:opacity-50 flex justify-center items-center"
                >
                  {uploading ? <SpinnerGap className="animate-spin" size={24} /> : 'Save Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brutal Delete Modal */}
      {promoToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface border-8 border-foreground shadow-[16px_16px_0_0_#FF6138] w-full max-w-md my-8 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
            <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(45deg,#0F0F0F,#0F0F0F_10px,#F7DF1E_10px,#F7DF1E_20px)] border-b-4 border-foreground" />
            
            <div className="p-8 pt-12 text-center">
              <div className="w-20 h-20 bg-red-500 mx-auto border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] flex items-center justify-center mb-6">
                <Trash weight="fill" size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PROMO IEU?</h2>
              <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Datana bakal leungit salawasna.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setPromoToDelete(null)}
                  className="flex-1 py-4 bg-white border-4 border-foreground font-black uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-[4px_4px_0_0_#0F0F0F] active:translate-y-1 active:shadow-[0_0_0_0_#0F0F0F]"
                >
                  TEU JADI
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white border-4 border-foreground font-black uppercase tracking-widest shadow-[4px_4px_0_0_#0F0F0F] hover:bg-red-600 active:translate-y-1 active:shadow-[0_0_0_0_#0F0F0F] transition-all"
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
