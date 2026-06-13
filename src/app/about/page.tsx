import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { JellyScroll } from '@/components/JellyScroll';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-[80px]">
      <Navbar />
      <JellyScroll>
        <div className="container mx-auto px-6 md:px-12 pb-32">
          {/* Header Section */}
          <header className="py-24 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-accent"></div>
              <span className="text-accent font-bold text-sm">About Us</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black leading-tight text-foreground mb-8">
              We don&apos;t just build, <br/>
              we <span className="text-accent-secondary">innovate.</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              NOMSTD adalah Creative Studio & IT Solutions yang lahir dari keresahan melihat banyaknya bisnis yang jalan di tempat karena teknologi yang usang dan desain yang kaku. Kami hadir untuk meracik ide liar menjadi produk digital yang nggak cuma estetik, tapi juga fungsional.
            </p>
          </header>

          {/* Vision & Mission Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
            <div className="p-10 bg-surface neo-brutalist">
              <div className="w-14 h-14 bg-accent/20 border-2 border-border flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#0F0F0F]">
                <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted leading-relaxed">
                Menjadi pionir studio kreatif yang mendobrak batasan antara seni visual (desain/fotografi) dan logika mesin (IT/coding), menciptakan ekosistem digital yang tak lekang oleh waktu.
              </p>
            </div>
            <div className="p-10 bg-surface neo-brutalist">
              <div className="w-14 h-14 bg-accent-secondary/20 border-2 border-border flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#0F0F0F]">
                <svg className="w-6 h-6 text-accent-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted leading-relaxed">
                Membantu brand kecil hingga korporat untuk menemukan identitas sejati mereka, mempercepat alur kerja dengan teknologi mutakhir, dan memberikan edukasi digital gratis bagi komunitas.
              </p>
            </div>
          </div>

          {/* Culture / Image Banner */}
          <div className="relative w-full aspect-[21/9] overflow-hidden mb-32 neo-brutalist">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" 
              alt="NOMSTD Team" 
              className="absolute inset-0 w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter opacity-80 mix-blend-overlay">NOMSTD CULTURE</h2>
            </div>
          </div>

        </div>
        <Footer />
      </JellyScroll>
    </main>
  );
}
