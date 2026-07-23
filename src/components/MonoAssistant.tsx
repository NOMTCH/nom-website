'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { WhatsappLogo } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

export function MonoAssistant() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const handleWA = () => {
    const text = 'Halo%20min,%20aku%20ada%20project%20seru%20nih,%20bisa%20bantu%20kerjain?%20%F0%9F%90%BE';
    window.open(`https://wa.me/6282130704794?text=${text}`, '_blank');
  };

  // Only show on home page or other specific pages if needed
  if (pathname !== '/') return null;

  return (
    <div className="print:hidden fixed bottom-5 md:bottom-8 right-5 md:right-8 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 bg-surface border border-border shadow-xl px-4 py-2.5 rounded-2xl relative"
          >
            <p className="text-xs font-bold text-foreground whitespace-nowrap">
              Ada project? Chat yuk! 🚀
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-surface border-b border-r border-border transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={handleWA}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-accent text-white rounded-full shadow-[0_6px_20px_rgba(78,159,61,0.4)] hover:shadow-[0_10px_28px_rgba(78,159,61,0.6)] hover:scale-105 transition-all duration-200 cursor-pointer border border-white/20"
        title="Chat via WhatsApp"
      >
        <WhatsappLogo weight="fill" className="relative z-10 w-6 h-6 md:w-7 md:h-7" />
      </button>
    </div>
  );
}
