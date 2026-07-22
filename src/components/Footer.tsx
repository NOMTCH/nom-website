'use client';

export function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-border bg-background text-foreground text-center relative overflow-hidden">
      {/* Soft Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(var(--color-border)_2px,transparent_2px)] [background-size:24px_24px]" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="bg-surface border border-border shadow-md rounded-3xl p-6 mb-10 hover:-translate-y-2 hover:shadow-lg hover:border-accent transition-all duration-300 cursor-pointer">
          <img src="/assets/logo/logo2.svg" alt="NOMSTD Logo" className="h-10 w-auto" />
        </div>
        
        <p className="text-muted font-semibold text-sm md:text-base mb-3">
          © {new Date().getFullYear()} NOMSTD Creative Studio &amp; IT Solutions.
        </p>
        <p className="text-xs text-accent font-bold mb-8">
          📍 Indonesia &amp; Worldwide
          <span className="sr-only">Studio Kreatif &amp; Jasa IT NOMSTD berlokasi di Cianjur, Jawa Barat, Indonesia</span>
        </p>
        
        <div className="flex justify-center gap-4 text-sm font-bold text-foreground mb-8">
          <a href="https://www.instagram.com/nomstd/" target="_blank" rel="noreferrer" className="py-2 px-6 rounded-full border border-border bg-surface hover:border-accent hover:text-accent transition-all">Instagram</a>
          <a href="#" className="py-2 px-6 rounded-full border border-border bg-surface hover:border-accent hover:text-accent transition-all">Twitter</a>
          <a href="#" className="py-2 px-6 rounded-full border border-border bg-surface hover:border-accent hover:text-accent transition-all">TikTok</a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted">
          <a href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</a>
          <a href="/disclaimer" className="hover:text-accent transition-colors">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}
