import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { PainPoints } from "@/components/PainPoints";
import { FreeTools } from "@/components/FreeTools";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JellyScroll } from "@/components/JellyScroll";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-accent selection:text-black">
      <Navbar />
      <JellyScroll>
        <Hero />
        <Services />
        <PainPoints />
        <FreeTools />
        <Contact />
        <Footer />
      </JellyScroll>
    </main>
  );
}
