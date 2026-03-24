"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

const values = [
  { icon: "◈", title: "Bold by Design", desc: "We don't do safe. Every project pushes the boundary of what's expected." },
  { icon: "◎", title: "Pixel Perfect", desc: "Obsessive attention to craft — from micro-interactions to macro layouts." },
  { icon: "◉", title: "Story-Driven", desc: "Every brand has a story. We make sure yours is impossible to ignore." },
  { icon: "✦", title: "Future-First", desc: "We build for today's screens and tomorrow's expectations." },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animate = async () => {
      if (typeof window === "undefined") return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".about-text", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.fromTo(".value-card", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".values-grid", start: "top 80%" },
      });
    };
    animate();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-bg relative overflow-hidden" id="about">
      {/* Vertical accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left */}
          <div>
            <span className="about-text opacity-0 text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-6">
              — About NOM Studio
            </span>
            <h2 className="about-text opacity-0 font-display text-5xl md:text-6xl lg:text-7xl text-white uppercase tracking-wide leading-[0.9] mb-8">
              We Are <br />
              <span className="text-accent">Creatives</span><br />
              By Nature
            </h2>
            <p className="about-text opacity-0 text-neutral/70 text-base md:text-lg leading-relaxed mb-6">
              NOM Studio is a modern creative digital studio founded on the belief that great design is more than aesthetics — it's a strategic tool that drives real results.
            </p>
            <p className="about-text opacity-0 text-neutral/60 text-sm md:text-base leading-relaxed mb-10">
              From brand identities to immersive web experiences, we partner with ambitious founders, emerging brands, and established companies to create work that moves people.
            </p>
            <Link
              href="/about"
              className="about-text opacity-0 inline-flex items-center gap-3 text-accent border border-accent px-8 py-4 text-sm font-heading font-medium tracking-widest uppercase hover:bg-accent hover:text-darker transition-all duration-300 group"
            >
              Our Story
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Right */}
          <div>
            {/* Large decorative element */}
            <div className="relative mb-12 aspect-square max-w-sm mx-auto lg:mx-0">
              <div className="absolute inset-0 border border-accent/10 rounded-full animate-spin-slow" />
              <div className="absolute inset-8 border border-accent/15 rounded-full" style={{ animation: "spin 15s linear infinite reverse" }} />
              <div className="absolute inset-16 border border-accent/20 rounded-full animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-8xl text-accent leading-none">N</div>
                  <div className="font-mono text-neutral/40 text-xs tracking-[0.3em] mt-2">STUDIO</div>
                </div>
              </div>
              {/* Orbiting dot */}
              <div
                className="absolute w-3 h-3 bg-accent rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1.5"
                style={{ animation: "spin 8s linear infinite" }}
              />
            </div>

            {/* Values */}
            <div className="values-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="value-card opacity-0 bg-bg-light border border-white/5 p-6 hover:border-accent/20 transition-all duration-300 group">
                  <span className="text-accent text-2xl block mb-3">{v.icon}</span>
                  <h4 className="text-white font-heading font-semibold text-sm mb-2 group-hover:text-accent transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-neutral/50 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
