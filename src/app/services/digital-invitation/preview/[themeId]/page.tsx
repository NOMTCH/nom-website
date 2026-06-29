import { InvitationEngine } from '@/components/invitation/InvitationEngine';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from '@phosphor-icons/react/dist/ssr';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ themeId: string }> }): Promise<Metadata> {
  const { themeId } = await params;
  return {
    title: `Live Preview Tema ${themeId} | Undangan Digital NOMSTD`,
    description: `Cobain langsung live preview tema undangan digital ${themeId}. Lihat transisi animasi, galeri foto, RSVP, musik, dan fitur lainnya secara interaktif.`,
    keywords: [themeId, "preview undangan", "live preview", "tema undangan premium"],
  };
}

export default async function ThemePreviewPage({ params }: { params: Promise<{ themeId: string }> }) {
  const { themeId } = await params;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar for Preview Controls & Checkout (HIDDEN ON MOBILE) */}
      <div className="hidden md:flex w-80 bg-white border-r border-gray-200/80 p-6 flex-col justify-between shadow-sm z-10">
        <div>
          <Link href="/services/digital-invitation" className="inline-flex items-center gap-2 font-bold uppercase text-xs tracking-wider text-gray-500 mb-8 hover:text-accent transition-colors">
            <ArrowLeft weight="bold" /> Kembali ke Katalog
          </Link>
          
          <div className="mb-4">
            <h1 className="text-xl font-display font-black uppercase tracking-tight text-gray-900">Live Preview</h1>
            <span className="inline-block bg-gray-100 text-gray-800 text-[10px] px-2.5 py-1 rounded-lg mb-6 uppercase font-bold tracking-wider mt-2">
              Theme: {themeId}
            </span>
          </div>
          
          <p className="font-semibold text-xs leading-relaxed text-gray-500 border-l-2 border-accent pl-3">
            Ini adalah tampilan *Live Preview* dari tema yang lo pilih. Coba scroll, klik buka undangan, dan rasakan smooth animasinya!
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl text-center mt-auto shadow-sm">
          <h3 className="font-display font-black uppercase text-sm text-gray-900 mb-1">Udah Cocok?</h3>
          <p className="text-xs font-semibold text-gray-500 mb-4">Mulai dari Rp 150K aja.</p>
          <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20pesan%20Undangan%20Digital." target="_blank" rel="noreferrer" className="w-full bg-gray-900 text-white py-2.5 font-bold uppercase text-xs rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            <ShoppingCart size={16} weight="bold" /> Checkout via WA
          </a>
        </div>
      </div>

      {/* Floating Action Buttons for Mobile */}
      <div className="md:hidden fixed top-4 left-4 right-4 z-[100] flex justify-between pointer-events-none">
        <Link href="/services/digital-invitation" className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-sm flex items-center justify-center text-gray-700 pointer-events-auto hover:bg-white transition-all">
          <ArrowLeft size={18} weight="bold" />
        </Link>
        <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20pesan%20Undangan%20Digital." target="_blank" rel="noreferrer" className="h-10 bg-gray-900 text-white rounded-xl px-4 shadow-md flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase tracking-wider pointer-events-auto hover:bg-gray-800 transition-all">
          <ShoppingCart size={14} weight="fill" /> Pesan
        </a>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 w-full h-[100dvh] relative overflow-hidden bg-white">
        <InvitationEngine themeId={themeId} />
      </div>

    </div>
  );
}
