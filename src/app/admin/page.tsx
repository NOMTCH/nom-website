'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HardDrives, Users, Layout, Plus } from '@phosphor-icons/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    cvUsers: 0,
    templates: 4
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
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter text-foreground leading-none mb-2">System Overview</h1>
        <div className="w-24 h-2 bg-accent" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#F7DF1E] border-2 border-foreground flex items-center justify-center">
              <HardDrives weight="fill" size={24} className="text-black" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Total Projects</h2>
          </div>
          <p className="text-6xl font-display font-black text-foreground">{stats.projects}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-accent border-2 border-foreground flex items-center justify-center">
              <Users weight="fill" size={24} className="text-white" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">CV Generator Users</h2>
          </div>
          <p className="text-6xl font-display font-black text-foreground">{stats.cvUsers}</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface border-4 border-foreground p-6 shadow-[8px_8px_0_0_#0F0F0F]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-foreground border-2 border-foreground flex items-center justify-center">
              <Layout weight="fill" size={24} className="text-white" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Active Templates</h2>
          </div>
          <p className="text-6xl font-display font-black text-foreground">{stats.templates}</p>
        </div>
      </div>

      <div className="mt-12 p-8 border-4 border-foreground bg-[#F7DF1E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface opacity-20 rotate-45 translate-x-32 -translate-y-32" />
        <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4 relative z-10">Quick Actions</h3>
        <div className="flex gap-4 relative z-10">
          <Link 
            href="/admin/projects"
            className="flex items-center gap-2 px-6 py-4 bg-surface border-4 border-foreground font-black uppercase shadow-[6px_6px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all"
          >
            <Plus weight="bold" size={20} />
            Add New Project
          </Link>
        </div>
      </div>
    </div>
  );
}
