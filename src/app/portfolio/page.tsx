import Link from "next/link";
import { projects } from "@/data/portfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — NOM Studio",
  description: "Selected work and projects by NOM Studio.",
};

const categories = ["All", "Graphic Design", "Web Design", "Digital Invitations"];

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-16">
          <span className="text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-4">
            — Our Work
          </span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-white uppercase tracking-wide leading-[0.88]">
            Selected<br /><span className="text-accent">Projects</span>
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 flex-wrap mb-14 border-b border-white/10 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 text-xs font-mono tracking-widest uppercase border transition-all duration-200 ${
                cat === "All"
                  ? "border-accent text-accent bg-accent/10"
                  : "border-white/10 text-neutral/50 hover:border-accent/50 hover:text-neutral"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative aspect-[4/5] bg-bg-light border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 cursor-pointer"
            >
              {/* BG */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{ background: project.bgPattern }}
              />

              {/* Geometric decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <div className="w-40 h-40 border rounded-full animate-spin-slow" style={{ borderColor: project.accentColor }} />
                <div className="absolute w-24 h-24 border rotate-45" style={{ borderColor: project.accentColor }} />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono tracking-widest uppercase px-3 py-1 border rounded-full"
                    style={{ borderColor: `${project.accentColor}40`, color: project.accentColor }}
                  >
                    {project.category}
                  </span>
                  <span className="text-neutral/40 text-xs font-mono">{project.year}</span>
                </div>
                <div>
                  <h3 className="font-display text-3xl text-white uppercase tracking-wide mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral/60 text-sm leading-relaxed mb-3">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono text-neutral/30 border border-white/10 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 w-10 h-10 bg-accent text-darker flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                →
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center border-t border-white/10 pt-16">
          <p className="text-neutral/60 text-lg mb-6">Like what you see?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-accent text-darker px-10 py-4 font-heading font-bold text-sm tracking-widest uppercase hover:bg-white transition-all duration-300 group"
          >
            Start Your Project <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
