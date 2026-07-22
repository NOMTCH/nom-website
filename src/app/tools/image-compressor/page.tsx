'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadSimple, 
  DownloadSimple, 
  Image as ImageIcon, 
  ArrowRight, 
  Check, 
  Spinner, 
  ArrowCounterClockwise, 
  ArrowsDownUp, 
  Gear, 
  Warning, 
  Info,
  Coffee
} from "@phosphor-icons/react";
import { NeoAdSlot } from '@/components/blog/NeoAdSlot';

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);
  
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>('image/webp');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Clean up object URLs on unmount/file change
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  // Handle file select
  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Tolong upload file gambar saja bre!');
      return;
    }
    
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    setCompressedUrl('');
    setCompressedSize(0);
    
    // Load image metadata to get dimensions
    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setCustomWidth(img.width);
      setCustomHeight(img.height);
    };
    img.src = url;
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Perform compression on canvas
  const handleCompress = () => {
    if (!originalUrl) return;
    
    setIsProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setIsProcessing(false);
        return;
      }
      
      // Set canvas dimensions to the custom dimensions
      canvas.width = customWidth || img.width;
      canvas.height = customHeight || img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob/image URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            const compUrl = URL.createObjectURL(blob);
            setCompressedUrl(compUrl);
            setCompressedSize(blob.size);
          }
          setIsProcessing(false);
        },
        format,
        quality / 100
      );
    };
    img.src = originalUrl;
  };

  // Trigger compression automatically when quality, format, or size changes
  useEffect(() => {
    if (originalUrl && customWidth > 0 && customHeight > 0) {
      const delayDebounce = setTimeout(() => {
        handleCompress();
      }, 300); // Debounce to avoid freezing while dragging quality slider
      return () => clearTimeout(delayDebounce);
    }
  }, [quality, format, customWidth, customHeight]);

  const handleWidthChange = (val: number) => {
    setCustomWidth(val);
    if (maintainAspectRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setCustomHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setCustomHeight(val);
    if (maintainAspectRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setCustomWidth(Math.round(val * ratio));
    }
  };

  const resetAll = () => {
    setFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setCustomWidth(0);
    setCustomHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savePercent = originalSize && compressedSize 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) 
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground pt-36 pb-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted hover:text-accent mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase">NOM-COMPRESS</h1>
          <p className="text-muted font-bold mt-2">Ubah format gambar ke WebP & kompres ukurannya langsung di browser lo. Cepat, aman, dan gratis!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT COLUMN: Controls & Input */}
          <div className="w-full lg:w-5/12 xl:w-4/12 space-y-6">
            
            {/* Upload Box */}
            <div className="bg-surface border border-border p-6 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-0.5 text-sm">1</span> Pilih Gambar
              </h2>
              
              {!file ? (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent hover:bg-surface/50'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={onFileSelect}
                    className="hidden" 
                  />
                  <UploadSimple size={48} className="mx-auto text-muted mb-4" />
                  <p className="font-bold text-sm uppercase tracking-wider">Drag & Drop Gambar Di Sini</p>
                  <p className="text-xs text-muted font-bold mt-2">Atau klik untuk browse file (JPG, PNG, WebP)</p>
                </div>
              ) : (
                <div className="p-4 bg-background border border-border rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center shrink-0">
                      <ImageIcon size={24} className="text-foreground" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate uppercase tracking-tight">{file.name}</p>
                      <p className="text-xs text-muted font-bold">{formatSize(originalSize)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={resetAll}
                    className="p-2 text-red-500 hover:text-red-700 bg-red-50 border border-transparent hover:border-red-500 rounded-xl transition-all"
                    title="Ganti Gambar"
                  >
                    <ArrowCounterClockwise size={20} weight="bold" />
                  </button>
                </div>
              )}
            </div>

            {/* Adjustments Panel */}
            <div className={`bg-surface border border-border p-6 rounded-[2rem] shadow-sm transition-opacity duration-300 ${!file ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="bg-accent text-white px-2 py-0.5 text-sm">2</span> Pengaturan
              </h2>

              <div className="space-y-6">
                {/* Format Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">Format Output</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['image/webp', 'image/jpeg', 'image/png'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        disabled={!file}
                        className={`py-3 border font-black uppercase text-xs rounded-xl transition-all ${
                          format === f 
                            ? 'bg-accent text-white border-accent shadow-sm' 
                            : 'bg-background border-border text-foreground hover:bg-background/80'
                        }`}
                      >
                        {f.split('/')[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Slider (Not applicable for PNG) */}
                {format !== 'image/png' && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted">Kualitas Kompresi</label>
                      <span className="px-2 py-0.5 bg-accent/10 text-accent font-black text-xs rounded-md">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      disabled={!file}
                      className="w-full accent-accent cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted font-bold mt-1">
                      <span>Kecil (Kualitas Rendah)</span>
                      <span>Sempurna (Kualitas Tinggi)</span>
                    </div>
                  </div>
                )}

                <hr className="border border-border" />

                {/* Dimension Settings */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">Ubah Resolusi (Resize)</label>
                    <button 
                      onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                      className={`text-xs font-bold flex items-center gap-1 px-2..5 py-1 border rounded-lg transition-all ${
                        maintainAspectRatio 
                          ? 'border-accent bg-accent/5 text-accent font-black' 
                          : 'border-border text-muted'
                      }`}
                      title="Kunci Rasio Lebar & Tinggi"
                    >
                      <ArrowsDownUp size={12} weight="bold" />
                      Rasio Asli
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-muted uppercase block mb-1">Lebar (px)</span>
                      <input 
                        type="number"
                        value={customWidth || ''}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                        disabled={!file}
                        className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent font-bold text-sm text-foreground"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted uppercase block mb-1">Tinggi (px)</span>
                      <input 
                        type="number"
                        value={customHeight || ''}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                        disabled={!file}
                        className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:border-accent font-bold text-sm text-foreground"
                        placeholder="Height"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* AdSense Placeholder Sidebar */}
            <div className="w-full">
              <NeoAdSlot format="rectangle" />
            </div>

          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="w-full lg:w-7/12 xl:w-8/12 space-y-6">
            
            {!file ? (
              <div className="w-full min-h-[400px] border-4 border-dashed border-border rounded-[2.5rem] flex flex-col justify-center items-center text-center p-8 bg-surface">
                <ImageIcon size={64} className="text-muted opacity-30 mb-4" />
                <h3 className="text-lg font-black uppercase tracking-tight text-muted">Belum ada file yang dipilih</h3>
                <p className="text-sm font-medium text-muted mt-2 max-w-sm">Upload gambar lu di panel sebelah kiri untuk melihat kompresi sebelum lu download.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Save Banner */}
                {compressedSize > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-between text-green-400"
                  >
                    <div>
                      <p className="text-lg font-black uppercase tracking-tight text-green-400">Berhasil Dikompres!</p>
                      <p className="text-xs font-bold text-muted mt-0.5">
                        Ukuran berkurang dari <span className="line-through">{formatSize(originalSize)}</span> menjadi <span className="font-black text-foreground">{formatSize(compressedSize)}</span>.
                      </p>
                    </div>
                    <div className="bg-green-500 text-white px-4 py-2 font-bold text-lg rounded-xl shadow-sm">
                      -{savePercent}%
                    </div>
                  </motion.div>
                )}

                {/* Previews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Original Image Frame */}
                  <div className="bg-surface border border-border rounded-3xl p-5 shadow-md flex flex-col h-full text-foreground">
                    <h3 className="text-sm font-black uppercase tracking-wider text-muted mb-3 flex items-center justify-between">
                      <span>Gambar Asli</span>
                      <span className="text-xs text-foreground bg-background px-2 py-0.5 rounded font-bold">{originalWidth}x{originalHeight} px</span>
                    </h3>
                    <div className="flex-1 bg-background border border-border rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[250px] relative max-h-[350px]">
                      {originalUrl && (
                        <img 
                          ref={imgRef}
                          src={originalUrl} 
                          alt="Original" 
                          className="max-h-[300px] w-auto max-w-full object-contain rounded-lg"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs font-bold">
                      <span className="text-muted">Ukuran File:</span>
                      <span className="text-foreground">{formatSize(originalSize)}</span>
                    </div>
                  </div>

                  {/* Compressed Image Frame */}
                  <div className="bg-surface border border-border rounded-3xl p-5 shadow-xl flex flex-col h-full relative text-foreground">
                    {isProcessing && (
                      <div className="absolute inset-0 bg-surface/70 backdrop-blur-xs z-20 rounded-3xl flex flex-col items-center justify-center">
                        <Spinner className="animate-spin text-accent" size={48} />
                        <span className="text-xs font-black uppercase tracking-widest mt-4">Mengompres...</span>
                      </div>
                    )}
                    
                    <h3 className="text-sm font-black uppercase tracking-wider text-muted mb-3 flex items-center justify-between">
                      <span className="text-accent font-black">Hasil Kompresi</span>
                      <span className="text-xs text-foreground bg-background px-2 py-0.5 rounded font-bold">{customWidth}x{customHeight} px</span>
                    </h3>
                    
                    <div className="flex-1 bg-background border border-border rounded-xl overflow-hidden flex items-center justify-center p-4 min-h-[250px] relative max-h-[350px]">
                      {compressedUrl ? (
                        <img 
                          src={compressedUrl} 
                          alt="Compressed" 
                          className="max-h-[300px] w-auto max-w-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-muted font-bold text-xs p-6 flex flex-col justify-center items-center">
                          <Spinner size={32} className="animate-pulse mb-2" />
                          <span>Menunggu konfigurasi...</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between items-center text-xs font-bold">
                      <span className="text-muted">Ukuran File:</span>
                      <span className="font-black text-accent">{compressedSize ? formatSize(compressedSize) : '-'}</span>
                    </div>
                  </div>

                </div>

                {/* Actions Box */}
                {compressedUrl && (
                  <div className="bg-surface border border-border p-6 rounded-[2.5rem] flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-accent">
                        <Check size={28} weight="bold" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-tight text-sm">Gambar Siap Di-download!</h4>
                        <p className="text-xs text-muted font-bold mt-0.5">Disimpan lokal, aman, tanpa terupload ke server luar.</p>
                      </div>
                    </div>
                    
                    <a
                      href={compressedUrl}
                      download={`nomstd-compressed-${Date.now()}.${format.split('/')[1]}`}
                      className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-bold uppercase tracking-wider hover:bg-accent-dark hover:-translate-y-0.5 transition-all text-center rounded-xl flex items-center justify-center gap-2 shadow-md"
                    >
                      <DownloadSimple size={20} weight="bold" />
                      Download Hasil
                    </a>
                  </div>
                )}

                {/* AdSense Placeholder Banner (Under results) */}
                <div className="w-full">
                  <NeoAdSlot format="horizontal" />
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
