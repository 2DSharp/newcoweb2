"use client";

import React, {useState} from 'react';
import {Check} from 'lucide-react';
import {PersonalInfo} from './PersonalInfo';
import {OtpValidation} from './OtpValidation';
import {StoreSetup} from './StoreSetup';
import apiService from "../services/api";
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
};

export function OnboardingForm() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        password: '',
        mobile: '',
        otp: '',
        storeName: '',
        email: '',
        state: '',
    });

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({...prev, ...data}));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const registerAccount = async () => {
        try {
            const response = await apiService.auth.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                phone: formData.mobile
            });

            if (response.successful) {
                nextStep();
            } else {
                alert("Here?")
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <PersonalInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        error={error}
                    />
                );
            case 2:
                return (
                    <OtpValidation
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onBack={() => setStep(step - 1)}
                        error={error}
                    />
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
            {/* Progress Steps */}
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

            {/* Form Container */}
            <div className="transition-all duration-300">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-80%', opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md"

                    >
                {renderStep()}

                    </motion.div>
                </AnimatePresence>
            </div>


        </>
    );
}