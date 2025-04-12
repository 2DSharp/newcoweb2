'use client';

import { useState, useEffect, useContext } from 'react';
import { Store, Mail, Globe, Building, Loader2, Check, SquareArrowUpRightIcon, SquareArrowOutUpRightIcon } from 'lucide-react';
import { apiService } from '@/services/api';
import ImageUploader from '@/components/ImageUploader';
import { SellerContext } from '@/app/seller/(workspace)/settings/page';
import Link from 'next/link';

interface StoreData {
  id?: string;
  name: string;
  email: string;
  description: string | null;
  state: string;
  image: string | null;
  imageUrl?: string | null;
}

export default function StoreBasicDetails() {
  const [formData, setFormData] = useState<StoreData>({
    name: '',
    email: '',
    state: '',
    description: '',
    image: null,
    imageUrl: null
  });
  const [originalData, setOriginalData] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const isSellerContext = useContext(SellerContext);

  const fetchStoreDetails = async () => {
    try {
      setIsFetching(true);
      const response = await apiService.store.getDetails();
      if (response.successful) {
        const storeData = {
          id: response.data.id,
          name: response.data.name || '',
          email: response.data.email || '',
          state: response.data.state || '',
          description: response.data.description || '',
          image: response.data.image || null,
          imageUrl: response.data.image || null // For initial load, image field contains the URL
        };
        setFormData(storeData);
        setOriginalData(storeData);
        // Reset image uploaded flag after fetching new data
        setImageUploaded(false);
      }
    } catch (error) {
      console.error('Error fetching store details:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);

    try {
      // Only send image field if it was actually changed via the uploader
      const submitData = {
        name: formData.name,
        email: formData.email,
        state: formData.state,
        description: formData.description,
        image: imageUploaded ? formData.image : null
      };

      const response = await apiService.store.update(null, submitData);

      if (response.successful) {
        // Fetch fresh data from server to reflect updated information
        await fetchStoreDetails();
        setShowSuccess(true);
        
        // Hide success indicator after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        console.error('Failed to update store details:', response.message);
      }
    } catch (error) {
      console.error('Error updating store details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (images) => {
    // Mark that the image has been uploaded/changed
    setImageUploaded(true);
    
    if (images.length > 0) {
      // Set both the image ID for API submission and the URL for display
      setFormData(prev => ({
        ...prev,
        image: images[0].imgId,
        imageUrl: images[0].url
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        image: null,
        imageUrl: null
      }));
    }
  };

  // Check if form data has changed from original
  const hasChanges = () => {
    if (!originalData) return false;
    
    // Special handling for image field - only consider it changed if imageUploaded is true
    const imageChanged = imageUploaded && (
      (originalData.image === null && formData.image !== null) ||
      (originalData.image !== null && formData.image === null) ||
      (originalData.image !== null && formData.image !== null && originalData.image !== formData.image)
    );
    
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.state !== originalData.state ||
      formData.description !== originalData.description ||
      imageChanged
    );
  };

  // Format the current image for the ImageUploader component
  const storeImages = formData.imageUrl ? [
    {
      imgId: formData.image || '',
      url: formData.imageUrl,
      thumbnail: false
    }
  ] : [];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Basic Details</h3>
        <p className="mt-1 text-md text-gray-500">
          Update your store's basic information
        </p>
        <p className="mt-1 text-sm text-gray-500">
           <Link href={`/store/${formData.id}`} target="_blank" className="text-blue-500 hover:underline">Access your store's public page <SquareArrowOutUpRightIcon className="w-4 h-4 inline-block" /></Link>
        </p>
      </div>

      {isFetching && !formData.name ? (
        <div className="p-6 flex justify-center">
          <div className="animate-pulse w-full">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
            <div>
              <ImageUploader
                images={storeImages}
                onChange={handleImageChange}
                maxImages={1}
                variationIndex={0}
                showThumbnailSelector={false}
                action="edit"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input-with-icon"
                placeholder="Enter store name"
                required
                minLength={4}
                maxLength={80}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input-with-icon"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase().slice(0, 2) })}
                className="form-input-with-icon"
                placeholder="Enter state code (e.g. KA)"
                required
                maxLength={2}
                minLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="form-textarea"
              placeholder="Enter store description"
            />
          </div>

          <div className="flex justify-end">
            {hasChanges() && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}