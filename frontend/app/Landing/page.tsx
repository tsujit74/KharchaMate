import SolutionSection from "./components/SolutionSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import HeroSection from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import CTASection from "./components/CTASection";

export default function HomePage() {
  return (
    <main className="bg-[#FCFCFD] text-[#1A1A1E] overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}