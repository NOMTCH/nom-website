import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";

// Data could eventually come from Supabase or MDX
const serviceData = {
  'graphic-design': {
    title: 'Graphic Design',
    subtitle: 'Branding that sticks. Layouts that convert.',
    content: 'We build visual identities from the ground up. Logo design, brand guidelines, brochure layouts, and complete social media visual management. Please note: We focus strictly on modern typography, layout, and composition. We do not provide hand-drawn digital illustration services.',
    video: '/assets/videos/Graphic.mp4',
    packages: [
      { name: 'Logo Starter', price: 'Rp 1.5 Juta', features: ['2 Concepts', '3 Revisions', 'Master Files'] },
      { name: 'Brand Identity Full', price: 'Rp 5.0 Juta', features: ['Primary & Secondary Logo', 'Brand Book', 'Social Media Templates'] }
    ]
  },
  'photography': {
    title: 'Photography',
    subtitle: 'Capturing moments with cinematic precision.',
    content: 'Whether it is a beautiful wedding, a formal corporate gathering, a school farewell, or outbound activities, we provide professional coverage to ensure your memories are preserved beautifully. We also offer commercial product photography with studio-grade lighting.',
    video: '/assets/videos/Photo.mp4',
    packages: [
      { name: 'Event Coverage', price: 'Rp 2.5 Juta', features: ['4 Hours', 'Unlimited Photos', 'Basic Edit'] },
      { name: 'Wedding Pro', price: 'Rp 8.0 Juta', features: ['Full Day', '2 Photographers', 'Premium Album'] }
    ]
  },
  'videography': {
    title: 'Videography',
    subtitle: 'Moving pictures that move your audience.',
    content: 'Professional video shooting and editing services. From cinematic wedding films and event aftermovies to punchy, dynamic Reels and TikTok packages designed specifically for social media engagement.',
    video: '/assets/videos/Video.mp4',
    packages: [
      { name: 'Reels / TikTok Pack', price: 'Rp 4.0 Juta', features: ['5 Vertical Videos', 'Trendy Editing', '1 Revision/Video'] },
      { name: 'Cinematic Event', price: 'Rp 7.5 Juta', features: ['Highlight Video', 'Drone Footage', 'Color Grading'] }
    ]
  },
  'web-development': {
    title: 'Web Development',
    subtitle: 'Fast, responsive, and beautifully coded.',
    content: 'We design and develop modern websites that serve as your digital storefront. Using modern tech stacks (React, Next.js), we build Company Profiles, Landing Pages, and Web Apps that load instantly and scale seamlessly.',
    video: '/assets/videos/Web.mp4',
    packages: [
      { name: 'Landing Page', price: 'Rp 3.5 Juta', features: ['Single Page', 'Responsive', 'Contact Form'] },
      { name: 'Company Profile', price: 'Rp 8.0 Juta', features: ['Up to 5 Pages', 'CMS Integration', 'SEO Setup'] }
    ]
  },
  'it-solutions': {
    title: 'IT Solutions',
    subtitle: 'Hardware mastery and reliable maintenance.',
    content: 'Slow laptop? Need a custom PC build for gaming or heavy rendering? Our IT Solutions division handles everything from SSD/RAM upgrades, deep cleaning, custom PC building, and office network maintenance.',
    video: '/assets/videos/Laptop.mp4',
    packages: [
      { name: 'Laptop Deep Clean & Paste', price: 'Rp 250 Ribu', features: ['Dust Removal', 'Thermal Paste', 'Optimization'] },
      { name: 'Custom PC Build Service', price: 'Rp 500 Ribu', features: ['Consultation', 'Assembly', 'Cable Management'] }
    ]
  }
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = serviceData[params.slug as keyof typeof serviceData];

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-black flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <video src={service.video} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto relative z-10 pt-12">
          <span className="text-accent font-bold tracking-widest text-sm uppercase mb-4 block">— SERVICE DETAIL</span>
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6">{service.title}</h1>
          <p className="text-2xl text-gray-400 font-medium max-w-2xl">{service.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Overview</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              {service.content}
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Pricing & Packages</h2>
            <div className="grid gap-6">
              {service.packages.map((pkg, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-sm">{pkg.price}</span>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <svg className="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href="/#contact" className="mt-8 block w-full py-4 text-center rounded-xl bg-white text-black font-bold hover:bg-accent transition-colors">
              Book this Service
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
