'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function StudyPage({ params }: { params: Promise<{ planId: string; day: string }> }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Study Mode Coming Soon</h1>
          <p className="text-gray-600 mb-8">
            We're preparing your personalized lectures and quizzes. This feature will be available once you create a study plan.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Daily AI-generated lessons in your language</li>
              <li>✓ Interactive quizzes to test understanding</li>
              <li>✓ Progress tracking and performance analytics</li>
              <li>✓ Expert doubt clearing (Pro feature)</li>
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
