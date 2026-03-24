"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home",     href: "/"          },
  { label: "Services", href: "/services"  },
  { label: "Projects", href: "/portfolio" },
  { label: "About",    href: "/about"     },
  { label: "Contact",  href: "/contact"   },
];

// ── Glitch hook ──────────────────────────────────────────────────
function useLogoGlitch() {
  const [active, setActive]   = useState(false);
  const [slices, setSlices]   = useState<{ y: number; offset: number; h: number }[]>([]);
  const [rgbShift, setRgbShift] = useState({ r: 0, g: 0, b: 0 });
  const rafRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iterRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current) clearTimeout(rafRef.current);
    setActive(false);
    setSlices([]);
    setRgbShift({ r: 0, g: 0, b: 0 });
    iterRef.current = 0;
  }, []);

  const start = useCallback(() => {
    if (active) return;
    setActive(true);
    iterRef.current = 0;

    const totalFrames = 14;

    const tick = () => {
      iterRef.current += 1;

      // random horizontal slice offsets — 2-4 slices per frame
      const count = 2 + Math.floor(Math.random() * 3);
      const newSlices = Array.from({ length: count }, () => ({
        y:      Math.random() * 100,          // % from top
        offset: (Math.random() - 0.5) * 14,  // px shift
        h:      2 + Math.random() * 12,       // slice height %
      }));
      setSlices(newSlices);

      // RGB channel shift
      setRgbShift({
        r:  (Math.random() - 0.5) * 6,
        g:  (Math.random() - 0.5) * 2,
        b:  (Math.random() - 0.5) * 6,
      });

      if (iterRef.current < totalFrames) {
        // variable frame timing — glitch is uneven
        const delay = iterRef.current < 6
          ? 35 + Math.random() * 30     // fast scramble at start
          : 50 + Math.random() * 60;    // slower resolve at end
        rafRef.current = setTimeout(tick, delay);
      } else {
        stop();
      }
    };

    tick();
  }, [active, stop]);

  useEffect(() => () => { if (rafRef.current) clearTimeout(rafRef.current); }, []);

  return { active, slices, rgbShift, start, stop };
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();
  const glitch   = useLogoGlitch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-white/5 py-4"
          : "py-7"
      )}>
        <div className="mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between max-w-[1600px]">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            href="/"
            aria-label="Home"
            className="relative flex items-center select-none"
            onMouseEnter={glitch.start}
            onMouseLeave={glitch.stop}
          >
            {/* ── Glitch container ─────────────────────────── */}
            <div
              className="relative overflow-hidden"
              style={{ height: 40, width: 160 }}
            >

              {/* BASE logo — always visible */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="NOM Studio"
                className="h-10 w-auto absolute top-0 left-0"
                style={{
                  maxWidth: 160,
                  transition: "filter 0.05s",
                  filter: glitch.active
                    ? `drop-shadow(0 0 6px rgba(32,255,0,0.7))`
                    : "none",
                }}
              />

              {/* RGB RED channel layer */}
              {glitch.active && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/logo.svg"
                  alt=""
                  aria-hidden
                  className="h-10 w-auto absolute top-0 left-0 pointer-events-none"
                  style={{
                    maxWidth: 160,
                    transform: `translate(${glitch.rgbShift.r}px, 0)`,
                    opacity: 0.55,
                    filter: "sepia(1) saturate(8) hue-rotate(-30deg)",
                    mixBlendMode: "screen",
                  }}
                />
              )}

              {/* RGB CYAN channel layer */}
              {glitch.active && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/logo.svg"
                  alt=""
                  aria-hidden
                  className="h-10 w-auto absolute top-0 left-0 pointer-events-none"
                  style={{
                    maxWidth: 160,
                    transform: `translate(${glitch.rgbShift.b}px, 0)`,
                    opacity: 0.45,
                    filter: "sepia(1) saturate(8) hue-rotate(160deg)",
                    mixBlendMode: "screen",
                  }}
                />
              )}

              {/* SLICE layers — horizontal clip glitch */}
              {glitch.active && glitch.slices.map((slice, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src="/logo.svg"
                  alt=""
                  aria-hidden
                  className="h-10 w-auto absolute top-0 left-0 pointer-events-none"
                  style={{
                    maxWidth: 160,
                    transform: `translate(${slice.offset}px, 0)`,
                    clipPath: `inset(${slice.y}% 0 ${Math.max(0, 100 - slice.y - slice.h)}% 0)`,
                    opacity: 0.9,
                    filter: i % 2 === 0
                      ? "sepia(1) saturate(10) hue-rotate(80deg) brightness(1.4)"   // green tint
                      : "sepia(1) saturate(10) hue-rotate(-30deg) brightness(1.2)", // red tint
                  }}
                />
              ))}

              {/* scanline flicker overlay */}
              {glitch.active && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
                    mixBlendMode: "multiply",
                  }}
                />
              )}

            </div>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────── */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-heading font-medium tracking-widest uppercase transition-colors duration-200 relative group",
                    pathname === link.href
                      ? "text-accent"
                      : "text-neutral hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              </li>
            ))}
          </ul>

          {/* ── CTA ──────────────────────────────────────────── */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="text-sm font-heading font-medium tracking-widest uppercase px-6 py-2.5 border border-accent text-accent hover:bg-accent hover:text-darker transition-all duration-300"
            >
              Let's Talk
            </Link>
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────── */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={cn(
              "block w-6 h-px bg-white transition-all duration-300",
              menuOpen && "rotate-45 translate-y-2.5"
            )} />
            <span className={cn(
              "block w-4 h-px bg-accent transition-all duration-300",
              menuOpen && "opacity-0 w-0"
            )} />
            <span className={cn(
              "block w-6 h-px bg-white transition-all duration-300",
              menuOpen && "-rotate-45 -translate-y-2.5"
            )} />
          </button>

        </div>
      </nav>

      {/* ── Mobile Menu ────────────────────────────────────────── */}
      <div className={cn(
        "fixed inset-0 z-40 bg-darker flex flex-col justify-center transition-all duration-500",
        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div className="px-10">
          <ul className="space-y-2">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{
                  transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                  transform: menuOpen ? "translateX(0)" : "translateX(-40px)",
                  opacity: menuOpen ? 1 : 0,
                  transition: "all 0.4s ease",
                }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "font-display text-6xl tracking-widest hover:text-accent transition-colors",
                    pathname === link.href ? "text-accent" : "text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex items-center gap-4">
            <a href="https://instagram.com" className="text-neutral hover:text-accent text-sm font-mono transition-colors">IG</a>
<a href="https://www.behance.net/iammonoz" className="text-neutral hover:text-accent text-sm font-mono transition-colors">BE</a>
            <a href="mailto:nomstudiodesign@gmail.com" className="text-neutral hover:text-accent text-sm font-mono transition-colors">EMAIL</a>
          </div>
        </div>
      </div>
    </>
  );
}