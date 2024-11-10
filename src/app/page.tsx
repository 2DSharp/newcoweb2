'use client';

import { Store } from 'lucide-react';
import { OnboardingForm } from '../components/OnboardingForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Onboarding</h1>
            <p className="text-gray-600 mt-2">Join thousands of successful sellers on our platform</p>
          </div>

          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}