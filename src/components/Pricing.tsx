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
    <section id="pricing" className="py-32 bg-background relative overflow-hidden border-t-4 border-foreground">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-foreground blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-display font-black text-foreground uppercase tracking-tighter leading-none mb-6"
          >
            Pricelist
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-3xl font-bold text-muted max-w-3xl"
          >
            Pilih paket yang paling pas buat ngebakar semangat bisnis lu. Nggak ada hidden fee, semuanya transparan.
          </motion.p>
        </div>

        {packages.length === 0 ? (
          <div className="p-12 text-center border-4 border-dashed border-foreground flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-2xl font-black uppercase tracking-widest text-muted">Paket Harga Sedang Disiapkan</p>
            <p className="text-muted mt-2 font-bold">Stay tuned! Admin kami sedang meracik harga terbaik buat lu.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {Object.entries(
              packages.reduce((acc, pkg) => {
                if (!acc[pkg.category]) acc[pkg.category] = [];
                acc[pkg.category].push(pkg);
                return acc;
              }, {} as Record<string, PricingPackage[]>)
            ).sort().map(([category, categoryPackages]) => (
              <div key={category} className="space-y-12">
                <div className="border-b-4 border-foreground pb-6 inline-block">
                  <h3 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter text-foreground relative">
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-full bg-accent"></span>
                    {category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-start">
                  {categoryPackages.map((pkg, idx) => (
                  <motion.div 
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`
                      relative bg-surface p-8 md:p-10 border-4 border-foreground flex flex-col h-full
                      transition-all duration-300
                      ${pkg.is_popular 
                        ? 'shadow-[16px_16px_0_0_#F7DF1E] !bg-foreground text-white border-white scale-100 lg:scale-105 z-10' 
                        : 'shadow-[16px_16px_0_0_#0F0F0F] hover:shadow-[20px_20px_0_0_#F7DF1E]'
                      }
                    `}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-6 -right-6 bg-accent text-black font-black text-sm uppercase tracking-widest px-6 py-2 border-4 border-white shadow-[8px_8px_0_0_#0F0F0F] flex items-center gap-2 transform rotate-6 z-20">
                        <Star weight="fill" size={20} /> Paling Laris
                      </div>
                    )}

                    <div className="mb-8">
                      <h3 className={`text-3xl font-display font-black uppercase tracking-tight mb-4 ${pkg.is_popular ? 'text-accent' : 'text-foreground'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-sm font-bold h-12 ${pkg.is_popular ? 'text-gray-400' : 'text-muted'}`}>
                        {pkg.description}
                      </p>
                    </div>

                    <div className="mb-10">
                      <div className="text-5xl md:text-6xl font-black tracking-tighter mb-2">
                        {pkg.price}
                      </div>
                    </div>

                    <div className="flex-1 mb-10">
                      <p className={`text-sm font-black uppercase tracking-widest mb-6 ${pkg.is_popular ? 'text-white' : 'text-foreground'}`}>
                        Yang didapet:
                      </p>
                      <ul className="space-y-4">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className={`mt-1 shrink-0 ${pkg.is_popular ? 'text-accent' : 'text-foreground'}`}>
                              <Check weight="bold" size={20} />
                            </div>
                            <span className={`font-bold leading-tight ${pkg.is_popular ? 'text-gray-200' : 'text-gray-700'}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => window.open(`https://wa.me/6282130704794?text=Halo%20min,%20aku%20mau%20pesen%20paket%20${encodeURIComponent(pkg.name)}%20dong!%20%F0%9F%90%BE`, '_blank')}
                      className={`
                        w-full py-5 px-6 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-4
                        ${pkg.is_popular 
                          ? 'bg-accent text-black border-accent hover:bg-white hover:border-white shadow-[6px_6px_0_0_#FFFFFF] active:shadow-[0px_0px_0_0_#FFFFFF] active:translate-x-1.5 active:translate-y-1.5' 
                          : 'bg-white text-black border-foreground hover:bg-accent shadow-[6px_6px_0_0_#0F0F0F] active:shadow-[0px_0px_0_0_#0F0F0F] active:translate-x-1.5 active:translate-y-1.5'
                        }
                      `}
                    >
                      Gas Sekarang <ArrowRight weight="bold" size={24} />
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
