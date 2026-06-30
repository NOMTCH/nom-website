"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash, Link as LinkIcon, Image as ImageIcon, Copy, Check, Info, UploadSimple, Spinner, InstagramLogo, TiktokLogo, TwitterLogo, YoutubeLogo, FacebookLogo, LinkedinLogo, GithubLogo, ShoppingBag, ShoppingCart, Globe, ArrowUpRight } from "@phosphor-icons/react";
import Link from 'next/link';

type LinkItem = {
  id: string;
  t: string; // title
  u: string; // url
};

type LinkData = {
  n: string; // name
  b: string; // bio
  a: string; // avatar
  l: Omit<LinkItem, 'id'>[]; // links without internal id
  th: string; // theme
};

function getIconForUrl(url: string) {
  if (!url) return <Globe size={20} weight="bold" />;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('instagram.com')) return <InstagramLogo size={20} weight="bold" />;
  if (lowerUrl.includes('tiktok.com')) return <TiktokLogo size={20} weight="bold" />;
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return <TwitterLogo size={20} weight="bold" />;
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return <YoutubeLogo size={20} weight="bold" />;
  if (lowerUrl.includes('facebook.com')) return <FacebookLogo size={20} weight="bold" />;
  if (lowerUrl.includes('linkedin.com')) return <LinkedinLogo size={20} weight="bold" />;
  if (lowerUrl.includes('github.com')) return <GithubLogo size={20} weight="bold" />;
  if (lowerUrl.includes('shopee.')) return <ShoppingBag size={20} weight="bold" />;
  if (lowerUrl.includes('tokopedia.com')) return <ShoppingCart size={20} weight="bold" />;
  return <Globe size={20} weight="bold" />;
}

