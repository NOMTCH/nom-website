"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { projects } from "@/data/portfolio";

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animate = async () => {
      if (typeof window === "undefined") return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".portfolio-heading",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".project-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".projects-grid", start: "top 75%" },
        }
      );
    };
    animate();
  }, []);

  const featured = projects.filter((p) => p.featured);

  return (
    <section ref={sectionRef} className="section-padding bg-darker relative" id="portfolio">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="portfolio-heading opacity-0 text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-4">
              — Selected Work
            </span>
            <h2 className="portfolio-heading opacity-0 font-display text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-wide">
              Our<br />
              <span className="text-accent">Projects</span>
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="portfolio-heading opacity-0 hidden md:inline-flex items-center gap-2 text-neutral hover:text-accent text-sm font-mono tracking-widest uppercase transition-colors group"
          >
            All Projects
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featured.map((project) => (
            <Link
              href={`/portfolio`}
              key={project.id}
              className="project-card opacity-0 group relative aspect-[4/5] bg-bg-light border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              {/* Background pattern */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{ background: project.bgPattern }}
              />

              {/* Geometric decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <div
                  className="w-48 h-48 border rounded-full animate-spin-slow"
                  style={{ borderColor: project.accentColor }}
                />
                <div
                  className="absolute w-32 h-32 border rotate-45"
                  style={{ borderColor: project.accentColor }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Top */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono tracking-widest uppercase px-3 py-1 border rounded-full"
                    style={{ borderColor: `${project.accentColor}40`, color: project.accentColor }}
                  >
                    {project.category}
                  </span>
                  <span className="text-neutral/40 text-xs font-mono">{project.year}</span>
                </div>

                {/* Bottom */}
                <div>
                  <h3 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide mb-2 group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-neutral/60 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-neutral/30 border border-white/10 px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover overlay arrow */}
              <div className="absolute top-6 right-6 w-10 h-10 bg-accent text-darker flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                →
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-neutral hover:text-accent text-sm font-mono tracking-widest uppercase transition-colors group"
          >
            View All Projects
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
