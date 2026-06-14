'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignOut, Briefcase, Desktop, List, X, Tag, CurrencyDollar } from '@phosphor-icons/react';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.refresh(); // Let middleware handle redirect
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Idle Auto-Logout Timer (15 minutes)
  useEffect(() => {
    if (!session || pathname.includes('/login')) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
      }, 15 * 60 * 1000); // 15 minutes
    };

    // Listen to user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    resetTimer();
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [session, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-foreground border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300 bg-background text-foreground">
      <Toaster 
        position="top-center" 
        expand={true}
        toastOptions={{
          className: 'bg-accent border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] rounded-none font-display font-black uppercase tracking-widest text-black p-6 text-xl group-[.toaster]:animate-[bounce_0.5s_ease-in-out]',
          style: { borderRadius: '0px' },
          duration: 3000,
        }} 
      />
      
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 border-b-4 border-foreground flex justify-between items-center bg-surface">
        <Link href="/admin" className="font-black uppercase tracking-widest text-lg flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/assets/logo/favicon.svg" className="w-6 h-6" alt="NOMSYS" />
          </div>
          NOMSYS
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X weight="bold" size={24} /> : <List weight="bold" size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-full md:w-64' : 'w-0 md:w-20 overflow-visible'} 
        bg-surface border-r-4 border-foreground 
        transition-all duration-300 flex flex-col shrink-0 relative z-40
      `}>
        {/* Desktop Center Puller */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute -right-[22px] top-1/2 -translate-y-1/2 w-[24px] h-[64px] bg-foreground text-white flex items-center justify-center rounded-r-xl border-4 border-l-0 border-foreground cursor-pointer hover:bg-accent hover:border-accent transition-colors z-50 shadow-[4px_4px_0_0_#0F0F0F]"
        >
          <div className="w-1 h-8 bg-white opacity-50 rounded-full" />
        </button>

        <div className={`p-6 border-b-4 border-foreground flex items-center ${!sidebarOpen && 'justify-center'} min-h-[84px]`}>
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img src="/assets/logo/favicon.svg" className="w-8 h-8" alt="NOMSYS" />
            </div>
            {sidebarOpen && <span className="font-black uppercase tracking-widest text-lg whitespace-nowrap">NOMSYS</span>}
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <Link 
            href="/admin" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3 border-2 border-foreground font-bold uppercase transition-all shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] ${pathname === '/admin' ? 'bg-[#F7DF1E] text-black border-black' : 'bg-white text-black'}`}
          >
            <Desktop weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Overview"}
          </Link>
          <Link 
            href="/admin/projects" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3 border-2 border-foreground font-bold uppercase transition-all shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] ${pathname.includes('/admin/projects') ? 'bg-[#F7DF1E] text-black border-black' : 'bg-white text-black'}`}
          >
            <Briefcase weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Portfolio"}
          </Link>
          <Link 
            href="/admin/promos" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3 border-2 border-foreground font-bold uppercase transition-all shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] ${pathname.includes('/admin/promos') ? 'bg-[#F7DF1E] text-black border-black' : 'bg-white text-black'}`}
          >
            <Tag weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Promos"}
          </Link>
          <Link 
            href="/admin/pricing" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3 border-2 border-foreground font-bold uppercase transition-all shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] ${pathname.includes('/admin/pricing') ? 'bg-[#F7DF1E] text-black border-black' : 'bg-white text-black'}`}
          >
            <CurrencyDollar weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Pricing"}
          </Link>
        </nav>

        <div className="p-4 border-t-4 border-foreground flex flex-col gap-2">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/admin/login');
            }}
            className={`w-full flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'justify-center gap-2 px-4'} py-3 bg-red-500 border-2 border-foreground font-black uppercase text-white shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all`}
            title="Logout"
          >
            <SignOut weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-12 relative z-10 custom-scrollbar transition-all duration-300">
        {/* Brutalist Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#0F0F0F_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
