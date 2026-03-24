"use client";
import type { Context } from "gsap";
import { useEffect, useRef } from "react";
import Link from "next/link";

// ── react-icons imports ──────────────────────────────────────────
import { Icon } from "@iconify/react";

// ── Stack config ─────────────────────────────────────────────────
const STACK = [
  // inner ring — dev tools (clockwise)
  { name: "Next.js",     icon: "simple-icons:nextdotjs",          color: "#ffffff", ring: 0 },
  { name: "React",       icon: "simple-icons:react",              color: "#61DAFB", ring: 0 },
  { name: "TypeScript",  icon: "simple-icons:typescript",         color: "#3178C6", ring: 0 },
  { name: "Tailwind",    icon: "simple-icons:tailwindcss",        color: "#06B6D4", ring: 0 },
  // outer ring — design tools (counter-clockwise)
  { name: "GSAP",        icon: "simple-icons:greensock",          color: "#88CE02", ring: 1 },
  { name: "Figma",       icon: "simple-icons:figma",              color: "#F24E1E", ring: 1 },
  { name: "Illustrator", icon: "simple-icons:adobeillustrator",   color: "#FF9A00", ring: 1 },
  { name: "Photoshop",   icon: "simple-icons:adobephotoshop",     color: "#31A8FF", ring: 1 },
];

