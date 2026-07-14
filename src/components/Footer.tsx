'use client';

export function Footer() {
  return (
    <footer className="py-16 md:py-24 border-t border-border bg-background text-center relative overflow-hidden">
      {/* Soft Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E5E7EB_2px,transparent_2px)] [background-size:24px_24px]" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="bg-white border border-border shadow-sm rounded-3xl p-6 mb-10 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <img src="/assets/logo/logo2.svg" alt="NOMSTD Logo" className="h-10 w-auto" />
        </div>
        
        <p className="text-muted font-bold text-sm md:text-base mb-8">
          © {new Date().getFullYear()} NOMSTD Creative Studio. All rights reserved.
        </p>
        
        <div className="flex justify-center gap-4 text-sm font-bold text-muted mb-8">
          <a href="https://www.instagram.com/nomstd/" target="_blank" rel="noreferrer" className="py-2 px-6 rounded-full border border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">Instagram</a>
          <a href="#" className="py-2 px-6 rounded-full border border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">Twitter</a>
          <a href="#" className="py-2 px-6 rounded-full border border-border hover:border-accent hover:text-accent hover:bg-accent/5 transition-all">TikTok</a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-400">
          <a href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</a>
          <a href="/disclaimer" className="hover:text-accent transition-colors">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}
