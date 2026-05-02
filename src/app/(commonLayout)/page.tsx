import HeroCarousel from "@/components/home/HeroCarousel";
import MotivationalSlider from "@/components/home/MotivationalSlider";
import EmergencyRequests from "@/components/home/EmergencyRequests";
import BenefitsSection from "@/components/home/BenefitsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { ActiveCrowdfunding } from "@/features/home/components/ActiveCrowdfunding";
import { TopDonorsLeaderboard } from "@/features/home/components/TopDonorsLeaderboard";
import { Testimonials } from "@/features/home/components/Testimonials";
import { FAQSection } from "@/features/home/components/FAQSection";
import { NewsletterCTA } from "@/features/home/components/NewsletterCTA";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroCarousel />
      <MotivationalSlider />
      <StatsSection />
      <EmergencyRequests />
      <ActiveCrowdfunding />
      <BenefitsSection />
      <TopDonorsLeaderboard />
      <HowItWorksSection />
      <Testimonials />
      <FAQSection />
      <NewsletterCTA />
    </main>
  );
}
