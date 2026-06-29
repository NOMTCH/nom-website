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

  // Fetch actual packages from DB
  const dbPackages = await getPricingPackages();
  const categoryName = getCategoryNameFromSlug(slug);
  const filteredPackages = dbPackages.filter(p => p.category === categoryName);

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
      <section className="relative pt-32 pb-20 px-6 border-b border-border">
        <div className="absolute inset-0 z-0">
          <video src={service.video} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto relative z-10 pt-12">
          <span className="text-accent font-bold tracking-widest text-sm uppercase mb-4 block">— SERVICE DETAIL</span>
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6">{service.title}</h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl">{service.subtitle}</p>
        </div>
      </section>
 
      {/* Content */}
      <section className="py-20 px-6 bg-white border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed text-lg md:text-xl font-medium">
            {service.content}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-gray-900 mb-4">Pricing & Packages</h2>
            <p className="text-gray-500 font-medium text-lg">Pilih tiket layanan yang sesuai dengan kebutuhan bisnis lu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 items-start">
            {(filteredPackages.length > 0 ? filteredPackages : service.packages).map((pkg, idx) => {
              const isDbPkg = 'features' in pkg && Array.isArray(pkg.features);
              const displayPriceValueOnly = isDbPkg
                ? (!isNaN(Number(pkg.price)) && pkg.price.trim() !== ''
                    ? new Intl.NumberFormat('id-ID').format(Number(pkg.price))
                    : pkg.price.replace(/Rp\.?\s?/i, ''))
                : pkg.price.replace(/Rp\.?\s?/i, '');
              
              const isPopular: boolean = 'is_popular' in pkg ? !!(pkg as any).is_popular : idx === 1;

              // Random receipt number based on name length so it's consistent during hydration
              const receiptNum = (pkg.name.length * 1234 % 9000) + 1000;

              return (
                <div 
                  key={idx} 
                  className={`
                    relative p-8 md:p-10 flex flex-col h-full bg-[#fdfdfd] border-[3px] border-dashed border-gray-950 transition-all duration-300
                    ${isPopular 
                      ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] scale-100 lg:scale-105 z-10 -rotate-1' 
                      : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Fake Barcode */}
                  <div className="flex gap-1 h-8 w-full max-w-[200px] mx-auto mb-6 opacity-80 justify-center">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 1].map((w, i) => (
                      <div key={i} className="bg-gray-950 h-full" style={{ width: `${w * 3}px` }}></div>
                    ))}
                  </div>

                  {isPopular && (
                    <div className="absolute top-12 -right-4 md:right-4 rotate-12 border-4 border-accent text-accent font-black text-xl uppercase tracking-widest px-4 py-1 rounded-sm opacity-90 z-20 bg-[#fdfdfd] shadow-sm">
                      BEST SELLER
                    </div>
                  )}

                  <div className="mb-6 text-center mt-2 relative z-10">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                      RECEIPT NO. {receiptNum}-0{idx + 1}
                    </p>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-gray-950 mb-3 font-display">
                      {pkg.name}
                    </h3>
                    {pkg.description && (
                      <p className="text-sm leading-relaxed text-gray-600 font-medium font-mono h-12">
                        {pkg.description}
                      </p>
                    )}
                  </div>

                  <div className="w-full border-b-[3px] border-dashed border-gray-300 my-6"></div>

                  <div className="mb-6 text-center">
                    <div className="flex items-start justify-center gap-2 mb-1">
                      <span className="text-xl font-bold mt-2 font-mono text-gray-950">IDR</span>
                      <span className="text-5xl md:text-6xl font-black tracking-tighter leading-none font-display text-gray-950">
                        {displayPriceValueOnly}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] uppercase text-gray-400 font-bold tracking-widest">NET AMOUNT</p>
                  </div>

                  <div className="w-full border-b-[3px] border-dashed border-gray-300 my-6"></div>

                  <div className="flex-1 mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-6 text-gray-950 font-mono bg-gray-200 inline-block px-2 py-1">
                      ITEMIZED SERVICES:
                    </p>
                    <ul className="space-y-4">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="mt-0.5 shrink-0 text-gray-950">
                            <svg width="18" height="18" fill="none" viewBox="0 0 256 256" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"><polyline points="216 72 104 184 48 128"></polyline></svg>
                          </div>
                          <span className="font-semibold text-sm leading-relaxed text-gray-800 font-mono">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full border-b-[3px] border-dashed border-gray-300 my-6"></div>

                  <a
                    href={`https://wa.me/6282130704794?text=Halo%20min,%20aku%20mau%20pesen%20paket%20${encodeURIComponent(pkg.name)}%20dong!%20%F0%9F%90%BE`}
                    target="_blank"
                    rel="noreferrer"
                    className={`
                      w-full py-4 px-6 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl transition-all duration-300
                      ${isPopular 
                        ? 'bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg hover:-translate-y-1' 
                        : 'bg-surface border border-gray-200 text-gray-900 hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-1 shadow-sm hover:shadow-md'
                      }
                    `}
                  >
                    ISSUE TICKET
                    <svg width="20" height="20" fill="none" viewBox="0 0 256 256" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"><line x1="40" y1="128" x2="216" y2="128"></line><polyline points="144 56 216 128 144 200"></polyline></svg>
                  </a>
                </div>
              );
            })}
          </div>
          <div className="mt-16 space-y-4 max-w-xl mx-auto flex flex-col md:flex-row gap-4">
            <Link href="/#contact" className="block w-full py-4 text-center rounded-xl bg-gray-950 text-white font-bold hover:bg-accent hover:text-black transition-colors shadow-sm">
              Book Custom Project
            </Link>
            <Link href={`/portfolio/${slug}`} className="block w-full py-4 text-center rounded-xl bg-white border border-border text-foreground font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Explore Our Portfolio
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
