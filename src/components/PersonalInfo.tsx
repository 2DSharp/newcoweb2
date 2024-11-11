'use client';

import { ArrowRight, AlertCircle } from 'lucide-react';
import { FormData } from './OnboardingForm';
import Link from "next/link";
import React from "react";

interface Props {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    onNext: () => any;
    error: string | null;
}

export function PersonalInfo({ formData, updateFormData, onNext, error }: Props) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateFormData({firstName: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateFormData({lastName: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => updateFormData({password: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    minLength={8}
                />
                <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => updateFormData({mobile: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="+1 (555) 000-0000"
                        pattern="[0-9+\s()-]+"
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-500"/>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Continue
                <ArrowRight className="ml-2 h-5 w-5"/>
            </button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <br />
                <Link href="/">
                    <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Login to your seller account
                    </span>
                </Link>
            </p>
        </form>
    );
}