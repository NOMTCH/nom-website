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

  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 10) return 'Wilujeng Enjing, Juragan! 🌅';
    if (hour >= 10 && hour < 15) return 'Wilujeng Siang, Juragan! ☀️';
    if (hour >= 15 && hour < 18) return 'Wilujeng Sonten, Juragan! ⛅';
    return 'Wilujeng Wengi, Juragan! 🌙';
  });

  useEffect(() => {
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
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{greeting}</p>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-gray-900 leading-none">System Overview</h1>
        
      </header>

      {/* Financial CRM Overview */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
          <CurrencyDollar weight="bold" /> Financial Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <div className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CurrencyDollar weight="bold" size={24} className="text-emerald-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Cuan Asup (Lunas)</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-gray-900">
              Rp {new Intl.NumberFormat('id-ID').format(finances.totalRevenue)}
            </p>
          </div>

          {/* Outstanding Card */}
          <div className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                <WarningCircle weight="bold" size={24} className="text-rose-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Duit Nunggak (Can Lunas)</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-gray-900">
              Rp {new Intl.NumberFormat('id-ID').format(finances.totalOutstanding)}
            </p>
          </div>

          {/* Invoices Count */}
          <div className="bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Receipt weight="bold" size={24} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Invoice Geus Dikirim</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-gray-900">
              {finances.invoicesCount}
            </p>
          </div>
        </div>
      </div>

      {/* System Stats Overview */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500 mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <HardDrives weight="fill" size={24} className="text-purple-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Total Projek</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-gray-900">{stats.projects}</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Users weight="fill" size={24} className="text-orange-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Nu Make CV</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-gray-900">{stats.cvUsers}</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Layout weight="fill" size={24} className="text-amber-600" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Template Aktif</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-gray-900">{stats.templates}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-8 border border-gray-800 rounded-2xl bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 opacity-20 rotate-45 translate-x-32 -translate-y-32 pointer-events-none" />
        <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-6 relative z-10">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 relative z-10">
          <Link 
            href="/admin/invoices/create"
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase shadow-sm hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Receipt weight="bold" size={18} />
            Jieun Invoice
          </Link>
          <Link 
            href="/admin/projects"
            className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-xs uppercase shadow-sm hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus weight="bold" size={18} />
            Tambah Projek
          </Link>
        </div>
      </div>
    </div>
  );
}
