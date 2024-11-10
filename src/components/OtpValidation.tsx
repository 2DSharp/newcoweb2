'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { FormData } from './OnboardingForm';

interface Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export function OtpValidation({ formData, updateFormData, onNext }: Props) {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
    // Implement OTP resend logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Number</h2>
        <p className="mt-2 text-gray-600">
          We've sent a verification code to {formData.mobile}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
        <input
          type="text"
          required
          value={formData.otp}
          onChange={(e) => updateFormData({ otp: e.target.value })}
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
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-500">
            Resend OTP in {timer} seconds
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Verify & Continue
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </form>
  );
}