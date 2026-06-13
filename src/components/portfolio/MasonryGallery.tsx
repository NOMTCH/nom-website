'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Photo } from '@/lib/data/portfolio';

export function MasonryGallery({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img 
              src={photo.url} 
              alt={photo.alt} 
              className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.alt}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
