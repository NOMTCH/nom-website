'use client';
import { useState } from 'react';

export function InlineTextTool() {
  const [text, setText] = useState('');
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  return (
    <div className="my-10 p-6 sm:p-8 bg-white border-4 border-foreground rounded-[2rem] shadow-[6px_6px_0_0_#000000]">
      <div className="mb-6">
        <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-accent/20">
          Interactive Try-Out
        </span>
        <h4 className="font-display font-black tracking-tight text-2xl text-gray-900 mt-4 mb-2">Coba Hitung Kata Langsung!</h4>
        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-lg">
          Daripada cuma baca teori, cobain langsung ketik teks di bawah ini. Tool ini ngitung kata secara instan tanpa loading.
        </p>
      </div>
      
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="w-full h-28 bg-gray-50 border-2 border-border rounded-xl p-4 focus:outline-none focus:border-accent font-medium text-sm text-base resize-none shadow-sm transition-colors"
        placeholder="Ketik kalimat percobaan di sini..."
      />
      
      <div className="flex flex-wrap gap-3 mt-4 text-xs font-bold text-gray-600">
        <div className="bg-white px-4 py-2 rounded-xl border-2 border-border shadow-sm flex gap-2">
          Jumlah Kata: <span className="text-accent font-black">{words}</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border-2 border-border shadow-sm flex gap-2">
          Karakter: <span className="text-accent font-black">{text.length}</span>
        </div>
      </div>
    </div>
  );
}
