'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(p => p);

  return (
    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted py-8 overflow-x-auto whitespace-nowrap">
      <Link href="/" className="hover:text-accent transition-colors">Home</Link>
      
      {paths.map((path, idx) => {
        const href = `/${paths.slice(0, idx + 1).join('/')}`;
        const isLast = idx === paths.length - 1;
        const displayName = path.replace(/-/g, ' ');

        return (
          <div key={path} className="flex items-center gap-2">
            <span className="text-muted/40">/</span>
            {isLast ? (
              <span className="text-accent">{displayName}</span>
            ) : (
              <Link href={href} className="hover:text-accent transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
