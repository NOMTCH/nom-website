'use client';

import Link from 'next/link';
import { ArrowUpRight, GithubLogo, InstagramLogo, WhatsappLogo, DribbbleLogo, BehanceLogo, Circle } from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background text-foreground relative overflow-hidden pt-20 pb-12">
      {/* Background Ambient Glow & Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(var(--color-border)_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-accent/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Giant Headline CTA Banner */}
        <div className="bg-surface border border-border/80 rounded-3xl p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group hover:border-accent/50 transition-all duration-300">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-4">
              <Circle weight="fill" className="text-accent text-[8px] animate-pulse" />
              <span>Ready to Scale Your Business?</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-display font-black leading-tight text-foreground">
              Let's Build Something <span className="text-accent">Crazy Together.</span>
            </h3>
            <p className="text-muted text-xs md:text-sm font-medium mt-2">
              Punya ide web app, butuh managed developer team, atau butuh setup server VPS? Tim NOMSTD siap eksekusi.
            </p>
          </div>
          
          <a
            href="https://wa.me/6282130704794?text=Halo%20NOMSTD,%20saya%20mau%20konsultasi%20projek"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-accent text-black font-bold px-7 py-4 rounded-xl shadow-lg hover:bg-accent/90 hover:scale-105 transition-all duration-300 text-sm md:text-base whitespace-nowrap"
          >
            <span>Konsultasi Projek</span>
            <ArrowUpRight size={20} weight="bold" />
          </a>
        </div>

        {/* Footer Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 pb-16 border-b border-border/60">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block bg-surface border border-border rounded-2xl p-3 mb-5 hover:border-accent transition-colors shadow-sm">
              <img src="/assets/logo/logo2.svg" alt="NOMSTD Logo" className="h-8 w-auto" />
            </Link>
            
            <p className="text-muted text-xs md:text-sm font-medium leading-relaxed max-w-sm mb-4">
              Creative Agency &amp; IT Solutions Studio terpercaya. Jasa Pembuatan Website Modern, Desain Grafis, Studio Foto &amp; Cloud VPS melayani wilayah Cipanas, Cianjur, Sukabumi, Purwakarta, Bandung &amp; seluruh Indonesia.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-foreground mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Accepting New Projects &amp; Managed Dev</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 font-display">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm font-medium text-muted">
              <li>
                <Link href="/services/web-development" className="hover:text-accent transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services/it-solutions" className="hover:text-accent transition-colors">
                  IT &amp; Cloud VPS Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/graphic-design" className="hover:text-accent transition-colors">
                  Graphic Design &amp; Branding
                </Link>
              </li>
              <li>
                <Link href="/services/photography" className="hover:text-accent transition-colors">
                  Photography Studio
                </Link>
              </li>
              <li>
                <Link href="/services/videography" className="hover:text-accent transition-colors">
                  Videography &amp; Reels
                </Link>
              </li>
              <li>
                <Link href="/services/digital-invitation" className="hover:text-accent transition-colors">
                  Digital Invitation
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Tools */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 font-display">
              Portals &amp; Tools
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm font-medium text-muted">
              <li>
                <Link href="/#pricing" className="hover:text-accent transition-colors">
                  Pricing &amp; IDR Estimator
                </Link>
              </li>
              <li>
                <Link href="/tools/image-resizer" className="hover:text-accent transition-colors">
                  Free Image Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/color-palette" className="hover:text-accent transition-colors">
                  Color Palette Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Location */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 font-display">
              Connect &amp; Showcase
            </h4>
            <div className="flex flex-wrap gap-2.5 mb-6">
              <a
                href="https://wa.me/6282130704794"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp Official"
                className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <WhatsappLogo size={20} weight="fill" />
              </a>
              <a
                href="https://www.instagram.com/nomstd/"
                target="_blank"
                rel="noreferrer"
                title="Instagram @nomstd"
                className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <InstagramLogo size={20} weight="fill" />
              </a>
              <a
                href="https://dribbble.com/iammonoz"
                target="_blank"
                rel="noreferrer"
                title="Dribbble @iammonoz"
                className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <DribbbleLogo size={20} weight="fill" />
              </a>
              <a
                href="https://www.behance.net/iammonoz"
                target="_blank"
                rel="noreferrer"
                title="Behance /iammonoz"
                className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <BehanceLogo size={20} weight="fill" />
              </a>
              <a
                href="https://github.com/iammonoz"
                target="_blank"
                rel="noreferrer"
                title="GitHub @iammonoz"
                className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:scale-110 transition-all duration-300 shadow-sm"
              >
                <GithubLogo size={20} weight="fill" />
              </a>
            </div>

            <div className="text-xs text-muted font-medium border-t border-border/50 pt-4">
              <p className="font-bold text-foreground mb-1">📍 Main HQ Location:</p>
              <p className="leading-normal">Cianjur, Jawa Barat, Indonesia</p>
              <p className="text-[11px] text-accent mt-1 font-semibold">Serving Bandung, Jakarta &amp; Worldwide Remote 🌐</p>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted">
          <p>
            © {new Date().getFullYear()} <span className="text-foreground font-bold">NOMSTD</span>. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-accent transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
