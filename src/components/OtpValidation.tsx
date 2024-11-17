'use client';

import React, {useState, useEffect} from 'react';
import {ArrowRight, RefreshCw, ArrowLeft, Phone, AlertCircle} from 'lucide-react';
import {FormData} from './OnboardingForm';
import apiService from "@/services/api";
import storeCredentials from "@/services/storage";
import {AuthService} from "@/services/authService";

interface Props {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    onNext: () => void;
    onBack: () => void;
    className?: string;
}

export function OtpValidation({formData, updateFormData, onNext, onBack, className = ''}: Props) {
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isChangingNumber, setIsChangingNumber] = useState(false);
    const [tempMobile, setTempMobile] = useState(formData.mobile);
    const [error, setError] = useState(null);
    const authService = AuthService.getInstance();


    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isChangingNumber) {
            updateFormData({mobile: tempMobile});
            setIsChangingNumber(false);
            setTimer(30);
            setCanResend(false);
        } else {
            try {

                const response = await apiService.auth.verifyOtp({
                    verificationId: formData.otpToken,
                    nonce: formData.otp
                })

                await authService.setAuthData(response.data)
                onNext();
            } catch (e) {
                console.log(e)
                setError(e.response.data.message);
            }
        }
    };

    const handleResendOTP = () => {
        setTimer(30);
        setCanResend(false);
    };

    const maskedPhone = formData.mobile.replace(/(\d{5})(\d{5})/, '+91 $1 $2');

    return (
        <div className={className}>
            <div className="relative">
                {/* OTP Verification Form */}
                <div className={`transition-all duration-500 ${isChangingNumber ? 'slide-out-left' : 'slide-in-right'}`}
                     style={{display: isChangingNumber ? 'none' : 'block'}}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Verify Your Number</h2>
                            <div className="mt-2 flex items-center justify-center gap-2 text-gray-600">
                                <span>Code sent to {maskedPhone}</span>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingNumber(true)}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors duration-300 text-sm font-medium"
                                >
                                    <Phone className="h-4 w-4 mr-1"/>
                                    Change
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                required
                                value={formData.otp}
                                onChange={(e) => updateFormData({otp: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                pattern="[0-9]{6}"
                            />
                        </div>

                        <div className="text-center">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2"/>
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-gray-500">
                                    Resend OTP in {timer} seconds
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5"/>
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                            >
                                Verify
                                <ArrowRight className="ml-2 h-5 w-5"/>
                            </button>
                        </div>

                        {error && (
                            <div
                                className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                <AlertCircle className="h-5 w-5 text-red-500"/>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Change Number Form */}
                <div className={`transition-all duration-500 ${isChangingNumber ? 'slide-in-right' : 'slide-out-left'}`}
                     style={{display: isChangingNumber ? 'block' : 'none'}}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Change Phone Number</h2>
                            <p className="mt-2 text-gray-600">
                                Enter your new phone number to receive OTP
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={tempMobile}
                                onChange={(e) => setTempMobile(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="+1 (555) 000-0000"
                                pattern="[0-9+\s()-]+"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsChangingNumber(false)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5"/>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                            >
                                Update
                                <Phone className="ml-2 h-5 w-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}