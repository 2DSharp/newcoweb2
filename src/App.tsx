import React, { useState } from 'react';
import { Store, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import PersonalInfo from './components/PersonalInfo';
import OtpValidation from './components/OtpValidation';
import StoreSetup from './components/StoreSetup';

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

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Onboarding</h1>
            <p className="text-gray-600 mt-2">Join thousands of successful sellers on our platform</p>
          </div>

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
        </div>
      </div>
    </div>
  );
}

export default App;