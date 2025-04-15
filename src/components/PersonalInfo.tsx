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
    saveFormDataToStorage: () => void;
    setOtpToken: (token: string) => void;
}

export function PersonalInfo({formData, updateFormData, onNext, saveFormDataToStorage, setOtpToken}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPhoneChanged, setIsPhoneChanged] = useState(false);
    const [originalPhone, setOriginalPhone] = useState(formData.mobile);

    useEffect(() => {
        if (formData.mobile == "") {
            setIsPhoneChanged(true);
        }
        // Check if we have existing data in localStorage
        const savedData = localStorage.getItem('onboardingFormData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.mobile === formData.mobile) {
                // If phone number matches, disable name and password fields
                setIsPhoneChanged(false);
                setOriginalPhone(parsed.mobile);
            } else {
                // If phone number is different, enable fields and clear OTP token
                setIsPhoneChanged(true);
                formData.password = "";
                setOtpToken(''); // Clear OTP token when phone changes
            }
        }
    }, [formData.mobile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // If phone number hasn't changed and we have existing data, just proceed
            if (!isPhoneChanged && sessionStorage.getItem('otpToken')) {
                await onNext();
                return;
            }

            // If phone number changed or no existing data, call register
            const response = await apiService.auth.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                phone: formData.mobile
            });

            if (response.successful) {
                // Update OTP token in sessionStorage
                setOtpToken(response.data);
                saveFormDataToStorage();
                await onNext();
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "An error occurred");
        }

        setIsLoading(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value;
        updateFormData({ mobile: newPhone });
        setIsPhoneChanged(newPhone !== originalPhone);
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
                        disabled={!isPhoneChanged}
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
                        disabled={!isPhoneChanged}
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
                        onChange={handlePhoneChange}
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
                    placeholder="Password"
                    minLength={8}
                    disabled={!isPhoneChanged}
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
                <Link href="/seller/">
                    <span className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Login to your seller account
                    </span>
                </Link>
            </p>
        </form>
    );
}