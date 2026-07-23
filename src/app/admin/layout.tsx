'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SignOut, Briefcase, Desktop, List, X, Tag, CurrencyDollar, Envelope, Receipt, Heart, Article, FileText, HardDrives } from '@phosphor-icons/react';
import { toast, Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Strict Inactivity & Session Security Config (15 Minutes Max Idle)
  const MAX_IDLE_TIME_MS = 15 * 60 * 1000;

  const forceSecurityLogout = async (reason = 'Sesi Anda telah berakhir demi keamanan (Auto Logout).') => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('nom_admin_last_active');
      }
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    toast.error(reason);
    router.push('/admin/login');
  };

  useEffect(() => {
    if (pathname.includes('/login')) return;

    // Check initial session & verify token with Supabase server
    const verifyServerSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        await forceSecurityLogout('Sesi tidak valid atau telah habis.');
        return;
      }

      // Check last activity timestamp
      const lastActive = sessionStorage.getItem('nom_admin_last_active');
      const now = Date.now();
      if (lastActive && now - parseInt(lastActive, 10) > MAX_IDLE_TIME_MS) {
        await forceSecurityLogout('Sesi telah kedaluwarsa karena inaktivitas (15 Menit).');
        return;
      }

      sessionStorage.setItem('nom_admin_last_active', now.toString());
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    verifyServerSession();

    // Activity tracker that updates timestamp & checks deadline
    const updateActivity = () => {
      const lastActive = sessionStorage.getItem('nom_admin_last_active');
      const now = Date.now();
      
      if (lastActive && now - parseInt(lastActive, 10) > MAX_IDLE_TIME_MS) {
        forceSecurityLogout('Sesi telah kedaluwarsa karena inaktivitas.');
        return;
      }

      sessionStorage.setItem('nom_admin_last_active', now.toString());
    };

    // Events to track activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, updateActivity));

    // Instant verification when tab re-gains focus or becomes visible (e.g. laptop wake up / tab switch)
    const handleVisibilityOrFocus = async () => {
      if (document.visibilityState === 'visible') {
        const lastActive = sessionStorage.getItem('nom_admin_last_active');
        const now = Date.now();
        if (lastActive && now - parseInt(lastActive, 10) > MAX_IDLE_TIME_MS) {
          await forceSecurityLogout('Laptop/Tab kembali aktif: Sesi telah kedaluwarsa.');
          return;
        }

        // Re-verify with server
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          await forceSecurityLogout('Sesi login telah dicabut atau habis.');
          return;
        }
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push('/admin/login');
    });

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, updateActivity));
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      subscription.unsubscribe();
    };
  }, [pathname, router]);

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
      <div className="print:hidden md:hidden p-4 border-b border-border flex justify-between items-center bg-surface">
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
        bg-surface border-r border-border 
        transition-all duration-300 flex-col shrink-0 md:sticky md:top-0 md:h-screen md:max-h-screen overflow-hidden z-40
      `}>
        {/* Desktop Center Puller */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface border border-border text-muted items-center justify-center rounded-full cursor-pointer hover:bg-background hover:text-foreground transition-all z-50 shadow-sm"
        >
          <div className="w-1.5 h-1.5 bg-muted rounded-full" />
        </button>

        <div className={`p-6 flex items-center ${!sidebarOpen && 'justify-center'} min-h-[84px] px-6`}>
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <img src="/assets/logo/favicon.svg" className="w-8 h-8" alt="NOMSYS" />
            </div>
            {sidebarOpen && <span className="font-display font-black text-xl tracking-tight text-foreground whitespace-nowrap">NOMSYS</span>}
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <Link 
            href="/admin" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname === '/admin' ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Desktop weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Overview"}
          </Link>
          <Link 
            href="/admin/projects" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/projects') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Briefcase weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Portfolio"}
          </Link>
          <Link 
            href="/admin/vps" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/vps') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <HardDrives weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "VPS & Domains"}
          </Link>
          <Link 
            href="/admin/promos" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/promos') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Tag weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Promos"}
          </Link>
          <Link 
            href="/admin/pricing" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/pricing') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <CurrencyDollar weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Pricing"}
          </Link>
          <Link 
            href="/admin/blog" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/blog') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Article weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Blog & Insight"}
          </Link>
          <Link 
            href="/admin/messages" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/messages') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Envelope weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Inbox"}
          </Link>
          <Link 
            href="/admin/invoices" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/invoices') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Receipt weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Invoices"}
          </Link>
          <Link 
            href="/admin/proposals" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/proposals') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <FileText weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Proposals"}
          </Link>
          <Link 
            href="/admin/invitations" 
            className={`group flex items-center ${!sidebarOpen ? 'justify-center px-0' : 'gap-3 px-4'} py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${pathname.includes('/admin/invitations') ? 'bg-accent text-white shadow-[0_4px_20px_rgba(78,159,61,0.35)] scale-[1.02]' : 'text-muted hover:bg-background hover:text-foreground hover:translate-x-1'}`}
          >
            <Heart weight="bold" size={20} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />
            {sidebarOpen && "Invitations"}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 lg:p-12 relative z-10 custom-scrollbar transition-all duration-300">
        
        {/* Floating Avatar Dropdown (Aligned horizontally with page titles) */}
        <div className="absolute top-6 right-6 lg:top-12 lg:right-12 z-30 print:hidden">
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full border border-border bg-surface hover:bg-background/80 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-[1.05] active:scale-[0.95]"
            >
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-black text-sm uppercase">
                {session?.user?.email?.substring(0, 2) || 'AD'}
              </div>
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-30 cursor-default" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-border shadow-2xl rounded-2xl p-2 z-40 animate-scale-in">
                  <div className="px-3 py-2 text-left">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted">Logged In As</p>
                    <p className="text-xs font-bold text-foreground truncate mt-0.5" title={session?.user?.email}>{session?.user?.email}</p>
                  </div>
                  <hr className="border-border my-1" />
                  <button 
                    onClick={async () => {
                      setDropdownOpen(false);
                      await supabase.auth.signOut();
                      router.push('/admin/login');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <SignOut weight="bold" size={16} />
                    Logout dari Sistem
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div key={pathname} className="relative z-10 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
