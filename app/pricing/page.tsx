import PricingCards from '@/components/landing/PricingCards';

export const metadata = {
  title: 'Pricing — AITuition',
  description: 'Simple, affordable pricing for AI-powered home tuition. 7-day free trial on all plans.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white py-4">
      <PricingCards />
    </div>
  );
}
