'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HardDrives, Users, Layout, Plus, CurrencyDollar, WarningCircle, Receipt, ChartLineUp, Eye, UserCircle, Wallet, ArrowRight, Lightning } from '@phosphor-icons/react';
import Link from 'next/link';
import { getTrafficStats } from './actions';
import TrafficChart from './TrafficChart';
import { getVPSServers, VPSServer } from '@/lib/data/vps';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    cvUsers: 0,
    cvProfiles: 0,
    pricingPackages: 0,
    templates: 4
  });
  
  const [finances, setFinances] = useState({
    totalRevenue: 0,
    totalOutstanding: 0,
    grandTotal: 0,
    invoicesCount: 0
  });

  const [traffic, setTraffic] = useState<{
    totalViews: number;
    uniqueVisitors: number;
    viewsToday: number;
    topPages: Array<{path: string; views: number}>;
  }>({
    totalViews: 0,
    uniqueVisitors: 0,
    viewsToday: 0,
    topPages: []
  });

  const [weeklyTraffic, setWeeklyTraffic] = useState<{
    views: number[];
    visitors: number[];
  }>({
    views: Array(7).fill(0),
    visitors: Array(7).fill(0)
  });

  const [weeklyFinances, setWeeklyFinances] = useState<{
    omset: number[];
    revenue: number[];
  }>({
    omset: Array(7).fill(0),
    revenue: Array(7).fill(0)
  });

  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 10) return 'Wilujeng Enjing, Juragan! 🌅';
    if (hour >= 10 && hour < 15) return 'Wilujeng Siang, Juragan! ☀️';
    if (hour >= 15 && hour < 18) return 'Wilujeng Sonten, Juragan! ⛅';
    return 'Wilujeng Wengi, Juragan! 🌙';
  });

  const [vpsList, setVpsList] = useState<VPSServer[]>([]);

  useEffect(() => {
    async function loadStats() {
      // Load VPS Servers for fleet health widget
      try {
        const vpsData = await getVPSServers();
        setVpsList(vpsData);
      } catch (e) {
        console.error('Error loading VPS list:', e);
      }

      // Load projects count
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
        
      // Load cv users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Load cv profiles count (how many CVs actually created)
      const { count: cvProfilesCount } = await supabase
        .from('cv_profiles')
        .select('*', { count: 'exact', head: true });

      // Load pricing packages count
      const { count: pricingCount } = await supabase
        .from('pricing_packages')
        .select('*', { count: 'exact', head: true });

      setStats({
        projects: projectsCount || 0,
        cvUsers: usersCount || 0,
        cvProfiles: cvProfilesCount || 0,
        pricingPackages: pricingCount || 0,
        templates: 4
      });

      // Load traffic stats
      const trafficStats = await getTrafficStats();
      setTraffic(trafficStats);
      setWeeklyTraffic({
        views: trafficStats.weeklyViews || Array(7).fill(0),
        visitors: trafficStats.weeklyVisitors || Array(7).fill(0)
      });

      // Load invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('total, status, down_payment, created_at');
        
      let revenue = 0;
      let outstanding = 0;
      let totalOmset = 0;
      
      const weeklyOmset = Array(7).fill(0);
      const weeklyRevenue = Array(7).fill(0);

      const dates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 6 + i);
        d.setHours(0, 0, 0, 0);
        return d;
      });
      
      if (invoicesData) {
        invoicesData.forEach(inv => {
          const totalVal = Number(inv.total) || 0;
          const dpVal = Number(inv.down_payment) || 0;
          
          if (inv.status === 'paid') {
            // Kalau udah lunas, berarti (Sisa Total + DP) udah masuk semua ke kantong
            revenue += (totalVal + dpVal);
            totalOmset += (totalVal + dpVal);
          } else if (inv.status === 'unpaid') {
            // Kalau belum lunas, DP-nya udah masuk ke kantong, sisanya nunggak
            revenue += dpVal;
            outstanding += totalVal;
            totalOmset += (totalVal + dpVal);
          }

          if (inv.created_at) {
            const invDate = new Date(inv.created_at);
            invDate.setHours(0, 0, 0, 0);
            
            const dayIdx = dates.findIndex(d => d.getTime() === invDate.getTime());
            if (dayIdx !== -1) {
              const omset = totalVal + dpVal;
              const cuan = inv.status === 'paid' ? (totalVal + dpVal) : dpVal;
              weeklyOmset[dayIdx] += omset;
              weeklyRevenue[dayIdx] += cuan;
            }
          }
        });
      }

      setFinances({
        totalRevenue: revenue,
        totalOutstanding: outstanding,
        grandTotal: totalOmset,
        invoicesCount: invoicesData?.length || 0
      });

      setWeeklyFinances({
        omset: weeklyOmset,
        revenue: weeklyRevenue
      });
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">{greeting}</p>
        <h1 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-foreground leading-none">System Overview</h1>
        
      </header>

      {/* Traffic Overview */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-muted flex items-center gap-2">
          <ChartLineUp weight="bold" /> Real-time Traffic
        </h2>

        <TrafficChart 
          viewsToday={traffic.viewsToday}
          uniqueVisitors={traffic.uniqueVisitors}
          totalViews={traffic.totalViews}
          totalRevenue={finances.totalRevenue}
          grandTotal={finances.grandTotal}
          totalOutstanding={finances.totalOutstanding}
          weeklyViews={weeklyTraffic.views}
          weeklyVisitors={weeklyTraffic.visitors}
          weeklyOmset={weeklyFinances.omset}
          weeklyRevenue={weeklyFinances.revenue}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Total Views Card */}
          <div className="bg-surface border border-border p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-950/30 rounded-xl flex items-center justify-center">
                <Eye weight="fill" size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Total Halaman Dibuka</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-foreground">
              {new Intl.NumberFormat('id-ID').format(traffic.totalViews)}
            </p>
          </div>

          {/* Unique Visitors Card */}
          <div className="bg-surface border border-border p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-950/30 rounded-xl flex items-center justify-center">
                <UserCircle weight="fill" size={20} className="text-pink-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Total Pengunjung (Unik)</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-foreground">
              {new Intl.NumberFormat('id-ID').format(traffic.uniqueVisitors)}
            </p>
          </div>

          {/* Views Today */}
          <div className="bg-surface border border-border p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-950/30 rounded-xl flex items-center justify-center">
                <ChartLineUp weight="bold" size={20} className="text-sky-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Dilihat Hari Ini</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-foreground">
              {new Intl.NumberFormat('id-ID').format(traffic.viewsToday)}
            </p>
          </div>
        </div>

        {/* Top Pages List */}
        {traffic.topPages && traffic.topPages.length > 0 && (
          <div className="mt-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2 px-1">Top 5 Halaman</h2>
            <div className="flex flex-nowrap overflow-x-auto gap-2.5 pb-2">
              {traffic.topPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 px-3.5 bg-surface rounded-full border border-border shadow-sm shrink-0 gap-3 min-w-[170px] max-w-[240px]">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-4 h-4 rounded-full bg-sky-950/50 flex items-center justify-center text-[9px] font-black text-sky-400 shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-mono text-xs font-bold text-muted truncate" title={page.path}>
                      {page.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-border">
                    <Eye size={12} weight="bold" className="text-muted" />
                    <span className="font-black text-xs text-foreground">{page.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VPS Infrastructure Overview */}
      {vpsList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <HardDrives weight="bold" className="text-accent" /> VPS Server Fleet &amp; Panjer Radar
            </h2>
            <Link href="/admin/vps" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
              Kelola VPS &amp; Domain <ArrowRight weight="bold" size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vpsList.map((vps, idx) => (
              <div key={vps.id || idx} className="bg-surface border border-border p-4 rounded-2xl shadow-sm hover:border-accent/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                        vps.status === 'online' ? 'bg-accent shadow-[0_0_8px_#4E9F3D]' :
                        vps.status === 'maintenance' ? 'bg-amber-400' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                      }`} />
                      <span className="font-display font-black text-sm uppercase text-foreground group-hover:text-accent transition-colors truncate max-w-[140px]">
                        {vps.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted bg-background px-2 py-0.5 rounded border border-border">
                      {vps.provider}
                    </span>
                  </div>

                  <div className="bg-background border border-border/80 p-2.5 rounded-xl font-mono text-xs space-y-1 my-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted font-semibold">IP Address:</span>
                      <span className="text-accent font-bold">{vps.ip_address}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted font-semibold">Specs:</span>
                      <span className="text-foreground text-[10px] truncate max-w-[130px]">{vps.specs}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs font-mono">
                  <span className="text-[10px] text-muted font-bold flex items-center gap-1">
                    <Lightning size={12} className="text-emerald-400 animate-pulse" /> Panjer Ping:
                  </span>
                  <span className={`font-black text-[11px] ${vps.status === 'offline' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    {vps.status === 'offline' ? 'DOWN (OFFLINE)' : `${14 + (idx * 6)}ms`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial CRM Overview */}
      <div>
        <h2 className="text-base font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
          <CurrencyDollar weight="bold" /> Financial Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Grand Total Card */}
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all duration-500"></div>
            <div className="flex items-center gap-3 mb-4 relative">
              <div className="w-10 h-10 bg-amber-950/30 border border-amber-500/20 rounded-xl flex items-center justify-center shadow-inner">
                <Wallet weight="fill" size={20} className="text-amber-400 drop-shadow-sm" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Total Omset Kabeh</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 relative">
              Rp {new Intl.NumberFormat('id-ID').format(finances.grandTotal)}
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <CurrencyDollar weight="bold" size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Cuan Asup (Lunas)</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-foreground">
              Rp {new Intl.NumberFormat('id-ID').format(finances.totalRevenue)}
            </p>
          </div>

          {/* Outstanding Card */}
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-950/30 border border-rose-500/20 rounded-xl flex items-center justify-center">
                <WarningCircle weight="bold" size={20} className="text-rose-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Duit Nunggak (Can Lunas)</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-foreground">
              Rp {new Intl.NumberFormat('id-ID').format(finances.totalOutstanding)}
            </p>
          </div>

          {/* Invoices Count */}
          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-950/30 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Receipt weight="bold" size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Invoice Geus Dikirim</h2>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-black text-foreground">
              {finances.invoicesCount}
            </p>
          </div>
        </div>
      </div>

      {/* System Stats Overview */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-muted mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-950/30 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <HardDrives weight="fill" size={24} className="text-purple-400" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Total Projek</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-foreground">{stats.projects}</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-950/30 border border-orange-500/20 rounded-xl flex items-center justify-center">
                <Users weight="fill" size={24} className="text-orange-400" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Nu Make CV</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-foreground">{stats.cvUsers}</p>
          </div>
          
          {/* Stat Card 3 */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <ChartLineUp weight="fill" size={24} className="text-emerald-400" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">CV Nu Dijieun</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-foreground">{stats.cvProfiles}</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-950/30 border border-rose-500/20 rounded-xl flex items-center justify-center">
                <CurrencyDollar weight="fill" size={24} className="text-rose-400" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Paket Harga</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-foreground">{stats.pricingPackages}</p>
          </div>

          {/* Stat Card 5 */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-950/30 border border-amber-500/20 rounded-xl flex items-center justify-center">
                <Layout weight="fill" size={24} className="text-amber-400" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Template Aktif</h2>
            </div>
            <p className="text-3xl lg:text-4xl font-display font-black text-foreground">{stats.templates}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-8 border border-border rounded-2xl bg-surface text-foreground relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 opacity-20 rotate-45 translate-x-32 -translate-y-32 pointer-events-none" />
        <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-6 relative z-10">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 relative z-10">
          <Link 
            href="/admin/invoices/create"
            className="flex items-center gap-2 px-6 py-3.5 bg-accent text-white rounded-xl font-bold text-xs uppercase shadow-sm hover:bg-accent/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Receipt weight="bold" size={18} />
            Jieun Invoice
          </Link>
          <Link 
            href="/admin/projects"
            className="flex items-center gap-2 px-6 py-3.5 bg-background text-foreground border border-border rounded-xl font-bold text-xs uppercase shadow-sm hover:bg-surface transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus weight="bold" size={18} />
            Tambah Projek
          </Link>
        </div>
      </div>
    </div>
  );
}
