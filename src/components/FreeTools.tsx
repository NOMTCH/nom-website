'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { 
  FileText, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  TextT, 
  QrCode as QrIcon, 
  ArrowRight,
  Sparkle,
  SquaresFour,
  Images
} from "@phosphor-icons/react";

type ToolType = 'cv' | 'link' | 'compress' | 'text' | 'qr' | 'grid';

export function FreeTools() {
  const [activeTab, setActiveTab] = useState<ToolType>('qr'); // Default to QR as it's the newest & most visual

  // 1. CV Generator State
  const [cvName, setCvName] = useState<string>('Rizky NOMSTD');
  const [cvJob, setCvJob] = useState<string>('Digital Tech Architect');

  // 2. Bio Link Builder State
  const [bioTheme, setBioTheme] = useState<'brutal-cyan' | 'neon-pink' | 'cyber-yellow'>('brutal-cyan');

  // 3. Image Compressor State
  const [sliderVal, setSliderVal] = useState<number>(50);

  // 4. Text Tool State
  const [textInput, setTextInput] = useState<string>('Halo dunia! Ini adalah NOMSTD Tools.');

  // 5. QR Generator State
  const [qrInput, setQrInput] = useState<string>('https://nomstd.my.id');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // 6. Grid Maker State
  const [gridImagesCount, setGridImagesCount] = useState<number>(4);

  // Draw QR code on the homepage playground dynamically
  useEffect(() => {
    if (activeTab === 'qr' && qrCanvasRef.current && qrInput) {
      QRCode.toCanvas(qrCanvasRef.current, qrInput, {
        width: 130,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).catch(err => console.error(err));
    }
  }, [qrInput, activeTab]);

  // Compute text statistics
  const wordCount = textInput.trim() === '' ? 0 : textInput.trim().split(/\s+/).length;
  const charCount = textInput.length;
  const lowercaseText = textInput.toLowerCase();
  const slugifiedText = textInput
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const tools = [
    {
      id: 'qr' as ToolType,
      label: 'QR Generator',
      desc: 'Bikin QR standee akrilik siap cetak 3R.',
      icon: QrIcon,
      bgColor: 'bg-accent',
      textColor: 'text-white'
    },
    {
      id: 'cv' as ToolType,
      label: 'CV Generator',
      desc: 'Buat CV ATS-Friendly dalam 1 menit.',
      icon: FileText,
      bgColor: 'bg-emerald-500',
      textColor: 'text-white'
    },
    {
      id: 'link' as ToolType,
      label: 'Bio Link Builder',
      desc: 'Kartu nama digital Neo-Pop keren.',
      icon: LinkIcon,
      bgColor: 'bg-violet-500',
      textColor: 'text-white'
    },
    {
      id: 'compress' as ToolType,
      label: 'Image Compressor',
      desc: 'Ubah gambar ke WebP super ringan.',
      icon: ImageIcon,
      bgColor: 'bg-amber-500',
      textColor: 'text-white'
    },
    {
      id: 'text' as ToolType,
      label: 'Text Converter',
      desc: 'Pengubah huruf & live word counter.',
      icon: TextT,
      bgColor: 'bg-rose-500',
      textColor: 'text-white'
    },
    {
      id: 'grid' as ToolType,
      label: 'Photo Grid',
      desc: 'Gabungkan banyak foto bergaya Neo-Brutalist.',
      icon: SquaresFour,
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    }
  ];

  return (
    <section id="tools" className="py-20 md:py-28 px-4 bg-surface relative border-t border-border">
      <div className="container mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-accent font-bold text-xs uppercase tracking-wider inline-block px-4 py-1.5 bg-accent/10 rounded-full">
            Level Up Your Brand & Workflow
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground">
            Coba Tools Premium Kami,<br/>
            <span className="text-accent">100% Gratis Tanpa Login!</span>
          </h2>
          <p className="text-muted text-sm md:text-base font-semibold leading-relaxed">
            Mainkan langsung fitur mini-playground di bawah ini untuk melihat hasil kerja tools premium NOMSTD sebelum memakainya.
          </p>
        </div>

        {/* PLAYGROUND FRAMEWORK CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* LEFT SIDE: TAB SELECTORS (Horizontal scroll on mobile, vertical stack on desktop) */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`snap-center shrink-0 min-w-[200px] lg:min-w-0 text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    isSelected 
                      ? 'bg-foreground text-white border-foreground shadow-[4px_4px_0_0_#000000]' 
                      : 'bg-white border-border text-foreground hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20' : tool.bgColor + ' ' + tool.textColor
                  }`}>
                    <Icon size={20} weight="bold" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wide">{tool.label}</h4>
                    <p className={`text-[10px] font-semibold mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-white/70' : 'text-muted'
                    }`}>
                      {tool.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: LIVE PLAYGROUND (The dynamic screen device) */}
          <div className="lg:col-span-8 bg-white border-4 border-foreground rounded-[2.5rem] shadow-[8px_8px_0_0_#000000] p-6 sm:p-8 flex flex-col justify-between min-h-[460px] relative overflow-hidden">
            
            {/* Screen Header mock buttons */}
            <div className="absolute top-4 left-6 flex items-center gap-1.5 hidden sm:flex">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-black/10"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 border border-black/10"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 border border-black/10"></span>
              <span className="text-[10px] font-bold text-gray-300 ml-2">NOMSTD-LIVE-PREVIEW.EXE</span>
            </div>

            {/* Dynamic Content Renderer */}
            <div className="flex-1 flex items-center justify-center pt-4 sm:pt-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center"
                >
                  
                  {/* TAB 1: QR CODE GENERATOR */}
                  {activeTab === 'qr' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted block">Tulis Link / URL Tautan</label>
                        <input 
                          type="text"
                          value={qrInput}
                          onChange={(e) => setQrInput(e.target.value)}
                          className="w-full bg-white border-2 border-foreground rounded-xl py-3 px-4 focus:outline-none font-bold text-sm text-base"
                          placeholder="https://toko-kamu.com"
                        />
                        <p className="text-[10px] font-bold text-muted">Ketik alamat link website menu makanan, sosmed, atau apa saja dan lihat QR-nya terbuat otomatis!</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-center bg-gray-50 border border-border p-4 rounded-3xl shadow-2xs">
                        <canvas ref={qrCanvasRef} className="w-[130px] h-[130px] object-contain bg-white rounded-xl border border-border" />
                        <span className="text-[9px] font-black uppercase text-accent mt-2 tracking-widest animate-pulse">Live QR Code</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CV GENERATOR */}
                  {activeTab === 'cv' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl">
                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-muted block mb-1">Nama Lengkap</label>
                          <input 
                            type="text"
                            value={cvName}
                            onChange={(e) => setCvName(e.target.value)}
                            className="w-full bg-white border border-border rounded-xl py-2 px-3 focus:outline-none font-bold text-xs text-base"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-muted block mb-1">Pekerjaan / Bidang</label>
                          <input 
                            type="text"
                            value={cvJob}
                            onChange={(e) => setCvJob(e.target.value)}
                            className="w-full bg-white border border-border rounded-xl py-2 px-3 focus:outline-none font-bold text-xs text-base"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Ketik nama & bidang lu, template CV ATS di sebelah kanan bakal ter-update secara instan!</p>
                      </div>
                      
                      {/* Mini Styled Creative Resume Mock */}
                      <div className="shrink-0 w-[200px] h-[250px] bg-white border-2 border-foreground rounded-2xl shadow-[4px_4px_0_0_#000000] flex overflow-hidden text-left relative text-[6px] leading-tight select-none">
                        {/* Left Sidebar (Pastel Accent) */}
                        <div className="w-[70px] bg-accent/5 border-r border-border p-2 flex flex-col items-center gap-3">
                          {/* Avatar Circle displaying the first letter of Name */}
                          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-xs border border-black shadow-xs">
                            {cvName ? cvName.trim().charAt(0).toUpperCase() : 'N'}
                          </div>
                          
                          {/* Contact Skeletons */}
                          <div className="w-full space-y-1">
                            <span className="font-black text-[5px] text-muted-foreground uppercase block">Kontak</span>
                            <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                            <div className="h-1.5 w-4/5 bg-gray-200 rounded"></div>
                          </div>

                          {/* Skill Tags */}
                          <div className="w-full space-y-1">
                            <span className="font-black text-[5px] text-muted-foreground uppercase block">Keahlian</span>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1 py-0.5 bg-emerald-500 text-white rounded font-bold scale-[0.8] origin-left">NextJS</span>
                              <span className="px-1 py-0.5 bg-violet-500 text-white rounded font-bold scale-[0.8] origin-left">UI Design</span>
                              <span className="px-1 py-0.5 bg-accent text-white rounded font-bold scale-[0.8] origin-left">SEO</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Content */}
                        <div className="flex-1 p-3 flex flex-col gap-2.5">
                          <div className="border-b border-gray-100 pb-1.5">
                            <h5 className="font-black text-[9px] text-gray-900 uppercase truncate leading-none">{cvName || 'Rizky NOMSTD'}</h5>
                            <p className="text-accent font-extrabold uppercase tracking-wide text-[5.5px] mt-0.5 truncate">{cvJob || 'Tech Architect'}</p>
                          </div>

                          <div className="space-y-2 flex-1">
                            {/* Summary */}
                            <div className="space-y-0.5">
                              <span className="font-black text-gray-900 uppercase text-[5px] tracking-wider block">Tentang Saya</span>
                              <div className="space-y-1">
                                <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                                <div className="h-1.5 w-5/6 bg-gray-100 rounded"></div>
                              </div>
                            </div>

                            {/* Experience */}
                            <div className="space-y-1">
                              <span className="font-black text-gray-900 uppercase text-[5px] tracking-wider block">Pengalaman</span>
                              <div className="border-l border-accent/30 pl-1.5 space-y-1.5">
                                <div className="relative">
                                  <div className="absolute -left-[8.5px] top-0.5 w-1.5 h-1.5 rounded-full bg-accent border border-white"></div>
                                  <p className="font-black text-[5.5px] text-gray-800 leading-none truncate">Creative Director</p>
                                  <p className="text-gray-400 font-bold scale-[0.9] origin-left mt-0.5 truncate">NOMSTD Studio • 2024</p>
                                </div>
                                <div className="relative">
                                  <div className="absolute -left-[8.5px] top-0.5 w-1.5 h-1.5 rounded-full bg-gray-300 border border-white"></div>
                                  <p className="font-black text-[5.5px] text-gray-600 leading-none truncate">Frontend Engineer</p>
                                  <p className="text-gray-400 font-bold scale-[0.9] origin-left mt-0.5 truncate">IT Solution • 2022</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: BIO LINK BUILDER */}
                  {activeTab === 'link' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted block">Ganti Tema Warna Layar HP</label>
                        <div className="flex gap-2">
                          {[
                            { id: 'brutal-cyan', color: 'bg-cyan-300', border: 'border-cyan-400' },
                            { id: 'neon-pink', color: 'bg-pink-400', border: 'border-pink-500' },
                            { id: 'cyber-yellow', color: 'bg-yellow-300', border: 'border-yellow-400' }
                          ].map(theme => (
                            <button
                              key={theme.id}
                              onClick={() => setBioTheme(theme.id as any)}
                              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform ${theme.color} ${
                                bioTheme === theme.id ? 'scale-110 border-black ring-2 ring-offset-2 ring-black' : 'border-black/10'
                              }`}
                              title={`Tema ${theme.id}`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Klik tombol warna bulat di atas buat ganti tema warna mockup smartphone di samping dengan nuansa Neo-Brutalisme!</p>
                      </div>

                      {/* Mock Smartphone Bio-Link Page */}
                      <div className="shrink-0 w-[160px] h-[250px] bg-foreground border-4 border-foreground rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col p-3 text-center">
                        {/* Camera Notch */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-foreground rounded-full z-20"></div>
                        
                        {/* Phone Screen body */}
                        <div className={`w-full h-full rounded-2xl flex flex-col justify-between p-2 pt-4 transition-colors duration-300 ${
                          bioTheme === 'brutal-cyan' ? 'bg-cyan-200 text-black' :
                          bioTheme === 'neon-pink' ? 'bg-pink-200 text-black' :
                          'bg-yellow-100 text-black'
                        }`}>
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full border border-black bg-white flex items-center justify-center font-bold text-[8px] overflow-hidden">
                              🐱
                            </div>
                            <h6 className="text-[8px] font-black uppercase tracking-tight mt-1 leading-none">@nomstd_studio</h6>
                          </div>

                          {/* Link Buttons inside HP mockup */}
                          <div className="space-y-1.5 my-2 flex-1 flex flex-col justify-center">
                            {['Toko Online', 'Portofolio Web', 'Instagram'].map((item, idx) => (
                              <button 
                                key={idx} 
                                className="w-full py-1.5 text-[7px] font-black uppercase bg-white border border-black rounded-lg shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-[0_0_0_0_#000] transition-all cursor-default"
                              >
                                {item}
                              </button>
                            ))}
                          </div>

                          <span className="text-[5px] font-bold text-gray-500 uppercase leading-none">nomstd-links</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: IMAGE COMPRESSOR */}
                  {activeTab === 'compress' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted block">Geser Perbandingan Kualitas</label>
                        <div className="space-y-2">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={sliderVal}
                            onChange={(e) => setSliderVal(Number(e.target.value))}
                            className="w-full accent-accent h-2 bg-gray-200 rounded-lg cursor-ew-resize"
                          />
                          <div className="flex justify-between text-[9px] font-bold text-muted">
                            <span>Kiri: Original (1.75 MB)</span>
                            <span>Kanan: WebP (177 KB)</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Geser slider di atas buat ngeliat perbandingan detail ketajaman gambar. Kompresor WebP NOMSTD mengecilkan ukuran data gambar hingga 90% tapi kualitas visual tetap tajam!</p>
                      </div>

                      {/* Mock Split Image Comparison Card */}
                      <div className="shrink-0 w-[200px] h-[200px] border-2 border-foreground rounded-2xl overflow-hidden relative select-none bg-zinc-950 flex items-center justify-center">
                        
                        {/* Right side (Compressed - Clean WebP mockup) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-900/60 p-4">
                          <Sparkle size={48} className="text-white animate-pulse" weight="fill" />
                          <span className="text-[9px] font-black text-white uppercase mt-2 tracking-wider">WebP - 177 KB</span>
                          <span className="text-[7px] text-cyan-200 uppercase mt-0.5">Ultra Sharp Quality</span>
                        </div>

                        {/* Left side (Original - Heavy Raw file mockup) */}
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center bg-[#FF9500]/60 p-4 overflow-hidden border-r-2 border-white"
                          style={{ clipPath: `inset(0 ${100 - sliderVal}% 0 0)` }}
                        >
                          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-800">
                            <ImageIcon size={48} className="text-white" />
                            <span className="text-[9px] font-black text-white uppercase mt-2 tracking-wider shrink-0">RAW PNG - 1.75 MB</span>
                            <span className="text-[7px] text-amber-200 uppercase mt-0.5 shrink-0">Unoptimized file</span>
                          </div>
                        </div>

                        {/* Centered line indicator */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
                          style={{ left: `${sliderVal}%` }}
                        />

                      </div>
                    </div>
                  )}

                  {/* TAB 5: TEXT CONVERTER */}
                  {activeTab === 'text' && (
                    <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-stretch max-w-2xl">
                      <div className="flex-1 space-y-3 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted block">Ketik Teks Lu di Sini</label>
                        <textarea
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full h-24 bg-white border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent font-medium text-xs resize-none text-base"
                          placeholder="Masukkan teks..."
                        />
                        <div className="flex gap-4 text-[9px] font-bold text-muted">
                          <span>Kata: <strong className="text-foreground">{wordCount}</strong></span>
                          <span>Karakter: <strong className="text-foreground">{charCount}</strong></span>
                        </div>
                      </div>

                      {/* Conversions Output Previews */}
                      <div className="flex-1 bg-gray-50 border border-border rounded-2xl p-4 flex flex-col justify-center space-y-2 text-[9px]">
                        <div>
                          <span className="text-[8px] font-black uppercase text-muted block">Kecil Semua (lowercase)</span>
                          <p className="font-bold text-foreground line-clamp-1 truncate bg-white border border-border/60 py-1 px-2 rounded-md mt-0.5">{lowercaseText || '-'}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black uppercase text-muted block">URL Slugify</span>
                          <p className="font-bold text-accent line-clamp-1 truncate bg-white border border-border/60 py-1 px-2 rounded-md mt-0.5">{slugifiedText || '-'}</p>
                        </div>
                        <span className="text-[8px] font-semibold text-gray-400 mt-1 leading-normal block">Pengubah huruf kapital dinamis dan counter bekerja instan sewaktu lu mengetik.</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: PHOTO GRID MAKER */}
                  {activeTab === 'grid' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-muted block">Simulasi Grid Layout</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <button
                              key={num}
                              onClick={() => setGridImagesCount(num)}
                              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center border-2 transition-all ${
                                gridImagesCount >= num ? 'bg-accent text-white border-accent' : 'bg-white text-muted border-border'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Klik angka di atas buat simulasi nambah foto ke canvas! Fitur ini menggabungkan semua fotomu ke dalam 1 grid atau gaya polaroid keren.</p>
                      </div>

                      <div className="shrink-0 w-[200px] h-[200px] bg-white border-2 border-foreground rounded-2xl shadow-[4px_4px_0_0_#000000] flex flex-wrap gap-1 p-2 overflow-hidden relative">
                        {Array.from({ length: Math.max(1, gridImagesCount) }).map((_, idx) => (
                          <div key={idx} className="flex-1 min-w-[45%] h-[45%] bg-blue-100 border border-blue-300 rounded flex items-center justify-center">
                            <Images className="text-blue-400" size={24} weight="fill" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Playground Bottom Action CTA */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted block">Uji coba mini berhasil</span>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {activeTab === 'qr' && 'Bikin QR siap cetak standee meja pakai logo toko.'}
                  {activeTab === 'cv' && 'Unduh file PDF CV ATS-Friendly standar HRD.'}
                  {activeTab === 'link' && 'Buat halaman bio link & pasang di media sosial.'}
                  {activeTab === 'compress' && 'Mulai kompresi file foto batch tak terbatas.'}
                  {activeTab === 'text' && 'Gunakan tool pengubah text case & pembersih spasi.'}
                  {activeTab === 'grid' && 'Buat kolase foto Aesthetic sekarang juga!'}
                </p>
              </div>
              
              <Link 
                href={
                  activeTab === 'qr' ? '/tools/qr-generator' :
                  activeTab === 'cv' ? '/tools/cv-generator' :
                  activeTab === 'link' ? '/tools/link-builder' :
                  activeTab === 'compress' ? '/tools/image-compressor' :
                  activeTab === 'grid' ? '/tools/photo-grid' :
                  '/tools/text-tool'
                }
                target="_blank"
                className="w-full sm:w-auto px-6 py-3 bg-accent text-white font-black uppercase text-xs rounded-xl shadow-[3px_3px_0_0_#000] border border-black hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] transition-all flex items-center justify-center gap-2"
              >
                Gaskeun Versi Lengkap
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

          </div>

        </div>

        {/* Support Us Saweria Section (Aligned at the bottom) */}
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-[#FF9500]/10 border-2 border-[#FFCC00]/30 text-center relative group shadow-sm hover:shadow-md rounded-[2rem] transition-all duration-300"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF9500] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
              Support Our Server
            </div>
            
            <div className="relative z-10 pt-2 flex flex-col md:flex-row gap-6 items-center text-left">
              <div className="shrink-0 bg-white p-2.5 rounded-2xl border border-border shadow-xs">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://saweria.co/iammonoz" 
                  alt="Saweria QR Code" 
                  className="w-24 h-24 object-contain rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase flex items-center gap-1.5">
                  Traktir Kopi NOMSTD ☕
                </h3>
                <p className="text-xs font-bold text-muted leading-relaxed">
                  Semua tool kami 100% gratis tanpa login & tanpa batasan. Bantu traktir server kopi agar kami bisa terus menjaga server tetap online dan menambahkan tools-tools baru yang berguna!
                </p>
                <a 
                  href="https://saweria.co/iammonoz" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 py-2.5 px-6 bg-[#FF9500] hover:bg-[#E68600] text-white text-xs font-black uppercase rounded-xl transition-all shadow-[2px_2px_0_0_#000] border border-black"
                >
                  Sawer Kopi lewat Saweria
                  <ArrowRight size={14} weight="bold" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
