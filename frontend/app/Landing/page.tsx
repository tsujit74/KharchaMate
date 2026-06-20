import HeroSection from "../landing/components/Hero";
import ProblemSection from "../landing/components/ProblemSection";
import SolutionSection from "../landing/components/SolutionSection";
import HowItWorksSection from "../landing/components/HowItWorksSection";
import TestimonialsSection from "../landing/components/TestimonialsSection";
import CTASection from "../landing/components/CTASection";

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