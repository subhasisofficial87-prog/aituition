import FAQ from '@/components/landing/FAQ';

export const metadata = {
  title: 'FAQ — AITuition',
  description: 'Frequently asked questions about AITuition — AI-powered home tutoring for Indian students.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <FAQ />
    </div>
  );
}
