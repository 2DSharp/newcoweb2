'use client';

import { useState, useContext, createContext } from 'react';
import StoreBasicDetails from '@/components/settings/StoreBasicDetails';
import StoreAddress from '@/components/settings/StoreAddress';
import StoreBankDetails from '@/components/settings/StoreBankDetails';
import StoreAccountDetails from '@/components/settings/StoreAccountDetails';
import { Building2, MapPin, Wallet, User } from 'lucide-react';
import './settings.css';

// Create a context to pass down the seller context flag
export const SellerContext = createContext(true);

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('basic');

  const sections = [
    { id: 'basic', label: 'Basic Details', icon: Building2 },
    { id: 'address', label: 'Address Details', icon: MapPin },
    { id: 'bank', label: 'Bank Account', icon: Wallet },
    { id: 'account', label: 'Account Settings', icon: User }
  ];

  return (
    <SellerContext.Provider value={true}>
      <div className="settings-page min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl shadow-sm p-4">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeSection === 'basic' && <StoreBasicDetails />}
              {activeSection === 'address' && <StoreAddress />}
              {activeSection === 'bank' && <StoreBankDetails />}
              {activeSection === 'account' && <StoreAccountDetails />}
            </div>
          </div>
        </div>
      </div>
    </SellerContext.Provider>
  );
}