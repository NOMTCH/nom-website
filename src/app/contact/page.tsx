"use client";
import { useState } from "react";
import type { Metadata } from "next";

const contactInfo = [
  { label: "Email", value: "hello@nomstudio.com", href: "mailto:hello@nomstudio.com" },
  { label: "Instagram", value: "@nom.studio", href: "https://instagram.com" },
  { label: "Behance", value: "behance.net/nomstudio", href: "https://behance.net" },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "", email: "", service: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bg pt-32 pb-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="mb-16">
          <span className="text-neutral/40 text-xs font-mono tracking-[0.3em] uppercase block mb-4">
            — Get In Touch
          </span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-white uppercase tracking-wide leading-[0.88]">
            Let's<br /><span className="text-accent">Talk</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-bg-light border border-accent/30 p-12 text-center">
                <div className="text-accent text-5xl mb-6">✦</div>
                <h3 className="font-display text-4xl text-white uppercase mb-4">Message Sent!</h3>
                <p className="text-neutral/60 text-sm leading-relaxed">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono text-neutral/40 tracking-widest uppercase block mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-bg-light border border-white/10 text-white placeholder-neutral/30 px-4 py-3 text-sm font-body focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral/40 tracking-widest uppercase block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      className="w-full bg-bg-light border border-white/10 text-white placeholder-neutral/30 px-4 py-3 text-sm font-body focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral/40 tracking-widest uppercase block mb-2">
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    value={formState.service}
                    onChange={handleChange}
                    className="w-full bg-bg-light border border-white/10 text-white px-4 py-3 text-sm font-body focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="" className="bg-bg">Select a service...</option>
                    <option value="graphic" className="bg-bg">Graphic Design</option>
                    <option value="web" className="bg-bg">Web Design</option>
                    <option value="invite" className="bg-bg">Digital Invitations</option>
                    <option value="other" className="bg-bg">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral/40 tracking-widest uppercase block mb-2">
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Describe your project, goals, timeline, and budget..."
                    className="w-full bg-bg-light border border-white/10 text-white placeholder-neutral/30 px-4 py-3 text-sm font-body focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-darker py-4 font-heading font-bold text-sm tracking-widest uppercase hover:bg-white transition-all duration-300 group flex items-center justify-center gap-3"
                >
                  Send Message
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h3 className="font-mono text-neutral/40 text-xs tracking-[0.2em] uppercase mb-6">
                Contact Info
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label}>
                    <div className="text-neutral/40 text-xs font-mono tracking-widest uppercase mb-1">
                      {info.label}
                    </div>
                    <a
                      href={info.href}
                      className="text-white hover:text-accent transition-colors text-sm font-body"
                    >
                      {info.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-10">
              <h3 className="font-mono text-neutral/40 text-xs tracking-[0.2em] uppercase mb-4">
                Availability
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
                <span className="text-white text-sm font-body">Open for new projects</span>
              </div>
              <p className="text-neutral/50 text-xs leading-relaxed">
                We typically respond within 24 hours on business days.
              </p>
            </div>

            <div className="border-t border-white/10 pt-10">
              <h3 className="font-mono text-neutral/40 text-xs tracking-[0.2em] uppercase mb-4">
                Working Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral/60">Monday – Friday</span>
                  <span className="text-white font-mono">09:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral/60">Saturday</span>
                  <span className="text-white font-mono">10:00 – 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral/60">Sunday</span>
                  <span className="text-neutral/30 font-mono">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
