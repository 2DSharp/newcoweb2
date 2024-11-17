'use client';

import {ArrowRight, AlertCircle} from 'lucide-react';
import {FormData} from './OnboardingForm';
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {AnimatingButton} from "@/components/animatingbutton";
import apiService from "@/services/api";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

interface Props {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    onNext: () => any;
}

export function PersonalInfo({formData, updateFormData, onNext}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        setError(null);
        try {
            const response = await apiService.auth.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                phone: formData.mobile
            });

            if (response.successful) {
                updateFormData({otpToken: response.data})
                await onNext();
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.log(err)
            setError(err.response.data.message);
        }

        setIsLoading(false);
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
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-500"/>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <AnimatingButton isLoading={isLoading}>
                Continue
            </AnimatingButton>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <br/>
                <Link href="/">
                    <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Login to your seller account
                    </span>
                </Link>
            </p>
        </form>
    );
}