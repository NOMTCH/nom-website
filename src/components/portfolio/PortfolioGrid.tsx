'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
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
      <div className="relative aspect-video w-full border-b-4 border-foreground overflow-hidden bg-black flex items-center justify-center">
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
            muted loop playsInline
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
        
        {/* Decorative Brutalist Star Vector */}
        {!item.icon && (
          <div className="absolute -top-4 -left-4 z-20 text-accent opacity-100 md:opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 transform -rotate-12 group-hover:rotate-12">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="#F7DF1E" stroke="#0F0F0F" strokeWidth="6" className="drop-shadow-[4px_4px_0_rgba(15,15,15,1)]">
               <polygon points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1 bg-surface group-hover:bg-accent group-active:bg-accent transition-colors duration-300">
        <h3 className="text-xl font-display font-black text-accent-secondary group-hover:text-white group-active:text-white mb-2 uppercase tracking-tighter">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm font-bold text-gray-600 group-hover:text-black group-active:text-black line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
      
      <div className="absolute top-4 right-4 w-10 h-10 bg-accent-secondary border-2 border-foreground flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 group-active:opacity-100 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 shadow-[2px_2px_0_0_#0F0F0F]">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
      </div>
    </>
  );

  const containerClasses = "group relative flex flex-col border-4 border-foreground overflow-hidden bg-surface shadow-[8px_8px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[4px_4px_0_0_#0F0F0F] active:translate-y-1 active:shadow-[4px_4px_0_0_#0F0F0F] cursor-pointer h-full transition-all z-10";

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
      <div className="text-center py-20 border-4 border-dashed border-foreground bg-surface">
        <h2 className="text-3xl font-black uppercase text-gray-400">No Projects Found</h2>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12 overflow-hidden"
            onClick={() => setActiveProject(null)}
          >
            <div className="absolute top-6 right-6 z-50">
              <button 
                onClick={() => setActiveProject(null)}
                className="w-12 h-12 bg-accent border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all flex items-center justify-center text-black"
              >
                <X weight="bold" size={24} />
              </button>
            </div>
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full max-w-6xl border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] bg-surface relative flex flex-col md:flex-row overflow-hidden"
            >
              {/* Sidebar Info */}
              <div className="w-full md:w-1/3 bg-surface border-b-4 md:border-b-0 md:border-r-4 border-foreground p-8 flex flex-col shrink-0 overflow-y-auto">
                <div className="mb-4">
                  <div className="w-12 h-2 bg-accent mb-4 border-2 border-foreground"></div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4">
                    {activeProject.title}
                  </h2>
                </div>
                {activeProject.description && (
                  <div className="prose prose-lg text-foreground font-bold leading-relaxed whitespace-pre-wrap">
                    {activeProject.description}
                  </div>
                )}
                {activeProject.href && activeProject.href.startsWith('http') && (
                  <div className="mt-8">
                    <a 
                      href={activeProject.href} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block py-3 px-6 bg-accent text-black font-black uppercase tracking-widest border-4 border-foreground shadow-[4px_4px_0_0_#0F0F0F] hover:bg-white hover:-translate-y-1 transition-all"
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
                  <div className="w-full aspect-video border-4 border-foreground">
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
                    <div key={mIdx} className="w-full border-4 border-foreground bg-surface">
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
                    <div className="w-full border-4 border-foreground bg-surface">
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
