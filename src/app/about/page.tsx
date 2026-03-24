import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — NOM Studio",
  description: "Meet the team behind NOM Studio.",
};

const team = [
  { name: "Adrian (MONO)", role: "Owner", specialty: "Graphic Design & Web Developer" },
  { name: "Rrahera", role: "Admin / Customer Service" },
];

const stats = [
  { value: "80+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "4+", label: "Years Experience" },
  { value: "3", label: "Core Services" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-end">
          <div>
            <span className="text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-4">
              — Our Story
            </span>
            <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-white uppercase tracking-wide leading-[0.85]">
              About<br /><span className="text-accent">NOM</span>
            </h1>
          </div>
          <div>
            <p className="text-neutral/70 text-lg leading-relaxed mb-6">
              NOM Studio was born out of a simple frustration: too many brands were settling for mediocre design. We set out to change that.
            </p>
            <p className="text-neutral/60 text-base leading-relaxed">
              Founded in 2020, NOM Studio is a tight-knit team of designers, developers, and creative strategists. We're passionate about crafting bold digital experiences that cut through the noise and deliver real results.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-bg-light border border-white/5 p-8 text-center">
              <div className="font-display text-6xl text-accent mb-2">{stat.value}</div>
              <div className="text-neutral/50 text-xs font-mono tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Philosophy */}
        <div className="mb-24 border-t border-b border-white/10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="font-display text-4xl text-white uppercase mb-6">Our Mission</h2>
              <p className="text-neutral/60 text-sm leading-relaxed">
                To empower ambitious brands with design that's as bold as their vision — crafted with purpose, precision, and passion.
              </p>
            </div>
            <div>
              <h2 className="font-display text-4xl text-white uppercase mb-6">Our Vision</h2>
              <p className="text-neutral/60 text-sm leading-relaxed">
                A world where every brand communicates with clarity, character, and confidence through outstanding design.
              </p>
            </div>
            <div>
              <h2 className="font-display text-4xl text-white uppercase mb-6">Our Values</h2>
              <ul className="space-y-2">
                {["Boldness", "Precision", "Authenticity", "Impact", "Growth"].map((v) => (
                  <li key={v} className="flex items-center gap-2 text-neutral/60 text-sm">
                    <span className="text-accent text-xs">✦</span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <h2 className="font-display text-5xl md:text-7xl text-white uppercase tracking-wide mb-12">
            The <span className="text-accent">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="group bg-bg-light border border-white/5 p-8 hover:border-accent/20 transition-all duration-300">
                {/* Avatar placeholder */}
                <div className="w-20 h-20 bg-bg border border-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                  <span className="font-display text-3xl text-accent">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-mono mb-3">{member.role}</p>
                <p className="text-neutral/50 text-xs font-mono tracking-widest uppercase">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-white/10 pt-16">
          <h2 className="font-display text-5xl text-white uppercase mb-4">Work With Us</h2>
          <p className="text-neutral/60 mb-8">Let's build something extraordinary together.</p>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-accent text-darker px-10 py-4 font-heading font-bold text-sm tracking-widest uppercase hover:bg-white transition-all duration-300 group">
            Get in Touch <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
