'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion';
import { EnvelopeSimpleOpen, MapPin, Gift, MusicNote, Pause, Heart, CheckCircle, House, Users, Calendar, Images, Envelope, CalendarPlus, VideoCamera, TShirt, Copy, QrCode, Bank, X } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');
  .font-cursive { font-family: 'Great Vibes', cursive; }
  .font-serif-lux { font-family: 'Cormorant Garamond', serif; }
  .font-sans-lux { font-family: 'Montserrat', sans-serif; }
  .lux-scroll { scroll-behavior: smooth; }
  @keyframes shimmer { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
  .gold-shimmer { animation: shimmer 3s ease-in-out infinite; }
  .lux-float { animation: float 6s ease-in-out infinite; }
`;

export interface InvitationData {
  groom: { name: string; fullName: string; parents: string; photo: string };
  bride: { name: string; fullName: string; parents: string; photo: string };
  date: string;
  ceremony: { time: string; location: string; address: string; mapUrl: string };
  reception: { time: string; location: string; address: string; mapUrl: string };
  quote?: string;
  musicUrl?: string;
  gallery?: string[];
  story?: { year: string; title: string; desc: string }[];
  wishes?: { name: string; wish: string; time: string }[];
  gifts?: { type: 'bank' | 'qris'; bankName: string; accountName: string; accountNo: string; qrisImg?: string }[];
  dressCode?: { colors: string[]; description: string };
  liveStream?: { platform: string; url: string; time: string };
}

export const DEFAULT_DUMMY_DATA: InvitationData = {
  groom: { 
    name: 'Romeo', fullName: 'Romeo Montague', parents: 'Putra dari Bpk. Montague & Ibu Montague',
    photo: '/assets/photo/Elegant/1/pexels-tr-n-long-3093985-14348502.jpg'
  },
  bride: { 
    name: 'Juliet', fullName: 'Juliet Capulet', parents: 'Putri dari Bpk. Capulet & Ibu Capulet',
    photo: '/assets/photo/Elegant/1/pexels-tr-n-long-3093985-14348505.jpg'
  },
  date: 'Sabtu, 20 Desember 2026',
  ceremony: { time: '09:00 - 10:00 WIB', location: 'Masjid Agung Al-Ikhlas', address: 'Jl. Soekarno Hatta No. 1', mapUrl: '#' },
  reception: { time: '18:00 - Selesai', location: 'Grand Ballroom eL Hotel Royale', address: 'Jl. Merdeka No. 2', mapUrl: '#' },
  quote: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri..."\n\n— QS. Ar-Rum: 21',
  musicUrl: '/assets/music/wedding-day.mp3', // Make sure the MP3 is placed in public/assets/music/
  gallery: [
    '/assets/photo/Elegant/1/pexels-tr-n-long-3093985-14348470.jpg',
    '/assets/photo/Elegant/1/pexels-tr-n-long-3093985-14348497.jpg',
    '/assets/photo/Elegant/1/pexels-tr-n-long-3093985-14348502.jpg',
    '/assets/photo/Elegant/1/pexels-tr-n-long-3093985-14348505.jpg'
  ],
  story: [
    { year: '2020', title: 'Awal Perjumpaan', desc: 'Sebuah ketidaksengajaan di sudut kafe tua saat hujan turun lebat.' },
    { year: '2023', title: 'Ikatan Janji', desc: 'Di hadapan keluarga tercinta, kami menautkan hati untuk merajut masa depan bersama.' }
  ],
  wishes: [
    { name: 'Caca', wish: 'Happy wedding Kania & Bagas ❤️', time: '1 jam lalu' }
  ],
  gifts: [
    { type: 'bank', bankName: 'BCA', accountName: 'Romeo Montague', accountNo: '1234567890' },
    { type: 'qris', bankName: 'QRIS', accountName: 'Juliet Capulet', accountNo: '-', qrisImg: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' }
  ],
  dressCode: {
    colors: ['#D4AF37', '#8B7355', '#FAFAFA', '#2C2C2C'],
    description: 'Untuk keselarasan acara, kami merekomendasikan tamu undangan mengenakan pakaian dengan sentuhan warna di atas.'
  },
  liveStream: { platform: 'YouTube', url: 'https://youtube.com', time: 'Akad Nikah - 09:00 WIB' }
};

// ==========================================
// GOLD PARTICLES (Floating Luxury Dust)
// ==========================================
const GoldParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: `${8 + (i * 7.5) % 88}%`,
    y: `${10 + (i * 13) % 80}%`,
    size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
    duration: 4 + (i % 4) * 1.5,
    delay: (i * 0.4) % 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            backgroundColor: 'var(--inv-primary)',
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

// ==========================================
// ART DECO CORNER (Thin Geometric Lines)
// ==========================================
const ArtDecoCorner = ({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const getStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', width: 80, height: 80, pointerEvents: 'none', zIndex: 1 };
    switch (position) {
      case 'top-left':     return { ...base, top: 16, left: 16 };
      case 'top-right':    return { ...base, top: 16, right: 16, transform: 'scaleX(-1)' };
      case 'bottom-left':  return { ...base, bottom: 16, left: 16, transform: 'scaleY(-1)' };
      case 'bottom-right': return { ...base, bottom: 16, right: 16, transform: 'scale(-1)' };
    }
  };

  return (
    <motion.svg
      viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={getStyle()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-20px' }}
    >
      {/* Outer L-shape — self drawing */}
      <motion.path
        d="M4,60 L4,4 L60,4"
        stroke="var(--inv-primary)" strokeWidth="0.8" fill="none"
        variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      {/* Inner L-shape */}
      <motion.path
        d="M12,52 L12,12 L52,12"
        stroke="var(--inv-primary)" strokeWidth="0.4" fill="none" opacity="0.6"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeInOut' }}
      />
      {/* Corner diamond */}
      <motion.rect
        x="1.5" y="1.5" width="5" height="5"
        stroke="var(--inv-primary)" strokeWidth="0.8" fill="none"
        transform="rotate(45 4 4)"
        variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.4, delay: 1.0 }}
      />
      {/* End ticks */}
      <motion.line x1="4" y1="60" x2="10" y2="60" stroke="var(--inv-primary)" strokeWidth="0.8"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.line x1="60" y1="4" x2="60" y2="10" stroke="var(--inv-primary)" strokeWidth="0.8"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
    </motion.svg>
  );
};

// ==========================================
// PARALLAX IMAGE COMPONENT
// ==========================================
const ParallaxImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track this specific element's position in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Map scroll progress to a Y translation (moves opposite to scroll direction)
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div 
        className="absolute w-full"
        style={{ y, height: '140%', top: '-20%' }}
      >
        <Image src={src} alt={alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" sizes="(max-width: 768px) 100vw, 50vw" />
      </motion.div>
    </div>
  );
};

// ==========================================
// LETTER REVEAL COMPONENT
// ==========================================
const LetterReveal = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => (
  <motion.span
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false }}
    style={{ display: 'inline-block' }}
  >
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        variants={{
          hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
          visible: { opacity: 1, y: 0, filter: 'blur(0px)',
            transition: { duration: 0.5, delay: delay + i * 0.04, ease: [0.25, 1, 0.5, 1] }
          }
        }}
        style={{ display: 'inline-block', whiteSpace: 'pre' }}
      >
        {char}
      </motion.span>
    ))}
  </motion.span>
);

// ==========================================
// LIGHTBOX GALLERY
// ==========================================
const Lightbox = ({ images, index, onClose, onPrev, onNext }: {
  images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrev, onNext, onClose]);

  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 50) onNext();
    if (diff < -50) onPrev();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white z-10 transition-colors">
        <X size={32} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors text-4xl font-light px-4 py-8">‹</button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors text-4xl font-light px-4 py-8">›</button>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.35 }}
          className="relative w-full h-full max-w-2xl max-h-[85vh] mx-8"
          onClick={e => e.stopPropagation()}
        >
          <Image src={images[index]} alt="Gallery" fill className="object-contain" sizes="100vw" />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest">{index + 1} / {images.length}</p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
const ScrollProgressBar = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left"
      style={{ scaleX, backgroundColor: 'var(--inv-primary)' }}
    />
  );
};

// ==========================================
// TOUCH RIPPLE
// ==========================================
const TouchRipple = ({ ripples }: { ripples: { id: number; x: number; y: number }[] }) => (
  <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
    {ripples.map(r => (
      <motion.div
        key={r.id}
        className="absolute rounded-full border"
        style={{ left: r.x - 4, top: r.y - 4, width: 8, height: 8, borderColor: 'var(--inv-primary)' }}
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 18, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    ))}
  </div>
);
export function InvitationEngine({ 
  themeId = 'classic-gold',
  invitationData,
  invitationId
}: { 
  themeId?: string,
  invitationData?: InvitationData,
  invitationId?: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [copiedNo, setCopiedNo] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [rsvpStep, setRsvpStep] = useState(0);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttend, setRsvpAttend] = useState<'hadir'|'tidak'|''>('');
  const [rsvpWish, setRsvpWish] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [confetti, setConfetti] = useState<{id:number;x:number;color:string;rotate:number;delay:number;duration:number}[]>([]);
  const [activeGift, setActiveGift] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rippleId = useRef(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const leftPanelScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const leftPanelY = useTransform(scrollYProgress, [0, 1], ['-2%', '8%']);

  const data = invitationData || DEFAULT_DUMMY_DATA;
  const [wishes, setWishes] = useState<{name: string, wish: string, time: string}[]>(data.wishes || []);

  // Fetch RSVP Wishes
  useEffect(() => {
    if (!invitationId) return;
    const fetchWishes = async () => {
      const { data: rsvps, error } = await supabase
        .from('rsvp_responses')
        .select('name, wish, created_at')
        .eq('invitation_id', invitationId)
        .not('wish', 'is', null)
        .order('created_at', { ascending: false });

      if (rsvps && !error) {
        setWishes(rsvps.map(r => ({
          name: r.name,
          wish: r.wish || '',
          time: new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        })));
      }
    };
    fetchWishes();
  }, [invitationId]);

  // Gyroscope Tilt Parallax
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const x = Math.max(-15, Math.min(15, e.gamma || 0));
      const y = Math.max(-15, Math.min(15, (e.beta || 0) - 45));
      setTilt({ x, y });
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Countdown Timer
  useEffect(() => {
    const parseDate = () => {
      const months: Record<string, number> = { Januari:0,Februari:1,Maret:2,April:3,Mei:4,Juni:5,Juli:6,Agustus:7,September:8,Oktober:9,November:10,Desember:11 };
      const cleaned = data.date.replace(/^[^,]+,\s*/, '').trim();
      const parts = cleaned.split(' ');
      const day = parseInt(parts[0]);
      const month = months[parts[1]] ?? 0;
      const year = parseInt(parts[2]);
      if (isNaN(day) || isNaN(year)) return null;
      return new Date(year, month, day);
    };
    const target = parseDate();
    const tick = () => {
      if (!target) return;
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        // Wedding day has arrived!
        setCountdown({ days: -1, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data.date]);

  // Touch Ripple Handler
  const handleTouchRipple = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
    const id = rippleId.current++;
    setRipples(prev => [...prev, { id, ...pos }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
  }, []);

  useEffect(() => {
    if (data.musicUrl) {
      audioRef.current = new Audio(data.musicUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [data.musicUrl]);

  const handleOpen = () => {
    setIsOpen(true);
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const handleRsvpSubmit = async () => {
    if (!rsvpName.trim() || !rsvpAttend) return;
    
    // Save to Supabase
    if (invitationId) {
      await supabase.from('rsvp_responses').insert({
        invitation_id: invitationId,
        name: rsvpName,
        attendance: rsvpAttend,
        wish: rsvpWish,
      });
      // Add to local state immediately for UI response
      if (rsvpWish.trim()) {
        setWishes([{ name: rsvpName, wish: rsvpWish, time: 'Baru saja' }, ...wishes]);
      }
    }

    setRsvpSubmitted(true);
    if (navigator.vibrate) navigator.vibrate([20, 10, 20, 10, 40]);
    // Spawn gold confetti
    const colors = ['#D4AF37','#F5E27A','#C9A227','#FFD700','#FFFFFF'];
    setConfetti(Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      color: colors[i % colors.length],
      rotate: Math.random() * 360,
      delay: Math.random() * 0.8,
      duration: 2.5 + Math.random(),
    })));
  };

  const toggleAudio = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNo(text);
    setTimeout(() => setCopiedNo(''), 2000);
  };

  // --- CSS VARIABLES MAPPING (Decoupled Theming) ---
  const getThemeVariables = () => {
    switch (themeId) {
      case 'brutalist-bold':
        return {
          '--inv-bg': '#F7DF1E',
          '--inv-text': '#000000',
          '--inv-primary': '#000000',
          '--inv-accent': '#FF6138',
          '--inv-surface': '#FFFFFF',
        } as React.CSSProperties;
      case 'minimalist-sage':
        return {
          '--inv-bg': '#F2F5F3',
          '--inv-text': '#2C3E35',
          '--inv-primary': '#2C3E35',
          '--inv-accent': '#6B8E7B',
          '--inv-surface': '#FFFFFF',
        } as React.CSSProperties;
      case 'classic-gold':
      default:
        return {
          '--inv-bg': '#FAFAFA',
          '--inv-text': '#2C2C2C',
          '--inv-primary': '#D4AF37', // Gold
          '--inv-accent': '#8B7355',  // Brownish gold
          '--inv-surface': '#FFFFFF',
        } as React.CSSProperties;
    }
  };

  const blurReveal = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } }
  };

  const hasGallery = data.gallery && data.gallery.length > 0;
  const hasStory = data.story && data.story.length > 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      <TouchRipple ripples={ripples} />
      <div 
        className="relative w-full h-[100dvh] overflow-hidden font-sans-lux"
        onMouseDown={handleTouchRipple}
        onTouchStart={handleTouchRipple}
        style={{
          ...getThemeVariables(),
          backgroundColor: 'var(--inv-bg)',
          color: 'var(--inv-text)'
        }}
      >
        <ScrollProgressBar scrollYProgress={scrollYProgress} />
        
        {/* ================= COVER OVERLAY ================= */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: 'var(--inv-bg)' }}
            >
              {/* Ken Burns Cover Image */}
              {hasGallery && (
                <motion.div
                  className="absolute inset-0 opacity-25"
                  animate={{ scale: [1.05, 1.25], x: [0, -30] }}
                  transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                >
                  <Image src={data.gallery![0]} alt="Cover Background" fill className="object-cover object-center" priority sizes="100vw" />
                </motion.div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--inv-bg)] via-transparent to-[var(--inv-bg)] opacity-80"></div>

              {/* Art Deco Corners on Cover */}
              <ArtDecoCorner position="top-left" />
              <ArtDecoCorner position="top-right" />
              <ArtDecoCorner position="bottom-left" />
              <ArtDecoCorner position="bottom-right" />
              <GoldParticles />

              {/* Cover Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="relative z-10 text-center max-w-lg w-full px-8 py-16 backdrop-blur-sm bg-[var(--inv-bg)]/40 border border-[var(--inv-primary)]/20 shadow-2xl"
              >
                <p className="uppercase tracking-[0.4em] text-xs mb-8 font-light" style={{ color: 'var(--inv-accent)' }}>The Wedding Of</p>
                <h1 className="font-cursive text-6xl md:text-7xl mb-4 leading-none" style={{ color: 'var(--inv-text)' }}>
                  <LetterReveal text={data.groom.name} delay={0.3} />
                  <span className="block text-4xl font-serif-lux italic font-light my-2" style={{ color: 'var(--inv-primary)' }}>&</span>
                  <LetterReveal text={data.bride.name} delay={0.6} />
                </h1>
                
                <div className="w-px h-16 mx-auto my-8 opacity-50" style={{ backgroundColor: 'var(--inv-primary)' }}></div>
                
                <p className="font-serif-lux text-xl italic tracking-widest mb-12">{data.date}</p>

                <div className="mb-12">
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--inv-accent)' }}>Kepada Yth.</p>
                  <p className="font-serif-lux text-2xl font-semibold">Tamu Spesial</p>
                </div>

                <button 
                  onClick={handleOpen}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 overflow-hidden rounded-sm transition-all bg-[var(--inv-text)] text-[var(--inv-bg)] hover:scale-105"
                >
                  <EnvelopeSimpleOpen size={20} className="font-light group-hover:-translate-y-1 transition-transform" />
                  <span className="uppercase tracking-[0.2em] text-xs font-medium">Buka Undangan</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* ================= MAIN ENGINE ================= */}
        <div className="flex w-full h-full">
          
          {/* LEFT PANEL (PC STICKY IMAGE) */}
          <div className="hidden lg:block relative w-1/2 h-full overflow-hidden bg-black">
            {hasGallery && (
              <motion.div 
                className="absolute w-full h-[120%] -top-[10%] opacity-80"
                style={{ 
                  scale: leftPanelScale,
                  y: leftPanelY 
                }}
              >
                <Image src={data.gallery![1] || data.gallery![0]} alt="Hero Background" fill className="object-cover object-center" priority sizes="50vw" />
              </motion.div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>
            
            {/* Art Deco on Left Panel */}
            <ArtDecoCorner position="top-left" />
            <ArtDecoCorner position="bottom-right" />
            <GoldParticles />

            <div className="absolute bottom-16 left-0 right-0 text-center text-white z-10 px-12">
               <p className="uppercase tracking-[0.5em] text-xs mb-6" style={{ color: 'var(--inv-primary)' }}>The Wedding Of</p>
               <h2 className="font-cursive text-7xl md:text-8xl mb-2 drop-shadow-lg">{data.groom.name} & {data.bride.name}</h2>
               <p className="font-serif-lux text-2xl italic tracking-widest opacity-90">{data.date}</p>
            </div>
          </div>

          {/* RIGHT PANEL (SCROLLING CONTENT) */}
          <div ref={scrollRef} className="w-full lg:w-1/2 h-full overflow-y-auto lux-scroll relative pb-32">
            
            {/* FLOATING BOTTOM NAV */}
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-3/4 z-50 bg-[var(--inv-surface)]/80 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--inv-primary)]/20 px-6 py-3 flex items-center gap-6"
                >
                  <a href="#home" className="text-[var(--inv-text)] hover:text-[var(--inv-primary)] transition-colors"><House size={22} weight="light" /></a>
                  <a href="#couple" className="text-[var(--inv-text)] hover:text-[var(--inv-primary)] transition-colors"><Users size={22} weight="light" /></a>
                  <a href="#event" className="text-[var(--inv-text)] hover:text-[var(--inv-primary)] transition-colors"><Calendar size={22} weight="light" /></a>
                  {hasGallery && <a href="#gallery" className="text-[var(--inv-text)] hover:text-[var(--inv-primary)] transition-colors"><Images size={22} weight="light" /></a>}
                  <a href="#rsvp" className="text-[var(--inv-text)] hover:text-[var(--inv-primary)] transition-colors"><Envelope size={22} weight="light" /></a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Audio Toggle */}
            <AnimatePresence>
              {isOpen && data.musicUrl && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}
                  onClick={toggleAudio}
                  className="fixed bottom-24 lg:bottom-6 right-6 lg:right-10 z-50 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 bg-[var(--inv-surface)] border border-[var(--inv-primary)] text-[var(--inv-primary)]"
                >
                  {/* Audio Visualizer Rings */}
                  {isPlaying && [1, 2, 3].map(i => (
                    <motion.span
                      key={i}
                      className="absolute inset-0 rounded-full border border-[var(--inv-primary)]"
                      animate={{ scale: [1, 1.8 + i * 0.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}
                  {isPlaying ? <Pause size={18} weight="fill" /> : <MusicNote size={18} weight="fill" />}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile Hero */}
            <section id="home" className="lg:hidden relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black">
              {hasGallery && (
                <motion.div 
                  className="absolute inset-0 opacity-60"
                  style={{ 
                    x: tilt.x * 1.5,
                    y: tilt.y * 1.5,
                    scale: 1.1,
                  }}
                  transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                >
                  <Image src={data.gallery![1] || data.gallery![0]} alt="Mobile Hero Background" fill className="object-cover object-center" priority sizes="100vw" />
                </motion.div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[var(--inv-bg)]"></div>
              <ArtDecoCorner position="top-left" />
              <ArtDecoCorner position="top-right" />
              <GoldParticles />

              {/* Content */}
              <div className="relative z-10 text-center px-6 text-white flex flex-col items-center">
                <motion.p variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="uppercase tracking-[0.4em] text-xs mb-6" style={{ color: 'var(--inv-primary)' }}>The Wedding Of</motion.p>
                <div className="font-cursive text-7xl mb-4 drop-shadow-xl">
                  <LetterReveal text={data.groom.name} delay={0.2} />
                  <br/><span className="text-4xl font-serif-lux italic">&</span><br/>
                  <LetterReveal text={data.bride.name} delay={0.5} />
                </div>
                <motion.p variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="font-serif-lux text-lg italic tracking-widest mb-12 opacity-90">{data.date}</motion.p>

                {/* Countdown Timer */}
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="flex gap-3 mb-6">
                  {countdown.days === -1 ? (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-8 py-4 border text-center"
                      style={{ borderColor: 'var(--inv-primary)' }}
                    >
                      <span className="font-cursive text-3xl" style={{ color: 'var(--inv-primary)' }}>Hari H Telah Tiba! 🥂</span>
                    </motion.div>
                  ) : (
                    [{v: countdown.days, l: 'Hari'}, {v: countdown.hours, l: 'Jam'}, {v: countdown.minutes, l: 'Menit'}, {v: countdown.seconds, l: 'Detik'}].map(({v, l}) => (
                      <div key={l} className="flex flex-col items-center">
                        <div className="w-16 h-16 border flex items-center justify-center" style={{ borderColor: 'var(--inv-primary)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                          <span className="font-serif-lux text-2xl font-light" style={{ color: 'var(--inv-primary)' }}>{String(v).padStart(2,'0')}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest mt-2 opacity-60">{l}</span>
                      </div>
                    ))
                  )}
                </motion.div>
              </div>

              {/* Swipe up hint */}
              <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Geser ke bawah</span>
                <div className="w-px h-8 bg-gradient-to-b from-transparent" style={{ backgroundImage: `linear-gradient(to bottom, transparent, var(--inv-primary))` }}></div>
              </motion.div>
            </section>

            {/* Quote */}
            {data.quote && (
              <section className="py-32 px-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <ArtDecoCorner position="top-left" />
                <ArtDecoCorner position="bottom-right" />
                <GoldParticles />
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="relative z-10">
                  <span className="block font-serif-lux text-6xl leading-none mb-6" style={{ color: 'var(--inv-primary)' }}>&ldquo;</span>
                  <p className="font-serif-lux text-xl md:text-2xl italic leading-relaxed opacity-80 max-w-md mx-auto whitespace-pre-line">
                    {data.quote}
                  </p>
                  <div className="w-px h-[100px] mx-auto mt-16 opacity-30" style={{ backgroundColor: 'var(--inv-primary)' }}></div>
                </motion.div>
              </section>
            )}

            {/* Profiles */}
            <section id="couple" className="py-24 px-6 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--inv-surface)' }}>
              <ArtDecoCorner position="top-right" />
              <ArtDecoCorner position="bottom-left" />
              <div className="max-w-lg mx-auto relative z-10">
                <motion.h2 variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="uppercase tracking-[0.3em] text-xs mb-20" style={{ color: 'var(--inv-accent)' }}>Mempelai</motion.h2>

                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="mb-24">
                  <div className="w-[220px] h-[300px] mx-auto mb-8 p-3 rounded-t-full shadow-sm" style={{ border: `1px solid var(--inv-primary)` }}>
                    <ParallaxImage src={data.groom.photo} alt="Groom" className="w-full h-full rounded-t-full" />
                  </div>
                  <h3 className="font-cursive text-5xl mb-4">{data.groom.fullName}</h3>
                  <p className="font-serif-lux italic text-lg" style={{ color: 'var(--inv-accent)' }}>{data.groom.parents}</p>
                </motion.div>

                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="text-4xl font-serif-lux italic mb-24" style={{ color: 'var(--inv-primary)' }}>&</motion.div>

                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }}>
                  <div className="w-[220px] h-[300px] mx-auto mb-8 p-3 rounded-t-full shadow-sm" style={{ border: `1px solid var(--inv-primary)` }}>
                    <ParallaxImage src={data.bride.photo} alt="Bride" className="w-full h-full rounded-t-full" />
                  </div>
                  <h3 className="font-cursive text-5xl mb-4">{data.bride.fullName}</h3>
                  <p className="font-serif-lux italic text-lg" style={{ color: 'var(--inv-accent)' }}>{data.bride.parents}</p>
                </motion.div>
              </div>
            </section>

            {/* Event Info */}
            <section id="event" className="py-32 px-6 relative overflow-hidden">
              <ArtDecoCorner position="top-left" />
              <ArtDecoCorner position="bottom-right" />
              <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="text-center mb-16 relative z-10">
                <h2 className="font-cursive text-6xl">Save The Date</h2>
                <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: 'var(--inv-primary)' }}></div>
              </motion.div>

              <div className="max-w-md mx-auto space-y-12 relative z-10">
                {[
                  { title: 'Akad Nikah', ...data.ceremony },
                  { title: 'Resepsi', ...data.reception }
                ].map((ev, idx) => (
                  <motion.div key={idx} variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="p-10 shadow-sm text-center border relative overflow-hidden" style={{ backgroundColor: 'var(--inv-surface)', borderColor: 'var(--inv-primary)' }}>
                    <h3 className="uppercase tracking-[0.2em] text-sm mb-6" style={{ color: 'var(--inv-accent)' }}>{ev.title}</h3>
                    <p className="font-serif-lux text-3xl mb-2">{ev.time}</p>
                    <p className="font-serif-lux italic text-xl mb-6 opacity-80">{data.date}</p>
                    <div className="mb-8">
                      <p className="font-medium mb-1">{ev.location}</p>
                      <p className="text-sm opacity-60 leading-relaxed">{ev.address}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a href={ev.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 border text-[10px] uppercase tracking-widest transition-colors border-[var(--inv-text)] text-[var(--inv-text)] hover:bg-[var(--inv-text)] hover:text-[var(--inv-bg)]">
                        <MapPin size={16} /> Lokasi
                      </a>
                      <a href="#" className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 border text-[10px] uppercase tracking-widest transition-colors border-[var(--inv-text)] bg-[var(--inv-text)] text-[var(--inv-bg)] hover:bg-transparent hover:text-[var(--inv-text)]">
                        <CalendarPlus size={16} /> Kalender
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Live Stream (Conditional) */}
            {data.liveStream && (
              <section className="py-24 px-6 text-center" style={{ backgroundColor: 'var(--inv-bg)' }}>
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="max-w-md mx-auto">
                  <VideoCamera size={48} weight="light" className="mx-auto mb-6" style={{ color: 'var(--inv-primary)' }} />
                  <h2 className="font-cursive text-5xl mb-4">Live Streaming</h2>
                  <p className="font-serif-lux text-xl mb-8 opacity-80">{data.liveStream.time}</p>
                  <a href={data.liveStream.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 border text-[10px] uppercase tracking-widest transition-all border-[var(--inv-text)] text-[var(--inv-text)] hover:bg-[var(--inv-text)] hover:text-[var(--inv-bg)]">
                    <VideoCamera size={18} /> Gabung via {data.liveStream.platform}
                  </a>
                </motion.div>
              </section>
            )}

            {/* Dress Code (Conditional) */}
            {data.dressCode && (
              <section className="py-24 px-6 text-center relative overflow-hidden" style={{ backgroundColor: 'var(--inv-surface)' }}>
                <ArtDecoCorner position="top-right" />
                <ArtDecoCorner position="bottom-left" />
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="max-w-md mx-auto relative z-10">
                  <TShirt size={48} weight="light" className="mx-auto mb-6" style={{ color: 'var(--inv-primary)' }} />
                  <h2 className="font-cursive text-5xl mb-6">Dress Code</h2>
                  <p className="font-light text-sm opacity-80 leading-relaxed mb-10">{data.dressCode.description}</p>
                  <div className="flex items-center justify-center gap-4">
                    {data.dressCode.colors.map((color, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-full border shadow-inner" style={{ backgroundColor: color, borderColor: 'var(--inv-text)20' }}></div>
                    ))}
                  </div>
                </motion.div>
              </section>
            )}

            {/* Story (Conditional) */}
            {hasStory && (
              <section className="py-24 px-8" style={{ backgroundColor: 'var(--inv-surface)' }}>
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="max-w-md mx-auto text-center">
                  <h2 className="font-cursive text-5xl mb-16">Our Story</h2>
                  <div className="space-y-12">
                    {data.story!.map((st, idx) => (
                      <div key={idx} className="relative">
                        <p className="font-serif-lux italic text-3xl mb-2" style={{ color: 'var(--inv-primary)' }}>{st.year}</p>
                        <h4 className="uppercase tracking-widest text-sm font-semibold mb-4">{st.title}</h4>
                        <p className="opacity-70 text-sm leading-loose">{st.desc}</p>
                        {idx !== data.story!.length - 1 && (
                          <div className="w-px h-12 mx-auto mt-12 opacity-30" style={{ backgroundColor: 'var(--inv-primary)' }}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>
            )}

            {/* Gallery (Conditional) */}
            {hasGallery && (
              <section id="gallery" className="py-24 px-4 relative overflow-hidden">
                <ArtDecoCorner position="top-right" />
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="max-w-2xl mx-auto text-center mb-12 relative z-10">
                  <h2 className="font-cursive text-5xl">Gallery</h2>
                </motion.div>
                <div className="columns-2 gap-4 max-w-2xl mx-auto px-2 relative z-10">
                  {data.gallery!.map((img, idx) => (
                    <motion.div
                      key={idx} variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }}
                      className="relative mb-4 break-inside-avoid shadow-sm aspect-[3/4] cursor-pointer group"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      <ParallaxImage src={img} alt="Gallery" className="w-full h-full rounded-sm" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-sm flex items-center justify-center">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileHover={{ opacity: 1, scale: 1 }} className="text-white text-xs uppercase tracking-widest border border-white/60 px-3 py-1">View</motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ============ ULTRA EPIC RSVP ============ */}
            <section id="rsvp" className="relative overflow-hidden" style={{ backgroundColor: 'var(--inv-text)', color: 'var(--inv-bg)', minHeight: '100dvh' }}>
              {/* Grain Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />

              {/* Gold Confetti on Submit */}
              <AnimatePresence>
                {rsvpSubmitted && confetti.map(c => (
                  <motion.div
                    key={c.id}
                    className="fixed pointer-events-none z-[300] w-2 h-3 rounded-[1px]"
                    style={{ left: `${c.x}%`, top: '-10px', backgroundColor: c.color, rotate: c.rotate }}
                    animate={{ y: ['0vh', '110vh'], rotate: c.rotate + 720, opacity: [1, 1, 0] }}
                    transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
                  />
                ))}
              </AnimatePresence>

              <div className="max-w-lg mx-auto px-6 py-24 relative z-10">

                {/* Header */}
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="text-center mb-16">
                  <p className="uppercase tracking-[0.4em] text-[10px] mb-4 opacity-50">Your Presence Matters</p>
                  <h2 className="font-cursive text-6xl mb-6" style={{ color: 'var(--inv-primary)' }}>RSVP</h2>
                  <div className="flex items-center justify-center gap-3">
                    {['Nama','Kehadiran','Ucapan','Selesai'].map((s,i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] transition-all duration-500 ${
                          rsvpSubmitted || i < rsvpStep ? 'border-[var(--inv-primary)] bg-[var(--inv-primary)] text-black' :
                          i === rsvpStep ? 'border-[var(--inv-primary)] text-[var(--inv-primary)]' :
                          'border-white/20 text-white/20'
                        }`}>{rsvpSubmitted || i < rsvpStep ? '✓' : i+1}</div>
                        {i < 3 && <div className={`w-8 h-px transition-all duration-700 ${rsvpSubmitted || i < rsvpStep ? 'bg-[var(--inv-primary)]' : 'bg-white/10'}`} />}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Multi-step Form */}
                <AnimatePresence mode="wait">
                  {!rsvpSubmitted ? (
                    <motion.div key={rsvpStep}
                      initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
                      transition={{ duration: 0.5 }}
                      className="mb-16"
                    >
                      {rsvpStep === 0 && (
                        <div className="space-y-8">
                          <p className="font-serif-lux text-2xl text-center opacity-60 italic">Siapa nama Anda?</p>
                          <input
                            autoFocus type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)}
                            placeholder="Tulis nama Anda..."
                            className="w-full border-b-2 py-4 text-2xl font-serif-lux text-center focus:outline-none placeholder:opacity-30 transition-all"
                            style={{
                              borderColor: 'var(--inv-primary)',
                              caretColor: 'var(--inv-primary)',
                              backgroundColor: 'transparent',
                              color: '#FAFAFA',
                            }}
                            onKeyDown={e => e.key === 'Enter' && rsvpName.trim() && setRsvpStep(1)}
                          />
                          <button
                            onClick={() => rsvpName.trim() && setRsvpStep(1)}
                            className="w-full py-4 uppercase tracking-[0.3em] text-xs transition-all"
                            style={{ backgroundColor: rsvpName.trim() ? 'var(--inv-primary)' : 'transparent', color: rsvpName.trim() ? 'black' : 'var(--inv-primary)', border: '1px solid var(--inv-primary)', opacity: rsvpName.trim() ? 1 : 0.4 }}
                          >Lanjut →</button>
                        </div>
                      )}

                      {rsvpStep === 1 && (
                        <div className="space-y-4">
                          <p className="font-serif-lux text-2xl text-center opacity-60 italic mb-10">Apakah Anda bisa hadir, <span style={{ color: 'var(--inv-primary)' }}>{rsvpName}</span>?</p>
                          {[{v:'hadir',label:'Ya, Saya Akan Hadir 🥂',desc:'Kami sangat menantikan kehadiran Anda'},{v:'tidak',label:'Mohon Maaf, Berhalangan 🙏',desc:'Terima kasih atas perhatian Anda'}].map(opt => (
                            <motion.button
                              key={opt.v} whileTap={{ scale: 0.97 }}
                              onClick={() => { setRsvpAttend(opt.v as 'hadir' | 'tidak'); setTimeout(() => setRsvpStep(2), 300); }}
                              className={`w-full p-6 border text-left transition-all duration-300 ${
                                rsvpAttend === opt.v ? 'border-[var(--inv-primary)] bg-[var(--inv-primary)]/10' : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <p className="font-serif-lux text-xl mb-1">{opt.label}</p>
                              <p className="text-xs opacity-50">{opt.desc}</p>
                            </motion.button>
                          ))}
                          <button onClick={() => setRsvpStep(0)} className="w-full py-3 text-xs uppercase tracking-widest opacity-30 hover:opacity-60 transition-opacity">← Kembali</button>
                        </div>
                      )}

                      {rsvpStep === 2 && (
                        <div className="space-y-8">
                          <p className="font-serif-lux text-2xl text-center opacity-60 italic">Tulis doa &amp; ucapan Anda</p>
                          <textarea
                            autoFocus rows={5} value={rsvpWish} onChange={e => setRsvpWish(e.target.value)}
                            placeholder="Semoga kalian bahagia selalu..."
                            className="w-full border p-4 text-sm font-light focus:outline-none resize-none transition-all placeholder:opacity-30"
                            style={{
                              borderColor: 'var(--inv-primary)',
                              caretColor: 'var(--inv-primary)',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#FAFAFA',
                            }}
                          />
                          <button
                            onClick={handleRsvpSubmit}
                            className="w-full py-5 uppercase tracking-[0.3em] text-xs font-semibold transition-all"
                            style={{ backgroundColor: 'var(--inv-primary)', color: 'black' }}
                          >Kirim Ucapan ✦</button>
                          <button onClick={() => setRsvpStep(1)} className="w-full py-3 text-xs uppercase tracking-widest opacity-30 hover:opacity-60 transition-opacity">← Kembali</button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                      className="text-center mb-16 py-12"
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center border-2"
                        style={{ borderColor: 'var(--inv-primary)' }}
                        animate={{ boxShadow: ['0 0 0px var(--inv-primary)', '0 0 30px var(--inv-primary)', '0 0 0px var(--inv-primary)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle size={36} weight="fill" style={{ color: 'var(--inv-primary)' }} />
                      </motion.div>
                      <h3 className="font-cursive text-5xl mb-4" style={{ color: 'var(--inv-primary)' }}>Terima Kasih!</h3>
                      <p className="font-serif-lux text-xl italic opacity-70">Doa {rsvpName} sangat berarti bagi kami 🥂</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Wish Wall */}
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }}>
                  <p className="uppercase tracking-[0.4em] text-[10px] text-center mb-8 opacity-40">— Ucapan Tamu —</p>
                  <div className="space-y-4">
                    {wishes.map((wish, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative p-5 border-l-2 backdrop-blur-sm"
                        style={{ borderColor: 'var(--inv-primary)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-serif-lux text-lg" style={{ color: 'var(--inv-primary)' }}>{wish.name}</h5>
                          <span className="text-[9px] uppercase tracking-wider opacity-30">{wish.time}</span>
                        </div>
                        <p className="text-sm font-light leading-relaxed opacity-80">{wish.wish}</p>
                        {/* Gold accent dot */}
                        <div className="absolute -left-[5px] top-5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--inv-primary)' }} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Wedding Gift */}
                <motion.div variants={blurReveal} initial="hidden" whileInView="visible" viewport={{ once: false }} className="mt-16 pt-16 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Gift size={40} weight="light" className="mx-auto mb-6" style={{ color: 'var(--inv-primary)' }} />
                  <h3 className="font-cursive text-4xl mb-4">Wedding Gift</h3>
                  <p className="font-light text-sm opacity-60 leading-relaxed mb-8 max-w-xs mx-auto">Bagi yang ingin memberikan tanda kasih secara digital.</p>
                  <button onClick={() => setIsGiftOpen(true)} className="inline-flex items-center gap-3 px-8 py-4 uppercase tracking-[0.2em] text-xs font-semibold transition-all hover:scale-105" style={{ backgroundColor: 'var(--inv-primary)', color: 'black' }}>
                    <Gift size={16} /> Kirim Hadiah
                  </button>
                </motion.div>
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-20 border-t" style={{ borderColor: 'var(--inv-primary)' }}>
              <p className="font-cursive text-3xl mb-4" style={{ color: 'var(--inv-accent)' }}>{data.groom.name} & {data.bride.name}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Powered by NOMSTD Agency</p>
            </footer>

          </div>
        </div>

        {/* ================= ULTRA EPIC GIFT MODAL ================= */}
        <AnimatePresence>
          {isGiftOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
              style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
              onClick={() => setIsGiftOpen(false)}
            >
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full sm:max-w-md relative overflow-hidden"
                style={{ backgroundColor: '#0A0A0A', color: '#FAFAFA', borderTop: '1px solid var(--inv-primary)', maxHeight: '92dvh', overflowY: 'auto' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Gold top accent line animated */}
                <motion.div
                  className="absolute top-0 left-0 h-[1px]"
                  style={{ backgroundColor: 'var(--inv-primary)' }}
                  initial={{ width: '0%' }} animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] opacity-40 mb-1">Digital</p>
                    <h2 className="font-cursive text-4xl" style={{ color: 'var(--inv-primary)' }}>Wedding Gift</h2>
                  </div>
                  <button onClick={() => setIsGiftOpen(false)} className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Tab Selector for multiple gifts */}
                {data.gifts && data.gifts.length > 1 && (
                  <div className="px-8 py-6">
                    <div className="flex gap-2 mb-8">
                      {data.gifts.map((g, i) => (
                        <button key={i} onClick={() => setActiveGift(i)}
                          className="flex-1 py-3 text-xs uppercase tracking-widest border transition-all"
                          style={{
                            borderColor: activeGift === i ? 'var(--inv-primary)' : 'rgba(255,255,255,0.1)',
                            color: activeGift === i ? 'var(--inv-primary)' : 'rgba(255,255,255,0.4)',
                            backgroundColor: activeGift === i ? 'rgba(212,175,55,0.08)' : 'transparent'
                          }}
                        >{g.type === 'bank' ? '🏦 ' + g.bankName : '📱 QRIS'}</button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {(() => {
                        const gift = data.gifts![activeGift];
                        return (
                          <motion.div key={activeGift}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                          >
                            {gift.type === 'bank' ? (
                              <div>
                                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">{gift.bankName}</p>
                                <p className="font-serif-lux text-2xl mb-6" style={{ color: 'var(--inv-primary)' }}>{gift.accountName}</p>
                                <div className="relative p-5 border" style={{ borderColor: 'rgba(212,175,55,0.2)', backgroundColor: 'rgba(212,175,55,0.04)' }}>
                                  <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Nomor Rekening</p>
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="font-mono text-2xl tracking-[0.2em]" style={{ color: 'var(--inv-primary)' }}>{gift.accountNo}</span>
                                    <motion.button
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => copyToClipboard(gift.accountNo)}
                                      className="flex-shrink-0 px-4 py-2 text-[10px] uppercase tracking-widest border transition-all"
                                      style={{
                                        borderColor: copiedNo === gift.accountNo ? '#22c55e' : 'var(--inv-primary)',
                                        color: copiedNo === gift.accountNo ? '#22c55e' : 'var(--inv-primary)',
                                        backgroundColor: copiedNo === gift.accountNo ? 'rgba(34,197,94,0.1)' : 'transparent'
                                      }}
                                    >
                                      {copiedNo === gift.accountNo ? '✓ Copied!' : 'Copy'}
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            ) : gift.qrisImg ? (
                              <div className="text-center">
                                <p className="font-serif-lux text-2xl mb-6" style={{ color: 'var(--inv-primary)' }}>{gift.accountName}</p>
                                <motion.div
                                  className="relative inline-block p-5 bg-white rounded-sm"
                                  animate={{ boxShadow: ['0 0 0px rgba(212,175,55,0)', '0 0 30px rgba(212,175,55,0.4)', '0 0 0px rgba(212,175,55,0)'] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  <img src={gift.qrisImg} alt="QRIS" className="w-52 h-52 object-contain" />
                                </motion.div>
                                <p className="text-[10px] uppercase tracking-widest opacity-30 mt-5">Scan dengan aplikasi e-wallet</p>
                              </div>
                            ) : null}
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                  </div>
                )}

                {/* Single gift */}
                {data.gifts && data.gifts.length === 1 && (() => {
                  const gift = data.gifts[0];
                  return (
                    <div className="px-8 py-6">
                      <p className="text-xs uppercase tracking-widest opacity-40 mb-2">{gift.bankName}</p>
                      <p className="font-serif-lux text-2xl mb-6" style={{ color: 'var(--inv-primary)' }}>{gift.accountName}</p>
                      {gift.type === 'bank' ? (
                        <div className="relative p-5 border" style={{ borderColor: 'rgba(212,175,55,0.2)', backgroundColor: 'rgba(212,175,55,0.04)' }}>
                          <p className="text-xs uppercase tracking-widest opacity-40 mb-2">Nomor Rekening</p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-mono text-2xl tracking-[0.2em]" style={{ color: 'var(--inv-primary)' }}>{gift.accountNo}</span>
                            <motion.button whileTap={{ scale: 0.92 }} onClick={() => copyToClipboard(gift.accountNo)}
                              className="px-4 py-2 text-[10px] uppercase tracking-widest border transition-all"
                              style={{ borderColor: copiedNo === gift.accountNo ? '#22c55e' : 'var(--inv-primary)', color: copiedNo === gift.accountNo ? '#22c55e' : 'var(--inv-primary)', backgroundColor: copiedNo === gift.accountNo ? 'rgba(34,197,94,0.1)' : 'transparent' }}
                            >{copiedNo === gift.accountNo ? '✓ Copied!' : 'Copy'}</motion.button>
                          </div>
                        </div>
                      ) : gift.qrisImg ? (
                        <div className="text-center">
                          <motion.div className="inline-block p-5 bg-white rounded-sm"
                            animate={{ boxShadow: ['0 0 0px rgba(212,175,55,0)', '0 0 30px rgba(212,175,55,0.4)', '0 0 0px rgba(212,175,55,0)'] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <img src={gift.qrisImg} alt="QRIS" className="w-52 h-52 object-contain" />
                          </motion.div>
                          <p className="text-[10px] uppercase tracking-widest opacity-30 mt-5">Scan dengan aplikasi e-wallet</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}

                {/* Bottom safe area */}
                <div className="h-8" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= LIGHTBOX ================= */}
        <AnimatePresence>
          {lightboxIndex !== null && hasGallery && (
            <Lightbox
              images={data.gallery!}
              index={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
              onPrev={() => setLightboxIndex(i => (i! - 1 + data.gallery!.length) % data.gallery!.length)}
              onNext={() => setLightboxIndex(i => (i! + 1) % data.gallery!.length)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
