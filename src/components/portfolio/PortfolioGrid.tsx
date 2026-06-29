'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';

export interface GridItem {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  mediaType?: 'image' | 'video';
  mediaItems?: { url: string; type: string }[];
  href: string;
  icon?: string;
}

function PortfolioCard({ item, idx, onClick, disableModal }: { item: GridItem; idx: number, onClick: (item: GridItem) => void, disableModal?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (item.mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  };

  const handleMouseLeave = () => {
    if (item.mediaType === 'video' && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disableModal) {
      return;
    }
    e.preventDefault();
    onClick(item);
  };

  const innerContent = (
    <>
      <div className="relative aspect-video w-full border-b border-border overflow-hidden bg-black flex items-center justify-center">
        {item.icon ? (
          <>
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:16px_16px] z-10" />
            <img src={item.icon} alt={item.title} className="w-24 h-24 object-contain transform transition-all duration-700 group-hover:scale-125 group-hover:-rotate-12 z-20" />
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-accent transition-colors duration-300 pointer-events-none z-30" />
          </>
        ) : item.mediaType === 'video' ? (
          <video 
            ref={videoRef}
            src={item.coverImage} 
            autoPlay muted loop playsInline
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-active:grayscale-0 group-hover:opacity-100 group-active:opacity-100 group-hover:scale-105 group-active:scale-105 transition-all duration-700"
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:grayscale-0 group-active:grayscale-0 group-hover:opacity-100 group-active:opacity-100 group-hover:scale-105 group-active:scale-105 transition-all duration-700"
            style={{ backgroundImage: `url('${item.coverImage}')` }}
          />
        )}

        {/* Brutalist Vector Halftone Overlay (Only for images/videos) */}
        {!item.icon && (
          <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:10px_10px] group-hover:opacity-0 transition-opacity duration-500 z-10" />
        )}
        
      </div>
      
      <div className="p-6 flex flex-col flex-1 bg-white transition-colors duration-300">
        <h3 className="text-xl font-display font-black text-gray-900 group-hover:text-accent transition-colors duration-300 mb-2 uppercase tracking-tight">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs font-semibold text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
      
      <div className="absolute top-4 right-4 w-10 h-10 bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 group-active:opacity-100 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 shadow-sm">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
      </div>
    </>
  );

  const containerClasses = "group relative flex flex-col border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full z-10";

  if (disableModal) {
    return (
      <Link href={item.href} className="block cursor-pointer h-full">
        <motion.div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className={containerClasses}
        >
          {innerContent}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className={containerClasses}
    >
      {innerContent}
    </motion.div>
  );
}

export function PortfolioGrid({ items, disableModal = false }: { items: GridItem[], disableModal?: boolean }) {
  const [activeProject, setActiveProject] = useState<GridItem | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeProject]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gray-200 bg-white rounded-3xl">
        <h2 className="text-2xl font-display font-black uppercase text-gray-400">No Projects Found</h2>
      </div>
    );
  }

  // Function to convert regular youtube URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <PortfolioCard key={item.id} item={item} idx={idx} onClick={setActiveProject} disableModal={disableModal} />
        ))}
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-12 overflow-hidden"
            onClick={() => setActiveProject(null)}
          >
            <div className="absolute top-6 right-6 z-50">
              <button 
                onClick={() => setActiveProject(null)}
                className="w-10 h-10 bg-white border border-gray-200/80 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center text-gray-600 cursor-pointer"
              >
                <X weight="bold" size={20} />
              </button>
            </div>
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full max-w-6xl border border-gray-100 shadow-xl rounded-3xl bg-white relative flex flex-col md:flex-row overflow-hidden"
            >
              {/* Sidebar Info */}
              <div className="w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-8 flex flex-col shrink-0 overflow-y-auto">
                <div className="mb-4">
                  <div className="w-12 h-1 bg-accent mb-4 rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-gray-900 mb-4">
                    {activeProject.title}
                  </h2>
                </div>
                {activeProject.description && (
                  <div className="text-sm font-semibold text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {activeProject.description}
                  </div>
                )}
                {activeProject.href && activeProject.href.startsWith('http') && (
                  <div className="mt-8">
                    <a 
                      href={activeProject.href} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block py-2.5 px-5 bg-gray-900 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm hover:bg-gray-800 transition-all"
                    >
                      Visit External Link
                    </a>
                  </div>
                )}
              </div>

              {/* Gallery / Media List */}
              <div className="w-full md:w-2/3 flex-1 bg-black overflow-y-auto custom-scrollbar p-6 space-y-6">
                
                {/* External Video First if exists */}
                {activeProject.href && activeProject.href.startsWith('http') && (
                  <div className="w-full aspect-video border border-border rounded-2xl">
                    <iframe 
                      src={getEmbedUrl(activeProject.href)} 
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Display Media Items */}
                {activeProject.mediaItems && activeProject.mediaItems.length > 0 ? (
                  activeProject.mediaItems.map((media, mIdx) => (
                    <div key={mIdx} className="w-full border border-border rounded-2xl bg-surface">
                      {media.type === 'video' ? (
                        <video 
                          src={media.url} 
                          controls
                          className="w-full h-auto object-contain max-h-[80vh]"
                        />
                      ) : (
                        <img 
                          src={media.url} 
                          alt={`${activeProject.title} media ${mIdx + 1}`}
                          className="w-full h-auto object-contain max-h-[80vh]"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  // Fallback to cover image if no media items but also no href video
                  !(activeProject.href && activeProject.href.startsWith('http')) && (
                    <div className="w-full border border-border rounded-2xl bg-surface">
                      {activeProject.mediaType === 'video' ? (
                        <video 
                          src={activeProject.coverImage} 
                          controls
                          className="w-full h-auto object-contain max-h-[80vh]"
                        />
                      ) : (
                        <img 
                          src={activeProject.coverImage} 
                          alt={activeProject.title}
                          className="w-full h-auto object-contain max-h-[80vh]"
                        />
                      )}
                    </div>
                  )
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
