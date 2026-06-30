'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TextT, 
  Copy, 
  Check, 
  Trash, 
  Clock, 
  BookOpen, 
  ArrowCounterClockwise,
  ListNumbers,
  FileText,
  Info,
  Image as ImageIcon
} from "@phosphor-icons/react";
import { NeoAdSlot } from '@/components/blog/NeoAdSlot';

export default function TextToolPage() {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Statistics calculations
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  
  const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = wordsArray.length;
  
  const paragraphCount = text.split(/\n+/).filter(para => para.trim().length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  
  // Average reading speed: 200 words per minute
  const readingTime = Math.ceil(wordCount / 200);

  // Case Conversion Functions
  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const handleTitleCase = () => {
    const titleCased = text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setText(titleCased);
  };

  const handleSentenceCase = () => {
    // Capitalize first letter of each sentence
    const sentenceCased = text
      .toLowerCase()
      .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, g1, g2) => g1 + g2.toUpperCase());
    setText(sentenceCased);
  };

  const handleSlugify = () => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    setText(slug.trim());
  };

  const handleRemoveExtraSpaces = () => {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    setText(cleaned);
  };

  const handleClear = () => {
    setText('');
    if (textAreaRef.current) textAreaRef.current.focus();
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-28 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted hover:text-accent mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase">NOM-TEXT TOOL</h1>
          <p className="text-muted font-bold mt-2">Alat bantu hitung kata, karakter, paragraf, dan ubah format teks instan untuk tugas sekolah, kuliah, atau artikel SEO.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Input & Action Buttons */}
          <div className="w-full lg:w-8/12 space-y-6">
            
            {/* Input Card */}
            <div className="bg-surface border-4 border-foreground p-6 rounded-[2rem] shadow-[6px_6px_0_0_#000000]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <TextT size={24} weight="bold" /> Input Teks
                </h2>
                {text && (
                  <button 
                    onClick={handleClear}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase text-red-500 hover:text-white bg-red-50 border border-red-200 hover:bg-red-500 hover:border-red-500 rounded-xl transition-all"
                  >
                    <Trash size={16} weight="bold" /> Clear
                  </button>
                )}
              </div>

              <textarea
                ref={textAreaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ketik atau paste teks tugas/artikel kamu di sini bre..."
                className="w-full h-80 bg-white border-2 border-foreground rounded-2xl p-5 focus:outline-none focus:ring-4 focus:ring-accent font-medium text-base resize-none shadow-inner"
              />

              {/* Conversion Buttons Panel */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">Format & Transform Teks</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleUppercase}
                    disabled={!text}
                    className="px-4 py-2.5 bg-white border border-border text-foreground hover:border-accent font-bold uppercase text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                  >
                    UPPERCASE
                  </button>
                  <button
                    onClick={handleLowercase}
                    disabled={!text}
                    className="px-4 py-2.5 bg-white border border-border text-foreground hover:border-accent font-bold uppercase text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                  >
                    lowercase
                  </button>
                  <button
                    onClick={handleTitleCase}
                    disabled={!text}
                    className="px-4 py-2.5 bg-white border border-border text-foreground hover:border-accent font-bold uppercase text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                  >
                    Title Case
                  </button>
                  <button
                    onClick={handleSentenceCase}
                    disabled={!text}
                    className="px-4 py-2.5 bg-white border border-border text-foreground hover:border-accent font-bold uppercase text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                  >
                    Sentence Case
                  </button>
                  <button
                    onClick={handleSlugify}
                    disabled={!text}
                    className="px-4 py-2.5 bg-white border border-border text-foreground hover:border-accent font-bold uppercase text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                    title="Ubah kalimat jadi format slug link URL"
                  >
                    Format URL Slug
                  </button>
                  <button
                    onClick={handleRemoveExtraSpaces}
                    disabled={!text}
                    className="px-4 py-2.5 bg-white border border-border text-foreground hover:border-accent font-bold uppercase text-xs rounded-xl shadow-xs transition-all disabled:opacity-40"
                    title="Hapus spasi ganda yang berlebih"
                  >
                    Bersihkan Spasi Ganda
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Copy Output Bar */}
            {text && (
              <div className="bg-[#FFD700] p-6 border-4 border-foreground rounded-[2rem] shadow-[6px_6px_0_0_#000000] flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white border border-foreground rounded-2xl">
                    <Check size={28} weight="bold" className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-sm">Hasil Siap Digunakan!</h4>
                    <p className="text-xs text-black/70 font-bold mt-0.5">Ubah format teks selesai. Klik tombol di samping untuk menyalin.</p>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-foreground font-black uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-0.5 transition-all text-center rounded-xl flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                  {copied ? 'Copied!' : 'Salin Teks'}
                </button>
              </div>
            )}

            {/* AdSense Placeholder Banner (Under Editor) */}
            <div className="w-full">
              <NeoAdSlot format="horizontal" />
            </div>

          </div>

          {/* RIGHT COLUMN: Statistics Dashboard */}
          <div className="w-full lg:w-4/12 space-y-6">
            
            {/* Dashboard Stats */}
            <div className="bg-surface border border-border p-6 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                <ListNumbers size={24} weight="bold" /> Statistik Teks
              </h2>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Words Card */}
                <div className="bg-white border border-border p-4 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Kata</span>
                  <span className="text-3xl font-display font-black block mt-1 text-foreground">{wordCount}</span>
                </div>

                {/* Characters With Spaces Card */}
                <div className="bg-white border border-border p-4 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Karakter</span>
                  <span className="text-3xl font-display font-black block mt-1 text-foreground">{charCountWithSpaces}</span>
                </div>

                {/* Characters No Spaces */}
                <div className="bg-white border border-border p-4 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Tanpa Spasi</span>
                  <span className="text-3xl font-display font-black block mt-1 text-foreground">{charCountNoSpaces}</span>
                </div>

                {/* Paragraphs */}
                <div className="bg-white border border-border p-4 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Paragraf</span>
                  <span className="text-3xl font-display font-black block mt-1 text-foreground">{paragraphCount}</span>
                </div>

                {/* Sentences */}
                <div className="bg-white border border-border p-4 rounded-2xl shadow-xs col-span-2">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Jumlah Kalimat</span>
                  <span className="text-3xl font-display font-black block mt-1 text-foreground">{sentenceCount}</span>
                </div>

              </div>
            </div>

            {/* Reading Time Card */}
            <div className="bg-white border-2 border-foreground p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center shrink-0">
                <Clock size={28} className="text-black" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Estimasi Waktu Baca</span>
                <span className="text-lg font-black uppercase tracking-tight text-foreground mt-0.5">
                  ~ {readingTime} {readingTime <= 1 ? 'Menit' : 'Menit'}
                </span>
                <p className="text-[10px] text-muted font-bold mt-0.5">Berdasarkan rata-rata 200 kata/menit.</p>
              </div>
            </div>

            {/* AdSense Sidebar Slot */}
            <div className="w-full">
              <NeoAdSlot format="rectangle" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
