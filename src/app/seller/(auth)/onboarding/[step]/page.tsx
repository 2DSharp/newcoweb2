'use client';

import {OnboardingForm} from '@/components/OnboardingForm';
// @ts-ignore
import EntryPageLayout from "@/app/seller/(auth)/layout";
import { redirect } from 'next/navigation'
import {useEffect} from "react";

export default function OnboardingHome({ params }: { params: { step: string } }) {

    // Map routes to step numbers
    const stepMap: { [key: string]: number } = {
        'personal-info': 1,
        'verify-otp': 2,
        'store-setup': 3
    }

    const currentStep = stepMap[params.step]

    if (!currentStep) {
        redirect('/seller/onboarding/personal-info')
    }

    useEffect(() => {

        // Check localStorage for progress
        const savedData = localStorage.getItem('onboardingFormData')
        if (savedData) {
            try {
                const formData = JSON.parse(savedData)

                // If personal info is complete, redirect to OTP verification
                if (formData.firstName && formData.lastName && formData.email && formData.password) {
                    if (currentStep < 2) {
                        window.location.href = '/seller/onboarding/verify-otp'
                        return
                    }

                    // If OTP is verified, redirect to store setup
                    if (formData.otpToken && currentStep < 3) {
                        window.location.href = '/seller/onboarding/store-setup'
                        return
                    }
                }
            } catch (e) {
                console.error('Error parsing saved form data:', e)
            }
        }
    }, [currentStep])

    return (
            <div className="max-w-md w-full mx-auto">

                {/* Logo and Header */}
                <div className="text-center mb-8">
                    {/*<div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">*/}
                    {/*    <Store className="w-8 h-8 text-white"/>*/}
                    {/*</div>*/}
                    <h1 className="text-3xl font-bold text-gray-900">Create a seller account</h1>
                    <p className="text-gray-600 mt-2">Sign up as a creator and let us help you grow your business</p>
                </div>

                <OnboardingForm initialStep={currentStep}/>

            </div>
)
;
}