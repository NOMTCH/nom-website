'use client';

import { useState, useEffect } from 'react';
import { Plus, PencilSimple, Trash, Star, CaretUp, CaretDown, Check } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { 
  PricingPackage, 
  getPricingPackages, 
  addPricingPackage, 
  updatePricingPackage, 
  deletePricingPackage 
} from '@/lib/data/pricing';

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [isPopular, setIsPopular] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const data = await getPricingPackages();
    setPackages(data);
    setLoading(false);
  };

  const handleOpenModal = (pkg?: PricingPackage) => {
    if (pkg) {
      setEditingId(pkg.id);
      setName(pkg.name);
      setPrice(pkg.price);
      setDescription(pkg.description);
      setFeatures(pkg.features.length > 0 ? pkg.features : ['']);
      setIsPopular(pkg.is_popular);
      setSortOrder(pkg.sort_order);
    } else {
      setEditingId(null);
      setName('');
      setPrice('');
      setDescription('');
      setFeatures(['']);
      setIsPopular(false);
      setSortOrder(packages.length);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleAddFeature = () => setFeatures([...features, '']);
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanFeatures = features.filter(f => f.trim() !== '');
      const pkgData = {
        name,
        price,
        description,
        features: cleanFeatures,
        is_popular: isPopular,
        sort_order: sortOrder
      };

      if (editingId) {
        await updatePricingPackage(editingId, pkgData);
        toast.success('Paket harga berhasil diupdate!');
      } else {
        await addPricingPackage(pkgData);
        toast.success('Paket harga berhasil ditambahkan!');
      }
      
      handleCloseModal();
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan paket harga');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    try {
      await deletePricingPackage(packageToDelete);
      toast.success('Paket berhasil dihapus');
      fetchPackages();
    } catch (error) {
      toast.error('Gagal menghapus paket');
    } finally {
      setPackageToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-foreground border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight">
              Pricing Packages
            </h1>
            <p className="text-muted mt-2">Manage the pricing tiers shown on the homepage.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-accent text-black font-black uppercase tracking-widest px-6 py-4 flex items-center gap-2 hover:bg-black hover:text-accent transition-colors border-4 border-black shadow-[8px_8px_0_0_#0F0F0F] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0_0_#0F0F0F]"
          >
            <Plus weight="bold" size={20} /> Add Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-surface border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] p-6 relative flex flex-col group">
              {pkg.is_popular && (
                <div className="absolute -top-5 -right-5 bg-accent text-black font-black text-xs uppercase tracking-widest px-4 py-2 border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] flex items-center gap-1 transform rotate-6">
                  <Star weight="fill" size={16} /> POPULAR
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display font-black text-2xl uppercase tracking-tight pr-4">{pkg.name}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenModal(pkg)} className="p-2 hover:bg-accent hover:text-black transition-colors rounded-none border-2 border-transparent hover:border-black">
                    <PencilSimple weight="bold" size={20} />
                  </button>
                  <button onClick={() => setPackageToDelete(pkg.id)} className="p-2 hover:bg-red-500 hover:text-white transition-colors rounded-none border-2 border-transparent hover:border-black text-red-500">
                    <Trash weight="bold" size={20} />
                  </button>
                </div>
              </div>
              
              <div className="text-4xl font-black mb-2">{pkg.price}</div>
              <p className="text-muted text-sm mb-6 h-10">{pkg.description}</p>
              
              <div className="space-y-3 mb-6 flex-1">
                {pkg.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm font-bold">
                    <Check weight="bold" className="text-accent shrink-0 mt-0.5" size={16} />
                    <span>{f}</span>
                  </div>
                ))}
                {pkg.features.length > 4 && (
                  <div className="text-xs text-muted font-bold italic">
                    + {pkg.features.length - 4} more features
                  </div>
                )}
              </div>
              
              <div className="mt-auto pt-6 border-t-4 border-dashed border-border flex items-center justify-between text-xs font-bold text-muted uppercase">
                <span>Order: {pkg.sort_order}</span>
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-span-full p-12 text-center border-4 border-dashed border-border flex flex-col items-center">
              <p className="text-xl font-bold mb-4 uppercase tracking-widest text-muted">Belum ada paket harga</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-background border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8 border-b-4 border-foreground pb-4">
                <h2 className="text-3xl font-display font-black uppercase tracking-tight">
                  {editingId ? 'Edit Package' : 'New Package'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-red-500 hover:text-white transition-colors border-2 border-transparent hover:border-black">
                  <Trash weight="bold" size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-2">Package Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-surface border-4 border-foreground p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-accent"
                      placeholder="e.g. UMKM Starter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-2">Price String</label>
                    <input 
                      type="text" 
                      required
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-surface border-4 border-foreground p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-accent"
                      placeholder="e.g. Rp 1.500.000 / bln"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-surface border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                    placeholder="Short description for this package"
                    rows={2}
                  />
                </div>

                <div className="flex gap-6 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-black uppercase tracking-widest mb-2">Sort Order</label>
                    <input 
                      type="number" 
                      required
                      value={sortOrder}
                      onChange={e => setSortOrder(parseInt(e.target.value))}
                      className="w-full bg-surface border-4 border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                    />
                  </div>
                  <label className="flex-1 flex items-center gap-3 p-3 bg-surface border-4 border-foreground cursor-pointer hover:bg-accent/10 h-[56px]">
                    <input 
                      type="checkbox" 
                      checked={isPopular}
                      onChange={e => setIsPopular(e.target.checked)}
                      className="w-6 h-6 border-4 border-foreground bg-white text-accent focus:ring-0 rounded-none cursor-pointer"
                    />
                    <span className="font-black uppercase tracking-widest text-sm">Mark as Popular</span>
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-black uppercase tracking-widest">Features</label>
                    <button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:text-accent"
                    >
                      <Plus weight="bold" /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-3">
                    {features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text" 
                          value={f}
                          onChange={e => handleFeatureChange(i, e.target.value)}
                          className="flex-1 bg-surface border-4 border-foreground p-2 font-bold text-sm focus:outline-none focus:border-accent"
                          placeholder="Feature detail..."
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFeature(i)}
                          className="p-2 border-4 border-foreground hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t-4 border-foreground flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 font-black uppercase tracking-widest border-4 border-transparent hover:border-foreground"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-black font-black uppercase tracking-widest px-8 py-3 border-4 border-black hover:bg-black hover:text-accent transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Brutal Delete Modal */}
        {packageToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface border-8 border-foreground shadow-[16px_16px_0_0_#FF6138] w-full max-w-md my-8 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
              <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(45deg,#0F0F0F,#0F0F0F_10px,#F7DF1E_10px,#F7DF1E_20px)] border-b-4 border-foreground" />
              
              <div className="p-8 pt-12 text-center">
                <div className="w-20 h-20 bg-red-500 mx-auto border-4 border-foreground shadow-[8px_8px_0_0_#0F0F0F] flex items-center justify-center mb-6">
                  <Trash weight="fill" size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PAKET IEU?</h2>
                <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Nya ah karunya geus nyieun.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPackageToDelete(null)}
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
    </div>
  );
}