const RINGS = [
  { radius: 130, duration: 18, direction:  1 },
  { radius: 210, duration: 28, direction: -1 },
];

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const orbRef      = useRef<HTMLDivElement>(null);
  const lineRefs    = useRef<(HTMLElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const orbitRef    = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const noiseRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: Context;

    const init = async () => {
      if (typeof window === "undefined") return;

      const { gsap }          = await import("gsap");
      const { SplitText }     = await import("gsap/SplitText");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { CustomEase }    = await import("gsap/CustomEase");

      gsap.registerPlugin(SplitText, ScrollTrigger, CustomEase);
      CustomEase.create("expo.out",  "0.16,1,0.3,1");
      CustomEase.create("back.soft", "0.34,1.3,0.64,1");

      ctx = gsap.context(() => {

        gsap.set(
          [badgeRef.current, subtitleRef.current,
           ctaRef.current, scrollRef.current, orbitRef.current],
          { autoAlpha: 0 }
        );

        const master = gsap.timeline({ defaults: { ease: "expo.out" } });

        // noise flash
        master.fromTo(noiseRef.current,
          { autoAlpha: 0.18 },
          { autoAlpha: 0, duration: 0.55, ease: "power2.out" }, 0
        );

        // badge
        master.fromTo(badgeRef.current,
          { autoAlpha: 0, y: -28, rotateX: -60 },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.7,
            transformOrigin: "top center" }, 0.2
        );

        // headline SplitText
        lineRefs.current.forEach((el, i) => {
          if (!el) return;
          const split = new SplitText(el, {
            type: "chars",
            charsClass: "split-char",
          });
          gsap.set(split.chars, {
            opacity: 0, yPercent: 110, rotateX: -80,
            transformOrigin: "50% 100%",
          });
          master.to(split.chars, {
            opacity: 1, yPercent: 0, rotateX: 0,
            duration: 0.7,
            stagger: { each: 0.03, from: "start" },
            ease: "expo.out",
          }, 0.3 + i * 0.12);
        });

        // subtitle
        if (subtitleRef.current) {
          const splitSub = new SplitText(subtitleRef.current, { type: "words" });
          gsap.set(splitSub.words, { opacity: 0, y: 20 });
          master.to(subtitleRef.current, { autoAlpha: 1, duration: 0 }, 1.1);
          master.to(splitSub.words, {
            opacity: 1, y: 0, duration: 0.55,
            stagger: 0.038, ease: "power3.out",
          }, 1.1);
        }

        // cta
        master.fromTo(ctaRef.current,
          { autoAlpha: 0, y: 32, skewX: -3 },
          { autoAlpha: 1, y: 0, skewX: 0, duration: 0.65, ease: "back.soft" },
          1.45
        );

        // orbit reveal + icon pop-in
        master.to(orbitRef.current, { autoAlpha: 1, duration: 0 }, 1.5);
        const iconEls = orbitRef.current?.querySelectorAll<HTMLElement>(".orbit-icon");
        if (iconEls) {
          gsap.set(iconEls, { scale: 0, opacity: 0 });
          master.to(iconEls, {
            scale: 1, opacity: 1,
            duration: 0.5,
            stagger: { each: 0.08, from: "random" },
            ease: "back.out(1.8)",
          }, 1.6);
        }

        // scroll indicator
        master.fromTo(scrollRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 0.6, y: 0, duration: 0.7 }, 1.95
        );

        // orb mouse parallax
        const section = sectionRef.current;
        const orb     = orbRef.current;
        if (!section || !orb) return;

        section.addEventListener("mousemove", (e: MouseEvent) => {
          const dx = (e.clientX / window.innerWidth  - 0.5) * 80;
          const dy = (e.clientY / window.innerHeight - 0.5) * 50;
          gsap.to(orb, { x: dx, y: dy, duration: 1.8, ease: "power2.out" });
        });

        // icon hover — glow pulse
        iconEls?.forEach(el => {
          el.addEventListener("mouseenter", () =>
            gsap.to(el, { scale: 1.3, duration: 0.3, ease: "back.out(2)" })
          );
          el.addEventListener("mouseleave", () =>
            gsap.to(el, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" })
          );
        });

        // magnetic buttons
        ctaRef.current?.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(btn => {
          btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
              x: (e.clientX - (r.left + r.width  / 2)) * 0.25,
              y: (e.clientY - (r.top  + r.height / 2)) * 0.25,
              duration: 0.4, ease: "power2.out",
            });
          });
          btn.addEventListener("mouseleave", () =>
            gsap.to(btn, { x: 0, y: 0, duration: 0.6,
              ease: "elastic.out(1,0.4)" })
          );
        });

        // headline scroll parallax
        lineRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            yPercent: -6 * (i + 1), ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top", end: "bottom top", scrub: 1.5,
            },
          });
        });

        // section fade on scroll-out
        gsap.to(section, {
          autoAlpha: 0, ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "80% top", end: "bottom top", scrub: true,
          },
        });

      }, sectionRef);
    };

    init();
    return () => ctx?.revert();
  }, []);

  const words = [
    { text: "Buat",      accent: false },
    { text: "Brand-Mu",      accent: false, tag: true },
    { text: "Stand Out",   accent: false, tag: true },
    
  ];

  return (
  <section
    ref={sectionRef}
    className="relative min-h-screen flex flex-col overflow-hidden bg-bg"
    style={{ perspective: "1200px" }}
  >

    {/* noise flash */}
    <div ref={noiseRef} className="absolute inset-0 z-30 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
        mixBlendMode: "overlay",
      }}
    />

    {/* grid */}
    <div className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(194,192,182,1) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(194,192,182,1) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />

    {/* glow orb */}
    <div ref={orbRef}
      className="absolute pointer-events-none will-change-transform"
      style={{
        top: "20%", right: "15%", width: 600, height: 600,
        background: "radial-gradient(circle,rgba(32,255,0,0.07) 0%,transparent 65%)",
        filter: "blur(50px)",
      }}
    />
    <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] pointer-events-none"
      style={{
        background: "radial-gradient(circle,rgba(32,255,0,0.04) 0%,transparent 70%)",
        filter: "blur(60px)",
      }}
    />

    {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
    <div className="relative z-10 flex-1 flex flex-col justify-center
      w-full max-w-[1600px] mx-auto
      px-5 sm:px-8 md:px-12 lg:px-20
      pt-28 sm:pt-32 lg:pt-0
      lg:grid lg:grid-cols-12 lg:items-center
      gap-8 lg:gap-6"
    >

      {/* ── LEFT ─────────────────────────────────────────────── */}
<div className="lg:col-span-7 flex flex-col w-full">

  {/* badge */}
  <div ref={badgeRef}
    className="inline-flex items-center gap-2 mb-6 sm:mb-10
      w-fit mx-auto lg:mx-0
      px-3 sm:px-4 py-1.5
      border border-accent/30 rounded-full"
    style={{ transformOrigin: "top center" }}
  >
    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shrink-0" />
    <span className="text-accent text-[10px] sm:text-xs font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase">
      Creative Digital Studio — Est. 2020
    </span>
  </div>

  {/* headline */}
  <div
    className="w-full flex flex-col items-center lg:items-start"
    style={{ perspective: "800px" }}
  >
    {words.map(({ text, accent, tag }, i) => (
      <div key={text} className="overflow-hidden flex items-end justify-center lg:justify-start gap-3 sm:gap-5 w-full">
        {accent ? (
          <span
            className="font-display uppercase leading-[0.9] tracking-tight will-change-transform block accent-word"
            style={{ fontSize: "clamp(2.8rem, 11vw, 8.5rem)" }}
          >
            <span ref={el => { lineRefs.current[i] = el; }}>
              {text}
            </span>
          </span>
        ) : (
          <span
            ref={el => { lineRefs.current[i] = el; }}
            className="font-display uppercase leading-[0.9] tracking-tight text-white will-change-transform block"
            style={{ fontSize: "clamp(2.8rem, 11vw, 8.5rem)" }}
          >
            {text}
          </span>
        )}
      </div>
    ))}
  </div>

  {/* subtitle */}
  <p ref={subtitleRef}
    className="mt-5 sm:mt-8
      w-full max-w-sm sm:max-w-md
      mx-auto lg:mx-0
      text-center lg:text-left
      text-neutral/70 text-sm sm:text-base md:text-lg leading-relaxed"
  >
    Desain kreatif, website modern, dan undangan digital
     untuk brand dan momen spesial kamu.
  </p>

  {/* cta */}
  <div ref={ctaRef}
    className="mt-6 sm:mt-8
      flex flex-wrap items-center
      justify-center lg:justify-start
      gap-3 sm:gap-4"
  >
    <Link href="/portfolio" data-magnetic
      className="relative inline-flex items-center gap-2 sm:gap-3
        bg-accent text-darker
        px-5 sm:px-8 py-3 sm:py-4
        font-heading font-semibold text-xs sm:text-sm
        tracking-widest uppercase overflow-hidden group will-change-transform"
    >
      <span
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)" }}
      />
      <span className="relative z-10">View Our Work</span>
      <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5">→</span>
    </Link>

    <Link href="/contact" data-magnetic
      className="inline-flex items-center gap-2 sm:gap-3
        text-white border border-white/20
        px-5 sm:px-8 py-3 sm:py-4
        font-heading font-semibold text-xs sm:text-sm
        tracking-widest uppercase
        hover:border-accent hover:text-accent
        transition-all duration-300 will-change-transform"
    >
      Let's Talk
    </Link>
  </div>

  {/* mobile stats */}
  <div className="mt-8 sm:mt-10 flex items-center justify-center lg:hidden gap-8 sm:gap-12">
    {[
      { value: "80+", label: "Projects" },
      { value: "4+",  label: "Years"    },
      { value: "50+", label: "Clients"  },
    ].map(s => (
      <div key={s.label} className="text-center">
        <div className="font-display text-3xl sm:text-4xl text-white
          drop-shadow-[0_0_12px_rgba(32,255,0,0.3)]"
        >
          {s.value}
        </div>
        <div className="text-neutral/50 text-[10px] font-mono tracking-widest uppercase mt-0.5">
          {s.label}
        </div>
      </div>
    ))}
  </div>

