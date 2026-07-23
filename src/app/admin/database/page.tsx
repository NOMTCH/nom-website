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
  Sparkle
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface TableMeta {
  name: string;
  category: string;
  description: string;
  columns: string[];
  icon: any;
  primaryKey: string;
  count: number;
}

export default function AdminDatabasePage() {
  const [loading, setLoading] = useState(true);
  const [ping, setPing] = useState<number>(18);
  const [copiedText, setCopiedText] = useState<string | null>(null);
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uxnerrixrumizakivjww.supabase.co';
  const supabaseProjectRef = 'uxnerrixrumizakivjww';

  const fetchTableCounts = async () => {
    setLoading(true);
    const start = performance.now();

    try {
      // Test latency
      await supabase.from('promos').select('id').limit(1);
      setPing(Math.max(12, Math.round(performance.now() - start)));

      // Fetch counts for all tables asynchronously
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
    fetchTableCounts();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const sqlFullSchema = `-- ========================================================
-- NOMSTD 2026 COMPLETE DATABASE SCHEMA & TABLES
-- Project: https://uxnerrixrumizakivjww.supabase.co
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
            <Database weight="bold" className="text-accent" /> Database Cluster &amp; Tables
          </h1>
          <p className="text-muted text-sm font-semibold">
            Monitor koneksi Supabase PostgreSQL, struktur 10 tabel utama, RLS policy, &amp; credentials database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTableCounts}
            disabled={loading}
            className="bg-accent/20 text-accent border border-accent/30 px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-accent/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Lightning size={16} weight="fill" className={loading ? "animate-spin" : "animate-pulse"} />
            {loading ? 'Refreshing...' : 'Refresh Status & Counts'}
          </button>

          <a 
            href={`https://supabase.com/dashboard/project/${supabaseProjectRef}/editor`}
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowSquareOut weight="bold" size={16} /> Open Supabase Studio
          </a>
        </div>
      </header>

      {/* Supabase Connection Overview Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <h2 className="text-lg font-display font-black uppercase text-foreground">
                Supabase Cloud PostgreSQL ({ping}ms)
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-black uppercase rounded">
                CONNECTED &amp; SYNCED
              </span>
            </div>

            <p className="text-xs text-muted font-mono">
              Project Ref: <span className="text-foreground font-bold">{supabaseProjectRef}</span> • Region: <span className="text-emerald-400 font-bold">AWS ap-southeast-1 (Singapore)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button 
              onClick={() => handleCopy(supabaseUrl, 'Project URL')}
              className="px-3 py-1.5 bg-background border border-border/80 hover:border-accent text-muted hover:text-foreground rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedText === 'Project URL' ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              <span>Copy URL</span>
            </button>

            <button 
              onClick={() => handleCopy(`postgresql://postgres.${supabaseProjectRef}:***@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`, 'Pooler String')}
              className="px-3 py-1.5 bg-background border border-border/80 hover:border-accent text-muted hover:text-foreground rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedText === 'Pooler String' ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              <span>Copy Pooler Connection</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Tables Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-black uppercase tracking-tight text-foreground flex items-center gap-2">
            <HardDrives className="text-accent" /> Registered Database Tables ({tables.length})
          </h2>
          <span className="text-xs font-mono text-muted font-bold">
            Total Rows: {tables.reduce((acc, t) => acc + t.count, 0)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tables.map((table) => {
            const TableIcon = table.icon;
            return (
              <div 
                key={table.name}
                className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-accent/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-background border border-border rounded-xl flex items-center justify-center text-accent shrink-0 group-hover:scale-105 transition-transform">
                        <TableIcon size={20} weight="bold" />
                      </div>
                      <div>
                        <h3 className="font-mono font-black text-sm text-foreground group-hover:text-accent transition-colors">
                          {table.name}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted/80">
                          {table.category}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-background border border-border/80 text-accent font-mono text-xs font-extrabold rounded-xl">
                      {table.count} rows
                    </span>
                  </div>

                  <p className="text-xs text-muted mb-4 line-clamp-2">
                    {table.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold uppercase text-muted tracking-wider block">Columns Schema:</span>
                    <div className="flex flex-wrap gap-1">
                      {table.columns.map((col) => (
                        <span key={col} className="px-2 py-0.5 bg-background border border-border/60 text-foreground font-mono text-[10px] rounded">
                          {col === table.primaryKey ? `🔑 ${col}` : col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck size={14} /> RLS Disabled (Full Admin Access)
                  </div>
                </div>
              </div>
            );
          })}
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

        <pre className="bg-background border border-border/80 p-4 rounded-xl font-mono text-xs text-foreground/90 overflow-x-auto max-h-[300px] custom-scrollbar">
          {sqlFullSchema}
        </pre>
      </div>
    </div>
  );
}
