'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  UploadSimple, 
  DownloadSimple, 
  Image as ImageIcon, 
  Trash, 
  Check, 
  Spinner, 
  SquaresFour,
  Images,
  FilmStrip,
  Plus,
  Palette
} from "@phosphor-icons/react";
import { NeoAdSlot } from '@/components/blog/NeoAdSlot';

type TemplateType = 'classic' | 'polaroid' | 'film';

interface UploadedPhoto {
  id: string;
  url: string;
  img: HTMLImageElement;
}

export default function PhotoGridPage() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [columns, setColumns] = useState(2); // For classic grid

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Multi-Upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    
    if (files.length === 0) return;

    setIsProcessing(true);

    const newPhotosPromises = files.map(file => {
      return new Promise<UploadedPhoto>((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          resolve({ id: Math.random().toString(36).substring(7), url, img });
        };
        img.src = url;
      });
    });

    Promise.all(newPhotosPromises).then(newPhotos => {
      setPhotos(prev => [...prev, ...newPhotos]);
      setIsProcessing(false);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(p => p.id !== id);
    });
  };

  // Draw Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (photos.length === 0) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    if (template === 'classic') {
      drawClassicGrid(canvas, ctx);
    } else if (template === 'polaroid') {
      drawPolaroid(canvas, ctx);
    } else if (template === 'film') {
      drawFilmStrip(canvas, ctx);
    }

  }, [photos, template, bgColor, columns]);

  const drawClassicGrid = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const gap = 20;
    const cols = columns;
    const rows = Math.ceil(photos.length / cols);
    const size = 600; // base size per cell
    
    canvas.width = (cols * size) + ((cols + 1) * gap);
    canvas.height = (rows * size) + ((rows + 1) * gap);

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    photos.forEach((photo, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = gap + (col * (size + gap));
      const y = gap + (row * (size + gap));

      // Draw image (cover style)
      drawImageCover(ctx, photo.img, x, y, size, size);
      
      // Border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, size, size);
    });
  };

  const drawPolaroid = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // A square large canvas
    canvas.width = 2000;
    canvas.height = 2000;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neo brutalist pattern background
    ctx.fillStyle = '#00000010';
    for(let i=0; i<canvas.width; i+=40) {
      for(let j=0; j<canvas.height; j+=40) {
        ctx.beginPath();
        ctx.arc(i, j, 2, 0, Math.PI*2);
        ctx.fill();
      }
    }

    const polaroidWidth = 500;
    const polaroidHeight = 600;

    // Seeded random for consistent preview
    let seed = 123;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    photos.forEach((photo, i) => {
      ctx.save();
      // Random position roughly centered
      const cx = (canvas.width / 2) + ((random() - 0.5) * 800);
      const cy = (canvas.height / 2) + ((random() - 0.5) * 800);
      const angle = (random() - 0.5) * 0.5; // radians (-0.25 to 0.25)

      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Brutalist Shadow
      ctx.fillStyle = '#000';
      ctx.fillRect(-polaroidWidth/2 + 20, -polaroidHeight/2 + 20, polaroidWidth, polaroidHeight);

      // Polaroid Paper
      ctx.fillStyle = '#FFF';
      ctx.fillRect(-polaroidWidth/2, -polaroidHeight/2, polaroidWidth, polaroidHeight);
      
      // Border outline
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 6;
      ctx.strokeRect(-polaroidWidth/2, -polaroidHeight/2, polaroidWidth, polaroidHeight);

      // Image Area
      const imgSize = 440;
      const imgX = -polaroidWidth/2 + 30;
      const imgY = -polaroidHeight/2 + 30;
      
      drawImageCover(ctx, photo.img, imgX, imgY, imgSize, imgSize);
      ctx.strokeRect(imgX, imgY, imgSize, imgSize);

      // Tape (Neo brutalist red tape)
      ctx.fillStyle = '#FF3366';
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-100, -polaroidHeight/2 - 20, 200, 60);
      ctx.strokeRect(-100, -polaroidHeight/2 - 20, 200, 60);
      
      ctx.restore();
    });
  };

  const drawFilmStrip = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const frameWidth = 800;
    const frameHeight = 500;
    const padding = 60;
    const stripColor = '#111';

    canvas.width = frameWidth + (padding * 2);
    canvas.height = (photos.length * frameHeight) + ((photos.length + 1) * padding);

    // Film Strip Background
    ctx.fillStyle = stripColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw holes
    ctx.fillStyle = bgColor; // The page background color poking through holes
    for(let y=20; y<canvas.height; y+=50) {
      // Left holes
      ctx.fillRect(15, y, 30, 30);
      // Right holes
      ctx.fillRect(canvas.width - 45, y, 30, 30);
    }

    // Draw photos
    photos.forEach((photo, i) => {
      const x = padding;
      const y = padding + (i * (frameHeight + padding));
      drawImageCover(ctx, photo.img, x, y, frameWidth, frameHeight);
      
      // Vintage overlay
      ctx.fillStyle = 'rgba(255, 200, 0, 0.05)';
      ctx.fillRect(x, y, frameWidth, frameHeight);
    });
  };

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const imgRatio = img.width / img.height;
    const targetRatio = w / h;
    let renderW, renderH, offsetX = 0, offsetY = 0;

    if (imgRatio > targetRatio) {
      renderH = h;
      renderW = img.width * (h / img.height);
      offsetX = (w - renderW) / 2;
    } else {
      renderW = w;
      renderH = img.height * (w / img.width);
      offsetY = (h - renderH) / 2;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, x + offsetX, y + offsetY, renderW, renderH);
    ctx.restore();
  };

  const handleDownload = () => {
    if (!canvasRef.current || photos.length === 0) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `nomstd-collage-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-[10px] uppercase tracking-widest mb-4 border border-accent/20">
            <SquaresFour weight="fill" size={14} /> Neo-Brutalist Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-gray-900 uppercase leading-[1.1]">
            Photo <span className="text-accent">Collage</span> Maker
          </h1>
          <p className="text-lg text-muted font-medium mt-4 max-w-2xl leading-relaxed">
            Gabungin banyak foto jadi 1 gambar *Aesthetic*. Bebas pilih desain Classic Grid, Acakan Polaroid, sampai gaya Klise Film jadul. Gratis 100%!
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="w-full lg:w-4/12 xl:w-3/12 space-y-6">
            
            {/* Upload Box */}
            <div className="bg-white border-4 border-foreground rounded-[2rem] p-6 shadow-[6px_6px_0_0_#000000]">
              <h2 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <Images weight="bold" /> 1. Masukin Foto
              </h2>
              
              <label className="w-full border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group min-h-[140px]">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUpload}
                />
                <div className="w-12 h-12 bg-white rounded-full border-2 border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {isProcessing ? <Spinner className="animate-spin text-accent" size={24} /> : <UploadSimple size={24} className="text-gray-400 group-hover:text-accent" />}
                </div>
                <span className="text-sm font-bold text-gray-600">Klik / Drop Banyak Foto</span>
              </label>

              {/* Thumbnails */}
              {photos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold text-gray-400 mb-2">{photos.length} Foto Siap Digabung</p>
                  <div className="flex flex-wrap gap-2">
                    {photos.map(p => (
                      <div key={p.id} className="relative group">
                        <img src={p.url} className="w-12 h-12 object-cover border-2 border-foreground rounded-lg" alt="thumb" />
                        <button 
                          onClick={() => removePhoto(p.id)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash size={12} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div className="bg-white border-4 border-foreground rounded-[2rem] p-6 shadow-[6px_6px_0_0_#000000]">
              <h2 className="font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <Palette weight="bold" /> 2. Pilih Style
              </h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setTemplate('classic')}
                  className={`w-full p-3 flex items-center gap-3 border-2 rounded-xl font-bold text-left transition-all ${template === 'classic' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-gray-500 hover:border-gray-400'}`}
                >
                  <SquaresFour size={24} weight={template === 'classic' ? 'fill' : 'regular'} />
                  Classic Grid
                </button>
                <button 
                  onClick={() => setTemplate('polaroid')}
                  className={`w-full p-3 flex items-center gap-3 border-2 rounded-xl font-bold text-left transition-all ${template === 'polaroid' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-gray-500 hover:border-gray-400'}`}
                >
                  <Images size={24} weight={template === 'polaroid' ? 'fill' : 'regular'} />
                  Brutalist Polaroid
                </button>
                <button 
                  onClick={() => setTemplate('film')}
                  className={`w-full p-3 flex items-center gap-3 border-2 rounded-xl font-bold text-left transition-all ${template === 'film' ? 'border-accent bg-accent/10 text-accent' : 'border-border text-gray-500 hover:border-gray-400'}`}
                >
                  <FilmStrip size={24} weight={template === 'film' ? 'fill' : 'regular'} />
                  Film Strip (Klise)
                </button>
              </div>

              {/* Extras */}
              <div className="mt-6 pt-6 border-t border-border space-y-4">
                {template === 'classic' && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">Jumlah Kolom: {columns}</label>
                    <input 
                      type="range" 
                      min="1" max="4" 
                      value={columns} 
                      onChange={(e) => setColumns(parseInt(e.target.value))}
                      className="w-full accent-accent"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Warna Background</label>
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Ad */}
            <div className="w-full hidden lg:block">
              <NeoAdSlot format="rectangle" />
            </div>

          </div>

          {/* RIGHT COLUMN: Preview & Download */}
          <div className="w-full lg:w-8/12 xl:w-9/12 space-y-6">
            
            {/* Canvas Container */}
            <div 
              ref={containerRef}
              className="w-full bg-surface border-4 border-dashed border-border rounded-[2.5rem] p-4 flex flex-col items-center justify-center min-h-[500px] overflow-hidden"
            >
              {photos.length === 0 ? (
                <div className="text-center opacity-30">
                  <SquaresFour size={80} className="mx-auto mb-4" />
                  <p className="font-black text-2xl uppercase">Preview Kolase</p>
                  <p className="font-bold">Upload foto dulu bre!</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                   <canvas 
                     ref={canvasRef} 
                     className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-sm border border-black/10"
                   />
                </div>
              )}
            </div>

            {/* Download Banner */}
            {photos.length > 0 && (
              <div className="bg-accent/10 border-2 border-accent p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-black uppercase text-xl text-accent">Kolase Lu Udah Jadi!</h3>
                  <p className="text-sm font-bold text-gray-600">Klik download buat simpan hasil HD (Resolusi Tinggi) ke device lu.</p>
                </div>
                <button 
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-0.5 transition-all rounded-xl flex items-center justify-center gap-2"
                >
                  <DownloadSimple size={20} weight="bold" /> Download JPG
                </button>
              </div>
            )}

            {/* Bottom Ad */}
            <div className="w-full">
              <NeoAdSlot format="horizontal" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
