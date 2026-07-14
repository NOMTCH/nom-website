'use server';

import { db } from '@/db';
import { pageViews } from '@/db/schema';
import { count, countDistinct, gte } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export async function getTrafficStats() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // Server-side requires Service Role Key or just Anon Key if RLS is disabled
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Total keseluruhan halaman yang dibuka (Total Views)
    const { count: totalViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    // 2. Total pengunjung unik (Unique Visitors) berdasarkan IP Hash
    // Supabase JS doesn't have COUNT DISTINCT out of the box easily, so we fetch ip_hash and count unique
    const { data: uniqueData } = await supabase
      .from('page_views')
      .select('ip_hash');
      
    const uniqueVisitors = new Set(uniqueData?.map((d: any) => d.ip_hash)).size;

    // 3. Views hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: viewsToday } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // 4. Top Pages (fetch paths and count in memory since traffic is manageable)
    const { data: allPaths } = await supabase
      .from('page_views')
      .select('path')
      .order('created_at', { ascending: false })
      .limit(1000); // Analyze last 1000 pageviews

    const pathCounts: Record<string, number> = {};
    if (allPaths) {
      allPaths.forEach(p => {
        const path = p.path || '/';
        pathCounts[path] = (pathCounts[path] || 0) + 1;
      });
    }

    const topPages = Object.entries(pathCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5); // Top 5 pages

    return { 
      totalViews: totalViews || 0, 
      uniqueVisitors: uniqueVisitors || 0, 
      viewsToday: viewsToday || 0,
      topPages
    };
  } catch (error: any) {
    console.error('Error fetching traffic stats:', error);
    // Silent fail if table doesn't exist yet (e.g. before migration)
    return { totalViews: 0, uniqueVisitors: 0, viewsToday: 0, topPages: [], error: error.message || String(error) };
  }
}
