'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Study Plan</h1>
          <p className="text-gray-600">Let's set up a personalized learning plan for your child</p>
        </div>

        {/* Placeholder Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h2 className="font-semibold text-gray-900 mb-2">✨ Onboarding Coming Soon</h2>
            <p className="text-sm text-gray-600">
              The interactive plan creation form is being updated. For now, you can:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">What you'll set up:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Select Board (CBSE, ICSE, Odia Medium)</li>
                <li>✓ Choose Class Level (LKG - 12)</li>
                <li>✓ Pick Subject</li>
                <li>✓ Choose Study Language (11 options)</li>
                <li>✓ Review AI-generated 10-month plan</li>
              </ul>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all"
            >
              Go to Dashboard
            </button>
          </div>

          <hr className="my-6" />

          <div className="text-center text-sm text-gray-600">
            <p>Your 7-day free trial starts once you create a plan.</p>
            <p>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Back to Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
