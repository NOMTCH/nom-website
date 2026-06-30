'use server';

import { db } from '@/db';
import { pageViews } from '@/db/schema';
import { count, countDistinct, gte } from 'drizzle-orm';

export async function getTrafficStats() {
  try {
    // 1. Total keseluruhan halaman yang dibuka (Total Views)
    const totalViewsRes = await db.select({ value: count() }).from(pageViews);
    const totalViews = totalViewsRes[0]?.value || 0;

    // 2. Total pengunjung unik (Unique Visitors) berdasarkan IP Hash
    const uniqueRes = await db.select({ value: countDistinct(pageViews.ipHash) }).from(pageViews);
    const uniqueVisitors = uniqueRes[0]?.value || 0;

    // 3. Views hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRes = await db.select({ value: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, today));
    const viewsToday = todayRes[0]?.value || 0;

    return { totalViews, uniqueVisitors, viewsToday };
  } catch (error) {
    console.error('Error fetching traffic stats:', error);
    // Silent fail if table doesn't exist yet (e.g. before migration)
    return { totalViews: 0, uniqueVisitors: 0, viewsToday: 0 };
  }
}