</div>

      {/* ── RIGHT — desktop orbit only ──────────────────────── */}
      <div
        ref={orbitRef}
        className="lg:col-span-5 hidden lg:flex items-center justify-center"
      >
        <div
          className="orbit-stage relative flex items-center justify-center shrink-0"
          style={{ width: 460, height: 460 }}
        >
          {/* ring tracks */}
          {RINGS.map((ring, i) => (
            <div key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width:  ring.radius * 2,
                height: ring.radius * 2,
                border: `1px solid rgba(32,255,0,${i === 0 ? 0.12 : 0.07})`,
              }}
            />
          ))}

          {/* center favicon */}
          <div className="relative z-20 flex items-center justify-center
            w-[88px] h-[88px] rounded-full bg-bg
            border border-accent/25
            shadow-[0_0_0_6px_rgba(32,255,0,0.04),0_0_40px_rgba(32,255,0,0.15)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/favicon.svg" alt="NOM Studio" width={48} height={48} className="object-contain" />
            <span className="absolute inset-0 rounded-full border border-accent/20 animate-ping" />
          </div>

          {/* orbiting icons */}
          {STACK.map((item) => {
            const ring        = RINGS[item.ring];
            const itemsInRing = STACK.filter(s => s.ring === item.ring).length;
            const posInRing   = STACK.filter(s => s.ring === item.ring)
                                     .findIndex(s => s.name === item.name);
            const duration    = ring.duration;
            const isReverse   = ring.direction === -1;

            return (
              <div key={item.name} className="orbit-icon absolute"
                style={{
                  width: 48, height: 48,
                  left: "50%", top: "50%",
                  marginLeft: -24, marginTop: -24,
                  ["--r" as string]: `${ring.radius}px`,
                  animation: `orbit-spin ${duration}s linear infinite ${isReverse ? "reverse" : "normal"}`,
                  animationDelay: `-${(posInRing / itemsInRing) * duration}s`,
                }}
              >
                <div
                  className="orbit-face w-full h-full rounded-2xl
                    flex flex-col items-center justify-center gap-0.5
                    border cursor-pointer group
                    shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${item.color}18, #2e2e2b 70%)`,
                    borderColor: `${item.color}25`,
                    animation: `counter-spin ${duration}s linear infinite ${isReverse ? "normal" : "reverse"}`,
                    animationDelay: `-${(posInRing / itemsInRing) * duration}s`,
                  }}
                  title={item.name}
                >
                  <Icon
                    icon={item.icon}
                    width={22}
                    height={22}
                    color={item.color}
                    style={{ filter: `drop-shadow(0 0 8px ${item.color}88)` }}
                  />
                  <span
                    className="font-mono text-[6px] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 leading-none"
                    style={{ color: item.color }}
                  >
                    {item.name.length > 6 ? item.name.slice(0, 6) : item.name}
                  </span>
                </div>
              </div>
            );
          })}

          {/* legend */}
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-6">
            {[
              { label: "Dev Stack",    color: "#20FF00" },
              { label: "Design Tools", color: "#C2C0B6" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                <span className="text-neutral/40 text-[10px] font-mono tracking-widest uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

    {/* ── MOBILE STACK STRIP — shown only below lg ─────────────── */}
<div className="lg:hidden relative z-10 w-full mt-4 pb-20">

  {/* ── Label ──────────────────────────────────────────────── */}
  <div className="flex items-center justify-center gap-3 mb-6">
    <span className="flex-1 max-w-[60px] h-px bg-gradient-to-r from-transparent to-accent/40" />
    <span className="text-neutral/50 text-[9px] font-mono tracking-[0.35em] uppercase">
      Our Stack
    </span>
    <span className="flex-1 max-w-[60px] h-px bg-gradient-to-l from-transparent to-accent/40" />
  </div>

  {/* ── Marquee row 1 — scrolls LEFT (dev tools) ───────────── */}
  <div className="relative mb-3 overflow-hidden">
    {/* fade edges */}
    <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
      style={{ background: "linear-gradient(90deg, #262624, transparent)" }} />
    <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
      style={{ background: "linear-gradient(-90deg, #262624, transparent)" }} />

    <div className="marquee-track flex gap-3" style={{ "--marquee-dir": "-1" } as React.CSSProperties}>
      {/* duplicate for seamless loop */}
      {[...STACK.filter(s => s.ring === 0), ...STACK.filter(s => s.ring === 0)].map((item, idx) => (
        <div
          key={`r1-${idx}`}
          className="marquee-card shrink-0 flex items-center gap-2.5
            px-3.5 py-2.5 rounded-xl border"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${item.color}15, #1e1e1c 60%)`,
            borderColor: `${item.color}25`,
            minWidth: "fit-content",
          }}
        >
          <div className="relative">
            <Icon
              icon={item.icon}
              width={20}
              height={20}
              color={item.color}
              style={{ filter: `drop-shadow(0 0 6px ${item.color}99)`, display: "block" }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase whitespace-nowrap"
            style={{ color: item.color + "cc" }}
          >
            {item.name}
          </span>
          {/* subtle ping dot */}
          <span className="w-1 h-1 rounded-full shrink-0"
            style={{ background: item.color, opacity: 0.5 }} />
        </div>
      ))}
    </div>
  </div>

  {/* ── Marquee row 2 — scrolls RIGHT (design tools) ───────── */}
  <div className="relative overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
      style={{ background: "linear-gradient(90deg, #262624, transparent)" }} />
    <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
      style={{ background: "linear-gradient(-90deg, #262624, transparent)" }} />

    <div className="marquee-track flex gap-3" style={{ "--marquee-dir": "1" } as React.CSSProperties}>
      {[...STACK.filter(s => s.ring === 1), ...STACK.filter(s => s.ring === 1)].map((item, idx) => (
        <div
          key={`r2-${idx}`}
          className="marquee-card shrink-0 flex items-center gap-2.5
            px-3.5 py-2.5 rounded-xl border"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${item.color}15, #1e1e1c 60%)`,
            borderColor: `${item.color}25`,
            minWidth: "fit-content",
          }}
        >
          <div className="relative">
            <Icon
              icon={item.icon}
              width={20}
              height={20}
              color={item.color}
              style={{ filter: `drop-shadow(0 0 6px ${item.color}99)`, display: "block" }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase whitespace-nowrap"
            style={{ color: item.color + "cc" }}
          >
            {item.name}
          </span>
          <span className="w-1 h-1 rounded-full shrink-0"
            style={{ background: item.color, opacity: 0.5 }} />
        </div>
      ))}
    </div>
  </div>

  {/* ── Accent ticker line ──────────────────────────────────── */}
  <div className="mt-6 overflow-hidden">
    <div className="ticker-line flex gap-8 whitespace-nowrap font-mono text-[9px]
      tracking-[0.3em] uppercase text-neutral/20"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="shrink-0">
          NOM STUDIO ✦ CREATIVE DIGITAL ✦ BOLD BY DESIGN ✦
        </span>
      ))}
    </div>
  </div>

