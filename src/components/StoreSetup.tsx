'use client';

import {Store} from 'lucide-react';
import {FormData} from './OnboardingForm';
import apiService from "@/services/api";
import React, {useEffect, useState} from "react";
import router from 'next/router';

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


async function fetchStates() {
    const res = await apiService.cms.getStateList();
    return (res.data);
}

export function StoreSetup({formData, updateFormData, onNext}: Props) {

    const [states, setStates] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStates().then(res => setStates(res));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await apiService.store.create({
                "name": formData.storeName,
                "state": formData.state,
                "email": formData.email
            });
            
            // Clear onboarding form data from localStorage when store setup is completed
            localStorage.removeItem('onboardingFormData');    
            window.location.href = "/seller/products/new";
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to create store. Please try again.");
            }
        }
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
                    onChange={(e) => updateFormData({storeName: e.target.value})}
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
                                onClick={() => updateFormData({storeName: example})}
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
                    onChange={(e) => updateFormData({email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="store@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <select
                    required
                    value={formData.state}
                    onChange={(e) => updateFormData({state: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Select a state</option>
                    {states && Object.entries(states).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Complete Setup
                <Store className="ml-2 h-5 w-5"/>
            </button>
        </form>
    );
}