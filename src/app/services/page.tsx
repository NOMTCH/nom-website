import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPricingPackages } from '@/lib/data/pricing';

export const metadata: Metadata = {
  title: 'Layanan & Solusi IT Kreatif Cianjur | NOMSTD',
  description: 'Ekosistem layanan lengkap NOMSTD Cianjur: Desain Grafis, Web Development, Fotografi, Videography Cinematic, dan IT Solutions & System Integration.',
  keywords: [
    'layanan nomstd',
    'jasa desain grafis cianjur',
    'jasa pembuatan website cianjur',
    'fotografer cianjur',
    'videografer cianjur',
    'servis laptop pc cianjur'
  ],
  alternates: {
    canonical: 'https://nomstd.my.id/services',
  },
  openGraph: {
    title: 'Layanan & Solusi IT Kreatif Cianjur | NOMSTD',
    description: 'Jelajahi seluruh layanan studio kreatif dan solusi teknologi dari NOMSTD.',
    url: 'https://nomstd.my.id/services',
  }
};

const serviceCategories = [
  {
    id: 'graphic-design',
    title: 'Graphic Design & Branding',
    subtitle: 'Identitas visual unik, logo profesional & tata letak yang menarik.',
    description: 'Kami membangun brand identity dari nol: desain logo, brand guidelines, desain brosur, kemasan produk, hingga manajemen visual media sosial.',
    video: '/assets/videos/Graphic.mp4',
    portfolioHref: '/portfolio/graphic-design',
    detailHref: '/services/graphic-design',
    features: ['Logo & Brand Identity', 'Social Media Templates', 'Packaging & Print Layout', 'Vector & Identity Manual']
  },
  {
    id: 'web-development',
    title: 'Web Design & Software Dev',
    subtitle: 'Website modern, responsif, cepat & berkinerja tinggi.',
    description: 'Pengembangan landing page, company profile, e-commerce, hingga web app interaktif berbasis Next.js & React dengan performa instan dan SEO optimized.',
    video: '/assets/videos/Web.mp4',
    portfolioHref: '/portfolio/web-development',
    detailHref: '/services/web-development',
    features: ['Landing Page High Converting', 'Company Profile CMS', 'SaaS & Web Application', 'SEO & Speed Optimization']
  },
  {
    id: 'photography',
    title: 'Photography Studio',
    subtitle: 'Dokumentasi momen berharga & visual produk profesional.',
    description: 'Layanan fotografi komersial, produk studio, dokumentasi acara perusahaan, wedding, hingga momen kelulusan dengan pencahayaan dan komposisi premium.',
    video: '/assets/videos/Photo.mp4',
    portfolioHref: '/portfolio/photography',
    detailHref: '/services/photography',
    features: ['Commercial Product Photo', 'Wedding & Event Coverage', 'Corporate Portraiture', 'High-Res Editing & Retouch']
  },
  {
    id: 'videography',
    title: 'Cinematic Videography',
    subtitle: 'Video komersial, aftermovie & konten sosial media dinamis.',
    description: 'Pembuatan video promosi bisnis, cinematic wedding aftermovie, hingga paket konten Reels & TikTok berkualitas tinggi untuk meningkatkan visual engagement.',
    video: '/assets/videos/Video.mp4',
    portfolioHref: '/portfolio/videography',
    detailHref: '/services/videography',
    features: ['Cinematic Event Aftermovie', 'Reels / TikTok Social Pack', 'Company Commercial Video', 'Professional Color Grading']
  },
  {
    id: 'it-solutions',
    title: 'IT Solutions & Hardware',
    subtitle: 'Rakit PC impian, perbaikan hardware & perawatan sistem.',
    description: 'Solusi lengkap teknis hardware: upgrade SSD/RAM, pembersihan thermal paste laptop, perakitan Custom PC gaming/workstation, dan perawatan jaringan kantor.',
    video: '/assets/videos/Laptop.mp4',
    portfolioHref: '/portfolio/it-solutions',
    detailHref: '/services/it-solutions',
    features: ['Custom PC Assembly', 'Laptop Repair & Maintenance', 'Deep Thermal Paste Paste', 'Network & System Maintenance']
  },
  {
    id: 'digital-invitation',
    title: 'Digital Invitation (Undangan Digital)',
    subtitle: 'Undangan web interaktif elegan untuk pernikahan & acara spesial.',
    description: 'Solusi undangan online berbasis website dengan berbagai fitur modern: musik, gallery foto, rsvp, amplop digital, maps, dan manajemen tamu.',
    video: '/assets/videos/Graphic.mp4',
    portfolioHref: '/services/digital-invitation',
    detailHref: '/services/digital-invitation',
    features: ['Desain Tema Eksklusif', 'RSVP & Ucapan Realtime', 'Amplop Digital & Gift Map', 'Merek/Nama Tamu Custom']
  }
];

