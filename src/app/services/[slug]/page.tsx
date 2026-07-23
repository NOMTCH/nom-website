import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { getPricingPackages } from "@/lib/data/pricing";

export const dynamic = 'force-dynamic';

function getCategoryNameFromSlug(slug: string): string {
  switch (slug) {
    case 'graphic-design': return 'Graphic Design';
    case 'photography': return 'Photography';
    case 'videography': return 'Videography';
    case 'web-development': return 'Web Development';
    case 'it-solutions': return 'IT Solutions';
    default: return '';
  }
}

// Data could eventually come from Supabase or MDX
const serviceData = {
  'graphic-design': {
    title: 'Graphic Design',
    subtitle: 'Branding that sticks. Layouts that convert.',
    content: 'We build visual identities from the ground up. Logo design, brand guidelines, brochure layouts, and complete social media visual management. Please note: We focus strictly on modern typography, layout, and composition. We do not provide hand-drawn digital illustration services.',
    video: '/assets/videos/Graphic.mp4',
    packages: [
      { name: 'Logo Starter', price: 'Rp 1.5 Juta', description: 'Paket logo dasar untuk usaha rintisan', features: ['2 Concepts', '3 Revisions', 'Master Files'] },
      { name: 'Brand Identity Full', price: 'Rp 5.0 Juta', description: 'Identitas visual lengkap untuk brand profesional', features: ['Primary & Secondary Logo', 'Brand Book', 'Social Media Templates'] }
    ]
  },
  'photography': {
    title: 'Photography',
    subtitle: 'Capturing moments with cinematic precision.',
    content: 'Whether it is a beautiful wedding, a formal corporate gathering, a school farewell, or outbound activities, we provide professional coverage to ensure your memories are preserved beautifully. We also offer commercial product photography with studio-grade lighting.',
    video: '/assets/videos/Photo.mp4',
    packages: [
      { name: 'Event Coverage', price: 'Rp 2.5 Juta', description: 'Dokumentasi event berdurasi pendek/menengah', features: ['4 Hours', 'Unlimited Photos', 'Basic Edit'] },
      { name: 'Wedding Pro', price: 'Rp 8.0 Juta', description: 'Dokumentasi lengkap hari bahagia', features: ['Full Day', '2 Photographers', 'Premium Album'] }
    ]
  },
  'videography': {
    title: 'Videography',
    subtitle: 'Moving pictures that move your audience.',
    content: 'Professional video shooting and editing services. From cinematic wedding films and event aftermovies to punchy, dynamic Reels and TikTok packages designed specifically for social media engagement.',
    video: '/assets/videos/Video.mp4',
    packages: [
      { name: 'Reels / TikTok Pack', price: 'Rp 4.0 Juta', description: 'Paket video vertikal berkala untuk sosmed', features: ['5 Vertical Videos', 'Trendy Editing', '1 Revision/Video'] },
      { name: 'Cinematic Event', price: 'Rp 7.5 Juta', description: 'Video aftermovie berkelas dengan grading premium', features: ['Highlight Video', 'Drone Footage', 'Color Grading'] }
    ]
  },
  'web-development': {
    title: 'Web Development',
    subtitle: 'Fast, responsive, and beautifully coded.',
    content: 'We design and develop modern websites that serve as your digital storefront. Using modern tech stacks (React, Next.js), we build Company Profiles, Landing Pages, and Web Apps that load instantly and scale seamlessly.',
    video: '/assets/videos/Web.mp4',
    packages: [
      { name: 'Landing Page', price: 'Rp 3.5 Juta', description: 'Halaman promosi cepat saji dengan performa tinggi', features: ['Single Page', 'Responsive', 'Contact Form'] },
      { name: 'Company Profile', price: 'Rp 8.0 Juta', description: 'Website profil perusahaan profesional terintegrasi CMS', features: ['Up to 5 Pages', 'CMS Integration', 'SEO Setup'] }
    ]
  },
  'it-solutions': {
    title: 'IT Solutions',
    subtitle: 'Hardware mastery and reliable maintenance.',
    content: 'Slow laptop? Need a custom PC build for gaming or heavy rendering? Our IT Solutions division handles everything from SSD/RAM upgrades, deep cleaning, custom PC building, and office network maintenance.',
    video: '/assets/videos/Laptop.mp4',
    packages: [
      { name: 'Laptop Deep Clean & Paste', price: 'Rp 250 Ribu', description: 'Pembersihan debu total & ganti pasta thermal', features: ['Dust Removal', 'Thermal Paste', 'Optimization'] },
      { name: 'Custom PC Build Service', price: 'Rp 500 Ribu', description: 'Rakit PC impian lu secara rapi & manajemen kabel', features: ['Consultation', 'Assembly', 'Cable Management'] }
    ]
  }
};