</div>

    {/* ── SCROLL INDICATOR — always visible, sits at very bottom ── */}
    <div
      ref={scrollRef}
      className="relative z-10 pb-6 flex flex-col items-center gap-2 mt-auto lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2"
    >
      <span className="text-neutral/40 text-[10px] font-mono tracking-[0.3em] uppercase">
        Scroll
      </span>
      <div className="relative w-[1px] h-10 overflow-hidden bg-white/10">
        <div className="absolute top-0 left-0 w-full bg-accent"
          style={{ height: "40%", animation: "scrollLine 1.6s ease-in-out infinite" }}
        />
      </div>
    </div>

    <style jsx>{`
  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes scrollLine {
    0%   { transform: translateY(-100%); opacity: 1; }
    70%  { transform: translateY(250%);  opacity: 1; }
    71%  { opacity: 0; }
    100% { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes orbit-spin {
    from { transform: rotate(0deg)   translateX(var(--r)) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
  }
  @keyframes counter-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Seamless marquee ──────────────────────────────────── */
  @keyframes marquee-left {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  @keyframes ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .marquee-track {
    animation-duration: 14s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-name: marquee-left;
    width: max-content;
  }
  /* reverse direction via CSS var */
  .marquee-track[style*='"--marquee-dir": "1"'],
  .marquee-track[style*="--marquee-dir: 1"] {
    animation-name: marquee-right;
  }

  .ticker-line {
    width: max-content;
    animation: ticker-scroll 20s linear infinite;
  }

  /* pause on hover */
  .marquee-track:hover,
  .ticker-line:hover {
    animation-play-state: paused;
  }

  /* card hover glow */
  .marquee-card {
    transition: border-color 0.3s ease, transform 0.3s ease;
  }
  .marquee-card:hover {
    transform: translateY(-3px) scale(1.04);
  }

  /* ── Desktop orbit scale ───────────────────────────────── */
  .orbit-stage { transform-origin: center center; }
  @media (max-width: 1280px) { .orbit-stage { transform: scale(0.85); } }
  @media (max-width: 1024px) { .orbit-stage { transform: scale(0.75); } }

  /* ── Split chars ───────────────────────────────────────── */
  :global(.split-char) { display: inline-block !important; }

  :global(.accent-word) {
    background: linear-gradient(100deg, #20FF00 0%, #80ff60 50%, #20FF00 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4s linear infinite;
  }
  :global(.accent-word .split-char) {
    background: inherit !important;
    background-size: inherit !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    animation: inherit !important;
  }

  /* hide scrollbar globally for this section */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`}</style>

  </section>
);
}