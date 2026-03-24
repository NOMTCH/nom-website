"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { services } from "@/data/services";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animate = async () => {
      if (typeof window === "undefined") return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".services-heading",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".service-row",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-list",
            start: "top 75%",
          },
        }
      );
    };
    animate();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-bg relative" id="services">
      {/* Section tag */}
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center justify-between mb-16 md:mb-20">
          <div>
            <span className="services-heading text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-4 opacity-0">
              — What We Do
            </span>
            <h2 className="services-heading opacity-0 font-display text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-wide">
              Our<br />
              <span className="text-accent">Services</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="hidden md:inline-flex items-center gap-2 text-neutral hover:text-accent text-sm font-mono tracking-widest uppercase transition-colors group"
          >
            All Services
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Services list */}
        <div className="services-list border-t border-white/10">
          {services.map((service, i) => (
            <Link
              href={`/services/${service.slug}`}
              key={service.id}
              className="service-row opacity-0 group block border-b border-white/10 py-8 md:py-10"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-6 md:gap-10 flex-1">
                  {/* Number */}
                  <span className="font-mono text-neutral/30 text-sm w-8 shrink-0">
                    {service.number}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-4xl md:text-6xl lg:text-7xl text-white group-hover:text-accent transition-colors duration-300 uppercase tracking-wide">
                    {service.title}
                  </h3>
                </div>

                {/* Description + Arrow */}
                <div className="hidden md:flex items-center gap-10 flex-1 justify-end">
                  <p className="text-neutral/60 text-sm max-w-xs leading-relaxed text-right group-hover:text-neutral/90 transition-colors">
                    {service.description}
                  </p>
                  <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center group-hover:border-accent group-hover:text-accent text-neutral/40 transition-all duration-300 group-hover:scale-110 shrink-0">
                    →
                  </div>
                </div>

                {/* Mobile arrow */}
                <div className="md:hidden text-neutral/40 group-hover:text-accent transition-colors">
                  →
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 ml-14 md:ml-[4.5rem] flex items-center gap-3 flex-wrap">
                {service.features.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="text-xs font-mono text-neutral/30 group-hover:text-neutral/50 transition-colors"
                  >
                    {f}
                  </span>
                ))}
                <span className="text-neutral/20 text-xs font-mono">
                  +{service.features.length - 3} more
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 md:hidden">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-neutral hover:text-accent text-sm font-mono tracking-widest uppercase transition-colors group"
          >
            All Services
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
