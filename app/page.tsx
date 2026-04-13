import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Benefits from '@/components/landing/Benefits';
import AboutUs from '@/components/landing/AboutUs';
import PricingCards from '@/components/landing/PricingCards';
import FAQ from '@/components/landing/FAQ';

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Benefits />
      <AboutUs />
      <PricingCards />
      <FAQ />
    </>
  );
}
