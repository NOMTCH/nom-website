'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Stop, SpeakerHigh } from '@phosphor-icons/react/dist/ssr';

export function AudioPlayer({ content, title }: { content: string, title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
    // Calculate reading time (avg 200 words per min)
    const words = content.split(/\s+/).length;
    setEstimatedTime(Math.max(1, Math.ceil(words / 200)));
    
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [content]);

  const togglePlay = () => {
    if (!supported) return alert("Browser lo nggak support fitur suara bre!");
    
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // Clean up markdown syntax for reading
      const cleanText = content.replace(/[#*_`>\[\]()]/g, '').slice(0, 5000);
      const utterance = new SpeechSynthesisUtterance(`${title}. ` + cleanText);
      utterance.lang = 'id-ID'; // Indonesian voice
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const stopAudio = () => {
    if (supported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!supported) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border-2 border-border rounded-2xl p-4 shadow-sm mb-12 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
          <SpeakerHigh size={20} weight="fill" />
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase text-gray-900 tracking-tight">Dengerin Artikel</h4>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimasi {estimatedTime} Menit</p>
        </div>
      </div>
      
      <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
        <button 
          onClick={togglePlay}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-foreground text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase hover:bg-gray-800 transition-colors shadow-sm"
        >
          {isPlaying && !isPaused ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          {isPlaying && !isPaused ? 'Pause Audio' : isPlaying && isPaused ? 'Lanjut' : 'Play Audio'}
        </button>
        {isPlaying && (
          <button 
            onClick={stopAudio}
            className="flex items-center justify-center w-[44px] h-[44px] bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-sm"
          >
            <Stop size={16} weight="fill" />
          </button>
        )}
      </div>
    </div>
  );
}