function matchCategory(packageCategory: string, slug: string): boolean {
  if (!packageCategory || !slug) return false;
  const pCat = packageCategory.toLowerCase().trim();
  const targetSlug = slug.toLowerCase().trim();

  const pCatSlug = pCat.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const targetSlugClean = targetSlug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (pCat === targetSlug || pCatSlug === targetSlugClean) return true;
  if (targetSlugClean.includes('web') && (pCat.includes('web') || pCat.includes('dev'))) return true;
  if (targetSlugClean.includes('graphic') && (pCat.includes('graphic') || pCat.includes('design') || pCat.includes('brand'))) return true;
  if (targetSlugClean.includes('photo') && (pCat.includes('photo') || pCat.includes('foto'))) return true;
  if (targetSlugClean.includes('video') && (pCat.includes('video') || pCat.includes('cinema'))) return true;
  if (targetSlugClean.includes('it') && (pCat.includes('it') || pCat.includes('hardware') || pCat.includes('laptop') || pCat.includes('pc'))) return true;

  return false;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceData[slug as keyof typeof serviceData];

  if (!service) {
    return {
      title: "Service Not Found | NOMSTD"
    };
  }

  return {
    title: `Jasa ${service.title} Premium | NOMSTD`,
    description: `${service.subtitle} ${service.content.substring(0, 120)}... Dapatkan penawaran harga menarik dari NOMSTD.`,
    keywords: [service.title.toLowerCase(), "jasa kreatif", "nomstd agency", "creative studio", "solusi IT"],
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceData[slug as keyof typeof serviceData];

  if (!service) {
    notFound();
  }

  // Fetch actual packages from DB with flexible category matching
  const dbPackages = await getPricingPackages();
  const filteredPackages = dbPackages.filter(p => matchCategory(p.category, slug));
  const finalPackages = filteredPackages.length > 0 ? filteredPackages : dbPackages;

  // Schema structured data for search engines
  const lowPriceValue = filteredPackages.length > 0
    ? (!isNaN(Number(filteredPackages[0].price)) ? Number(filteredPackages[0].price) : 250000)
    : (service.packages[0]?.price.includes("Ribu") 
        ? parseInt(service.packages[0].price.replace(/[^0-9]/g, '')) * 1000 
        : parseFloat(service.packages[0].price.replace(/[^0-9.]/g, '')) * 1000000);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.subtitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "NOMSTD",
      "image": "https://nomstd.my.id/assets/logo/favicon.svg",
      "url": "https://nomstd.my.id",
      "email": "admin@nomstudio.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bandung",
        "addressRegion": "Jawa Barat",
        "addressCountry": "ID"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "IDR",
      "lowPrice": lowPriceValue,
      "offerCount": filteredPackages.length > 0 ? filteredPackages.length : service.packages.length
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-black flex flex-col">
      <JsonLd schema={schemaMarkup} />
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-24 pb-12 px-4 md:px-6 border-b border-border">
        <div className="absolute inset-0 z-0">
          <video src={service.video} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10 pt-6">
          <span className="text-accent font-bold tracking-widest text-xs uppercase mb-2 block">— SERVICE DETAIL</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black mb-3">{service.title}</h1>
          <p className="text-xs md:text-sm text-muted font-medium max-w-2xl">{service.subtitle}</p>
        </div>
      </section>
 
      {/* Content */}
      <section className="py-10 md:py-12 px-4 md:px-6 bg-surface/60 border-b border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent mb-2 px-3 py-1 bg-accent/10 rounded-full inline-block">
            Layanan Overview
          </span>
          <h2 className="text-xl md:text-2xl font-display font-black uppercase text-foreground mb-3">
            Kenapa Memilih Layanan Ini?
          </h2>
          <p className="text-muted leading-relaxed text-xs md:text-sm font-medium">
            {service.content}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <span className="text-accent font-bold text-xs uppercase tracking-widest px-3 py-1 bg-accent/10 border border-accent/20 rounded-full inline-block mb-2">
              PAKET & PILIHAN HARGA
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight text-foreground mb-2">
              Pricing &amp; Packages
            </h2>
            <p className="text-muted font-medium text-xs">Pilih tiket paket layanan yang paling pas sesuai dengan skala bisnis Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
            {finalPackages.map((pkg, idx) => {
              const isDbPkg = 'features' in pkg && Array.isArray(pkg.features);
              const displayPriceValueOnly = isDbPkg
                ? (!isNaN(Number(pkg.price)) && pkg.price.trim() !== ''
                    ? new Intl.NumberFormat('id-ID').format(Number(pkg.price))
                    : pkg.price.replace(/Rp\.?\s?/i, ''))
                : pkg.price.replace(/Rp\.?\s?/i, '');
              
              const isPopular: boolean = 'is_popular' in pkg ? !!(pkg as any).is_popular : idx === 1;

              return (
                <div 
                  key={idx} 
                  className={`
                    relative p-5 md:p-6 flex flex-col h-full rounded-xl transition-all duration-300
                    ${isPopular 
                      ? 'bg-surface border-2 border-accent text-foreground shadow-lg scale-100 z-10' 
                      : 'bg-surface border border-border/80 text-foreground shadow-sm hover:border-accent hover:shadow-xl hover:-translate-y-1'
                    }
                  `}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white font-bold text-xs uppercase tracking-wider px-6 py-2 rounded-full shadow-lg flex items-center gap-2 z-20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,29.53,0L165.7,81.24l59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg> 
                      Paling Popular
                    </div>
                  )}

                  <div className="mb-6 text-center mt-2 relative z-10">
                    <h3 className="text-3xl font-display font-black uppercase tracking-tight text-foreground mb-3">
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className="text-sm leading-relaxed text-muted font-medium min-h-[48px]">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  <div className="w-full border-b border-border/60 my-4"></div>

                  <div className="mb-6 text-center">
                    <div className="flex items-start justify-center gap-1.5 mb-1">
                      <span className="text-xl font-bold mt-2 text-accent font-display">Rp</span>
                      <span className="text-5xl md:text-6xl font-display font-black tracking-tighter leading-none text-foreground">
                        {displayPriceValueOnly}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase text-muted font-bold tracking-widest">NET INVESTMENT</p>
                  </div>

                  <div className="w-full border-b border-border/60 my-4"></div>

                  <div className="flex-1 mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4 text-accent">
                      Fasilitas & Fitur Paket:
                    </p>
                    <ul className="space-y-3.5">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0 text-accent">
                            <svg width="18" height="18" fill="none" viewBox="0 0 256 256" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"><polyline points="216 72 104 184 48 128"></polyline></svg>
                          </div>
                          <span className="font-semibold text-sm leading-relaxed text-foreground">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`https://wa.me/6282130704794?text=Halo%20min,%20aku%20mau%20pesen%20paket%20${encodeURIComponent(pkg.name)}%20dong!%20%F0%9F%90%BE`}
                    target="_blank"
                    rel="noreferrer"
                    className={`
                      w-full py-4 px-6 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 shadow-md cursor-pointer
                      ${isPopular 
                        ? 'bg-accent text-white hover:bg-accent/90 shadow-accent/20 hover:scale-[1.02]' 
                        : 'bg-background border border-border text-foreground hover:bg-accent hover:text-white hover:border-accent hover:scale-[1.02]'
                      }
                    `}
                  >
                    <span>Pesan Paket Sekarang</span>
                    <svg width="18" height="18" fill="none" viewBox="0 0 256 256" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"><line x1="40" y1="128" x2="216" y2="128"></line><polyline points="144 56 216 128 144 200"></polyline></svg>
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-16 space-y-4 max-w-xl mx-auto flex flex-col md:flex-row gap-4">
            <Link href="/#contact" className="block w-full py-4 text-center rounded-2xl bg-accent text-white font-black text-sm uppercase tracking-wider hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all hover:scale-[1.02]">
              Consult Custom Project
            </Link>
            <Link href={`/portfolio/${slug}`} className="block w-full py-4 text-center rounded-2xl bg-surface border border-border text-foreground hover:border-accent hover:text-accent font-black text-sm uppercase tracking-wider transition-all">
              Explore Portfolio
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
