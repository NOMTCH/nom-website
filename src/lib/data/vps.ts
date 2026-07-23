import { supabase } from '../supabase';

export interface VPSServer {
  id: string;
  name: string;
  provider: string;
  ip_address: string;
  os: string;
  specs: string;
  status: 'online' | 'maintenance' | 'offline';
  ssh_port: number;
  monthly_cost: number;
  notes?: string;
  created_at?: string;
}

export interface DomainItem {
  id: string;
  domain_name: string;
  registrar: string;
  client_name?: string;
  vps_id?: string;
  ssl_status: 'active' | 'expiring_soon' | 'expired';
  expiry_date: string;
  auto_renew: boolean;
  yearly_cost: number;
  created_at?: string;
}

export interface AppDeployment {
  id: string;
  app_name: string;
  domain: string;
  vps_id?: string;
  vps_name?: string;
  port?: number;
  env: 'production' | 'staging';
  status: 'running' | 'stopped' | 'deploying';
  repo_url?: string;
  client_name?: string;
  created_at?: string;
}

// Initial Default Data (Matches live Supabase vps_servers table)
export const DEFAULT_SERVERS: VPSServer[] = [
  {
    id: 'vps-1',
    name: 'NOMLABS',
    provider: 'IDCloudHost',
    ip_address: '103.172.205.222',
    os: 'Ubuntu 24.04 LTS',
    specs: '2 vCPU / 2GB RAM / 40GB NVMe',
    status: 'online',
    ssh_port: 22,
    monthly_cost: 150000,
    notes: 'Main Production VPS IDCloudHost NOMLABS Server',
    created_at: new Date().toISOString()
  }
];

export const DEFAULT_DOMAINS: DomainItem[] = [
  {
    id: 'dom-1',
    domain_name: 'nomstd.my.id',
    registrar: 'IDCloudHost',
    client_name: 'Internal (NOM Studio)',
    vps_id: 'vps-1',
    ssl_status: 'active',
    expiry_date: '2027-04-15',
    auto_renew: true,
    yearly_cost: 150000,
    created_at: new Date().toISOString()
  },
  {
    id: 'dom-2',
    domain_name: 'ptkaryaprashida.co.id',
    registrar: 'Rumahweb',
    client_name: 'PT Karya Prashida',
    vps_id: 'vps-1',
    ssl_status: 'active',
    expiry_date: '2026-11-20',
    auto_renew: true,
    yearly_cost: 275000,
    created_at: new Date().toISOString()
  },
  {
    id: 'dom-3',
    domain_name: 'balivillaconnect.com',
    registrar: 'Namecheap',
    client_name: 'Bali Villa Connect',
    vps_id: 'vps-2',
    ssl_status: 'expiring_soon',
    expiry_date: '2026-08-05',
    auto_renew: false,
    yearly_cost: 210000,
    created_at: new Date().toISOString()
  }
];

export const DEFAULT_DEPLOYMENTS: AppDeployment[] = [
  {
    id: 'dep-1',
    app_name: 'NOM Official Website 2026',
    domain: 'nomstd.my.id',
    vps_id: 'vps-1',
    vps_name: 'NOM-PROD-SG-01',
    port: 3000,
    env: 'production',
    status: 'running',
    repo_url: 'github.com/NOMTCH/nom-website',
    client_name: 'Internal',
    created_at: new Date().toISOString()
  },
  {
    id: 'dep-2',
    app_name: 'Karya Prashida Web Portal',
    domain: 'ptkaryaprashida.co.id',
    vps_id: 'vps-1',
    vps_name: 'NOM-PROD-SG-01',
    port: 3001,
    env: 'production',
    status: 'running',
    repo_url: 'github.com/NOMTCH/karyaprashida-web',
    client_name: 'PT Karya Prashida',
    created_at: new Date().toISOString()
  },
  {
    id: 'dep-3',
    app_name: 'Bali Villa Booking System',
    domain: 'balivillaconnect.com',
    vps_id: 'vps-2',
    vps_name: 'HETZNER-DE-APPS',
    port: 8080,
    env: 'production',
    status: 'running',
    repo_url: 'github.com/NOMTCH/bali-villa-app',
    client_name: 'Bali Villa Connect',
    created_at: new Date().toISOString()
  }
];

