'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  HardDrives, 
  Globe, 
  Receipt, 
  FileText, 
  Envelope, 
  Heart, 
  Briefcase, 
  Tag, 
  CurrencyDollar, 
  ShieldCheck, 
  Lightning, 
  ArrowSquareOut,
  Code,
  Plus,
  PencilSimple,
  Trash,
  UserCircle,
  X,
  Lock,
  Eye,
  EyeSlash,
  Key,
  Fire,
  Atom,
  ListDashes,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Portal from '@/components/Portal';

export type DBProviderType = 'supabase' | 'postgresql' | 'mysql' | 'firebase' | 'mongodb' | 'redis';

export interface DatabaseAccount {
  id: string;
  name: string; // e.g. "NOMSTD Official Web 2026"
  client_name?: string; // e.g. "Internal Studio"
  provider: DBProviderType; // 'supabase' | 'postgresql' | 'mysql' | 'firebase' | 'mongodb' | 'redis'
  owner_email: string; // e.g. "nomstd2026@gmail.com"
  dashboard_login_url?: string; // e.g. "https://supabase.com/dashboard"
  connection_url: string; // e.g. "https://uxnerrixrumizakivjww.supabase.co"
  db_name_or_ref?: string; // e.g. "postgres" or project_ref
  api_key_or_secret?: string; // API Key / Password
  region?: string; // e.g. "AWS ap-southeast-1 (Singapore)"
  notes?: string; // e.g. "Login via Google Account nomstd2026@gmail.com"
  tables_summary?: string; // e.g. "10 Tables: vps_servers, invoices, projects..."
  is_active?: boolean;
}

interface TableMeta {
  name: string;
  category: string;
  description: string;
  columns: string[];
  icon: any;
  primaryKey: string;
  count: number;
}

const DEFAULT_ACCOUNTS: DatabaseAccount[] = [
  {
    id: 'db-acc-1',
    name: 'NOMSTD 2026 Official Web',
    client_name: 'Internal NOM Studio',
    provider: 'supabase',
    owner_email: 'nomstd2026@gmail.com',
    dashboard_login_url: 'https://supabase.com/dashboard/project/uxnerrixrumizakivjww',
    connection_url: 'https://uxnerrixrumizakivjww.supabase.co',
    db_name_or_ref: 'uxnerrixrumizakivjww',
    api_key_or_secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    region: 'AWS ap-southeast-1 (Singapore)',
    notes: 'Main Production Supabase. Login via Google Account nomstd2026@gmail.com',
    tables_summary: '10 Tables: vps_servers, domains, deployments, invoices, proposals, client_messages, invitations, projects, pricing_packages, promos',
    is_active: true
  },
  {
    id: 'db-acc-2',
    name: 'PT Karya Prashida Enterprise',
    client_name: 'PT Karya Prashida',
    provider: 'postgresql',
    owner_email: 'admin@karyaprashida.co.id',
    dashboard_login_url: 'https://supabase.com/dashboard/project/yibkpkfliqirvkrsmich',
    connection_url: 'https://yibkpkfliqirvkrsmich.supabase.co',
    db_name_or_ref: 'yibkpkfliqirvkrsmich',
    api_key_or_secret: 'postgresql://postgres.yibkpkfliqirvkrsmich:***@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres',
    region: 'AWS ap-southeast-1 (Singapore)',
    notes: 'Database Company Profile & Invoice Client. Login pake email admin@karyaprashida.co.id',
    tables_summary: '5 Tables: client_portal, invoices, vps_nodes, ssl_certs, activity_logs',
    is_active: true
  },
  {
    id: 'db-acc-3',
    name: 'Bali Villa Booking App',
    client_name: 'Bali Villa Connect',
    provider: 'mysql',
    owner_email: 'dev@balivillaconnect.com',
    dashboard_login_url: 'https://app.planetscale.com/balivilla',
    connection_url: 'aws.connect.planetscale.com',
    db_name_or_ref: 'balivilla_prod',
    api_key_or_secret: 'pscale_pw_89712a8z90...',
    region: 'AWS ap-southeast-1 (Singapore)',
    notes: 'SaaS Villa Reservation System. Login PlanetScale pake email dev@balivillaconnect.com',
    tables_summary: '8 Tables: villas, reservations, guests, payments, reviews',
    is_active: true
  },
  {
    id: 'db-acc-4',
    name: 'Realtime Chat & Auth',
    client_name: 'Internal / Mobile App',
    provider: 'firebase',
    owner_email: 'nomstd.dev@gmail.com',
    dashboard_login_url: 'https://console.firebase.google.com',
    connection_url: 'nomstd-live-app.firebaseio.com',
    db_name_or_ref: 'nomstd-live-app',
    api_key_or_secret: 'AIzaSyA89a712z90...',
    region: 'asia-southeast1 (Singapore)',
    notes: 'Realtime Firestore & Push Notifications. Login Google Console: nomstd.dev@gmail.com',
    tables_summary: 'Collections: user_tokens, push_logs, live_presence',
    is_active: true
  }
];

