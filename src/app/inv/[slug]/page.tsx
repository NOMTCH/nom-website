'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { InvitationEngine } from '@/components/invitation/InvitationEngine';
import { getInvitationBySlug, Invitation } from '@/lib/data/invitations';
import Link from 'next/link';

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function loadInvitation() {
      try {
        const data = await getInvitationBySlug(slug);
        if (data) {
          setInvitation(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load invitation:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadInvitation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[80px] top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[80px] bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
          <span className="font-serif-lux italic text-[#D4AF37] tracking-widest text-sm uppercase">Loading Invitation...</span>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-6 text-center relative">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-md p-8 border border-[#D4AF37]/20 bg-[#121212]/80 backdrop-blur-md rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <h1 className="text-6xl font-serif-lux text-[#D4AF37] mb-6">404</h1>
          <h2 className="text-xl font-display uppercase tracking-widest text-[#D4AF37]/80 mb-4">Undangan Tidak Ditemukan</h2>
          <p className="font-sans-lux text-[#a1a1a1] text-sm leading-relaxed mb-8">
            Halaman undangan yang Anda cari tidak dapat ditemukan. Silakan periksa kembali tautan Anda atau hubungi admin NOMSTD.
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#b8952c] text-black font-black uppercase tracking-widest text-xs transition-colors border border-black shadow-[4px_4px_0_0_#ffffff]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InvitationEngine 
      invitationData={invitation.data} 
      invitationId={invitation.id} 
    />
  );
}
