import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Vision from "@/components/sections/vision";
import AIShowcase from "@/components/sections/ai-showcase";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <Vision />
      <AIShowcase />
      <Footer />
    </main>
  );
}
