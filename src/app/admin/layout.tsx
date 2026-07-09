'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignOut, Briefcase, Desktop, List, X, Tag, CurrencyDollar, Envelope, Receipt, Heart, Article, FileText } from '@phosphor-icons/react';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
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
        <div className="w-16 h-16 border border-border rounded-2xl border-t-accent animate-spin"></div>
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
          className: 'bg-surface border border-border shadow-lg rounded-2xl font-sans text-foreground p-4 group-[.toaster]:animate-[bounce_0.5s_ease-in-out]',
          style: { borderRadius: '16px' },
          duration: 3000,
        }} 
      />
      
      {/* Mobile Sidebar Toggle */}
      <div className="print:hidden md:hidden p-4 border-b border-gray-100 flex justify-between items-center bg-surface">
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
        print:hidden
        ${sidebarOpen ? 'flex w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4' : 'hidden md:flex md:w-20 md:border-r-4 overflow-visible'} 
        bg-[#F9FAFB] border-r border-gray-200/80 
        transition-all duration-300 flex-col shrink-0 relative z-40
      `}>
        {/* Desktop Center Puller */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 text-gray-400 items-center justify-center rounded-full cursor-pointer hover:bg-gray-50 hover:text-gray-600 transition-all z-50 shadow-sm"
        >
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        </button>

        <div className={`p-6 flex items-center ${!sidebarOpen && 'justify-center'} min-h-[84px] px-6`}>
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img src="/assets/logo/favicon.svg" className="w-8 h-8" alt="NOMSYS" />
            </div>
            {sidebarOpen && <span className="font-display font-black text-xl tracking-tight text-foreground whitespace-nowrap">NOMSYS</span>}
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          <Link 
            href="/admin" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname === '/admin' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Desktop weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Overview"}
          </Link>
          <Link 
            href="/admin/projects" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/projects') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Briefcase weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Portfolio"}
          </Link>
          <Link 
            href="/admin/promos" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/promos') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Tag weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Promos"}
          </Link>
          <Link 
            href="/admin/pricing" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/pricing') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <CurrencyDollar weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Pricing"}
          </Link>
          <Link 
            href="/admin/blog" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/blog') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Article weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Blog & Insight"}
          </Link>
          <Link 
            href="/admin/messages" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/messages') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Envelope weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Inbox"}
          </Link>
          <Link 
            href="/admin/invoices" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/invoices') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Receipt weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Invoices"}
          </Link>
          <Link 
            href="/admin/proposals" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/proposals') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <FileText weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Proposals"}
          </Link>
          <Link 
            href="/admin/invitations" 
            className={`flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all ${pathname.includes('/admin/invitations') ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <Heart weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Invitations"}
          </Link>
        </nav>

        <div className="p-4 flex flex-col gap-2 mt-auto border-t border-gray-100">
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/admin/login');
            }}
            className={`w-full flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'justify-center gap-2 px-4'} py-3 bg-red-50 text-red-600 rounded-xl font-bold uppercase hover:bg-red-100 transition-colors`}
            title="Logout"
          >
            <SignOut weight="bold" size={20} className="shrink-0" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white p-6 lg:p-12 relative z-10 custom-scrollbar transition-all duration-300">
        {/* Brutalist Pattern Overlay */}
        
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
