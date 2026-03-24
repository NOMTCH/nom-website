import Link from "next/link";
import { services } from "@/data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graphic Design — NOM Studio",
  description: "Bold visual identities, brand systems, and print materials by NOM Studio.",
};

const service = services[0];

export default function GraphicDesignPage() {
  return (
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral/40 mb-12">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
          <span>/</span>
          <span className="text-neutral/70">Graphic Design</span>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          <div>
            <span className="text-accent text-4xl block mb-6">{service.icon}</span>
            <h1 className="font-display text-7xl md:text-9xl text-white uppercase tracking-wide leading-[0.85] mb-8">
              Graphic<br /><span className="text-accent">Design</span>
            </h1>
            <p className="text-neutral/70 text-lg leading-relaxed mb-8">{service.longDescription}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-accent text-darker px-8 py-4 font-heading font-bold text-sm tracking-widest uppercase hover:bg-white transition-all duration-300 group"
            >
              Start a Project <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-neutral/40 text-xs tracking-[0.2em] uppercase mb-6">What's Included</h3>
            {service.features.map((f, i) => (
              <div key={f} className="flex items-center gap-4 py-4 border-b border-white/5 group hover:border-accent/20 transition-colors">
                <span className="font-mono text-neutral/30 text-xs w-6">0{i + 1}</span>
                <span className="text-white group-hover:text-accent transition-colors font-heading">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="bg-bg-light border border-white/5 p-10 mb-12">
          <h2 className="font-display text-4xl text-white uppercase mb-8">Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {service.deliverables.map((d) => (
              <div key={d} className="flex items-start gap-3 p-4 border border-white/5">
                <span className="text-accent mt-0.5">✦</span>
                <span className="text-neutral/70 text-sm font-body leading-relaxed">{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-white/10 pt-16">
          <p className="text-neutral/60 text-lg mb-8">Ready to build your brand identity?</p>
          <Link href="/contact" className="inline-flex items-center gap-3 border border-accent text-accent px-10 py-4 font-heading font-medium text-sm tracking-widest uppercase hover:bg-accent hover:text-darker transition-all duration-300 group">
            Get a Free Quote <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
