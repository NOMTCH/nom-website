import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { PainPoints } from "@/components/PainPoints";
import { FreeTools } from "@/components/FreeTools";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

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
