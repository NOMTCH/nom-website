import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pageViews } from '@/db/schema';
import crypto from 'crypto';

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

    // Insert to database using Drizzle
    await db.insert(pageViews).values({
      path,
      ipHash,
      userAgent,
      deviceType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    // Always return 200 to prevent client-side errors from disrupting the user experience
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 200 });
  }
}
