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
  const [activeTab, setActiveTab] = useState<ToolType>('qr');

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

  useEffect(() => {
    if (activeTab === 'qr' && qrCanvasRef.current && qrInput) {
      QRCode.toCanvas(qrCanvasRef.current, qrInput, {
        width: 130,
        margin: 1,
        color: {
          dark: '#4E9F3D',
          light: '#242424'
        }
      }).catch(err => console.error(err));
    }
  }, [qrInput, activeTab]);

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
    },
    {
      id: 'cv' as ToolType,
      label: 'CV Generator',
      desc: 'Buat CV ATS-Friendly dalam 1 menit.',
      icon: FileText,
    },
    {
      id: 'link' as ToolType,
      label: 'Bio Link Builder',
      desc: 'Kartu nama digital Neo-Pop keren.',
      icon: LinkIcon,
    },
    {
      id: 'compress' as ToolType,
      label: 'Image Compressor',
      desc: 'Ubah gambar ke WebP super ringan.',
      icon: ImageIcon,
    },
    {
      id: 'text' as ToolType,
      label: 'Text Converter',
      desc: 'Pengubah huruf & live word counter.',
      icon: TextT,
    },
    {
      id: 'grid' as ToolType,
      label: 'Photo Grid',
      desc: 'Gabungkan banyak foto bergaya Neo-Brutalist.',
      icon: SquaresFour,
    }
  ];

  return (
    <section id="tools" className="py-16 md:py-24 px-4 bg-background text-foreground relative border-t border-border">
      <div className="container mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-accent font-bold text-xs uppercase tracking-wider inline-block px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full">
            Level Up Your Brand &amp; Workflow
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-foreground">
            Coba Tools Premium Kami,<br/>
            <span className="text-accent">100% Gratis Tanpa Login!</span>
          </h2>
          <p className="text-muted text-xs md:text-sm font-semibold leading-relaxed">
            Mainkan langsung fitur mini-playground di bawah ini untuk melihat hasil kerja tools premium NOMSTD sebelum memakainya.
          </p>
        </div>

        {/* PLAYGROUND FRAMEWORK CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* LEFT SIDE: TAB SELECTORS */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`snap-center shrink-0 min-w-[200px] lg:min-w-0 text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer ${
                    isSelected 
                      ? 'bg-accent text-white border-accent shadow-lg' 
                      : 'bg-surface border-border text-foreground hover:border-accent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-background text-accent'
                  }`}>
                    <Icon size={20} weight="bold" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wide">{tool.label}</h4>
                    <p className={`text-[10px] font-semibold mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-white/80' : 'text-muted'
                    }`}>
                      {tool.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: LIVE PLAYGROUND */}
          <div className="lg:col-span-8 bg-surface border border-border rounded-2xl md:rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col justify-between min-h-[460px] relative overflow-hidden text-foreground">
            
            {/* Screen Header mock buttons */}
            <div className="absolute top-4 left-6 flex items-center gap-1.5 hidden sm:flex">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-[10px] font-mono text-muted ml-2">NOMSTD-LIVE-PREVIEW.EXE</span>
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
                      <div className="flex-1 space-y-4 w-full text-left">
                        <label className="text-[10px] font-black uppercase tracking-wider text-accent block">Tulis Link / URL Tautan</label>
                        <input 
                          type="text"
                          value={qrInput}
                          onChange={(e) => setQrInput(e.target.value)}
                          className="w-full bg-background border border-border text-foreground rounded-xl py-3 px-4 focus:outline-none focus:border-accent font-bold text-sm"
                          placeholder="https://toko-kamu.com"
                        />
                        <p className="text-[10px] font-bold text-muted">Ketik alamat link website menu makanan, sosmed, atau apa saja dan lihat QR-nya terbuat otomatis!</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-center bg-background border border-border p-4 rounded-3xl shadow-sm">
                        <canvas ref={qrCanvasRef} className="w-[130px] h-[130px] object-contain bg-surface rounded-xl border border-border" />
                        <span className="text-[9px] font-black uppercase text-accent mt-2 tracking-widest animate-pulse">Live QR Code</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CV GENERATOR */}
                  {activeTab === 'cv' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl text-left">
                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-accent block mb-1">Nama Lengkap</label>
                          <input 
                            type="text"
                            value={cvName}
                            onChange={(e) => setCvName(e.target.value)}
                            className="w-full bg-background border border-border text-foreground rounded-xl py-2 px-3 focus:outline-none focus:border-accent font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-wider text-accent block mb-1">Pekerjaan / Bidang</label>
                          <input 
                            type="text"
                            value={cvJob}
                            onChange={(e) => setCvJob(e.target.value)}
                            className="w-full bg-background border border-border text-foreground rounded-xl py-2 px-3 focus:outline-none focus:border-accent font-bold text-xs"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Ketik nama &amp; bidang lu, template CV ATS di sebelah kanan bakal ter-update secara instan!</p>
                      </div>
                      
                      {/* Mini Styled Resume Mock */}
                      <div className="shrink-0 w-[200px] h-[250px] bg-background border border-border rounded-2xl shadow-md flex overflow-hidden text-left relative text-[6px] leading-tight select-none">
                        <div className="w-[70px] bg-surface border-r border-border p-2 flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-xs border border-border">
                            {cvName ? cvName.trim().charAt(0).toUpperCase() : 'N'}
                          </div>
                          
                          <div className="w-full space-y-1">
                            <span className="font-black text-[5px] text-accent uppercase block">Kontak</span>
                            <div className="h-1.5 w-full bg-border rounded"></div>
                            <div className="h-1.5 w-4/5 bg-border rounded"></div>
                          </div>
 
                          <div className="w-full space-y-1">
                            <span className="font-black text-[5px] text-accent uppercase block">Keahlian</span>
                            <div className="flex flex-wrap gap-1">
                              <span className="px-1 py-0.5 bg-accent text-white rounded font-bold scale-[0.8] origin-left">NextJS</span>
                              <span className="px-1 py-0.5 bg-accent text-white rounded font-bold scale-[0.8] origin-left">Laravel</span>
                            </div>
                          </div>
                        </div>
 
                        <div className="flex-1 p-3 flex flex-col gap-2.5 text-foreground">
                          <div className="border-b border-border pb-1.5">
                            <h5 className="font-black text-[9px] text-foreground uppercase truncate leading-none">{cvName || 'Rizky NOMSTD'}</h5>
                            <p className="text-accent font-extrabold uppercase tracking-wide text-[5.5px] mt-0.5 truncate">{cvJob || 'Tech Architect'}</p>
                          </div>
 
                          <div className="space-y-2 flex-1">
                            <div className="space-y-0.5">
                              <span className="font-black text-foreground uppercase text-[5px] tracking-wider block">Tentang Saya</span>
                              <div className="space-y-1">
                                <div className="h-1.5 w-full bg-border rounded"></div>
                                <div className="h-1.5 w-5/6 bg-border rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: BIO LINK BUILDER */}
                  {activeTab === 'link' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl text-left">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-accent block">Ganti Tema Warna Layar HP</label>
                        <div className="flex gap-2">
                          {[
                            { id: 'brutal-cyan', color: 'bg-accent', border: 'border-accent' },
                            { id: 'neon-pink', color: 'bg-pink-500', border: 'border-pink-500' },
                            { id: 'cyber-yellow', color: 'bg-yellow-400', border: 'border-yellow-400' }
                          ].map(theme => (
                            <button
                              key={theme.id}
                              onClick={() => setBioTheme(theme.id as any)}
                              className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform ${theme.color} ${
                                bioTheme === theme.id ? 'scale-110 border-white ring-2 ring-offset-2 ring-accent' : 'border-white/20'
                              }`}
                              title={`Tema ${theme.id}`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Klik tombol warna bulat di atas buat ganti tema warna mockup smartphone di samping!</p>
                      </div>
 
                      {/* Mock Smartphone */}
                      <div className="shrink-0 w-[160px] h-[250px] bg-background border border-border rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col p-3 text-center">
                        <div className="w-full h-full rounded-2xl bg-surface flex flex-col justify-between p-2 pt-4 border border-border">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full border border-accent bg-background flex items-center justify-center font-bold text-[8px] overflow-hidden text-white">
                              🐱
                            </div>
                            <h6 className="text-[8px] font-black uppercase tracking-tight mt-1 leading-none text-foreground">@nomstd_studio</h6>
                          </div>
 
                          <div className="space-y-1.5 my-2 flex-1 flex flex-col justify-center">
                            {['Toko Online', 'Portofolio Web', 'Instagram'].map((item, idx) => (
                              <button 
                                key={idx} 
                                className="w-full py-1.5 text-[7px] font-black uppercase bg-accent text-white border border-accent rounded-lg shadow-sm active:translate-y-0.5 transition-all cursor-default"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
 
                          <span className="text-[5px] font-bold text-muted uppercase leading-none">nomstd-links</span>
                        </div>
                      </div>
                    </div>
                  )} )                  {/* TAB 4: IMAGE COMPRESSOR */}
                  {activeTab === 'compress' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl text-left">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-accent block">Geser Perbandingan Kualitas</label>
                        <div className="space-y-2">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={sliderVal}
                            onChange={(e) => setSliderVal(Number(e.target.value))}
                            className="w-full accent-accent h-2 bg-background rounded-lg cursor-ew-resize"
                          />
                          <div className="flex justify-between text-[9px] font-bold text-muted">
                            <span>Kiri: Original (1.75 MB)</span>
                            <span>Kanan: WebP (177 KB)</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Geser slider di atas buat ngeliat perbandingan detail ketajaman gambar!</p>
                      </div>
 
                      <div className="shrink-0 w-[200px] h-[200px] border border-border rounded-2xl overflow-hidden relative select-none bg-background flex items-center justify-center">
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-accent/40 p-4">
                          <Sparkle size={48} className="text-white animate-pulse" weight="fill" />
                          <span className="text-[9px] font-black text-white uppercase mt-2 tracking-wider">WebP - 177 KB</span>
                          <span className="text-[7px] text-accent uppercase mt-0.5 font-bold">Ultra Sharp Quality</span>
                        </div>
                      </div>
                    </div>
                  )} )                  {/* TAB 5: TEXT CONVERTER */}
                  {activeTab === 'text' && (
                    <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 items-stretch max-w-2xl text-left">
                      <div className="flex-1 space-y-3 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-accent block">Ketik Teks Lu di Sini</label>
                        <textarea
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          className="w-full h-24 bg-background border border-border text-foreground rounded-xl p-3 focus:outline-none focus:border-accent font-medium text-xs resize-none"
                          placeholder="Masukkan teks..."
                        />
                        <div className="flex gap-4 text-[9px] font-bold text-muted">
                          <span>Kata: <strong className="text-foreground">{wordCount}</strong></span>
                          <span>Karakter: <strong className="text-foreground">{charCount}</strong></span>
                        </div>
                      </div>
 
                      <div className="flex-1 bg-background border border-border rounded-2xl p-4 flex flex-col justify-center space-y-2 text-[9px]">
                        <div>
                          <span className="text-[8px] font-black uppercase text-muted block">Kecil Semua (lowercase)</span>
                          <p className="font-bold text-foreground line-clamp-1 truncate bg-surface border border-border py-1 px-2 rounded-md mt-0.5">{lowercaseText || '-'}</p>
                        </div>
                        <div>
                          <span className="text-[8px] font-black uppercase text-muted block">URL Slugify</span>
                          <p className="font-bold text-accent line-clamp-1 truncate bg-surface border border-border py-1 px-2 rounded-md mt-0.5">{slugifiedText || '-'}</p>
                        </div>
                      </div>
                    </div>
                  )} )                  {/* TAB 6: PHOTO GRID MAKER */}
                  {activeTab === 'grid' && (
                    <div className="w-full flex flex-col sm:flex-row gap-6 sm:gap-8 items-center max-w-xl text-left">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] font-black uppercase tracking-wider text-accent block">Simulasi Grid Layout</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <button
                              key={num}
                              onClick={() => setGridImagesCount(num)}
                              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center border transition-all cursor-pointer ${
                                gridImagesCount >= num ? 'bg-accent text-white border-accent' : 'bg-background text-muted border-border'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-muted leading-relaxed">Klik angka di atas buat simulasi nambah foto ke canvas!</p>
                      </div>
 
                      <div className="shrink-0 w-[200px] h-[200px] bg-background border border-border rounded-2xl flex flex-wrap gap-1 p-2 overflow-hidden relative">
                        {Array.from({ length: Math.max(1, gridImagesCount) }).map((_, idx) => (
                          <div key={idx} className="flex-1 min-w-[45%] h-[45%] bg-surface border border-border rounded flex items-center justify-center">
                            <Images className="text-accent" size={24} weight="fill" />
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
                <span className="text-[10px] font-black uppercase tracking-wider text-accent block">Uji coba mini berhasil</span>
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
                className="w-full sm:w-auto px-6 py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
              >
                Gaskeun Versi Lengkap
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

          </div>

        </div>

        {/* Support Us Saweria Section */}
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-surface border border-border text-center relative group shadow-md rounded-2xl md:rounded-3xl transition-all duration-300"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
              Support Our Server
            </div>
            
            <div className="relative z-10 pt-2 flex flex-col md:flex-row gap-6 items-center text-left">
              <div className="shrink-0 bg-background p-2.5 rounded-2xl border border-border">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://saweria.co/iammonoz" 
                  alt="Saweria QR Code" 
                  className="w-24 h-24 object-contain rounded-lg bg-white p-1"
                />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase flex items-center gap-1.5">
                  Traktir Kopi NOMSTD ☕
                </h3>
                <p className="text-xs font-bold text-muted leading-relaxed">
                  Semua tool kami 100% gratis tanpa login &amp; tanpa batasan. Bantu traktir server kopi agar kami bisa terus menjaga server tetap online!
                </p>
                <a 
                  href="https://saweria.co/iammonoz" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 py-2.5 px-6 bg-accent hover:bg-accent/90 text-white text-xs font-bold uppercase rounded-xl transition-all"
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
