import Link from "next/link";
import { services } from "@/data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — NOM Studio",
  description: "Graphic Design, Web Design, and Digital Invitations by NOM Studio.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-20">
          <span className="text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-4">
            — What We Offer
          </span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-white uppercase tracking-wide leading-[0.88]">
            Our <span className="text-accent">Services</span>
          </h1>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {services.map((service) => (
            <Link
              href={`/services/${service.slug}`}
              key={service.id}
              className="group bg-bg-light border border-white/5 p-8 hover:border-accent/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-accent text-3xl">{service.icon}</span>
                <span className="font-mono text-neutral/30 text-sm">{service.number}</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wide mb-4 group-hover:text-accent transition-colors">
                {service.title}
              </h2>
              <p className="text-neutral/60 text-sm leading-relaxed mb-8">
                {service.description}
              </p>
              <ul className="space-y-2 mb-8">
                {service.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs font-mono text-neutral/50">
                    <span className="text-accent">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-accent text-sm font-mono tracking-widest group-hover:gap-4 transition-all">
                Learn More <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Process */}
        <div className="border-t border-white/10 pt-16">
          <h2 className="font-display text-4xl md:text-6xl text-white uppercase tracking-wide mb-12">
            Our <span className="text-accent">Process</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Discovery", "Strategy", "Creation", "Delivery"].map((step, i) => (
              <div key={step} className="relative">
                <div className="text-6xl font-display text-white/5 mb-4">0{i + 1}</div>
                <div className="w-8 h-px bg-accent mb-4" />
                <h3 className="font-heading font-semibold text-white mb-2">{step}</h3>
                <p className="text-neutral/50 text-sm leading-relaxed">
                  {["We deep-dive into your brand, goals, and audience.", "We craft a clear roadmap and creative direction.", "We bring it to life with precision and passion.", "We deliver and support beyond the finish line."][i]}
                </p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 right-0 translate-x-1/2 text-accent/30 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
