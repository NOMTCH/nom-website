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
      setSortOrder(pkg.sort_order);
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

        <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200/80 text-xs font-bold uppercase tracking-widest text-gray-500">
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
                  <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{pkg.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{pkg.description}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-gray-900">
                      Rp {new Intl.NumberFormat('id-ID').format(Number(pkg.price))}
                    </td>
                    <td className="p-4 text-center">
                      {pkg.is_popular ? (
                        <span className="inline-block bg-accent/10 text-accent px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-block text-gray-300">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-gray-500">
                      {pkg.sort_order}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(pkg)} className="p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors rounded-xl">
                          <PencilSimple weight="bold" size={18} />
                        </button>
                        <button onClick={() => setPackageToDelete(pkg.id)} className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-xl">
                          <Trash weight="bold" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-background border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-3xl font-display font-black uppercase tracking-tight">
                  {editingId ? 'Edit Package' : 'New Package'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
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
                      className="w-full bg-surface border border-border rounded-2xl p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-accent"
                      placeholder="e.g. UMKM Starter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-2">Nominal Harga</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">Rp</span>
                      <input 
                        type="number" 
                        required
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full bg-surface border border-border rounded-2xl p-3 pl-12 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-accent"
                        placeholder="1500000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-surface border border-border rounded-2xl p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-accent"
                  >
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Web Development">Web Development</option>
                    <option value="IT Solutions">IT Solutions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-surface border border-border rounded-2xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
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
                      className="w-full bg-surface border border-border rounded-2xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent"
                    />
                  </div>
                  <label className="flex-1 flex items-center gap-3 p-3 bg-surface border border-border rounded-2xl cursor-pointer hover:bg-accent/10 h-[56px]">
                    <input 
                      type="checkbox" 
                      checked={isPopular}
                      onChange={e => setIsPopular(e.target.checked)}
                      className="w-6 h-6 border border-border rounded-2xl bg-white text-accent focus:ring-0 cursor-pointer"
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
                          className="flex-1 bg-surface border border-border rounded-2xl p-2 font-bold text-sm focus:outline-none focus:border-accent"
                          placeholder="Feature detail..."
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFeature(i)}
                          className="p-2 border border-border rounded-2xl hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent text-white font-bold uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-accent/90 transition-all shadow-sm disabled:opacity-50 text-xs"
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
            <div className="bg-surface border border-gray-100 shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden animate-[bounce_0.3s_ease-in-out]">
              
              
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-red-500 mx-auto border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center mb-6">
                  <Trash weight="fill" size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">HAPUS PAKET IEU?</h2>
                <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Asli yeuh rek dihapus? Nya ah karunya geus nyieun.</p>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPackageToDelete(null)}
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
    </div>
  );
}
