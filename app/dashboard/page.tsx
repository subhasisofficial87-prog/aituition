'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome to AITuition</p>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:from-green-600 hover:to-blue-600 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </Link>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Coming Soon</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Create a study plan to see your dashboard with stats, calendar, and more.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Your First Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
