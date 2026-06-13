'use client';

export function Footer() {
  return (
    <footer className="py-16 border-t-8 border-foreground bg-black text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="bg-accent border-4 border-foreground shadow-[8px_8px_0_0_#ffffff] p-6 mb-8 hover:-rotate-2 transition-transform cursor-pointer">
          <img src="/assets/logo/logo.svg" alt="NOMSTD Logo" className="h-12 w-auto" />
        </div>
        
        <p className="text-white font-bold uppercase tracking-widest text-sm md:text-base mb-8">
          © {new Date().getFullYear()} NOMSTD Creative Studio. All rights reserved.
        </p>
        
        <div className="flex justify-center gap-6 text-sm font-black uppercase tracking-widest text-white">
          <a href="https://www.instagram.com/nomstd/" target="_blank" rel="noreferrer" className="py-2 px-4 border-2 border-transparent hover:border-white hover:bg-white hover:text-black transition-all">Instagram</a>
          <a href="#" className="py-2 px-4 border-2 border-transparent hover:border-white hover:bg-white hover:text-black transition-all">Twitter</a>
          <a href="#" className="py-2 px-4 border-2 border-transparent hover:border-white hover:bg-white hover:text-black transition-all">TikTok</a>
        </div>
      </div>
    </footer>
  );
}
