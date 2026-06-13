'use client';

import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { ReactNode } from 'react';

export function JellyScroll({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Adjusted spring physics for a more rubber-band "snap" feel
  const smoothVelocity = useSpring(scrollVelocity, { damping: 30, stiffness: 300 });
  
  // Rubber Band / Squash & Stretch Effect
  // Stretches vertically and slightly squishes horizontally when scrolling fast
  const scaleY = useTransform(smoothVelocity, [-2000, 0, 2000], [1.04, 1, 1.04]);
  const scaleX = useTransform(smoothVelocity, [-2000, 0, 2000], [0.98, 1, 0.98]);

  return (
    <motion.div 
      style={{ scaleX, scaleY }} 
      className="w-full origin-center flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
}
