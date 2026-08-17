import Hero from "@/components/home/Hero";
import ServicePanel from "@/components/home/ServicePanel";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import ServicesSection from "@/components/home/ServicesSection";
import BusinessSection from "@/components/home/BusinessSection";
import NetworkSection from "@/components/home/NetworkSection";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import PlatformPreviewSection from "@/components/home/PlatformPreviewSection";
import TrustSection from "@/components/home/TrustSection";
import FaqSection from "@/components/home/FaqSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicePanel />
      <ProblemSection />
      <SolutionSection />
      <ServicesSection />
      <BusinessSection />
      <NetworkSection />
      <SustainabilitySection />
      <PlatformPreviewSection />
      <TrustSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
