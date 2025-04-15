'use client';

import { useState, useContext, useEffect } from 'react';
import { MapPin, Building, User, Phone, MapPinned, Flag } from 'lucide-react';
import apiService from '@/services/api';
import { SellerContext } from '@/app/seller/(workspace)/settings/page';

export default function StoreAddress() {
  // Get the seller context value
  const isSellerContext = useContext(SellerContext);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    isDefault: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch address data on component mount
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const response = await apiService.accounts.getAddresses(isSellerContext);
        if (response.successful && response.data && response.data.length > 0) {
          const address = response.data[0]; // Assume first address is the store address
          setFormData({
            name: address.name || '',
            phone: address.phone || '',
            addressLine1: address.addressLine1 || '',
            addressLine2: address.addressLine2 || '',
            city: address.city || '',
            state: address.state || '',
            zipCode: address.pinCode ? address.pinCode.toString() : '',
            landmark: address.landmark || '',
            isDefault: address.default !== undefined ? address.default : true
          });
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [isSellerContext]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      // Format address data for API
      const addressData = {
        label: formData.label,
        name: formData.name,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pinCode: formData.zipCode ? parseInt(formData.zipCode) : undefined,
        landmark: formData.landmark,
        businessRegistration: formData.businessRegistration,
        default: formData.isDefault
      };

      // Check if we need to update or create
      const addresses = await apiService.accounts.getAddresses(isSellerContext);
      
      if (addresses.successful && addresses.data && addresses.data.length > 0) {
        // Update existing address
        const addressId = addresses.data[0].id;
        await apiService.accounts.updateAddress(addressId, addressData, isSellerContext);
      } else {
        // Create new address
        await apiService.accounts.addAddress(addressData, isSellerContext);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Address Details</h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your store's address and business registration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input-with-icon"
                placeholder="Contact person name"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input-with-icon"
                placeholder="Contact phone number"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN/ZIP Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="form-input"
              placeholder="Enter PIN/ZIP code"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="form-input-with-icon w-full"
              placeholder="Street address, P.O. box, company name"
            />
          </div>
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 opacity-40" />
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              className="form-input-with-icon w-full"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="form-input"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="form-input"
              placeholder="Enter state"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="form-input-with-icon"
              placeholder="Nearby landmark for easier navigation"
            />
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg">
            Address saved successfully!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}