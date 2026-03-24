"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animate = async () => {
      if (typeof window === "undefined") return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".cta-element", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    };
    animate();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-darker relative overflow-hidden"
      id="contact-cta"
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(32,255,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Horizontal lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

      <div className="mx-auto max-w-[1600px] text-center relative z-10">
        <span className="cta-element opacity-0 text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-6">
          — Ready To Start?
        </span>

        <h2 className="cta-element opacity-0 font-display text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] text-white uppercase leading-[0.85] tracking-tight mb-4">
          Let's
        </h2>
        <h2
          className="cta-element opacity-0 font-display text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] uppercase leading-[0.85] tracking-tight mb-12"
          style={{
            background: "linear-gradient(90deg, #20FF00 0%, #80ff60 50%, #20FF00 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "bgMove 3s linear infinite",
          }}
        >
          Create
        </h2>

        <style jsx>{`
          @keyframes bgMove {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}</style>

        <p className="cta-element opacity-0 text-neutral/60 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
          Have a project in mind? Let's talk about how we can bring your vision to life with bold design and seamless execution.
        </p>

        <div className="cta-element opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-accent text-darker px-10 py-5 font-heading font-bold text-sm tracking-widest uppercase hover:bg-white transition-all duration-300"
          >
            Start a Project
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="mailto:nomstudiodesign@gmail.com"
            className="inline-flex items-center gap-3 text-accent font-mono text-sm tracking-widest hover:underline transition-all"
          >
            nomstudiodesign@gmail.com
          </a>
        </div>

        {/* Availability badge */}
        <div className="cta-element opacity-0 mt-16 inline-flex items-center gap-3 px-5 py-2.5 border border-white/10 rounded-full">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-neutral/60 text-xs font-mono tracking-widest">
            Currently accepting new projects for Q2 2025
          </span>
        </div>
      </div>
    </section>
  );
}
