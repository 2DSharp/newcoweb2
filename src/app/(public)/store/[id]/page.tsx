'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import SellerProfile from '@/components/seller/SellerProfile';
import Stories from '@/components/seller/Stories';
import Lists from '@/components/seller/Lists';
import Categories from '@/components/seller/Categories';
import ProductSection from '@/components/product/ProductSection';
import { mockData } from '@/data/mockData';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product';

// Define API response types
interface ApiProduct {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  subCategory: string;
  price: string;
  numericPrice: number;
}

interface StoreData {
  id: string;
  name: string;
  description: string;
  image: string;
  recentProducts: ApiProduct[];
}

export default function Page() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const storeId = params.id;

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/public/stores/${storeId}`);
        const data = await response.json();
        
        if (data.successful) {
          setStoreData(data.data);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  // Use mock data for stories, lists, and categories while showing real store data
  const sellerData = storeData ? {
    ...mockData.seller,
    id: storeData.id,
    name: storeData.name,
    description: storeData.description,
    image: storeData.image,
  } : mockData.seller;

  // Map API products to the Product interface expected by components
  const mappedProducts: Product[] = storeData?.recentProducts?.map(apiProduct => ({
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.numericPrice,
    image: apiProduct.thumbnail,
    rating: 4.5 // Default rating since it's not in the API
  })) || [];

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  if (storeData?.recentProducts) {
    storeData.recentProducts.forEach(apiProduct => {
      if (!productsByCategory[apiProduct.category]) {
        productsByCategory[apiProduct.category] = [];
      }
      
      // Map to the expected Product interface
      productsByCategory[apiProduct.category].push({
        id: apiProduct.id ,
        name: apiProduct.name,
        price: apiProduct.numericPrice,
        image: apiProduct.thumbnail,
        rating: 4.5 // Default rating since it's not in the API
      });
    });
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading store details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8">
            <SellerProfile 
              seller={sellerData}
              isFollowing={isFollowing}
              onToggleFollow={() => setIsFollowing(!isFollowing)}
            />
            <Stories stories={mockData.seller.stories} />
            <Lists lists={mockData.seller.lists} />
            <Categories categories={Object.keys(productsByCategory).length > 0 ? 
              Object.keys(productsByCategory) : 
              mockData.seller.categories} 
            />
          </div>

          {/* Right Column - Products */}
          <div className="md:col-span-2 space-y-8">
            {mappedProducts.length > 0 && (
              <ProductSection
                title="Recent Products"
                icon={<TrendingUp className="w-5 h-5" />}
                products={mappedProducts}
              />
            )}
            {Object.entries(productsByCategory).map(([category, products]) => (
              <ProductSection
                key={category}
                title={category}
                products={products}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}