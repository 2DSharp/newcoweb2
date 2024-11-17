// components/OnboardingForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { PersonalInfo } from './PersonalInfo';
import { OtpValidation } from './OtpValidation';
import { StoreSetup } from './StoreSetup';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export type FormData = {
    firstName: string;
    lastName: string;
    password: string;
    mobile: string;
    otp: string;
    storeName: string;
    email: string;
    state: string;
    otpToken: string;
};

type Props = {
    initialStep: number;
};

export function OnboardingForm({ initialStep }: Props) {

    const [formData, setFormData] = useState<FormData>(() => {
        // Initialize form data from localStorage if available
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('onboardingFormData');
            return saved ? JSON.parse(saved) : {
                firstName: '',
                lastName: '',
                password: '',
                mobile: '',
                otp: '',
                storeName: '',
                email: '',
                state: '',
                otpToken: ''
            };
        }
        return {
            firstName: '',
            lastName: '',
            password: '',
            mobile: '',
            otp: '',
            storeName: '',
            email: '',
            state: '',
            otpToken: ''
        };
    });

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('onboardingFormData', JSON.stringify(formData));
    }, [formData]);

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({...prev, ...data}));
    };

    const router = useRouter();
    const [step, setStep] = useState(initialStep);

    const nextStep = () => {
        // Only update the URL, let the useEffect handle the step update
        const newStep = step + 1;
        switch (newStep) {
            case 2:
                router.push('/onboarding/verify-otp');
                break;
            case 3:
                router.push('/onboarding/store-setup');
                break;
        }
    };

    const goBack = () => {
        // Only update the URL, let the useEffect handle the step update
        const newStep = step - 1;
        switch (newStep) {
            case 1:
                router.push('/onboarding/personal-info');
                break;
            case 2:
                router.push('/onboarding/verify-otp');
                break;
        }
    };

// components/OnboardingForm.tsx
    useEffect(() => {
        setStep(initialStep);
    }, [initialStep]); // Simplified useEffect

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <PersonalInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{x: '100%', opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            exit={{x: '-80%', opacity: 0}}
                            transition={{duration: 0.3}}
                            className="w-full max-w-md"
                        >
                            <OtpValidation
                                formData={formData}
                                updateFormData={updateFormData}
                                onNext={nextStep}
                                onBack={goBack}
                            />
                        </motion.div>
                    </AnimatePresence>
                );
            case 3:
                return (
                    <StoreSetup
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((item) => (
                    <React.Fragment key={item}>
                        <div className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step >= item
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {step > item ? (
                                    <Check className="w-5 h-5"/>
                                ) : (
                                    <span>{item}</span>
                                )}
                            </div>
                            {item < 3 && (
                                <div
                                    className={`w-20 h-1 ${
                                        step > item ? 'bg-indigo-600' : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <div className="transition-all duration-300">
                {renderStep()}
            </div>
        </>
    );
}