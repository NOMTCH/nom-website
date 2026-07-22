'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPricingPackages, PricingPackage } from '@/lib/data/pricing';
import { Check, Star, ArrowRight } from '@phosphor-icons/react';

export function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('Semua');

  useEffect(() => {
    async function load() {
      const data = await getPricingPackages();
      setPackages(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null;

  const categories = ['Semua', ...Array.from(new Set(packages.map(p => p.category)))];

  const filteredPackages = activeTab === 'Semua'
    ? packages
    : packages.filter(p => p.category === activeTab);

  const groupedPackages = filteredPackages.reduce((acc, pkg) => {
    if (!acc[pkg.category]) acc[pkg.category] = [];
    acc[pkg.category].push(pkg);
    return acc;
  }, {} as Record<string, PricingPackage[]>);

  return (
    <section id="pricing" className="py-24 md:py-32 bg-background text-foreground relative overflow-hidden border-t border-border">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold text-xs uppercase tracking-widest inline-block px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-4"
          >
            TRANSPARENT PRICELIST
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-black text-foreground tracking-tight uppercase leading-none mb-6"
          >
            Paket Investasi Bisnis
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-muted"
          >
            Pilih paket yang paling pas untuk mengakselerasi brand dan bisnis Anda. Tanpa hidden fee, semuanya transparan.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 mb-12 md:mb-16 overflow-x-auto no-scrollbar py-2.5 max-w-full justify-start md:justify-center px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`
                px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer shrink-0 whitespace-nowrap
                ${activeTab === cat
                  ? 'bg-accent text-white border-accent shadow-md shadow-accent/20 scale-105'
                  : 'bg-surface text-muted border-border hover:border-accent hover:text-foreground'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {packages.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border bg-surface rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-xl font-bold uppercase tracking-wider text-muted">Paket Harga Sedang Disiapkan</p>
            <p className="text-muted mt-2 font-medium">Stay tuned! Tim kami sedang meracik paket terbaik buat lu.</p>
          </div>
        ) : (
          <div className="space-y-20">
            {Object.entries(groupedPackages).map(([category, categoryPackages]) => (
              <div key={category} className="space-y-10">
                <div className="flex justify-center">
                  <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-foreground relative inline-block px-6 py-2.5 bg-surface/80 border border-border rounded-2xl shadow-sm">
                    {category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                  {categoryPackages.map((pkg, idx) => (
                    <motion.div 
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.5 }}
                      className={`
                        relative p-7 md:p-9 flex flex-col h-full rounded-3xl transition-all duration-300 bg-surface text-foreground border border-border/80 shadow-md hover:border-accent hover:-translate-y-2
                        ${pkg.is_popular ? 'border-2 border-accent shadow-xl' : ''}
                      `}
                    >
                      {pkg.is_popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white font-bold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-20">
                          <Star weight="fill" size={14} /> Paling Laris
                        </div>
                      )}

                      <div className="mb-6 text-center">
                        <h4 className="text-2xl font-bold tracking-tight mb-2 text-foreground uppercase font-display">
                          {pkg.name}
                        </h4>
                        <p className="text-xs leading-relaxed text-muted font-medium min-h-[40px]">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="mb-8 text-center">
                        <div className="flex items-start justify-center gap-1 mb-1">
                          <span className="text-lg font-bold mt-1 text-accent font-display">Rp</span>
                          <span className="text-4xl md:text-5xl font-display font-black tracking-tighter leading-none text-foreground">
                            {!isNaN(Number(pkg.price)) && pkg.price.trim() !== ''
                              ? new Intl.NumberFormat('id-ID').format(Number(pkg.price))
                              : pkg.price.replace(/Rp\.?\s?/i, '')}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 mb-8 border-t border-border/60 pt-6">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-4 text-accent">
                          Yang Didapat:
                        </p>
                        <ul className="space-y-3">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-0.5 shrink-0 text-accent">
                                <Check weight="bold" size={16} />
                              </div>
                              <span className="font-semibold text-xs leading-relaxed text-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button 
                        onClick={() => window.open(`https://wa.me/6282130704794?text=Halo%20min,%20aku%20mau%20pesen%20paket%20${encodeURIComponent(pkg.name)}%20dong!%20%F0%9F%90%BE`, '_blank')}
                        className="w-full py-3.5 px-6 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 bg-accent text-white hover:bg-accent/90 shadow-md hover:scale-[1.02] cursor-pointer"
                      >
                        Pesan Paket Sekarang <ArrowRight weight="bold" size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
