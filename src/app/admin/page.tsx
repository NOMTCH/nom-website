'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HardDrives, Users, Layout, Plus, CurrencyDollar, WarningCircle, Receipt } from '@phosphor-icons/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    cvUsers: 0,
    templates: 4
  });
  
  const [finances, setFinances] = useState({
    totalRevenue: 0,
    totalOutstanding: 0,
    invoicesCount: 0
  });

  const [greeting, setGreeting] = useState('Wilujeng Sumping, Juragan! 👋');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 10) setGreeting('Wilujeng Enjing, Juragan! 🌅');
    else if (hour >= 10 && hour < 15) setGreeting('Wilujeng Siang, Juragan! ☀️');
    else if (hour >= 15 && hour < 18) setGreeting('Wilujeng Sonten, Juragan! ⛅');
    else setGreeting('Wilujeng Wengi, Juragan! 🌙');

    async function loadStats() {
      // Load projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
        
      // Load cv users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      setStats({
        projects: projectsCount || 0,
        cvUsers: usersCount || 0,
        templates: 4
      });

      // Load invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('total, status');
        
      let revenue = 0;
      let outstanding = 0;
      
      if (invoicesData) {
        invoicesData.forEach(inv => {
          if (inv.status === 'paid') revenue += Number(inv.total);
          if (inv.status === 'unpaid') outstanding += Number(inv.total);
        });
      }

      setFinances({
        totalRevenue: revenue,
        totalOutstanding: outstanding,
        invoicesCount: invoicesData?.length || 0
      });
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-12">
      <header>
        <p className="text-xl md:text-2xl font-bold text-muted mb-2">{greeting}</p>
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter text-foreground leading-none mb-2">System Overview</h1>
        <div className="w-24 h-2 bg-accent" />
      </header>

      {/* Financial CRM Overview */}
      <div>
        <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
          <CurrencyDollar weight="bold" /> Financial Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <div className="bg-emerald-400 border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white border-2 border-foreground flex items-center justify-center">
                <CurrencyDollar weight="bold" size={24} className="text-black" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-black">Cuan Asup (Lunas)</h2>
            </div>
            <p className="text-4xl lg:text-5xl font-display font-black text-black">
              Rp {new Intl.NumberFormat('id-ID').format(finances.totalRevenue)}
            </p>
          </div>

          {/* Outstanding Card */}
          <div className="bg-red-400 border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white border-2 border-foreground flex items-center justify-center">
                <WarningCircle weight="bold" size={24} className="text-black" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Duit Nunggak (Can Lunas)</h2>
            </div>
            <p className="text-4xl lg:text-5xl font-display font-black text-white">
              Rp {new Intl.NumberFormat('id-ID').format(finances.totalOutstanding)}
            </p>
          </div>

          {/* Invoices Count */}
          <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent border-2 border-foreground flex items-center justify-center">
                <Receipt weight="bold" size={24} className="text-black" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Invoice Geus Dikirim</h2>
            </div>
            <p className="text-5xl lg:text-6xl font-display font-black text-foreground">
              {finances.invoicesCount}
            </p>
          </div>
        </div>
      </div>

      {/* System Stats Overview */}
      <div>
        <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F7DF1E] border-2 border-foreground flex items-center justify-center">
                <HardDrives weight="fill" size={24} className="text-black" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Total Projek</h2>
            </div>
            <p className="text-5xl lg:text-6xl font-display font-black text-foreground">{stats.projects}</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent border-2 border-foreground flex items-center justify-center">
                <Users weight="fill" size={24} className="text-white" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Nu Make CV</h2>
            </div>
            <p className="text-5xl lg:text-6xl font-display font-black text-foreground">{stats.cvUsers}</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-foreground border-2 border-foreground flex items-center justify-center">
                <Layout weight="fill" size={24} className="text-white" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Template Aktif</h2>
            </div>
            <p className="text-5xl lg:text-6xl font-display font-black text-foreground">{stats.templates}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-8 border-4 border-foreground bg-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface opacity-20 rotate-45 translate-x-32 -translate-y-32" />
        <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-6 relative z-10">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 relative z-10">
          <Link 
            href="/admin/invoices/create"
            className="flex items-center gap-2 px-6 py-4 bg-white border-4 border-foreground font-black uppercase shadow-[6px_6px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all"
          >
            <Receipt weight="bold" size={20} />
            Jieun Invoice
          </Link>
          <Link 
            href="/admin/projects"
            className="flex items-center gap-2 px-6 py-4 bg-surface border-4 border-foreground font-black uppercase shadow-[6px_6px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all"
          >
            <Plus weight="bold" size={20} />
            Tambah Projek
          </Link>
        </div>
      </div>
    </div>
  );
}
