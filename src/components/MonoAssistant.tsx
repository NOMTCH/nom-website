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
    <div className="print:hidden fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[999] flex flex-col items-end">
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 bg-white border border-border shadow-[0_12px_24px_rgba(0,0,0,0.08)] px-5 py-3.5 rounded-2xl relative"
          >
            <p className="text-sm font-bold text-foreground">
              Ada project seru? Ngobrol yuk! 🚀
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-border transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={handleWA}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#25D366] text-white rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_16px_32px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Soft highlight on hover */}
        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <WhatsappLogo weight="fill" className="relative z-10 w-8 h-8 md:w-10 md:h-10" />
        
        {/* Continuous Pulse effect */}
        <span className="absolute inset-0 rounded-full border-[3px] border-[#25D366] animate-ping opacity-30" style={{ animationDuration: '2s' }}></span>
      </button>
    </div>
  );
}