export default function AdminDatabasePage() {
  const [loading, setLoading] = useState(true);
  const [ping, setPing] = useState<number>(18);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  // Category Filter State ('all' | 'supabase' | 'postgresql' | 'mysql' | 'firebase' | 'mongodb' | 'redis')
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Database Accounts List
  const [accounts, setAccounts] = useState<DatabaseAccount[]>([]);

  // INSPECT TABLES MODAL STATE (Triggered per Project Card)
  const [inspectingProject, setInspectingProject] = useState<DatabaseAccount | null>(null);

  // MODAL FORM STATES (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<DatabaseAccount | null>(null);
  const [accForm, setAccForm] = useState<Partial<DatabaseAccount>>({
    name: '',
    client_name: '',
    provider: 'supabase',
    owner_email: '',
    dashboard_login_url: 'https://',
    connection_url: 'https://',
    db_name_or_ref: '',
    api_key_or_secret: '',
    region: 'AWS ap-southeast-1 (Singapore)',
    notes: '',
    tables_summary: ''
  });

  const [deleteTarget, setDeleteTarget] = useState<DatabaseAccount | null>(null);

  const [tables, setTables] = useState<TableMeta[]>([
    { name: 'vps_servers', category: 'Infrastructure', description: 'Server VPS & Cloud Nodes (IDCloudHost, Hetzner, Vultr)', columns: ['id', 'name', 'provider', 'ip_address', 'os', 'specs', 'status', 'ssh_port', 'monthly_cost'], icon: HardDrives, primaryKey: 'id', count: 0 },
    { name: 'domains', category: 'Infrastructure', description: 'Domain clients & SSL certificates tracking', columns: ['id', 'domain_name', 'registrar', 'client_name', 'vps_id', 'ssl_status', 'expiry_date', 'yearly_cost'], icon: Globe, primaryKey: 'id', count: 0 },
    { name: 'deployments', category: 'Infrastructure', description: 'App deployments, web services & docker runners', columns: ['id', 'app_name', 'domain', 'vps_id', 'port', 'env', 'status', 'repo_url'], icon: HardDrives, primaryKey: 'id', count: 0 },
    { name: 'invoices', category: 'Finance & CRM', description: 'Invoices, tagihan client & status pembayaran', columns: ['id', 'invoice_number', 'client_name', 'service_title', 'total', 'down_payment', 'status', 'due_date'], icon: Receipt, primaryKey: 'id', count: 0 },
    { name: 'proposals', category: 'Finance & CRM', description: 'Surat penawaran & quotation estimasi harga', columns: ['id', 'proposal_number', 'client_name', 'project_title', 'total_estimate', 'status'], icon: FileText, primaryKey: 'id', count: 0 },
    { name: 'client_messages', category: 'Client Services', description: 'Pesan masuk dari form kontak website', columns: ['id', 'name', 'email', 'phone', 'service_interest', 'message', 'status'], icon: Envelope, primaryKey: 'id', count: 0 },
    { name: 'invitations', category: 'Client Services', description: 'Project Undangan Digital Client', columns: ['id', 'slug', 'title', 'category', 'client_name', 'event_date', 'status'], icon: Heart, primaryKey: 'id', count: 0 },
    { name: 'projects', category: 'Content', description: 'Showcase portofolio web design & development', columns: ['id', 'title', 'slug', 'category', 'client', 'image', 'tech_stack', 'is_featured'], icon: Briefcase, primaryKey: 'id', count: 0 },
    { name: 'pricing_packages', category: 'Finance & CRM', description: 'Daftar paket harga layanan studio', columns: ['id', 'title', 'category', 'price', 'period', 'features', 'is_popular'], icon: CurrencyDollar, primaryKey: 'id', count: 0 },
    { name: 'promos', category: 'Marketing', description: 'Kode kupon diskon & promo spesial', columns: ['id', 'code', 'discount_type', 'discount_value', 'max_uses', 'used_count', 'valid_until', 'status'], icon: Tag, primaryKey: 'id', count: 0 }
  ]);

  // Load Saved Databases from LocalStorage or Fallback
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_db_accounts_vault') : null;
    let list: DatabaseAccount[] = DEFAULT_ACCOUNTS;

    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
      } catch (e) {
        console.error(e);
      }
    }

    setAccounts(list);
  }, []);

  const fetchTableCounts = async () => {
    setLoading(true);
    const start = performance.now();

    try {
      // Test latency
      await supabase.from('promos').select('id').limit(1);
      setPing(Math.max(12, Math.round(performance.now() - start)));

      // Fetch counts for active database
      const updatedTables = await Promise.all(
        tables.map(async (tbl) => {
          try {
            const { count } = await supabase.from(tbl.name).select('*', { count: 'exact', head: true });
            return { ...tbl, count: count || 0 };
          } catch {
            return { ...tbl, count: 0 };
          }
        })
      );

      setTables(updatedTables);
    } catch (e) {
      toast.error('Gagal terhubung ke Supabase Database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inspectingProject && inspectingProject.provider === 'supabase') {
      fetchTableCounts();
    }
  }, [inspectingProject]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleShowSecret = (id: string) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- MODAL ACTIONS ---
  const handleOpenModal = (acc?: DatabaseAccount) => {
    if (acc) {
      setEditingAcc(acc);
      setAccForm(acc);
    } else {
      setEditingAcc(null);
      setAccForm({
        name: '',
        client_name: '',
        provider: 'supabase',
        owner_email: '',
        dashboard_login_url: 'https://',
        connection_url: 'https://',
        db_name_or_ref: '',
        api_key_or_secret: '',
        region: 'AWS ap-southeast-1 (Singapore)',
        notes: '',
        tables_summary: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accForm.name || !accForm.owner_email || !accForm.connection_url) {
      toast.error('Nama Database, Email Login Owner & URL Koneksi wajib diisi');
      return;
    }

    const payload: DatabaseAccount = {
      id: editingAcc ? editingAcc.id : `db-acc-${Date.now()}`,
      name: accForm.name!.trim(),
      client_name: accForm.client_name?.trim() || 'Internal',
      provider: (accForm.provider as DBProviderType) || 'supabase',
      owner_email: accForm.owner_email!.trim(),
      dashboard_login_url: accForm.dashboard_login_url?.trim() || '',
      connection_url: accForm.connection_url!.trim(),
      db_name_or_ref: accForm.db_name_or_ref?.trim() || '',
      api_key_or_secret: accForm.api_key_or_secret?.trim() || '',
      region: accForm.region || 'AWS ap-southeast-1 (Singapore)',
      notes: accForm.notes?.trim() || '',
      tables_summary: accForm.tables_summary?.trim() || '',
      is_active: true
    };

    let updated: DatabaseAccount[];
    if (editingAcc) {
      updated = accounts.map(a => a.id === editingAcc.id ? payload : a);
    } else {
      updated = [payload, ...accounts];
    }

    setAccounts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nom_db_accounts_vault', JSON.stringify(updated));
    }

    toast.success(`Database ${payload.name} berhasil disimpan!`);
    setIsModalOpen(false);
  };

  const handleDeleteAccount = () => {
    if (!deleteTarget) return;
    const updated = accounts.filter(a => a.id !== deleteTarget.id);
    setAccounts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nom_db_accounts_vault', JSON.stringify(updated));
    }

    toast.success(`Database ${deleteTarget.name} berhasil dihapus!`);
    setDeleteTarget(null);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter(a => {
    const matchesCat = activeCategory === 'all' || a.provider === activeCategory;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.owner_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.client_name && a.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getProviderBadge = (provider: DBProviderType) => {
    switch (provider) {
      case 'supabase':
        return { label: 'SUPABASE', color: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400', icon: Database };
      case 'postgresql':
        return { label: 'POSTGRESQL', color: 'bg-sky-950/80 border-sky-500/30 text-sky-400', icon: HardDrives };
      case 'mysql':
        return { label: 'MYSQL / MARIADB', color: 'bg-amber-950/80 border-amber-500/30 text-amber-400', icon: HardDrives };
      case 'firebase':
        return { label: 'FIREBASE NOSQL', color: 'bg-orange-950/80 border-orange-500/30 text-orange-400', icon: Fire };
      case 'mongodb':
        return { label: 'MONGODB', color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300', icon: Atom };
      case 'redis':
        return { label: 'REDIS CACHE', color: 'bg-rose-950/80 border-rose-500/30 text-rose-400', icon: Lightning };
      default:
        return { label: 'DATABASE', color: 'bg-surface border-border text-foreground', icon: Database };
    }
  };

  const sqlFullSchema = `-- ========================================================
-- NOMSTD 2026 COMPLETE DATABASE SCHEMA & TABLES
-- ========================================================

CREATE TABLE IF NOT EXISTS public.vps_servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  os TEXT NOT NULL,
  specs TEXT NOT NULL,
  status TEXT DEFAULT 'online',
  ssh_port INT DEFAULT 22,
  monthly_cost NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.domains (
  id TEXT PRIMARY KEY,
  domain_name TEXT NOT NULL,
  registrar TEXT NOT NULL,
  client_name TEXT,
  vps_id TEXT REFERENCES public.vps_servers(id) ON DELETE SET NULL,
  ssl_status TEXT DEFAULT 'active',
  expiry_date DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  yearly_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.deployments (
  id TEXT PRIMARY KEY,
  app_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  vps_id TEXT REFERENCES public.vps_servers(id) ON DELETE SET NULL,
  vps_name TEXT,
  port INT DEFAULT 3000,
  env TEXT DEFAULT 'production',
  status TEXT DEFAULT 'running',
  repo_url TEXT,
  client_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  service_title TEXT NOT NULL,
  total NUMERIC NOT NULL,
  down_payment NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'unpaid',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proposals (
  id TEXT PRIMARY KEY,
  proposal_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  total_estimate NUMERIC NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.client_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'wedding',
  client_name TEXT NOT NULL,
  event_date DATE,
  status TEXT DEFAULT 'active',
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  client TEXT,
  image TEXT,
  description TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  period TEXT DEFAULT 'project',
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.promos (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL,
  max_uses INT DEFAULT 100,
  used_count INT DEFAULT 0,
  valid_until DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vps_servers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos DISABLE ROW LEVEL SECURITY;`;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-2 flex items-center gap-3">
            <Database weight="bold" className="text-accent" /> Multi-Database &amp; Account Vault
          </h1>
          <p className="text-muted text-sm font-semibold">
            Pusat ingatan akun login &amp; kredensial database multi-project (Supabase, PostgreSQL, MySQL, Firebase, MongoDB).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus weight="bold" size={18} /> Add Database Account
          </button>
        </div>
      </header>

      {/* CATEGORY & SEARCH FILTER BAR */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                activeCategory === 'all' ? 'bg-accent text-white shadow-md' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              All ({accounts.length})
            </button>
            <button
              onClick={() => setActiveCategory('supabase')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                activeCategory === 'supabase' ? 'bg-emerald-500 text-white shadow-md' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              Supabase ({accounts.filter(a => a.provider === 'supabase').length})
            </button>
            <button
              onClick={() => setActiveCategory('postgresql')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                activeCategory === 'postgresql' ? 'bg-sky-500 text-white shadow-md' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              PostgreSQL ({accounts.filter(a => a.provider === 'postgresql').length})
            </button>
            <button
              onClick={() => setActiveCategory('mysql')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                activeCategory === 'mysql' ? 'bg-amber-500 text-black shadow-md' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              MySQL / MariaDB ({accounts.filter(a => a.provider === 'mysql').length})
            </button>
            <button
              onClick={() => setActiveCategory('firebase')}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer ${
                activeCategory === 'firebase' ? 'bg-orange-500 text-white shadow-md' : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              Firebase ({accounts.filter(a => a.provider === 'firebase').length})
            </button>
          </div>

          <input 
            type="text"
            placeholder="Cari nama web, email owner, atau client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 bg-surface border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-semibold"
          />
        </div>

        {/* MASTER DATABASE ACCOUNTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAccounts.length === 0 ? (
            <div className="col-span-full border border-dashed border-border rounded-3xl p-12 text-center text-muted font-semibold uppercase tracking-widest bg-surface/50">
              Tidak ada akun database ditemukan.
            </div>
          ) : (
            filteredAccounts.map((acc) => {
              const badge = getProviderBadge(acc.provider);
              const BadgeIcon = badge.icon;
              const isSecretVisible = showSecret[acc.id];

              return (
                <div 
                  key={acc.id}
                  className="bg-surface border border-border hover:border-accent/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Header Name & Provider Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className={`text-[9px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 border rounded flex items-center gap-1 w-fit mb-1.5 ${badge.color}`}>
                          <BadgeIcon size={12} weight="bold" /> {badge.label}
                        </span>
                        <h3 className="font-display font-black text-base uppercase text-foreground group-hover:text-accent transition-colors truncate max-w-[200px]">
                          {acc.name}
                        </h3>
                      </div>

                      <span className="text-[10px] font-mono text-muted/80 shrink-0 font-bold">
                        {acc.client_name || 'Internal'}
                      </span>
                    </div>

                    {/* OWNER LOGIN EMAIL HIGHLIGHT BANNER */}
                    <div className="bg-background border border-border/80 p-2.5 rounded-xl font-mono text-xs space-y-1 mb-3 shadow-inner">
                      <span className="text-muted text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <UserCircle size={14} className="text-accent" /> Login Email Owner:
                      </span>
                      <p className="text-accent font-black text-xs truncate underline" title={acc.owner_email}>
                        📧 {acc.owner_email}
                      </p>
                    </div>

                    {/* Connection & Credentials Box */}
                    <div className="space-y-1.5 text-xs font-mono mb-4 text-muted">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-muted/80">URL / Host:</span>
                        <button 
                          onClick={() => handleCopy(acc.connection_url, 'URL')}
                          className="text-foreground hover:text-accent font-bold truncate max-w-[170px] flex items-center gap-1"
                          title="Copy URL"
                        >
                          <span className="truncate">{acc.connection_url}</span>
                          <Copy size={12} />
                        </button>
                      </div>

                      {acc.api_key_or_secret && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
                          <span className="font-bold text-muted/80">Key / Secret:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-foreground truncate max-w-[130px]">
                              {isSecretVisible ? acc.api_key_or_secret : '••••••••••••••••'}
                            </span>
                            <button 
                              onClick={() => toggleShowSecret(acc.id)}
                              className="p-0.5 text-muted hover:text-accent cursor-pointer"
                              title="Toggle Secret"
                            >
                              {isSecretVisible ? <EyeSlash size={12} /> : <Eye size={12} />}
                            </button>
                            <button 
                              onClick={() => handleCopy(acc.api_key_or_secret!, 'Secret Key')}
                              className="p-0.5 text-muted hover:text-accent cursor-pointer"
                              title="Copy Secret Key"
                            >
                              <Copy size={12} />
                            </button>
                          </div>
                        </div>
                      )}

                      {acc.tables_summary && (
                        <p className="text-[11px] font-semibold text-emerald-400/90 pt-1 line-clamp-1 truncate">
                          📊 {acc.tables_summary}
                        </p>
                      )}

                      {acc.notes && (
                        <p className="text-[11px] italic text-muted/90 line-clamp-2">
                          "{acc.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 text-[11px] font-mono">
                    <button 
                      onClick={() => setInspectingProject(acc)}
                      className="px-3 py-1.5 bg-accent/15 text-accent border border-accent/30 rounded-xl font-bold uppercase text-[10px] hover:bg-accent/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ListDashes size={14} weight="bold" /> Inspect Tables
                    </button>

                    <div className="flex items-center gap-1.5">
                      {acc.dashboard_login_url && (
                        <a 
                          href={acc.dashboard_login_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-background border border-border/80 hover:border-accent text-muted hover:text-foreground rounded-lg font-bold flex items-center gap-1 text-[10px]"
                          title="Buka Console Dashboard Provider"
                        >
                          <ArrowSquareOut size={12} /> Console
                        </a>
                      )}

                      <button 
                        onClick={() => handleOpenModal(acc)}
                        className="p-1 text-muted hover:text-accent transition-colors cursor-pointer"
                        title="Edit Database Info"
                      >
                        <PencilSimple size={15} />
                      </button>

                      <button 
                        onClick={() => setDeleteTarget(acc)}
                        className="p-1 text-muted hover:text-red-400 transition-colors cursor-pointer"
                        title="Hapus Database"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SQL Script Viewer & 1-Click Copy */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={20} className="text-accent" />
            <h2 className="text-base font-display font-black uppercase text-foreground">
              Full Database SQL DDL Script
            </h2>
          </div>

          <button 
            onClick={() => handleCopy(sqlFullSchema, 'SQL Script')}
            className="px-4 py-2 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-accent/90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {copiedText === 'SQL Script' ? <Check size={16} /> : <Copy size={16} />}
            <span>Copy SQL Script</span>
          </button>
        </div>

        <pre className="bg-background border border-border/80 p-4 rounded-xl font-mono text-xs text-foreground/90 overflow-x-auto max-h-[250px] custom-scrollbar">
          {sqlFullSchema}
        </pre>
      </div>

      {/* DEDICATED PROJECT TABLES INSPECTOR MODAL (Per Project Card) */}
      {inspectingProject && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-border/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database size={24} className="text-accent" />
                    <h3 className="text-2xl font-display font-black uppercase text-foreground">
                      {inspectingProject.name}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-black uppercase rounded">
                      ONLINE ({ping}ms)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
                    <span className="text-accent font-bold">📧 Owner Email: {inspectingProject.owner_email}</span>
                    <span className="text-border">•</span>
                    <span className="text-muted">Host: {inspectingProject.connection_url}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setInspectingProject(null)} 
                  className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Table List Inspection Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                    <ListDashes size={18} className="text-accent" /> Schema &amp; Registered Tables ({tables.length})
                  </h4>
                  {inspectingProject.provider === 'supabase' && (
                    <button 
                      onClick={fetchTableCounts}
                      disabled={loading}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Lightning size={14} className={loading ? "animate-spin" : ""} /> Refresh Live Counts
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tables.map((table) => {
                    const TableIcon = table.icon;
                    return (
                      <div key={table.name} className="bg-background border border-border/80 rounded-2xl p-4 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TableIcon size={18} className="text-accent" />
                            <span className="font-black text-foreground">{table.name}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-surface border border-border text-accent text-[10px] font-bold rounded">
                            {inspectingProject.provider === 'supabase' ? `${table.count} rows` : 'Active'}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted line-clamp-2">{table.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {table.columns.map((col) => (
                            <span key={col} className="px-1.5 py-0.5 bg-surface border border-border/60 text-[9px] rounded text-foreground/80">
                              {col === table.primaryKey ? `🔑 ${col}` : col}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end pt-4 border-t border-border/80">
                <button 
                  onClick={() => setInspectingProject(null)}
                  className="px-6 py-2.5 bg-accent text-white rounded-xl font-bold uppercase text-xs shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                >
                  Tutup Inspector
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* MODAL: ADD / EDIT DATABASE ACCOUNT */}
      {isModalOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
                <div className="flex items-center gap-2">
                  <Database size={22} className="text-accent" />
                  <h3 className="text-xl font-display font-black uppercase tracking-tight text-foreground">
                    {editingAcc ? 'Edit Database Account' : 'Add Database Account'}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Nama Project / Title Database *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="misal: NOMSTD Official 2026 atau PT Karya Prashida Portal"
                    value={accForm.name || ''}
                    onChange={(e) => setAccForm({ ...accForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                      Provider / Type *
                    </label>
                    <select
                      value={accForm.provider || 'supabase'}
                      onChange={(e) => setAccForm({ ...accForm, provider: e.target.value as DBProviderType })}
                      className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-semibold"
                    >
                      <option value="supabase">Supabase</option>
                      <option value="postgresql">PostgreSQL</option>
                      <option value="mysql">MySQL / MariaDB</option>
                      <option value="firebase">Firebase NoSQL</option>
                      <option value="mongodb">MongoDB</option>
                      <option value="redis">Redis Cache</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                      Client / Owner Web
                    </label>
                    <input 
                      type="text"
                      placeholder="misal: Internal Studio"
                      value={accForm.client_name || ''}
                      onChange={(e) => setAccForm({ ...accForm, client_name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    📧 Owner Login Email * (PENTING: Email mana yang dipake login ke console)
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="misal: nomstd2026@gmail.com atau admin@client.com"
                    value={accForm.owner_email || ''}
                    onChange={(e) => setAccForm({ ...accForm, owner_email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    URL Connection / Host Database *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="https://uxnerrixrumizakivjww.supabase.co atau db.karyaprashida.co.id:5432"
                    value={accForm.connection_url || ''}
                    onChange={(e) => setAccForm({ ...accForm, connection_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Dashboard Login URL (Link Konsol Web Provider)
                  </label>
                  <input 
                    type="text"
                    placeholder="https://supabase.com/dashboard atau https://console.firebase.google.com"
                    value={accForm.dashboard_login_url || ''}
                    onChange={(e) => setAccForm({ ...accForm, dashboard_login_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    API Key / Secret Password / Connection String
                  </label>
                  <input 
                    type="text"
                    placeholder="Anon key / password database..."
                    value={accForm.api_key_or_secret || ''}
                    onChange={(e) => setAccForm({ ...accForm, api_key_or_secret: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Ringkasan Tabel / Collections
                  </label>
                  <input 
                    type="text"
                    placeholder="misal: 10 Tables: vps_servers, invoices, projects..."
                    value={accForm.tables_summary || ''}
                    onChange={(e) => setAccForm({ ...accForm, tables_summary: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Catatan Khusus (Login via Google, 2FA, DLL)
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Catatan khusus login akun..."
                    value={accForm.notes || ''}
                    onChange={(e) => setAccForm({ ...accForm, notes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-medium"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/80">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-background border border-border text-muted hover:text-foreground rounded-xl font-bold uppercase text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-accent text-white rounded-xl font-bold uppercase text-xs shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                  >
                    Simpan Database Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <Portal>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <Trash size={24} />
              </div>
              <h3 className="text-lg font-display font-black uppercase text-foreground">
                Hapus Akun Database?
              </h3>
              <p className="text-xs text-muted">
                Apakah Anda yakin ingin menghapus pencatatan akun database <strong className="text-foreground">{deleteTarget.name}</strong>?
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button 
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 bg-background border border-border text-muted hover:text-foreground rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-5 py-2 bg-red-500 text-white rounded-xl font-bold text-xs uppercase shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
