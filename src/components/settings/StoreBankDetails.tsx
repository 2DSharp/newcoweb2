'use client';

import { useState } from 'react';
import { Building2, CreditCard, User } from 'lucide-react';

export default function StoreBankDetails() {
  const [formData, setFormData] = useState({
    accountHolder: 'Artisan Home & Living LLC',
    accountNumber: '••••••••1234',
    routingNumber: '•••••0123',
    bankName: 'Commerce Bank',
    swiftCode: 'CMRCUS12'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your payment information for receiving payouts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.accountHolder}
              onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
              className="form-input-with-icon"
              placeholder="Enter account holder name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="form-input-with-icon"
                placeholder="Enter account number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
            <input
              type="text"
              value={formData.routingNumber}
              onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
              className="form-input"
              placeholder="Enter routing number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="form-input-with-icon"
                placeholder="Enter bank name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code</label>
            <input
              type="text"
              value={formData.swiftCode}
              onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
              className="form-input"
              placeholder="Enter SWIFT code"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}