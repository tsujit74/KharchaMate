import HeroSection from "@/app/landing/components/Hero";
import ProblemSection from "@/app/landing/components/ProblemSection";
import SolutionSection from "@/app/landing/components/SolutionSection";
import HowItWorksSection from "@/app/landing/components/HowItWorksSection";
import TestimonialsSection from "@/app/landing/components/TestimonialsSection";
import CTASection from "@/app/landing/components/CTASection";

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