// Supabase API wrappers with fallback to localStorage
export async function getVPSServers(): Promise<VPSServer[]> {
  try {
    const { data, error } = await supabase.from('vps_servers').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      if (data.length > 0) return data as VPSServer[];
      // If Supabase table is empty, check localStorage or default
      const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_vps_servers') : null;
      if (stored !== null) return JSON.parse(stored);
      return DEFAULT_SERVERS;
    }
  } catch (e) {
    console.warn('Using local fallback for VPS servers');
  }

  const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_vps_servers') : null;
  if (stored !== null) return JSON.parse(stored);
  return DEFAULT_SERVERS;
}

export async function saveVPSServer(server: VPSServer): Promise<void> {
  try {
    await supabase.from('vps_servers').upsert([server]);
  } catch (e) {
    console.warn('Saved server to local fallback');
  }
  const current = await getVPSServers();
  const index = current.findIndex(s => s.id === server.id);
  if (index >= 0) current[index] = server;
  else current.unshift(server);
  if (typeof window !== 'undefined') localStorage.setItem('nom_vps_servers', JSON.stringify(current));
}

export async function deleteVPSServer(id: string): Promise<void> {
  try {
    await supabase.from('vps_servers').delete().eq('id', id);
  } catch (e) {
    console.warn('Deleted server from local fallback');
  }
  const current = await getVPSServers();
  const updated = current.filter(s => s.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem('nom_vps_servers', JSON.stringify(updated));
}

export async function getDomains(): Promise<DomainItem[]> {
  try {
    const { data, error } = await supabase.from('domains').select('*').order('expiry_date', { ascending: true });
    if (!error && data) {
      if (data.length > 0) return data as DomainItem[];
      const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_domains') : null;
      if (stored !== null) return JSON.parse(stored);
      return DEFAULT_DOMAINS;
    }
  } catch (e) {
    console.warn('Using local fallback for domains');
  }

  const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_domains') : null;
  if (stored !== null) return JSON.parse(stored);
  return DEFAULT_DOMAINS;
}

export async function saveDomain(domain: DomainItem): Promise<void> {
  try {
    await supabase.from('domains').upsert([domain]);
  } catch (e) {
    console.warn('Saved domain to local fallback');
  }
  const current = await getDomains();
  const index = current.findIndex(d => d.id === domain.id);
  if (index >= 0) current[index] = domain;
  else current.unshift(domain);
  if (typeof window !== 'undefined') localStorage.setItem('nom_domains', JSON.stringify(current));
}

export async function deleteDomain(id: string): Promise<void> {
  try {
    await supabase.from('domains').delete().eq('id', id);
  } catch (e) {
    console.warn('Deleted domain from local fallback');
  }
  const current = await getDomains();
  const updated = current.filter(d => d.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem('nom_domains', JSON.stringify(updated));
}

export async function getDeployments(): Promise<AppDeployment[]> {
  try {
    const { data, error } = await supabase.from('deployments').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      if (data.length > 0) return data as AppDeployment[];
      const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_deployments') : null;
      if (stored !== null) return JSON.parse(stored);
      return DEFAULT_DEPLOYMENTS;
    }
  } catch (e) {
    console.warn('Using local fallback for deployments');
  }

  const stored = typeof window !== 'undefined' ? localStorage.getItem('nom_deployments') : null;
  if (stored !== null) return JSON.parse(stored);
  return DEFAULT_DEPLOYMENTS;
}

export async function saveDeployment(dep: AppDeployment): Promise<void> {
  try {
    await supabase.from('deployments').upsert([dep]);
  } catch (e) {
    console.warn('Saved deployment to local fallback');
  }
  const current = await getDeployments();
  const index = current.findIndex(d => d.id === dep.id);
  if (index >= 0) current[index] = dep;
  else current.unshift(dep);
  if (typeof window !== 'undefined') localStorage.setItem('nom_deployments', JSON.stringify(current));
}

export async function deleteDeployment(id: string): Promise<void> {
  try {
    await supabase.from('deployments').delete().eq('id', id);
  } catch (e) {
    console.warn('Deleted deployment from local fallback');
  }
  const current = await getDeployments();
  const updated = current.filter(d => d.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem('nom_deployments', JSON.stringify(updated));
}
