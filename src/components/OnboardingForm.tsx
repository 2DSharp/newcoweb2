'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { PersonalInfo } from './PersonalInfo';
import { OtpValidation } from './OtpValidation';
import { StoreSetup } from './StoreSetup';

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
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfo formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 2:
        return <OtpValidation formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 3:
        return <StoreSetup formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
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
                  <Check className="w-5 h-5" />
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
      <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
        {renderStep()}
      </div>
    </>
  );
}