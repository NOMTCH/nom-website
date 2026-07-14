import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pageViews } from '@/db/schema';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Get user's IP address from headers (works on Vercel/proxies)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || 'unknown');

    // Hash the IP to protect user privacy (GDPR compliance)
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Parse user agent to get basic device info
    const userAgent = req.headers.get('user-agent') || 'unknown';
    let deviceType = 'desktop';
    if (/mobile/i.test(userAgent)) deviceType = 'mobile';
    if (/tablet/i.test(userAgent) || /ipad/i.test(userAgent)) deviceType = 'tablet';

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert to database using Supabase client to bypass IPv4 pooler issues
    const { error } = await supabase.from('page_views').insert([{
      path,
      ip_hash: ipHash,
      user_agent: userAgent,
      device_type: deviceType,
    }]);

    if (error) {
      console.error('Supabase insert error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Tracking error:', error);
    // Return error for debugging
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 200 });
  }
}
