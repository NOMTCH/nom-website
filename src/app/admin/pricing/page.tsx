'use client';

import { useState, useEffect } from 'react';
import { Plus, PencilSimple, Trash, Star, CaretUp, CaretDown, Check, X } from '@phosphor-icons/react';
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
  const [category, setCategory] = useState('Graphic Design');
  const [features, setFeatures] = useState<string[]>(['']);
  const [isPopular, setIsPopular] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    const data = await getPricingPackages();
    setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenModal = (pkg?: PricingPackage) => {
    if (pkg) {
      setEditingId(pkg.id);
      setName(pkg.name);
      setPrice(pkg.price);
      setDescription(pkg.description);
      setCategory(pkg.category || 'Graphic Design');
      setFeatures(pkg.features.length > 0 ? pkg.features : ['']);
      setIsPopular(pkg.is_popular);
      setSortOrder(pkg.sort_order ?? 0);
    } else {
      setEditingId(null);
      setName('');
      setPrice('');
      setDescription('');
      setCategory('Graphic Design');
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
        category,
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
        <div className="w-12 h-12 border border-border rounded-2xl border-t-accent animate-spin"></div>
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
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent/90 transition-all flex items-center gap-1.5"
          >
            <Plus weight="bold" size={20} /> Add Package
          </button>
        </div>

        <div className="bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-background/80 border-b border-border/80 text-xs font-bold uppercase tracking-widest text-muted">
                  <th className="p-4">Package Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-center">Popular</th>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-border/40 hover:bg-background/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground">{pkg.name}</div>
                      <div className="text-xs text-muted truncate max-w-xs">{pkg.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-background border border-border text-foreground px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-accent">
                      Rp {new Intl.NumberFormat('id-ID').format(Number(pkg.price))}
                    </td>
                    <td className="p-4 text-center">
                      {pkg.is_popular ? (
                        <span className="inline-block bg-accent/20 border border-accent/30 text-accent px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-block text-muted/50">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-muted">
                      {pkg.sort_order}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(pkg)} className="p-2 text-muted hover:bg-background hover:text-accent transition-colors rounded-xl border border-transparent hover:border-border">
                          <PencilSimple weight="bold" size={18} />
                        </button>
                        <button onClick={() => setPackageToDelete(pkg.id)} className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors rounded-xl border border-transparent hover:border-red-500/20">
                          <Trash weight="bold" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted font-bold uppercase tracking-widest text-sm">
                      Belum ada paket harga
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-surface border border-border shadow-2xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-foreground">
              <div className="flex justify-between items-center mb-8 border-b border-border/80 pb-4">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight text-foreground">
                  {editingId ? 'Edit Package' : 'New Package'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 text-muted hover:text-foreground hover:bg-background rounded-xl transition-colors">
                  <X weight="bold" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Package Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-background border border-border rounded-2xl p-3 font-bold text-foreground text-lg focus:outline-none focus:border-accent"
                      placeholder="e.g. UMKM Starter"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Nominal Harga</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 font-black text-accent select-none pointer-events-none text-base">Rp</span>
                      <input 
                        type="number" 
                        required
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl p-3 !pl-12 font-bold text-foreground text-lg focus:outline-none focus:border-accent"
                        placeholder="1500000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Category</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-background border border-border text-foreground rounded-2xl p-3 pr-10 font-bold text-base focus:outline-none focus:border-accent appearance-none cursor-pointer"
                    >
                      <option value="Graphic Design" className="bg-surface text-foreground">Graphic Design</option>
                      <option value="Photography" className="bg-surface text-foreground">Photography</option>
                      <option value="Videography" className="bg-surface text-foreground">Videography</option>
                      <option value="Web Development" className="bg-surface text-foreground">Web Development</option>
                      <option value="IT Solutions" className="bg-surface text-foreground">IT Solutions</option>
                    </select>
                    <CaretDown weight="bold" size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-semibold focus:outline-none focus:border-accent"
                    placeholder="Short description for this package"
                    rows={2}
                  />
                </div>

                <div className="flex gap-6 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Sort Order</label>
                    <input 
                      type="number" 
                      required
                      value={sortOrder}
                      onChange={e => setSortOrder(parseInt(e.target.value))}
                      className="w-full bg-background border border-border text-foreground rounded-2xl p-3 font-bold focus:outline-none focus:border-accent"
                    />
                  </div>
                  <label className="flex-1 flex items-center gap-3 p-3 bg-background border border-border rounded-2xl cursor-pointer hover:border-accent transition-colors h-[52px]">
                    <input 
                      type="checkbox" 
                      checked={isPopular}
                      onChange={e => setIsPopular(e.target.checked)}
                      className="w-5 h-5 accent-accent border border-border rounded-xl"
                    />
                    <span className="font-bold uppercase tracking-wider text-xs text-foreground">Mark as Popular</span>
                  </label>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted">Features</label>
                    <button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-accent hover:underline"
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
                          className="flex-1 bg-background border border-border text-foreground rounded-xl p-2.5 font-semibold text-sm focus:outline-none focus:border-accent"
                          placeholder="Feature detail..."
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFeature(i)}
                          className="p-2.5 border border-border rounded-xl bg-background hover:bg-red-500/10 text-muted hover:text-red-400 hover:border-red-500/30 transition-colors"
                        >
                          <Trash weight="bold" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-white font-bold uppercase tracking-wider px-8 py-3 rounded-xl hover:bg-accent/90 transition-all shadow-md disabled:opacity-50 text-xs border border-accent"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {packageToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden text-foreground">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 mx-auto rounded-2xl flex items-center justify-center mb-6">
                  <Trash weight="fill" size={32} />
                </div>
                <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2 text-foreground">Delete Package?</h2>
                <p className="font-semibold text-muted mb-8 text-sm">Are you sure you want to delete this pricing package? This action cannot be undone.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPackageToDelete(null)}
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
        )}
      </div>
    </div>
  );
}