export default async function ServicesPage() {
  const dbPackages = await getPricingPackages();

  return (
    <main className="min-h-screen bg-background text-foreground pt-[100px] flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <section className="container mx-auto px-6 md:px-12 pt-8 pb-16">
        <div className="max-w-4xl">
          <span className="text-accent font-bold tracking-widest text-xs uppercase px-3.5 py-1.5 bg-accent/10 border border-accent/20 rounded-full inline-block mb-4">
            SATU PINTU UNTUK SEMUA KEBUTUHAN
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-tight text-foreground mb-6">
            Semua Solusi Kreatif. <br />
            <span className="text-accent">Tanpa Pusing Nyari Vendor.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-medium max-w-2xl">
            Nggak perlu pusing komunikasi sama banyak vendor terpisah. Dari rakitan PC workstation, web app Next.js, foto produk studio, sampai video cinematic aftermovie—semua disikat sama tim NOMSTD.
          </p>
        </div>
      </section>

      {/* Services Cards Grid */}
      <section className="container mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((service) => (
            <div 
              key={service.id}
              className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col group"
            >
              {/* Media Preview */}
              <div className="relative aspect-video bg-black overflow-hidden border-b border-border">
                <video 
                  src={service.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-background/80 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-widest text-foreground rounded-lg">
                    {service.id.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h2 className="text-2xl font-display font-black uppercase tracking-tight text-foreground mb-2 group-hover:text-accent transition-colors">
                  {service.title}
                </h2>
                <p className="text-xs font-bold text-accent tracking-wider uppercase mb-4">
                  {service.subtitle}
                </p>
                <p className="text-sm text-muted font-medium leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="border-t border-border/60 pt-4 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3">Include Features:</span>
                  <ul className="grid grid-cols-1 gap-2">
                    {service.features.map((feat, i) => (
                      <li key={i} className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link 
                    href={service.detailHref}
                    className="flex-1 py-3 px-4 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-md transition-all hover:scale-[1.02]"
                  >
                    Detail & Harga
                  </Link>
                  <Link 
                    href={service.portfolioHref}
                    className="py-3 px-4 bg-background border border-border hover:border-accent text-foreground hover:text-accent font-bold text-xs uppercase tracking-wider rounded-xl text-center transition-all"
                  >
                    Portfolio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Overview Highlight */}
      {dbPackages.length > 0 && (
        <section className="bg-surface/50 border-t border-b border-border py-24 px-6 md:px-12">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-accent font-bold text-xs uppercase tracking-widest px-3.5 py-1.5 bg-accent/10 rounded-full inline-block mb-3">
                PRICELIST OVERVIEW
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tight mb-4">
                Paket & Estimasi Biaya
              </h2>
              <p className="text-sm md:text-base text-muted font-medium">
                Pilihan paket investasi terbaik untuk kebutuhan bisnis dan karya visual Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dbPackages.slice(0, 3).map((pkg) => (
                <div key={pkg.id} className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-accent transition-all">
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1">{pkg.category}</span>
                    <h3 className="text-xl font-bold uppercase text-foreground mb-2">{pkg.name}</h3>
                    <p className="text-xs text-muted mb-4 line-clamp-2">{pkg.description}</p>
                    <div className="text-2xl font-black text-accent mb-4">
                      Rp {new Intl.NumberFormat('id-ID').format(Number(pkg.price) || 0)}
                    </div>
                  </div>
                  <Link 
                    href={`/services/${pkg.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full py-2.5 bg-background border border-border hover:bg-accent hover:text-white hover:border-accent text-center font-bold text-xs uppercase rounded-xl transition-all block"
                  >
                    Lihat Fitur Paket
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-24 px-6 md:px-12 container mx-auto text-center">
        <div className="max-w-3xl mx-auto bg-surface border border-border rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase text-foreground tracking-tight mb-4">
            Punya Kebutuhan Custom?
          </h2>
          <p className="text-muted text-base font-medium mb-8">
            Konsultasikan ide projek Anda secara gratis langsung bersama tim ahli kami.
          </p>
          <a
            href="https://wa.me/6282130704794?text=Halo%20min,%20mau%20konsultasi%20layanan%20NOMSTD%20dong!%20%F0%9F%90%BE"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 py-4 px-8 bg-accent text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all hover:scale-105"
          >
            Konsultasi via WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
