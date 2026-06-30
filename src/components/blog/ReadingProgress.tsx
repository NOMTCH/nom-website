'use client';
import { useState, useEffect } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress((scrollY / docHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-2 bg-accent z-[100] transition-all duration-150 ease-out shadow-[0_2px_10px_rgba(175,82,222,0.5)]" 
      style={{ width: `${progress}%` }} 
    />
  );
}
