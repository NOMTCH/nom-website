import Link from 'next/link';
import { invitationThemes } from '@/data/invitationThemes';
import { CaretRight, Star, CheckCircle, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Undangan Digital Premium | NOMSTD',
  description: 'Bikin tamu undangan pernikahan/acara Anda kagum. Undangan digital eksklusif dengan tema premium, RSVP real-time, kado cashless (QRIS), dan animasi mulus.',
  keywords: ['undangan digital premium', 'jasa undangan online', 'undangan pernikahan digital', 'qris kado cashless', 'undangan neo-pop', 'nomstd wedding'],
};

export default function DigitalInvitationLanding() {
  const invitationServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Jasa Undangan Digital Premium",
    "description": "Pembuatan undangan digital eksklusif dengan animasi modern, RSVP, kado cashless, dan peta lokasi interaktif.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "NOMSTD",
      "url": "https://nomstd.my.id"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "IDR",
      "lowPrice": 150000,
      "highPrice": 2000000,
      "offerCount": 3
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white pt-[80px]">
      <JsonLd schema={invitationServiceSchema} />
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 border-b border-border bg-[#FAFAFA] relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-block bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 font-bold uppercase text-xs rounded-full mb-6">
            Undangan Digital Premium 💎
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-8 text-foreground">
            Bikin Tamu Lo<br/>Kena Mental.
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 border-l-2 border-accent pl-4 text-gray-500">
            Bosan dengan undangan digital pasaran harga 50 ribuan? 
            Kami buatkan undangan berkelas, animasi mulus, fitur kado cashless, dan desain "BOOM" yang bikin tamu mikir lo abis miliaran buat resepsi.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#themes" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-gray-800 hover:-translate-y-0.5 shadow-sm transition-all flex items-center gap-2">
              Lihat Katalog <CaretRight weight="bold" />
            </a>
          </div>
        </div>
        {/* Background Decorations */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent rounded-full border border-accent/10 blur-3xl opacity-20 pointer-events-none"></div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4">Fitur Premium</h2>
            <p className="text-lg font-medium text-gray-500">Semua yang lo butuhin buat pamer resepsi dengan elegan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "RSVP & Guestbook", desc: "Tamu bisa konfirmasi kehadiran real-time dan ninggalin jejak digital yang keren." },
              { title: "Kado Cashless", desc: "Terima amplop digital langsung via QRIS atau Transfer Bank. Praktis abis." },
              { title: "Smooth Animation", desc: "Transisi halaman sehalus sutra pakai Framer Motion. Gak ada yang namanya ngelag." }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <Star size={36} weight="fill" className="text-accent mb-4" />
                <h3 className="text-xl font-display font-black uppercase mb-2 text-gray-900">{feat.title}</h3>
                <p className="font-semibold text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="themes" className="py-20 px-6 border-b border-border bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">Katalog Tema</h2>
              <p className="font-bold text-gray-500">Pilih "senjata" andalan lo.</p>
            </div>
            <div className="hidden md:block bg-gray-900 text-white px-3 py-1 font-bold uppercase text-[10px] tracking-wider rounded-lg">
              {invitationThemes.length} Varian
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {invitationThemes.map((theme) => (
              <div key={theme.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden group flex flex-col h-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="aspect-[3/4] border-b border-gray-100 overflow-hidden relative">
                  <img src={theme.coverImage} alt={theme.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-gray-100 px-2 py-1 text-[9px] font-black uppercase rounded-lg">
                    {theme.style}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-display font-black uppercase tracking-tight mb-2 text-gray-900">{theme.name}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-4 flex-1 leading-relaxed">{theme.description}</p>
                  <Link href={`/services/digital-invitation/preview/${theme.id}`} className="w-full bg-gray-900 text-white border border-gray-900 text-center py-2.5 font-bold uppercase text-xs rounded-xl hover:bg-gray-800 transition-colors">
                    Live Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-gray-900 mb-4">Investasi Harga Diri</h2>
            <p className="text-xl font-bold text-gray-500">Berapa budget lo buat pamer ke mantan?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Standard */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-black uppercase mb-2 text-gray-900">Silver</h3>
                <div className="text-4xl font-display font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Rp 150K</div>
                <ul className="space-y-3 mb-8 font-semibold text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> Tema Standar</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> Max 5 Foto Gallery</li>
                  <li className="flex items-center gap-2 text-gray-400"><CheckCircle weight="regular" /> Tanpa Musik</li>
                  <li className="flex items-center gap-2 text-gray-400"><CheckCircle weight="regular" /> Tanpa Kado Cashless</li>
                </ul>
              </div>
              <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20pesan%20Undangan%20Digital%20paket%20SILVER." target="_blank" rel="noreferrer" className="w-full bg-gray-900 text-white text-center py-3 font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <WhatsappLogo size={18} /> Pesan Silver
              </a>
            </div>

            {/* Gold (Recommended) */}
            <div className="bg-white border-2 border-accent rounded-3xl p-8 shadow-md flex flex-col justify-between relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 font-bold uppercase text-[10px] rounded-full tracking-wider whitespace-nowrap">
                Paling Laris 🔥
              </div>
              <div>
                <h3 className="text-xl font-display font-black uppercase mb-2 text-gray-900">Gold</h3>
                <div className="text-5xl font-display font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Rp 350K</div>
                <ul className="space-y-3 mb-8 font-semibold text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> Bebas Pilih Tema</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> Max 15 Foto Gallery</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> Background Musik</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> Fitur RSVP & Guestbook</li>
                  <li className="flex items-center gap-2 text-gray-400"><CheckCircle weight="regular" /> Tanpa Domain Khusus</li>
                </ul>
              </div>
              <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20mau%20pesan%20Undangan%20Digital%20paket%20GOLD." target="_blank" rel="noreferrer" className="w-full bg-accent text-white text-center py-4 font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-accent-dark transition-colors flex items-center justify-center gap-2">
                <WhatsappLogo size={18} /> Pesan Gold
              </a>
            </div>

            {/* Ultimate */}
            <div className="bg-gray-950 border border-gray-900 text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-black uppercase mb-2 text-accent">Ultimate</h3>
                <div className="text-4xl font-display font-black text-white mb-6 border-b border-gray-800 pb-4">Rp 2 Juta</div>
                <ul className="space-y-3 mb-8 font-semibold text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-accent" /> Desain Custom 100%</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-accent" /> Unlimited Foto Gallery</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-accent" /> Kado Cashless (QRIS)</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-accent" /> Custom QR Code Tamu</li>
                  <li className="flex items-center gap-2"><CheckCircle weight="fill" className="text-accent" /> Domain (.com) Sendiri</li>
                </ul>
              </div>
              <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20SULTAN%20mau%20pesan%20Undangan%20Digital%20paket%20ULTIMATE%202%20JUTA." target="_blank" rel="noreferrer" className="w-full bg-white text-gray-900 text-center py-3 font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <WhatsappLogo size={18} /> Konsultasi Sultan
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
