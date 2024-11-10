'use client';

import { Store } from 'lucide-react';
import { FormData } from './OnboardingForm';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const storeNameExamples = [
  "Sarah's Boutique",
  "Urban Essentials",
  "The Cozy Corner",
  "Green Valley Market"
];

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export function StoreSetup({ formData, updateFormData, onNext }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Let's Set Your Store Up</h2>
        <p className="mt-2 text-gray-600">
          Create your store's identity and reach customers across the country
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Store Name</label>
        <input
          type="text"
          required
          value={formData.storeName}
          onChange={(e) => updateFormData({ storeName: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Your Store Name"
        />
        <div className="mt-2">
          <p className="text-sm text-gray-500">Try something like:</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {storeNameExamples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => updateFormData({ storeName: example })}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Business Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="store@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">State</label>
        <select
          required
          value={formData.state}
          onChange={(e) => updateFormData({ state: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Complete Setup
        <Store className="ml-2 h-5 w-5" />
      </button>
    </form>
  );
}