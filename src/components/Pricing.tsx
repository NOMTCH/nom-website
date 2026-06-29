'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPricingPackages, PricingPackage } from '@/lib/data/pricing';
import { Check, Star, ArrowRight } from '@phosphor-icons/react';

export function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPricingPackages();
      setPackages(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null;

  return (
    <section id="pricing" className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-border">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-accent-secondary/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold text-sm uppercase tracking-wider inline-block px-4 py-1.5 bg-accent/10 rounded-full mb-4"
          >
            Transparent Pricing
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-black text-foreground tracking-tight leading-none mb-6"
          >
            Pricelist
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-muted"
          >
            Pilih paket yang paling pas buat ngebakar semangat bisnis lu. Nggak ada hidden fee, semuanya transparan.
          </motion.p>
        </div>

        {packages.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-border bg-surface rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-xl font-bold uppercase tracking-wider text-muted">Paket Harga Sedang Disiapkan</p>
            <p className="text-muted mt-2 font-medium">Stay tuned! Admin kami sedang meracik harga terbaik buat lu.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {Object.entries(
              packages.reduce((acc, pkg) => {
                if (!acc[pkg.category]) acc[pkg.category] = [];
                acc[pkg.category].push(pkg);
                return acc;
              }, {} as Record<string, PricingPackage[]>)
            ).sort().map(([category, categoryPackages]) => (
              <div key={category} className="space-y-12">
                <div className="flex justify-center">
                  <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-foreground relative inline-block px-6 py-2 bg-white border border-border rounded-2xl shadow-sm">
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
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className={`
                      relative p-8 md:p-10 flex flex-col h-full rounded-[2.5rem] transition-all duration-300
                      ${pkg.is_popular 
                        ? 'bg-foreground text-white border-none shadow-[0_20px_40px_rgba(0,0,0,0.15)] scale-100 lg:scale-105 z-10' 
                        : 'bg-white text-foreground border border-border shadow-sm hover:shadow-xl hover:-translate-y-2'
                      }
                    `}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded-full shadow-lg flex items-center gap-2 z-20">
                        <Star weight="fill" size={16} /> Paling Laris
                      </div>
                    )}

                    <div className="mb-8 text-center">
                      <h3 className={`text-2xl font-bold tracking-tight mb-3 ${pkg.is_popular ? 'text-white' : 'text-foreground'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-sm h-12 leading-relaxed ${pkg.is_popular ? 'text-gray-300' : 'text-muted'}`}>
                        {pkg.description}
                      </p>
                    </div>

                    <div className="mb-10 text-center">
                      <div className="flex items-start justify-center gap-1 mb-2">
                        <span className="text-xl md:text-2xl font-bold mt-2">Rp</span>
                        <span className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                          {!isNaN(Number(pkg.price)) && pkg.price.trim() !== ''
                            ? new Intl.NumberFormat('id-ID').format(Number(pkg.price))
                            : pkg.price.replace(/Rp\.?\s?/i, '')}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 mb-10">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${pkg.is_popular ? 'text-white' : 'text-muted'}`}>
                        Yang didapet:
                      </p>
                      <ul className="space-y-4">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className={`mt-0.5 shrink-0 ${pkg.is_popular ? 'text-accent' : 'text-accent'}`}>
                              <Check weight="bold" size={20} />
                            </div>
                            <span className={`font-semibold text-sm leading-relaxed ${pkg.is_popular ? 'text-gray-200' : 'text-foreground'}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => window.open(`https://wa.me/6282130704794?text=Halo%20min,%20aku%20mau%20pesen%20paket%20${encodeURIComponent(pkg.name)}%20dong!%20%F0%9F%90%BE`, '_blank')}
                      className={`
                        w-full py-4 px-6 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 rounded-2xl transition-all duration-300
                        ${pkg.is_popular 
                          ? 'bg-accent text-white hover:bg-accent-dark shadow-md hover:shadow-lg hover:-translate-y-1' 
                          : 'bg-surface border border-border text-foreground hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-1 shadow-sm hover:shadow-md'
                        }
                      `}
                    >
                      Gas Sekarang <ArrowRight weight="bold" size={20} />
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
