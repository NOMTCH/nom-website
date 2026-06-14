'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import Lottie to prevent SSR hydration errors
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import catAnimation from '../../public/assets/lottie/mono-cat.json';

export function MonoAssistant() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname() || '';

  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const catSoundRef = useRef<HTMLAudioElement | null>(null);

  const isCVGenerator = pathname.includes('/cv-generator');
  const isAdmin = pathname.includes('/admin');

  const triggerTooltip = () => {
    setShowTooltip(true);
    
    // Play pop sound immediately
    if (popSoundRef.current) {
      popSoundRef.current.volume = 0.5;
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {}); // catch block in case browser blocks autoplay
    }

    // Play cat meow shortly after
    setTimeout(() => {
      if (catSoundRef.current) {
        catSoundRef.current.volume = 0.6;
        catSoundRef.current.currentTime = 0;
        catSoundRef.current.play().catch(() => {});
      }
    }, 300);
  };

  useEffect(() => {
    setIsClient(true);

    // Show tooltip automatically after 5 seconds to grab attention
    const timer = setTimeout(() => {
      triggerTooltip();
    }, 5000);
    return () => clearTimeout(timer);
  }, [pathname]); // Reset timer when route changes

  const handleWA = () => {
    let text = 'Halo%20min,%20aku%20ada%20project%20seru%20nih,%20bisa%20bantu%20kerjain?%20%F0%9F%90%BE';
    if (isCVGenerator) {
      text = 'Halo%20min,%20aku%20bingung%20bikin%20CV%20nih,%20tolong%20bantuin%20dong!%20%F0%9F%90%BE';
    } else if (isAdmin) {
      text = 'Ampun%20Bos%20MONO!%20Saya%20akan%20kerja%20lebih%20keras%20lagi!%20%F0%9F%99%8F%E2%80%8D%E2%99%82%EF%B8%8F';
    }
    window.open(`https://wa.me/6282130704794?text=${text}`, '_blank');
  };

  if (!isClient) return null;

  const chatMessage = isAdmin
    ? "Meow! 🐾 Kerja yang bener, jangan ngasal biar cuan! Bos ngawasin lho! 💸"
    : isCVGenerator
    ? "Meow! 🐾 Bingung bikin CV? WA babuku aja ntar dia bantuin autopilot! 🚀"
    : "Meow! 🐾 Ada project seru? WA babuku aja ntar dia balasin chat lho! 🚀";

  return (
    <div className="fixed -bottom-4 right-2 sm:-bottom-6 sm:right-6 z-[999] flex flex-col items-end pointer-events-none">
      <audio ref={popSoundRef} src="/assets/Sound/pop.wav" preload="auto" />
      <audio ref={catSoundRef} src="/assets/Sound/cat.wav" preload="auto" />

      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="-mb-8 sm:-mb-10 md:-mb-14 mr-4 sm:mr-10 md:mr-16 bg-white border-2 border-foreground shadow-[4px_4px_0_0_#0F0F0F] p-2.5 sm:p-3 max-w-[160px] sm:max-w-[220px] relative pointer-events-auto z-10"
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }} 
              className="absolute top-1 right-2 text-gray-400 hover:text-black font-bold"
            >
              &times;
            </button>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-800 leading-relaxed pr-2">
              {chatMessage}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 sm:right-12 w-3 sm:w-4 h-3 sm:h-4 bg-white border-b-2 border-r-2 border-foreground transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={handleWA}
        onMouseEnter={() => {
          if (!showTooltip) triggerTooltip();
        }}
        className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 relative cursor-pointer hover:scale-105 transition-transform pointer-events-auto origin-bottom z-20"
      >
        <Lottie animationData={catAnimation} loop={true} style={{ width: '100%', height: '100%' }} />
      </button>
    </div>
  );
}
