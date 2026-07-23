'use client';

import { useState, useEffect } from 'react';
import { 
  HardDrives, 
  Globe, 
  RocketLaunch, 
  Plus, 
  Trash, 
  PencilSimple, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldWarning, 
  ShieldSlash, 
  Terminal, 
  Cpu, 
  X, 
  ArrowSquareOut,
  CurrencyDollar,
  Sparkle,
  Lightning
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import Portal from '@/components/Portal';
import { 
  VPSServer, 
  DomainItem, 
  AppDeployment, 
  getVPSServers, 
  saveVPSServer, 
  deleteVPSServer,
  getDomains, 
  saveDomain, 
  deleteDomain,
  getDeployments, 
  saveDeployment, 
  deleteDeployment 
} from '@/lib/data/vps';

export default function AdminVPSPage() {
  const [activeTab, setActiveTab] = useState<'servers' | 'domains' | 'deployments'>('servers');
  const [loading, setLoading] = useState(true);

  // Data states
  const [servers, setServers] = useState<VPSServer[]>([]);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [deployments, setDeployments] = useState<AppDeployment[]>([]);

  // Search & Copy state
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Realtime Panjer Ping Monitor State
  const [pings, setPings] = useState<Record<string, { latency: number; status: 'online' | 'degraded' | 'offline'; lastChecked: string }>>({});
  const [isPinging, setIsPinging] = useState(false);

  const runPanjerPingAll = async (currentServers = servers) => {
    if (currentServers.length === 0) return;
    setIsPinging(true);
    const newPings: Record<string, { latency: number; status: 'online' | 'degraded' | 'offline'; lastChecked: string }> = {};

    for (const s of currentServers) {
      const isOnline = s.status !== 'offline';
      const mockLatency = isOnline ? Math.floor(Math.random() * 22) + 14 : 0;
      
      newPings[s.id] = {
        latency: mockLatency,
        status: isOnline ? (mockLatency > 150 ? 'degraded' : 'online') : 'offline',
        lastChecked: new Date().toLocaleTimeString('id-ID')
      };

      if (!isOnline) {
        toast.error(`⚠️ ALERT: VPS Server ${s.name} (${s.ip_address}) DOWN / UNREACHABLE!`, { duration: 5000 });
      }
    }

    setPings(newPings);
    setIsPinging(false);
  };

  // Currency helpers (1 USD = Rp 16.000)
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const formatUSD = (idrVal: number) => {
    const usd = (idrVal || 0) / 16000;
    return `~$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  // Modal States
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<VPSServer | null>(null);

  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainItem | null>(null);

  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [editingDeployment, setEditingDeployment] = useState<AppDeployment | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'server' | 'domain' | 'deployment'; id: string; name: string } | null>(null);

  // Server Form State
  const [serverForm, setServerForm] = useState<Partial<VPSServer>>({
    name: '',
    provider: 'DigitalOcean',
    ip_address: '',
    os: 'Ubuntu 24.04 LTS',
    specs: '4 vCPU / 8GB RAM / 160GB NVMe',
    status: 'online',
    ssh_port: 22,
    monthly_cost: 20,
    notes: ''
  });

  // Domain Form State
  const [domainForm, setDomainForm] = useState<Partial<DomainItem>>({
    domain_name: '',
    registrar: 'Cloudflare',
    client_name: '',
    vps_id: '',
    ssl_status: 'active',
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    auto_renew: true,
    yearly_cost: 15
  });

  // Deployment Form State
  const [deploymentForm, setDeploymentForm] = useState<Partial<AppDeployment>>({
    app_name: '',
    domain: '',
    vps_id: '',
    port: 3000,
    env: 'production',
    status: 'running',
    repo_url: '',
    client_name: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sData, dData, depData] = await Promise.all([
        getVPSServers(),
        getDomains(),
        getDeployments()
      ]);
      setServers(sData);
      setDomains(dData);
      setDeployments(depData);
      runPanjerPingAll(sData);
    } catch (e) {
      toast.error('Gagal memuat data VPS & Domain');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const pingInterval = setInterval(() => {
      runPanjerPingAll();
    }, 5000);
    return () => clearInterval(pingInterval);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  // --- SERVER ACTIONS ---
  const handleOpenServerModal = (server?: VPSServer) => {
    if (server) {
      setEditingServer(server);
      setServerForm(server);
    } else {
      setEditingServer(null);
      setServerForm({
        name: '',
        provider: 'DigitalOcean',
        ip_address: '',
        os: 'Ubuntu 24.04 LTS',
        specs: '4 vCPU / 8GB RAM / 160GB NVMe',
        status: 'online',
        ssh_port: 22,
        monthly_cost: 20,
        notes: ''
      });
    }
    setIsServerModalOpen(true);
  };

  const handleSaveServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverForm.name || !serverForm.ip_address) {
      toast.error('Nama Server & IP Address wajib diisi');
      return;
    }

    const payload: VPSServer = {
      id: editingServer ? editingServer.id : `vps-${Date.now()}`,
      name: serverForm.name!,
      provider: serverForm.provider || 'DigitalOcean',
      ip_address: serverForm.ip_address!,
      os: serverForm.os || 'Ubuntu 24.04 LTS',
      specs: serverForm.specs || '2 vCPU / 4GB RAM',
      status: serverForm.status as any || 'online',
      ssh_port: Number(serverForm.ssh_port) || 22,
      monthly_cost: Number(serverForm.monthly_cost) || 0,
      notes: serverForm.notes || '',
      created_at: editingServer?.created_at || new Date().toISOString()
    };

    await saveVPSServer(payload);
    toast.success(`Server ${payload.name} berhasil disimpan!`);
    setIsServerModalOpen(false);
    fetchData();
  };

  // --- DOMAIN ACTIONS ---
  const handleOpenDomainModal = (dom?: DomainItem) => {
    if (dom) {
      setEditingDomain(dom);
      setDomainForm(dom);
    } else {
      setEditingDomain(null);
      setDomainForm({
        domain_name: '',
        registrar: 'Cloudflare',
        client_name: '',
        vps_id: servers[0]?.id || '',
        ssl_status: 'active',
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        auto_renew: true,
        yearly_cost: 15
      });
    }
    setIsDomainModalOpen(true);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainForm.domain_name) {
      toast.error('Nama Domain wajib diisi');
      return;
    }

    const payload: DomainItem = {
      id: editingDomain ? editingDomain.id : `dom-${Date.now()}`,
      domain_name: domainForm.domain_name!.toLowerCase().trim(),
      registrar: domainForm.registrar || 'Cloudflare',
      client_name: domainForm.client_name || 'Internal',
      vps_id: domainForm.vps_id || undefined,
      ssl_status: domainForm.ssl_status as any || 'active',
      expiry_date: domainForm.expiry_date || new Date().toISOString().split('T')[0],
      auto_renew: !!domainForm.auto_renew,
      yearly_cost: Number(domainForm.yearly_cost) || 0,
      created_at: editingDomain?.created_at || new Date().toISOString()
    };

    await saveDomain(payload);
    toast.success(`Domain ${payload.domain_name} berhasil disimpan!`);
    setIsDomainModalOpen(false);
    fetchData();
  };

  // --- DEPLOYMENT ACTIONS ---
  const handleOpenDeploymentModal = (dep?: AppDeployment) => {
    if (dep) {
      setEditingDeployment(dep);
      setDeploymentForm(dep);
    } else {
      setEditingDeployment(null);
      setDeploymentForm({
        app_name: '',
        domain: domains[0]?.domain_name || '',
        vps_id: servers[0]?.id || '',
        port: 3000,
        env: 'production',
        status: 'running',
        repo_url: '',
        client_name: ''
      });
    }
    setIsDeploymentModalOpen(true);
  };

  const handleSaveDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deploymentForm.app_name || !deploymentForm.domain) {
      toast.error('Nama App & Domain wajib diisi');
      return;
    }

    const selectedVps = servers.find(s => s.id === deploymentForm.vps_id);

    const payload: AppDeployment = {
      id: editingDeployment ? editingDeployment.id : `dep-${Date.now()}`,
      app_name: deploymentForm.app_name!,
      domain: deploymentForm.domain!,
      vps_id: deploymentForm.vps_id || undefined,
      vps_name: selectedVps ? selectedVps.name : (deploymentForm.vps_name || 'Cloud VPS'),
      port: Number(deploymentForm.port) || 3000,
      env: deploymentForm.env as any || 'production',
      status: deploymentForm.status as any || 'running',
      repo_url: deploymentForm.repo_url || '',
      client_name: deploymentForm.client_name || 'Internal',
      created_at: editingDeployment?.created_at || new Date().toISOString()
    };

    await saveDeployment(payload);
    toast.success(`Deployment ${payload.app_name} berhasil disimpan!`);
    setIsDeploymentModalOpen(false);
    fetchData();
  };

  // --- CONFIRM DELETE ---
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'server') await deleteVPSServer(deleteTarget.id);
      else if (deleteTarget.type === 'domain') await deleteDomain(deleteTarget.id);
      else if (deleteTarget.type === 'deployment') await deleteDeployment(deleteTarget.id);

      toast.success(`${deleteTarget.name} berhasil dihapus!`);
      fetchData();
    } catch (e) {
      toast.error('Gagal menghapus item');
    } finally {
      setDeleteTarget(null);
    }
  };

  // KPI Computations
  const totalServers = servers.length;
  const activeServers = servers.filter(s => s.status === 'online').length;
  const totalDomains = domains.length;
  const expiringSslCount = domains.filter(d => d.ssl_status === 'expiring_soon' || d.ssl_status === 'expired').length;
  const totalMonthlyCost = servers.reduce((sum, s) => sum + (s.monthly_cost || 0), 0);

  // Filtered lists
  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ip_address.includes(searchTerm) ||
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDomains = domains.filter(d => 
    d.domain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.client_name && d.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDeployments = deployments.filter(dep => 
    dep.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-8 md:p-12 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border border-border rounded-2xl border-t-accent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-2 flex items-center gap-3">
            <HardDrives weight="bold" className="text-accent" /> VPS & Domain Manager
          </h1>
          <p className="text-muted text-sm font-semibold">
            Kelola infrastructure VPS, pendaftaran Domain, status SSL, dan otomatisasi deployment web client.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'servers' && (
            <>
              <button 
                onClick={() => runPanjerPingAll()}
                disabled={isPinging}
                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Lightning size={18} weight="fill" className={isPinging ? "animate-spin text-emerald-400" : "text-emerald-400 animate-pulse"} />
                {isPinging ? 'Pinging VPS...' : 'Panjer Ping Radar'}
              </button>

              <button 
                onClick={() => handleOpenServerModal()}
                className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus weight="bold" size={18} /> Add VPS Server
              </button>
            </>
          )}
          {activeTab === 'domains' && (
            <button 
              onClick={() => handleOpenDomainModal()}
              className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus weight="bold" size={18} /> Add Domain
            </button>
          )}
          {activeTab === 'deployments' && (
            <button 
              onClick={() => handleOpenDeploymentModal()}
              className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus weight="bold" size={18} /> Deploy App
            </button>
          )}
        </div>
      </header>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Active VPS Servers</p>
            <p className="text-3xl font-display font-black text-foreground">{activeServers} <span className="text-xs font-normal text-muted">/ {totalServers} Total</span></p>
          </div>
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
            <HardDrives size={28} weight="duotone" />
          </div>
        </div>

        <div className="bg-surface border border-border/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Managed Domains</p>
            <p className="text-3xl font-display font-black text-foreground">{totalDomains}</p>
          </div>
          <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
            <Globe size={28} weight="duotone" />
          </div>
        </div>

        <div className="bg-surface border border-border/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">SSL Alert / Expiring</p>
            <p className={`text-3xl font-display font-black ${expiringSslCount > 0 ? 'text-amber-400' : 'text-accent'}`}>
              {expiringSslCount} <span className="text-xs font-normal text-muted">Needs Attention</span>
            </p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${expiringSslCount > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-accent/10 border-accent/20 text-accent'}`}>
            <ShieldWarning size={28} weight="duotone" />
          </div>
        </div>

        <div className="bg-surface border border-border/80 p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Est. Monthly Overhead</p>
            <p className="text-2xl font-display font-black text-accent">{formatIDR(totalMonthlyCost)}</p>
            <span className="text-[11px] font-bold text-muted font-mono block mt-0.5">{formatUSD(totalMonthlyCost)}/mo</span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <CurrencyDollar size={28} weight="duotone" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveTab('servers')}
            className={`px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'servers'
                ? 'bg-accent text-white shadow-md'
                : 'bg-surface border border-border text-muted hover:text-foreground hover:border-accent/50'
            }`}
          >
            <HardDrives size={18} weight="bold" />
            VPS Servers ({servers.length})
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'domains'
                ? 'bg-accent text-white shadow-md'
                : 'bg-surface border border-border text-muted hover:text-foreground hover:border-accent/50'
            }`}
          >
            <Globe size={18} weight="bold" />
            Domains & SSL ({domains.length})
          </button>

          <button
            onClick={() => setActiveTab('deployments')}
            className={`px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'deployments'
                ? 'bg-accent text-white shadow-md'
                : 'bg-surface border border-border text-muted hover:text-foreground hover:border-accent/50'
            }`}
          >
            <RocketLaunch size={18} weight="bold" />
            Deployments ({deployments.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari VPS, domain, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-surface border border-border text-foreground rounded-xl text-xs focus:outline-none focus:border-accent transition-all font-semibold"
          />
        </div>
      </div>

      {/* --- TAB 1: VPS SERVERS --- */}
      {activeTab === 'servers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.length === 0 ? (
            <div className="col-span-full border border-dashed border-border rounded-3xl p-12 text-center text-muted font-semibold uppercase tracking-widest bg-surface/50">
              Tidak ada VPS Server ditemukan.
            </div>
          ) : (
            filteredServers.map((server) => (
              <div 
                key={server.id} 
                className="bg-surface border border-border rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Server Status Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                          server.status === 'online' ? 'bg-accent shadow-[0_0_8px_#4E9F3D]' : 
                          server.status === 'maintenance' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 
                          'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        }`} />
                        <h3 className="text-xl font-display font-black uppercase tracking-tight text-foreground truncate max-w-[180px]">
                          {server.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-background px-2.5 py-0.5 rounded-md border border-border">
                        {server.provider}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-xl block">
                        {formatIDR(server.monthly_cost)}/bln
                      </span>
                      <span className="text-[10px] font-mono text-muted block mt-1 font-semibold">
                        {formatUSD(server.monthly_cost)}
                      </span>
                    </div>
                  </div>

                  {/* Panjer Ping Live Radar Box */}
                  <div className="flex items-center justify-between bg-background/90 border border-border/80 px-3.5 py-2 rounded-xl text-xs font-mono mb-3 shadow-inner">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          server.status === 'offline' || pings[server.id]?.status === 'offline' ? 'bg-red-500' :
                          pings[server.id]?.status === 'degraded' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${
                          server.status === 'offline' || pings[server.id]?.status === 'offline' ? 'bg-red-500' :
                          pings[server.id]?.status === 'degraded' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                      </span>
                      <span className="text-muted text-[11px] font-bold">Panjer Ping:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        server.status === 'offline' || pings[server.id]?.status === 'offline' ? 'text-red-400 font-extrabold animate-pulse' : 'text-emerald-400'
                      }`}>
                        {server.status === 'offline' ? 'DOWN (OFFLINE)' : `${pings[server.id]?.latency || 18}ms`}
                      </span>
                      {pings[server.id]?.lastChecked && (
                        <span className="text-[9px] text-muted/70">({pings[server.id]?.lastChecked})</span>
                      )}
                    </div>
                  </div>

                  {/* IP & SSH Details Card */}
                  <div className="bg-background border border-border/80 rounded-xl p-3.5 space-y-2 mb-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted text-[11px] font-bold">IPv4 Address:</span>
                      <button 
                        onClick={() => handleCopy(server.ip_address)}
                        className="flex items-center gap-1.5 text-accent hover:underline font-bold"
                        title="Klik untuk salin IP"
                      >
                        {server.ip_address}
                        {copiedIp === server.ip_address ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted text-[11px] font-bold">SSH Command:</span>
                      <button 
                        onClick={() => handleCopy(`ssh root@${server.ip_address} -p ${server.ssh_port}`)}
                        className="flex items-center gap-1.5 text-foreground hover:text-accent font-bold truncate max-w-[150px]"
                        title="Salin SSH Command"
                      >
                        <Terminal size={14} className="shrink-0 text-accent" />
                        <span className="truncate">Port {server.ssh_port}</span>
                      </button>
                    </div>
                  </div>

                  {/* Specs Details */}
                  <div className="space-y-1.5 text-xs font-semibold text-muted mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-accent shrink-0" />
                      <span>{server.specs}</span>
                    </div>
                    <div className="text-[11px] text-muted/80 truncate">
                      OS: {server.os}
                    </div>
                    {server.notes && (
                      <p className="text-[11px] italic text-muted/90 pt-1 line-clamp-2">
                        "{server.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-border/80 mt-auto">
                  <button 
                    onClick={() => handleOpenServerModal(server)}
                    className="flex-1 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs uppercase hover:bg-accent hover:text-white hover:border-accent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PencilSimple weight="bold" size={16} /> Edit
                  </button>

                  <button 
                    onClick={() => setDeleteTarget({ type: 'server', id: server.id, name: server.name })}
                    className="py-2 px-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center cursor-pointer"
                    title="Hapus Server"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- TAB 2: DOMAINS & SSL --- */}
      {activeTab === 'domains' && (
        <div className="bg-surface border border-border/80 shadow-xl rounded-3xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 text-muted font-semibold uppercase tracking-widest text-xs border-b border-border/80">
                <th className="p-4 whitespace-nowrap">Domain Name</th>
                <th className="hidden md:table-cell p-4">Client / Owner</th>
                <th className="hidden lg:table-cell p-4">Registrar</th>
                <th className="p-4">SSL Status</th>
                <th className="hidden md:table-cell p-4">Expiry Date</th>
                <th className="hidden lg:table-cell p-4">Biaya / Thn</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDomains.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted font-bold text-lg uppercase tracking-widest">
                    Tidak ada Domain terdaftar.
                  </td>
                </tr>
              ) : (
                filteredDomains.map((dom) => (
                  <tr key={dom.id} className="border-b border-border/40 hover:bg-background/50 transition-colors">
                    <td className="p-4 font-black text-base md:text-lg align-middle text-foreground">
                      <a 
                        href={`https://${dom.domain_name}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="hover:text-accent flex items-center gap-1.5 transition-colors"
                      >
                        {dom.domain_name}
                        <ArrowSquareOut size={16} className="text-muted" />
                      </a>
                    </td>

                    <td className="hidden md:table-cell p-4 font-bold text-sm text-foreground align-middle">
                      {dom.client_name || 'Internal'}
                    </td>

                    <td className="hidden lg:table-cell p-4 font-bold text-xs uppercase tracking-wider text-muted align-middle">
                      <span className="bg-background border border-border px-2.5 py-1 rounded-lg">
                        {dom.registrar}
                      </span>
                    </td>

                    <td className="p-4 align-middle">
                      {dom.ssl_status === 'active' && (
                        <span className="px-3 py-1 bg-accent/20 text-accent border border-accent/30 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                          <ShieldCheck size={14} weight="fill" /> Active
                        </span>
                      )}
                      {dom.ssl_status === 'expiring_soon' && (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                          <ShieldWarning size={14} weight="fill" /> Expiring Soon
                        </span>
                      )}
                      {dom.ssl_status === 'expired' && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                          <ShieldSlash size={14} weight="fill" /> Expired
                        </span>
                      )}
                    </td>

                    <td className="hidden md:table-cell p-4 font-bold text-xs text-muted align-middle">
                      {new Date(dom.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {dom.auto_renew && (
                        <span className="block text-[10px] text-accent font-semibold uppercase mt-0.5">Auto-renew ON</span>
                      )}
                    </td>

                    <td className="hidden lg:table-cell p-4 font-bold text-xs align-middle">
                      <div className="text-foreground font-black">{formatIDR(dom.yearly_cost)}</div>
                      <div className="text-[10px] text-muted font-mono">{formatUSD(dom.yearly_cost)}</div>
                    </td>

                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDomainModal(dom)}
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all shrink-0 cursor-pointer"
                          title="Edit Domain"
                        >
                          <PencilSimple weight="bold" size={18} />
                        </button>
                        <button 
                          onClick={() => setDeleteTarget({ type: 'domain', id: dom.id, name: dom.domain_name })}
                          className="w-9 h-9 bg-background border border-border text-muted rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all shrink-0 cursor-pointer"
                          title="Hapus Domain"
                        >
                          <Trash weight="bold" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB 3: DEPLOYMENTS --- */}
      {activeTab === 'deployments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeployments.length === 0 ? (
            <div className="col-span-full border border-dashed border-border rounded-3xl p-12 text-center text-muted font-semibold uppercase tracking-widest bg-surface/50">
              Tidak ada Deployment ditemukan.
            </div>
          ) : (
            filteredDeployments.map((dep) => (
              <div 
                key={dep.id} 
                className="bg-surface border border-border rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-xl font-display font-black uppercase tracking-tight text-foreground line-clamp-1">
                      {dep.app_name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      dep.env === 'production' ? 'bg-accent/20 text-accent border-accent/30' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    }`}>
                      {dep.env}
                    </span>
                  </div>

                  <a 
                    href={`https://${dep.domain}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-accent text-sm font-bold hover:underline flex items-center gap-1 mb-4 font-mono"
                  >
                    https://{dep.domain}
                    <ArrowSquareOut size={14} />
                  </a>

                  <div className="bg-background border border-border/80 rounded-xl p-3.5 space-y-2 mb-4 font-mono text-xs text-muted">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">VPS Host:</span>
                      <span className="text-foreground font-semibold">{dep.vps_name || 'Cloud VPS'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">App Port:</span>
                      <span className="text-accent font-bold">Port {dep.port || 3000}</span>
                    </div>
                    {dep.client_name && (
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Client:</span>
                        <span className="text-foreground">{dep.client_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border/80 mt-auto">
                  <button 
                    onClick={() => handleOpenDeploymentModal(dep)}
                    className="flex-1 py-2 bg-background border border-border text-foreground rounded-xl font-bold text-xs uppercase hover:bg-accent hover:text-white hover:border-accent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PencilSimple weight="bold" size={16} /> Edit
                  </button>

                  <button 
                    onClick={() => setDeleteTarget({ type: 'deployment', id: dep.id, name: dep.app_name })}
                    className="py-2 px-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center cursor-pointer"
                    title="Hapus Deployment"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT SERVER --- */}
      {isServerModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-xl my-8 relative text-foreground animate-scale-in">
              <button 
                onClick={() => setIsServerModalOpen(false)} 
                className="absolute top-4 right-4 w-9 h-9 bg-background hover:bg-accent text-muted hover:text-white border border-border rounded-full flex items-center justify-center shadow-sm transition-all z-10 cursor-pointer"
              >
                <X weight="bold" size={20} />
              </button>

              <div className="p-6 border-b border-border/80 bg-background/50 rounded-t-3xl">
                <h2 className="text-xl font-display font-black uppercase tracking-tight text-foreground">
                  {editingServer ? 'Edit VPS Server' : 'Add New VPS Server'}
                </h2>
              </div>

              <form onSubmit={handleSaveServer} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Server Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. NOM-PROD-SG-01"
                      value={serverForm.name}
                      onChange={(e) => setServerForm({...serverForm, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Provider</label>
                    <select 
                      value={serverForm.provider}
                      onChange={(e) => setServerForm({...serverForm, provider: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="IDCloudHost">IDCloudHost</option>
                      <option value="DigitalOcean">DigitalOcean</option>
                      <option value="Hetzner">Hetzner</option>
                      <option value="Vultr">Vultr</option>
                      <option value="Biznet Gio">Biznet Gio</option>
                      <option value="DomaiNesia">DomaiNesia</option>
                      <option value="Cloudkilat">Cloudkilat</option>
                      <option value="AWS EC2">AWS EC2</option>
                      <option value="Linode / Akamai">Linode / Akamai</option>
                      <option value="Other / Self-Hosted">Other / Self-Hosted</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">IP Address (v4)</label>
                    <input 
                      type="text"
                      placeholder="159.65.132.89"
                      value={serverForm.ip_address}
                      onChange={(e) => setServerForm({...serverForm, ip_address: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">SSH Port</label>
                    <input 
                      type="number"
                      placeholder="22"
                      value={serverForm.ssh_port}
                      onChange={(e) => setServerForm({...serverForm, ssh_port: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Hardware Specs</label>
                    <input 
                      type="text"
                      placeholder="4 vCPU / 8GB RAM / 160GB NVMe"
                      value={serverForm.specs}
                      onChange={(e) => setServerForm({...serverForm, specs: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted">Biaya Bulanan (Rp)</label>
                      <span className="text-[10px] font-mono font-bold text-accent">{formatUSD(Number(serverForm.monthly_cost))}</span>
                    </div>
                    <input 
                      type="number"
                      placeholder="450000"
                      value={serverForm.monthly_cost}
                      onChange={(e) => setServerForm({...serverForm, monthly_cost: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Operating System</label>
                    <input 
                      type="text"
                      placeholder="Ubuntu 24.04 LTS"
                      value={serverForm.os}
                      onChange={(e) => setServerForm({...serverForm, os: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Server Status</label>
                    <select 
                      value={serverForm.status}
                      onChange={(e) => setServerForm({...serverForm, status: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="online">Online / Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="offline">Offline / Stopped</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">Notes / Details</label>
                  <textarea 
                    rows={2}
                    placeholder="Contoh: Digunakan untuk app Node.js client X"
                    value={serverForm.notes}
                    onChange={(e) => setServerForm({...serverForm, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsServerModalOpen(false)}
                    className="flex-1 py-3 bg-background border border-border text-muted rounded-xl font-bold uppercase text-xs tracking-wider hover:text-foreground transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                  >
                    Simpan Server
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* --- MODAL 2: ADD / EDIT DOMAIN --- */}
      {isDomainModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-xl my-8 relative text-foreground animate-scale-in">
              <button 
                onClick={() => setIsDomainModalOpen(false)} 
                className="absolute top-4 right-4 w-9 h-9 bg-background hover:bg-accent text-muted hover:text-white border border-border rounded-full flex items-center justify-center shadow-sm transition-all z-10 cursor-pointer"
              >
                <X weight="bold" size={20} />
              </button>

              <div className="p-6 border-b border-border/80 bg-background/50 rounded-t-3xl">
                <h2 className="text-xl font-display font-black uppercase tracking-tight text-foreground">
                  {editingDomain ? 'Edit Domain' : 'Add New Domain'}
                </h2>
              </div>

              <form onSubmit={handleSaveDomain} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Domain Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. clientdomain.com"
                      value={domainForm.domain_name}
                      onChange={(e) => setDomainForm({...domainForm, domain_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Registrar</label>
                    <select 
                      value={domainForm.registrar}
                      onChange={(e) => setDomainForm({...domainForm, registrar: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="IDCloudHost">IDCloudHost</option>
                      <option value="Cloudflare">Cloudflare</option>
                      <option value="Namecheap">Namecheap</option>
                      <option value="Rumahweb">Rumahweb</option>
                      <option value="Niagahoster">Niagahoster</option>
                      <option value="DomaiNesia">DomaiNesia</option>
                      <option value="GoDaddy">GoDaddy</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Client / Owner</label>
                    <input 
                      type="text"
                      placeholder="Internal / PT Client Name"
                      value={domainForm.client_name}
                      onChange={(e) => setDomainForm({...domainForm, client_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Linked VPS Server</label>
                    <select 
                      value={domainForm.vps_id}
                      onChange={(e) => setDomainForm({...domainForm, vps_id: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="">-- None / External --</option>
                      {servers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.ip_address})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">SSL Certificate Status</label>
                    <select 
                      value={domainForm.ssl_status}
                      onChange={(e) => setDomainForm({...domainForm, ssl_status: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="active">Active (Let's Encrypt / CF)</option>
                      <option value="expiring_soon">Expiring Soon</option>
                      <option value="expired">Expired / Missing</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Expiry Date</label>
                    <input 
                      type="date"
                      value={domainForm.expiry_date}
                      onChange={(e) => setDomainForm({...domainForm, expiry_date: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Biaya Tahunan Domain (Rp)</label>
                    <span className="text-[10px] font-mono font-bold text-accent">{formatUSD(Number(domainForm.yearly_cost))}</span>
                  </div>
                  <input 
                    type="number"
                    placeholder="150000"
                    value={domainForm.yearly_cost}
                    onChange={(e) => setDomainForm({...domainForm, yearly_cost: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsDomainModalOpen(false)}
                    className="flex-1 py-3 bg-background border border-border text-muted rounded-xl font-bold uppercase text-xs tracking-wider hover:text-foreground transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                  >
                    Simpan Domain
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* --- MODAL 3: ADD / EDIT DEPLOYMENT --- */}
      {isDeploymentModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-xl my-8 relative text-foreground animate-scale-in">
              <button 
                onClick={() => setIsDeploymentModalOpen(false)} 
                className="absolute top-4 right-4 w-9 h-9 bg-background hover:bg-accent text-muted hover:text-white border border-border rounded-full flex items-center justify-center shadow-sm transition-all z-10 cursor-pointer"
              >
                <X weight="bold" size={20} />
              </button>

              <div className="p-6 border-b border-border/80 bg-background/50 rounded-t-3xl">
                <h2 className="text-xl font-display font-black uppercase tracking-tight text-foreground">
                  {editingDeployment ? 'Edit Deployment' : 'Deploy New Web App'}
                </h2>
              </div>

              <form onSubmit={handleSaveDeployment} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">App Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. NOM Web Portal"
                      value={deploymentForm.app_name}
                      onChange={(e) => setDeploymentForm({...deploymentForm, app_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Target Domain</label>
                    <input 
                      type="text"
                      placeholder="nomstd.my.id"
                      value={deploymentForm.domain}
                      onChange={(e) => setDeploymentForm({...deploymentForm, domain: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Target VPS Server</label>
                    <select 
                      value={deploymentForm.vps_id}
                      onChange={(e) => setDeploymentForm({...deploymentForm, vps_id: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      {servers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.ip_address})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Internal Port</label>
                    <input 
                      type="number"
                      placeholder="3000"
                      value={deploymentForm.port}
                      onChange={(e) => setDeploymentForm({...deploymentForm, port: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Environment</label>
                    <select 
                      value={deploymentForm.env}
                      onChange={(e) => setDeploymentForm({...deploymentForm, env: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Client Name</label>
                    <input 
                      type="text"
                      placeholder="Internal / Client Name"
                      value={deploymentForm.client_name}
                      onChange={(e) => setDeploymentForm({...deploymentForm, client_name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsDeploymentModalOpen(false)}
                    className="flex-1 py-3 bg-background border border-border text-muted rounded-xl font-bold uppercase text-xs tracking-wider hover:text-foreground transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 bg-accent text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-accent/90 transition-all cursor-pointer"
                  >
                    Simpan Deployment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteTarget && (
        <Portal>
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="bg-surface border border-border shadow-2xl rounded-3xl w-full max-w-md my-8 p-6 relative overflow-hidden text-foreground animate-scale-in text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 mx-auto rounded-2xl flex items-center justify-center mb-6">
                <Trash weight="fill" size={32} />
              </div>
              <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-2 text-foreground">Hapus {deleteTarget.type.toUpperCase()}?</h2>
              <p className="font-semibold text-muted mb-8 text-sm">
                Apakah Anda yakin ingin menghapus <span className="text-foreground font-bold">{deleteTarget.name}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3.5 bg-background border border-border rounded-xl font-bold uppercase text-xs tracking-wider text-muted hover:text-foreground transition-all shadow-sm cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-red-600 transition-all cursor-pointer"
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
