import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TopicsSection from "@/components/landing/TopicsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => (
  <div className="min-h-screen bg-background">
    <LandingHeader />
    <HeroSection />
    <FeaturesSection />
    <TopicsSection />
    <HowItWorksSection />
    <CTASection />
    <LandingFooter />
  </div>
);

export default Index;
