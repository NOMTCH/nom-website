'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { 
  QrCode as QrIcon, 
  DownloadSimple, 
  Link as LinkIcon, 
  WhatsappLogo, 
  WifiHigh, 
  TextT, 
  UploadSimple, 
  Trash, 
  Image as ImageIcon,
  Check,
  Warning,
  Gear,
  Info,
  Printer,
  Phone,
  Envelope
} from "@phosphor-icons/react";

type QRType = 'url' | 'whatsapp' | 'wifi' | 'text';
type CardTheme = 'qris-red' | 'brutal-yellow' | 'modern-neon' | 'clean-minimal' | 'pro-acrylic';

export default function QrGeneratorPage() {
  const [activeTab, setActiveTab] = useState<QRType>('url');
  const [generationMode, setGenerationMode] = useState<'qr-only' | 'ready-to-print'>('ready-to-print');
  
  // Input fields for QR Data (Step 1)
  const [url, setUrl] = useState<string>('https://nomstd.my.id');
  const [phone, setPhone] = useState<string>('6282130704794');
  const [waMessage, setWaMessage] = useState<string>('Halo NOMSTD, saya mau pesan...');
  const [wifiSsid, setWifiSsid] = useState<string>('WIFI NOMSTD STUDIO');
  const [wifiPassword, setWifiPassword] = useState<string>('nomstd2026');
  const [wifiEncryption, setWifiEncryption] = useState<string>('WPA');
  const [plainText, setPlainText] = useState<string>('Halo Ujang!');
  
  // Customization & Branding (For QR)
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  // Pre-loaded logo image element to avoid asynchronous canvas drawing glitches
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  
  // Customization (For Card Template - Changed defaults to NOMSTD)
  const [shopName, setShopName] = useState<string>('NOMSTD');
  const [shopSubtitle, setShopSubtitle] = useState<string>('CREATIVE AGENCY & IT SOLUTIONS');
  const [phoneContact, setPhoneContact] = useState<string>('0821-3070-4794');
  const [emailContact, setEmailContact] = useState<string>('halo@nomstd.com');
  const [scanInstruction, setScanInstruction] = useState<string>('SCAN UNTUK KUNJUNGI WEBSITE');
  const [cardTheme, setCardTheme] = useState<CardTheme>('pro-acrylic');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardPreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync default scan instruction based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'url':
        setScanInstruction('SCAN UNTUK KUNJUNGI WEBSITE');
        break;
      case 'whatsapp':
        setScanInstruction('SCAN UNTUK CHAT WHATSAPP');
        break;
      case 'wifi':
        setScanInstruction('SCAN UNTUK KONEK WIFI');
        break;
      case 'text':
        setScanInstruction('SCAN UNTUK BACA INFORMASI');
        break;
    }
  }, [activeTab]);

  // Pre-load the logo image when logoUrl changes
  useEffect(() => {
    if (!logoUrl) {
      setLogoImage(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setLogoImage(img);
    };
    img.src = logoUrl;
  }, [logoUrl]);

  // Clean up object URLs on unmount/file change
  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  // Compute actual text payload based on active tab
  const getPayload = (): string => {
    switch (activeTab) {
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'whatsapp':
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        const encodedMsg = encodeURIComponent(waMessage);
        return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
      case 'wifi':
        const enc = wifiEncryption === 'none' ? 'nopass' : wifiEncryption;
        return `WIFI:T:${enc};S:${wifiSsid};P:${wifiPassword};;`;
      case 'text':
        return plainText;
      default:
        return '';
    }
  };

  const textPayload = getPayload();

  // Generate QR Code on Hidden Canvas
  const generateQRCode = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !textPayload) return;

    try {
      await QRCode.toCanvas(canvas, textPayload, {
        width: 360,
        margin: 2,
        errorCorrectionLevel: 'H', // Use 'H' (High) to allow space for center logo
        color: {
          dark: fgColor,
          light: bgColor
        }
      });

      if (logoUrl) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const logo = new Image();
          logo.crossOrigin = "anonymous";
          logo.onload = () => {
            const size = canvas.width;
            const logoSize = size * 0.22;
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;

            ctx.fillStyle = bgColor;
            ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
            ctx.strokeStyle = fgColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
            ctx.drawImage(logo, x, y, logoSize, logoSize);
          };
          logo.src = logoUrl;
        }
      }
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [textPayload, fgColor, bgColor, logoUrl, activeTab]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Tolong upload file gambar saja bre!');
        return;
      }
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Compute text lines for the card template based on active tab selection (No Emojis!)
  const getCardContentLines = () => {
    switch (activeTab) {
      case 'wifi':
        return {
          line1: `Join our free WiFi network: ${wifiSsid || '-'}`,
          line2: `Password: ${wifiPassword || '-'}`
        };
      case 'whatsapp':
        return {
          line1: 'Hubungi Kami via WhatsApp',
          line2: `Phone Contact: +${phone || '-'}`
        };
      case 'url':
        const displayUrl = url.replace('https://', '').replace('http://', '');
        return {
          line1: 'Kunjungi Tautan Website Resmi',
          line2: displayUrl || '-'
        };
      case 'text':
        return {
          line1: 'Catatan Informasi',
          line2: plainText.length > 30 ? plainText.substring(0, 30) + '...' : plainText || '-'
        };
    }
  };

  // Draw High-Resolution 3R Card (900 x 1270 px) on a target canvas
  const drawCardToCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 900;
    const height = 1270;
    canvas.width = width;
    canvas.height = height;

    // Draw Background
    if (cardTheme === 'brutal-yellow') {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 24;
      ctx.strokeRect(12, 12, width - 24, height - 24);
    } else if (cardTheme === 'modern-neon') {
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#00D8FF');
      gradient.addColorStop(1, '#FF00FF');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 16;
      ctx.strokeRect(8, 8, width - 16, height - 16);
    } else if (cardTheme === 'clean-minimal') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#f1f1f1';
      ctx.lineWidth = 2;
      for (let i = 50; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 50; j < height; j += 50) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, width - 40, height - 40);
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, width - 60, height - 60);
    } else if (cardTheme === 'pro-acrylic') {
      // Pure, minimal, borderless white background matching the acrylic look
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Very faint, thin outline for print boundary reference
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, width - 30, height - 30);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 220);
      ctx.lineTo(150, 110);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.moveTo(width, height);
      ctx.lineTo(width, height - 250);
      ctx.lineTo(width - 250, height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e63946';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, width - 20, height - 20);
    }

    ctx.textAlign = 'center';
    
    // Theme-specific Title Header
    if (cardTheme === 'qris-red') {
      ctx.fillStyle = '#111827';
      ctx.font = '900 36px sans-serif';
      ctx.fillText('NOM-QR STANDAR NASIONAL', width / 2, 70);
      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Satu QR untuk Semua Metode Pembayaran & Tautan', width / 2, 105);
    } else if (cardTheme === 'modern-neon') {
      ctx.fillStyle = '#00D8FF';
      ctx.font = '900 38px sans-serif';
      ctx.fillText('⚡ NOM-QR SYSTEM ⚡', width / 2, 80);
    } else if (cardTheme === 'brutal-yellow') {
      ctx.fillStyle = '#000000';
      ctx.font = '900 42px sans-serif';
      ctx.fillText('NOM-QR CODE STANDAR', width / 2, 85);
    } else if (cardTheme === 'clean-minimal') {
      ctx.fillStyle = '#000000';
      ctx.font = '800 34px sans-serif';
      ctx.fillText('NOM-QR STANDARD', width / 2, 80);
    }

    // DRAW LOGO & SHOP NAME
    if (cardTheme === 'pro-acrylic') {
      if (logoImage) {
        const lSize = 100;
        const lx = 160;
        const ly = 100;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(lx + lSize/2, ly + lSize/2, lSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logoImage, lx, ly, lSize, lSize);
        ctx.restore();

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(lx + lSize/2, ly + lSize/2, lSize/2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#111827';
        ctx.font = '900 48px sans-serif';
        ctx.fillText(shopName, lx + lSize + 30, ly + 55);

        ctx.fillStyle = '#6b7280';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(shopSubtitle, lx + lSize + 30, ly + 95);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#111827';
        ctx.font = '900 56px sans-serif';
        ctx.fillText(shopName, width / 2, 140);
        ctx.fillStyle = '#6b7280';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(shopSubtitle, width / 2, 190);
      }
    } else {
      ctx.textAlign = 'center';
      ctx.fillStyle = cardTheme === 'modern-neon' ? '#ffffff' : '#000000';
      ctx.font = '900 56px sans-serif';
      ctx.fillText(shopName.toUpperCase(), width / 2, 230);
      ctx.fillStyle = cardTheme === 'modern-neon' ? '#FF00FF' : '#4b5563';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(shopSubtitle, width / 2, 280);
    }

    // DRAW QR CODE IN CENTER
    const qrCanvas = canvasRef.current;
    if (qrCanvas) {
      const qrSize = cardTheme === 'pro-acrylic' ? 470 : 500;
      const qx = (width - qrSize) / 2;
      const qy = cardTheme === 'pro-acrylic' ? 290 : 350;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qx - 15, qy - 15, qrSize + 30, qrSize + 30);
      
      // Border around QR - make it borderless for pro-acrylic just like the photo
      if (cardTheme !== 'pro-acrylic') {
        ctx.strokeStyle = cardTheme === 'brutal-yellow' ? '#000000' : '#e5e7eb';
        ctx.lineWidth = cardTheme === 'brutal-yellow' ? 8 : 3;
        ctx.strokeRect(qx - 15, qy - 15, qrSize + 30, qrSize + 30);
      }

      ctx.drawImage(qrCanvas, qx, qy, qrSize, qrSize);
    }

    // DRAW DETAILS BELOW QR CODE
    ctx.textAlign = 'center';
    if (cardTheme === 'pro-acrylic') {
      // 1. Scan instruction (Centered, clean, bold, no lines)
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(scanInstruction.toUpperCase(), width / 2, 850);

      // 2. Tab Details (SSID, pass, URL, etc.) - Clean centered text blocks, NO boxes!
      const details = getCardContentLines();
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(details.line1, width / 2, 940);
      
      ctx.fillStyle = '#4b5563';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(details.line2, width / 2, 1000);

      // 3. Footer Branding / Sub-branding - Very subtle, clean, bottom aligned
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('BUILT BY NOMSTD CREATIVE STUDIO', width / 2, 1200);
    } else {
      // Standard Layout for other themes
      ctx.fillStyle = cardTheme === 'modern-neon' ? '#00D8FF' : '#374151';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('SATU QR UNTUK SEMUA', width / 2, 940);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Scan dengan kamera HP Anda untuk terhubung', width / 2, 985);

      ctx.fillStyle = cardTheme === 'modern-neon' ? '#ffffff' : '#111827';
      ctx.font = 'bold 26px sans-serif';
      const footerY = 1140;
      ctx.fillText(`WhatsApp: ${phoneContact}   |   Email: ${emailContact}`, width / 2, footerY);

      ctx.fillStyle = cardTheme === 'modern-neon' ? '#FF00FF' : '#111827';
      ctx.fillRect(80, 1180, width - 160, 4);

      ctx.fillStyle = cardTheme === 'modern-neon' ? '#00D8FF' : '#6b7280';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('BUILT BY NOMSTD CREATIVE STUDIO', width / 2, 1220);
    }
  };

  // Draw on the card preview canvas inside a useEffect loop reacting to all input triggers
  useEffect(() => {
    if (generationMode === 'ready-to-print') {
      const previewCanvas = cardPreviewCanvasRef.current;
      if (previewCanvas) {
        drawCardToCanvas(previewCanvas);
      }
    }
  }, [
    generationMode,
    cardTheme,
    activeTab,
    shopName,
    shopSubtitle,
    scanInstruction,
    phoneContact,
    emailContact,
    fgColor,
    bgColor,
    logoImage,
    url,
    phone,
    wifiSsid,
    wifiPassword,
    plainText
  ]);

  const handleDownload = () => {
    if (generationMode === 'qr-only') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `nomstd-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const canvas = cardPreviewCanvasRef.current;
      if (!canvas) return;
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `nomstd-acrylic-card-3r-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Preview Details for UI
  const previewLines = getCardContentLines();

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted hover:text-accent mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase">NOM-QR GENERATOR</h1>
          <p className="text-muted font-bold mt-2">Bikin QR Code custom atau Template Kartu Acrylic Siap Cetak (3R Card) dengan logo bisnis/UMKM lo.</p>
        </div>

        {/* MODE SELECTOR (QR Only vs Siap Cetak Card) */}
        <div className="mb-8 bg-surface p-3 border border-border rounded-2xl flex max-w-md">
          <button 
            onClick={() => setGenerationMode('qr-only')}
            className={`flex-1 py-3 px-4 font-black uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
              generationMode === 'qr-only' ? 'bg-foreground text-white shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <QrIcon size={18} weight="bold" />
            QR Code Saja
          </button>
          <button 
            onClick={() => setGenerationMode('ready-to-print')}
            className={`flex-1 py-3 px-4 font-black uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
              generationMode === 'ready-to-print' ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            <Printer size={18} weight="bold" />
            Template Siap Cetak (3R)
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Input Tabs & Options */}
          <div className="w-full lg:w-7/12 xl:w-8/12 space-y-6">
            
            {/* Tab Selectors & Data inputs */}
            <div className="bg-surface border-4 border-foreground p-6 rounded-[2rem] shadow-[6px_6px_0_0_#000000] space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-0.5 text-sm">1</span> Isi Data QR Code
              </h2>

              {/* Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'url', label: 'Tautan Link', icon: LinkIcon },
                  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsappLogo },
                  { id: 'wifi', label: 'WiFi Cafe', icon: WifiHigh },
                  { id: 'text', label: 'Teks Bebas', icon: TextT }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as QRType)}
                      className={`py-3 px-2 border-2 font-black uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                        activeTab === tab.id 
                          ? 'bg-accent text-white border-accent shadow-sm' 
                          : 'bg-white border-border text-foreground hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} weight="bold" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <hr className="border border-border" />

              {/* Dynamic Tab Input Fields */}
              <div className="space-y-4">
                {activeTab === 'url' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Alamat Website / Menu Link</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LinkIcon className="text-muted" size={20} />
                      </div>
                      <input 
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-white border border-border rounded-xl py-3.5 pr-4 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="https://toko-kamu.com/menu"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'whatsapp' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Nomor WhatsApp (Kode Negara, cth: 62)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <WhatsappLogo className="text-muted" size={20} weight="fill" />
                        </div>
                        <input 
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl py-3.5 pr-4 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                          style={{ paddingLeft: '3rem' }}
                          placeholder="6282130704794"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Pesan Pembuka Otomatis</label>
                      <textarea
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        className="w-full h-24 bg-white border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent font-medium text-sm resize-none"
                        placeholder="Halo admin, saya mau order paket 1..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'wifi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Nama Hotspot WiFi (SSID)</label>
                      <input 
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full bg-white border border-border rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                        placeholder="SSID WiFi Cafe"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Password WiFi</label>
                        <input 
                          type="password"
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                          placeholder="Password"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Keamanan</label>
                        <select
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value)}
                          className="w-full bg-white border border-border rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm h-[54px]"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="none">Tanpa Password</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'text' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Masukkan Teks</label>
                    <textarea
                      value={plainText}
                      onChange={(e) => setPlainText(e.target.value)}
                      className="w-full h-32 bg-white border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent font-medium text-sm resize-none"
                      placeholder="Masukkan teks bebas..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Template Card Details Form (Only visible in ready-to-print mode) */}
            {generationMode === 'ready-to-print' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border-4 border-foreground p-6 rounded-[2rem] shadow-[6px_6px_0_0_#000000] space-y-6"
              >
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <span className="bg-accent text-white px-2 py-0.5 text-sm">2</span> Kustomisasi Template Cetak
                </h2>

                {/* Theme Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">Model Desain & Tema (Aesthetic & Professional)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'pro-acrylic', label: 'Pro Acrylic' },
                      { id: 'qris-red', label: 'QRIS Classic' },
                      { id: 'brutal-yellow', label: 'Brutal Yellow' },
                      { id: 'modern-neon', label: 'Neon Cyber' },
                      { id: 'clean-minimal', label: 'Minimal Grid' }
                    ].map((themeItem) => (
                      <button
                        key={themeItem.id}
                        onClick={() => setCardTheme(themeItem.id as CardTheme)}
                        className={`py-3 px-1 border-2 font-black uppercase text-[10px] sm:text-xs rounded-xl transition-all ${
                          cardTheme === themeItem.id 
                            ? 'bg-accent text-white border-accent shadow-sm' 
                            : 'bg-white border-border text-foreground hover:bg-gray-50'
                        }`}
                      >
                        {themeItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border border-border" />

                {/* Business Information Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Nama Toko / UMKM</label>
                    <input 
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                      placeholder="Nama Toko"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Subtitle / NMID (cth: NMID : XXXXXXX)</label>
                    <input 
                      type="text"
                      value={shopSubtitle}
                      onChange={(e) => setShopSubtitle(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                      placeholder="NMID : IDXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Instruksi Scan (cth: SCAN FOR MENU)</label>
                    <input 
                      type="text"
                      value={scanInstruction}
                      onChange={(e) => setScanInstruction(e.target.value)}
                      className="w-full bg-white border border-border rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-sm"
                      placeholder="SCAN FOR MENU"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">WhatsApp (Footer)</label>
                      <input 
                        type="text"
                        value={phoneContact}
                        onChange={(e) => setPhoneContact(e.target.value)}
                        className="w-full bg-white border border-border rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-xs"
                        placeholder="WhatsApp"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Email / Medsos (Footer)</label>
                      <input 
                        type="text"
                        value={emailContact}
                        onChange={(e) => setEmailContact(e.target.value)}
                        className="w-full bg-white border border-border rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-xs"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* QR Styling */}
            <div className="bg-surface border border-border p-6 rounded-[2rem] shadow-sm space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-0.5 text-sm">{generationMode === 'ready-to-print' ? '3' : '2'}</span> Kustomisasi Warna & Logo QR
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Color Pickers */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Warna QR Code (Dots)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-12 border-2 border-foreground rounded-xl cursor-pointer p-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={fgColor.toUpperCase()}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="bg-white border border-border rounded-xl py-2 px-3 focus:outline-none text-xs font-bold uppercase w-28"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Warna Latar (Background)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 border-2 border-foreground rounded-xl cursor-pointer p-0 bg-transparent"
                      />
                      <input 
                        type="text"
                        value={bgColor.toUpperCase()}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="bg-white border border-border rounded-xl py-2 px-3 focus:outline-none text-xs font-bold uppercase w-28"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted block">Logo Tengah QR (Opsional)</label>
                  
                  {!logoUrl ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-accent hover:bg-white/50 transition-all flex flex-col justify-center items-center"
                    >
                      <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <UploadSimple size={28} className="text-muted mb-2" />
                      <span className="text-[10px] font-bold uppercase text-muted">Upload Logo Bisnis</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-white border border-border rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={logoUrl} alt="Logo" className="w-10 h-10 object-cover rounded-lg border border-border shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold text-muted uppercase">Logo Terpasang</p>
                          <p className="text-xs font-bold text-foreground truncate max-w-[120px]">{logoFile?.name || 'custom-logo.png'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={removeLogo}
                        className="p-2 text-red-500 hover:text-red-700 bg-red-50 border border-transparent hover:border-red-500 rounded-xl transition-all"
                        title="Hapus Logo"
                      >
                        <Trash size={18} weight="bold" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 text-[9px] font-bold text-muted leading-tight">
                    <Warning size={14} className="shrink-0 text-amber-500" />
                    <span>Gunakan warna kontras (contoh: QR hitam, background putih) agar kamera mudah memindai.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AdSense Horizontal Banner Slot */}
            <div className="border-4 border-dashed border-border bg-[#F9F9F9] rounded-[2rem] p-8 text-center text-muted text-xs font-bold relative min-h-[120px] flex flex-col justify-center items-center">
              <span className="absolute top-2 right-4 px-2 py-0.5 bg-border text-[9px] uppercase tracking-widest text-muted-foreground rounded-full">Ads</span>
              <ImageIcon size={32} className="opacity-30 mb-2" />
              <span>Space Iklan AdSense Banner Bawah</span>
              <span className="text-[10px] opacity-50 mt-1">Sponsor Banner Horizontal (728x90)</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Output & Preview */}
          <div className="w-full lg:w-5/12 xl:w-4/12 space-y-6 lg:sticky lg:top-24">
            
            {/* Hidden Canvas for QR Code generation only */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Output Card */}
            <div className="bg-white border-4 border-foreground p-6 rounded-[2.5rem] shadow-[8px_8px_0_0_#000000] flex flex-col items-center text-center">
              <h3 className="text-sm font-black uppercase tracking-wider text-muted mb-6">
                {generationMode === 'qr-only' ? 'Hasil QR Code Kamu' : 'Live Preview Cetak (3R Card)'}
              </h3>
              
              {/* Preview Rendering */}
              {generationMode === 'qr-only' ? (
                // QR Only View
                <div className="p-4 bg-white border-2 border-foreground rounded-3xl shadow-sm flex items-center justify-center w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] md:w-[300px] md:h-[300px]">
                  <img 
                    src={canvasRef.current?.toDataURL('image/png')} 
                    alt="QR Code" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ) : (
                // 3R Card Canvas-Based Live Preview: 100% IDENTICAL to downloaded file!
                <div className="p-2 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-center w-[290px] h-[409px] overflow-hidden relative">
                  <canvas 
                    ref={cardPreviewCanvasRef} 
                    className="w-full h-full object-contain pointer-events-none" 
                  />
                </div>
              )}

              {/* Info Tips */}
              <div className="mt-6 flex items-start gap-2 text-[10px] font-bold text-left text-muted bg-[#F9F9F9] border border-border p-3 rounded-xl w-full">
                <Info size={18} className="shrink-0 text-accent" />
                <span>
                  {generationMode === 'qr-only' 
                    ? 'QR Code ini digenerate instan. Unduh PNG resolusi tinggi siap pakai.'
                    : 'Template didownload dalam format 3R Card (900x1270 px) resolusi tinggi, siap dicetak fisik.'
                  }
                </span>
              </div>

              {/* Download Action */}
              <button
                onClick={handleDownload}
                disabled={!textPayload}
                className="w-full py-4 mt-6 bg-accent text-white font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-0.5 transition-all text-center rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_#000]"
              >
                <DownloadSimple size={20} weight="bold" />
                {generationMode === 'qr-only' ? 'Download PNG' : 'Download Cetakan 3R'}
              </button>
            </div>

            {/* AdSense Sidebar Slot */}
            <div className="border-4 border-dashed border-border bg-[#F9F9F9] rounded-[2rem] p-6 text-center text-muted text-xs font-bold relative min-h-[160px] flex flex-col justify-center items-center">
              <span className="absolute top-2 right-4 px-2 py-0.5 bg-border text-[9px] uppercase tracking-widest text-muted-foreground rounded-full">Ads</span>
              <ImageIcon size={32} className="opacity-30 mb-2" />
              <span>Space Iklan AdSense Kanan</span>
              <span className="text-[10px] opacity-50 mt-1">Sponsor Banner Vertikal</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