export default function LinkBuilderPage() {
  const [name, setName] = useState("Bang NOM");
  const [bio, setBio] = useState("Tukang Ngoding & Desain NOMSTD");
  const [avatar, setAvatar] = useState("");
  const [theme, setTheme] = useState("brutal-yellow");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: '1', t: 'Website Agency NOMSTD', u: 'https://nomstd.my.id' },
    { id: '2', t: 'Shopee Official Store', u: 'https://shopee.co.id/nomstd' },
    { id: '3', t: 'Follow Instagram', u: 'https://instagram.com/nomstd' }
  ]);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Generate Base64 URL
  useEffect(() => {
    try {
      const data: LinkData = {
        n: name,
        b: bio,
        a: avatar,
        l: links.map(({ t, u }) => ({ t, u })),
        th: theme
      };
      const jsonString = JSON.stringify(data);
      const base64 = btoa(encodeURIComponent(jsonString));
      
      if (typeof window !== 'undefined') {
        setGeneratedUrl(`${window.location.origin}/l?data=${base64}`);
      }
    } catch (error) {
      console.error("Error generating URL:", error);
    }
  }, [name, bio, avatar, links, theme]);

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), t: '', u: '' }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id: string, field: 't' | 'u', value: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setAvatar(result.data.url);
      } else {
        alert("Gagal upload gambar. Coba lagi!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted hover:text-accent mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase">NOM-LINK Builder</h1>
          <p className="text-muted font-bold mt-2">Bikin Bio Link berkelas ala NOMSTD. Gampang, kilat, dan desainnya gak ada obat.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: Editor Form */}
          <div className="w-full lg:w-1/2 xl:w-7/12 space-y-8 bg-surface p-6 md:p-8 border border-border rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-300">
            
            {/* Section: Profile */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-1">1</span> Data Profil
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest block mb-2">Nama Tampilan</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-accent font-bold"
                    placeholder="Contoh: Bang NOM"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest block mb-2">Deskripsi Singkat (Bio)</label>
                  <input 
                    type="text" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white border border-border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                    placeholder="Tulis keahlian atau jualan lo..."
                  />
                </div>
                <div>
                  <label className="text-sm font-bold uppercase tracking-widest block mb-2">Foto Profil (Upload / Paste URL)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="text-muted" size={20} />
                      </div>
                      <input 
                        type="url" 
                        value={avatar} 
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full bg-white border border-border rounded-xl py-3 pr-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm h-12"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="relative w-full sm:w-auto flex-shrink-0 h-12">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Upload dari galeri"
                      />
                      <button type="button" className="w-full h-full px-6 bg-accent text-white font-black uppercase tracking-widest border border-border rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 relative z-0">
                        {isUploading ? <Spinner className="animate-spin" size={20} /> : <UploadSimple size={20} weight="bold" />}
                        {isUploading ? "Uploading..." : "Upload File"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border border-border rounded-xl" />

            {/* Section: Links */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-1">2</span> Daftar Link
              </h2>
              
              <div className="space-y-5">
                {links.map((link, index) => (
                  <div key={link.id} className="p-4 bg-white border border-border rounded-xl relative group">
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-accent border border-border rounded-xl flex items-center justify-center text-xs font-black text-white">
                      {index + 1}
                    </div>
                    <button 
                      onClick={() => removeLink(link.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-100 p-1.5 rounded border border-transparent hover:border-red-500 transition-colors z-10"
                      title="Hapus Link"
                    >
                      <Trash size={20} weight="bold" />
                    </button>
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <label className="text-xs font-bold uppercase text-muted mb-1 block">Judul Tombol</label>
                        <input 
                          type="text" 
                          value={link.t} 
                          onChange={(e) => updateLink(link.id, 't', e.target.value)}
                          className="w-full bg-surface border-b border-border p-2 focus:outline-none focus:bg-yellow-50 font-bold"
                          placeholder="Shopee, WA, atau Web Portfolio"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-muted mb-1 block">Alamat Link (URL)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="text-muted" size={16} />
                          </div>
                        <input 
                          type="url" 
                          value={link.u} 
                          onChange={(e) => updateLink(link.id, 'u', e.target.value)}
                          className="w-full bg-surface border-b border-border py-2 pr-2 focus:outline-none focus:bg-yellow-50 text-sm"
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="https://..."
                        />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addLink}
                className="w-full py-4 mt-2 border-2 border-dashed border-foreground text-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} weight="bold" /> Tambah Link Baru
              </button>
            </section>

            <hr className="border border-border rounded-xl" />

            {/* Section: Themes */}
            <section className="space-y-4">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-1">3</span> Tema Visual
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button onClick={() => setTheme('brutal-yellow')} className={`p-3 border border-border rounded-xl font-black uppercase text-sm ${theme === 'brutal-yellow' ? 'bg-[#FFD700] shadow-sm rounded-xl translate-y-[-2px] translate-x-[-2px]' : 'bg-white hover:bg-gray-100'}`}>Brutal Yellow</button>
                <button onClick={() => setTheme('brutal-red')} className={`p-3 border border-border rounded-xl font-black uppercase text-sm text-white ${theme === 'brutal-red' ? 'bg-[#FF6138] shadow-sm rounded-xl translate-y-[-2px] translate-x-[-2px]' : 'bg-red-800 hover:bg-red-700 text-white'}`}>Brutal Red</button>
                <button onClick={() => setTheme('dark')} className={`p-3 border border-border rounded-xl font-black uppercase text-sm text-white ${theme === 'dark' ? 'bg-black shadow-[4px_4px_0_0_#FFD700] translate-y-[-2px] translate-x-[-2px]' : 'bg-gray-800 hover:bg-gray-900 text-white'}`}>Pitch Black</button>
                
                <button onClick={() => setTheme('brutal-blue')} className={`p-3 border border-border rounded-xl font-black uppercase text-sm text-black ${theme === 'brutal-blue' ? 'bg-[#00D8FF] shadow-sm rounded-xl translate-y-[-2px] translate-x-[-2px]' : 'bg-[#e0faff] hover:bg-[#bdf3ff]'}`}>Brutal Blue</button>
                <button onClick={() => setTheme('brutal-green')} className={`p-3 border-2 border-[#00FF00] font-black uppercase text-sm ${theme === 'brutal-green' ? 'bg-black text-[#00FF00] shadow-[4px_4px_0_0_#00FF00] translate-y-[-2px] translate-x-[-2px]' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>Hacker Green</button>
                <button onClick={() => setTheme('brutal-cyberpunk')} className={`p-3 border border-border rounded-xl font-black uppercase text-sm ${theme === 'brutal-cyberpunk' ? 'bg-[#FCE100] text-black shadow-[4px_4px_0_0_#00FFFF] translate-y-[-2px] translate-x-[-2px]' : 'bg-[#FF00FF] text-white hover:bg-[#d900d9]'}`}>Cyberpunk</button>
              </div>
            </section>

          </div>

          {/* RIGHT: Live Preview & Generator */}
          <div className="w-full lg:w-1/2 xl:w-5/12 space-y-6 lg:sticky lg:top-24 mt-12 lg:mt-0">
            
            {/* Mobile Banner Helper */}
            <div className="lg:hidden bg-foreground text-white text-center p-3 font-bold uppercase tracking-widest text-xs animate-pulse">
              👇 Scroll ke bawah buat liat Live Preview 👇
            </div>
            
            {/* The Magic Link Box */}
            <div className="bg-[#FFD700] p-6 border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform rotate-1 hover:rotate-0 transition-transform">
              <h3 className="font-black uppercase tracking-widest text-lg mb-2 flex items-center gap-2">
                ✨ Magic Link Kamu
              </h3>
              <p className="text-xs font-medium mb-4">
                URL sakti lo udah siap! Langsung Copy dan pasang di profil IG/TikTok lo sekarang.
              </p>
              
              <div className="flex bg-white border border-border rounded-xl">
                <input 
                  type="text" 
                  readOnly 
                  value={generatedUrl} 
                  className="flex-1 p-3 outline-none text-xs text-muted truncate bg-transparent"
                />
                <button 
                  onClick={handleCopy}
                  className="px-4 bg-foreground text-white font-black hover:bg-accent transition-colors flex items-center gap-2"
                >
                  {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs font-bold text-foreground bg-white/50 p-2 border border-foreground">
                <Info size={24} className="shrink-0" />
                <span>Simpan URL ini! URL ini nyimpen seluruh pengaturan profil lo. Kalau hilang, lo harus bikin dari awal lagi. Jangan sampai lupa ya!</span>
              </div>
            </div>

            {/* AdSense Placeholder Builder page */}
            <div className="border-4 border-dashed border-border bg-[#F9F9F9] rounded-2xl p-6 text-center text-muted text-xs font-bold relative min-h-[100px] flex flex-col justify-center items-center">
              <span className="absolute top-2 right-4 px-2 py-0.5 bg-border text-[9px] uppercase tracking-widest text-muted-foreground rounded-full">Ads</span>
              <span className="text-[10px] opacity-75">Space Iklan AdSense (Side Banner)</span>
            </div>

            {/* Mobile Preview Frame */}
            <div className="mx-auto w-[320px] h-[650px] border-[8px] border-foreground rounded-[2rem] overflow-hidden bg-white shadow-[12px_12px_0_0_#0F0F0F] relative flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-xl z-20"></div>
              
              {/* Preview Content */}
              <div className={`flex-1 overflow-y-auto w-full h-full pb-10 ${
                theme === 'dark' ? 'bg-black text-white' : 
                theme === 'brutal-red' ? 'bg-[#FF6138] text-black' : 
                theme === 'brutal-blue' ? 'bg-[#00D8FF] text-black' : 
                theme === 'brutal-green' ? 'bg-black text-[#00FF00]' : 
                theme === 'brutal-cyberpunk' ? 'bg-[#FCE100] text-black' : 
                theme === 'brutal-yellow' ? 'bg-[#FFD700] text-black' : 
                'bg-white text-black'
              }`}>
                {/* Header Pattern */}
                <div className={`h-24 w-full border-b border-border ${
                  theme === 'dark' ? 'bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px] opacity-20' : 
                  theme === 'brutal-green' ? 'bg-[radial-gradient(#00FF00_2px,transparent_2px)] [background-size:16px_16px] opacity-20' : 
                  theme === 'brutal-cyberpunk' ? 'bg-[radial-gradient(#FF00FF_2px,transparent_2px)] [background-size:16px_16px] opacity-40' : 
                  'bg-[radial-gradient(#000000_2px,transparent_2px)] [background-size:16px_16px] opacity-10'
                }`}></div>
                
                <div className="px-6 -mt-12 relative z-10 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className={`w-24 h-24 rounded-full border-4 overflow-hidden mb-4 bg-white flex items-center justify-center ${
                    theme === 'dark' ? 'shadow-[4px_4px_0_0_#FFD700] border-[#FFD700]' : 
                    theme === 'brutal-green' ? 'shadow-[4px_4px_0_0_#00FF00] border-[#00FF00]' : 
                    theme === 'brutal-cyberpunk' ? 'shadow-[4px_4px_0_0_#00FFFF] border-[#FF00FF]' : 
                    'shadow-sm rounded-xl border-foreground'
                  }`}>
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 font-black text-3xl">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  
                  {/* Name & Bio */}
                  <h2 className="text-xl font-display font-black uppercase tracking-tight">{name || 'Your Name'}</h2>
                  <p className={`text-sm font-bold mt-1 px-2 ${
                    theme === 'dark' ? 'text-gray-300' : 
                    theme === 'brutal-green' ? 'text-[#00FF00]' : 
                    'text-gray-800'
                  }`}>
                    {bio || 'Your bio goes here'}
                  </p>
                </div>

                {/* Link Buttons */}
                <div className="px-6 mt-8 space-y-4">
                  {links.map((link, idx) => (
                    link.t && (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between w-full py-3 px-4 text-left border-2 font-black uppercase tracking-wide text-xs transition-transform ${
                          theme === 'dark' ? 'bg-white text-black shadow-[4px_4px_0_0_#FFD700] border-foreground' : 
                          theme === 'brutal-green' ? 'bg-black text-[#00FF00] border-[#00FF00] shadow-[4px_4px_0_0_#00FF00]' : 
                          theme === 'brutal-cyberpunk' ? 'bg-[#FF00FF] text-white border-black shadow-[4px_4px_0_0_#00FFFF]' : 
                          theme === 'brutal-blue' ? 'bg-white text-black border-black shadow-sm rounded-xl' : 
                          'bg-white text-black border-foreground shadow-sm rounded-xl'
                        }`}
                      >
                        <span className="flex items-center gap-2 overflow-hidden">
                          {getIconForUrl(link.u)}
                          <span className="truncate">{link.t}</span>
                        </span>
                        <ArrowUpRight size={16} weight="bold" className="flex-shrink-0 ml-2" />
                      </div>
                    )
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    theme === 'dark' ? 'text-gray-500' : 
                    theme === 'brutal-green' ? 'text-[#00FF00] opacity-70' : 
                    'text-gray-500'
                  }`}>
                    Powered by NOMSTD
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[999] flex gap-3">
        <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="flex-1 bg-[#FFD700] text-black font-black uppercase text-[10px] sm:text-xs py-3 px-2 border border-border rounded-2xl shadow-sm active:translate-y-1 active:translate-x-1 transition-all text-center">
          👇 Cek Preview
        </button>
        <a href="https://saweria.co/iammonoz" target="_blank" rel="noreferrer" className="flex-1 bg-accent text-white font-black uppercase text-[10px] sm:text-xs py-3 px-2 border border-border rounded-2xl shadow-sm active:translate-y-1 active:translate-x-1 transition-all text-center">
          ☕ Traktir Kopi
        </a>
      </div>
    </div>
  );
}
