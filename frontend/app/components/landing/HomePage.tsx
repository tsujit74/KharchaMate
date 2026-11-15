import HeroSection from "./components/Hero";
import HowItWorksSection from "./components/HowItWorksSection";
import FAQSection from "./components/FAQSection";
import FounderNote from "./components/Foundernote";
import CTASection from "./components/CTASection";
import SolutionSection from "./components/SolutionSection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-[#FAF8F4] text-[#1A1A1E]">
      <HeroSection />
      <HowItWorksSection />
      <SolutionSection />
      <FAQSection />
      <FounderNote />
      <CTASection />
    </main>
  );
}