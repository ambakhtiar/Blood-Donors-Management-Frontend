import BenefitsSection from "@/components/home/BenefitsSection";
import EmergencyRequests from "@/components/home/EmergencyRequests";
import HeroCarousel from "@/components/home/HeroCarousel";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import MotivationalSlider from "@/components/home/MotivationalSlider";


export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <MotivationalSlider />
      <EmergencyRequests />
      <BenefitsSection />
      <HowItWorksSection />
    </main>
  );
}
