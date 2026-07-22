import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { PainPoints } from "@/components/PainPoints";
import { FreeTools } from "@/components/FreeTools";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NOMSTD — Creative Studio & IT Engineering Agency',
  description: 'Modern websites, powerful software, AI automation, and visual identities designed to move your business forward. Melayani jasa web development, desain grafis, fotografi, dan IT solutions profesional di Cianjur, Bandung, Jakarta, & seluruh Indonesia.',
  keywords: [
    'nomstd', 'creative agency cianjur', 'jasa pembuatan website cianjur',
    'web development cianjur', 'desain grafis cianjur', 'foto produk cianjur',
    'videografi cianjur', 'servis laptop cianjur', 'rakit pc cianjur'
  ],
  alternates: {
    canonical: 'https://nomstd.my.id',
  }
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-accent selection:text-black">
      <Navbar />
      <Hero />
      <Services />
      <PainPoints />
      <FreeTools />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
