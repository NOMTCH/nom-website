"use client";
import Link from "next/link";

const footerLinks = {
  Services: [
    { label: "Graphic Design", href: "/services/graphic-design" },
    { label: "Web Design", href: "/services/web-design" },
    { label: "Digital Invitations", href: "/services/digital-invitation" },
  ],
  Studio: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ],
  Social: [
    { label: "Instagram", href: "https://instagram.com/nomstd" },
{ label: "Behance", href: "https://www.behance.net/iammonoz" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-darker border-t border-white/5">
      {/* Top Marquee */}
      <div className="border-b border-white/5 py-4 overflow-hidden">
        <div className="marquee-wrapper">
          <div className="marquee-inner">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-6">
                <span className="font-display text-2xl tracking-widest text-white/20">
                  NOM STUDIO
                </span>
                <span className="text-accent text-xl">✦</span>
                <span className="font-display text-2xl tracking-widest text-white/20">
                  CREATIVE DIGITAL
                </span>
                <span className="text-accent text-xl">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2 mb-6">
              <span className="font-display text-3xl text-white tracking-widest">NOM</span>
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-display text-3xl text-neutral tracking-widest">STUDIO</span>
            </Link>
            <p className="text-neutral/70 text-sm leading-relaxed max-w-xs font-body">
              A modern creative digital studio crafting bold visual identities, immersive web experiences, and bespoke digital invitations.
            </p>
            <div className="mt-8">
              <a
                href="mailto:nomstudiodesign@gmail.com"
                className="text-accent font-mono text-sm hover:underline"
              >
                nomstudiodesign@gmail.com
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white/40 text-xs font-mono tracking-[0.2em] uppercase mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral text-sm hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral/40 text-xs font-mono">
            © {new Date().getFullYear()} NOM Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-neutral/40 text-xs font-mono">Available for new projects</span>
          </div>
          <p className="text-neutral/40 text-xs font-mono">
            Designed & Built with ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
