import HeroSection from "../Landing/components/Hero";
import ProblemSection from "../Landing/components/ProblemSection";
import SolutionSection from "../Landing/components/SolutionSection";
import HowItWorksSection from "../Landing/components/HowItWorksSection";
import TestimonialsSection from "../Landing/components/TestimonialsSection";
import CTASection from "../Landing/components/CTASection";

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