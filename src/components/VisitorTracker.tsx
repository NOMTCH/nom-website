'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    // Track page view
    // We add search params just in case they are relevant, though usually path is enough
    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: url }),
    }).catch((err) => {
      // Silently fail so it doesn't bother users
      console.error('Tracker error:', err);
    });
  }, [pathname, searchParams]);

  return null; // This component renders nothing visually
}
