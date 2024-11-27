'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import SellerProfile from '@/components/seller/SellerProfile';
import Stories from '@/components/seller/Stories';
import Lists from '@/components/seller/Lists';
import Categories from '@/components/seller/Categories';
import ProductSection from '@/components/product/ProductSection';
import { mockData } from '@/data/mockData';

export default function Page() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8">
            <SellerProfile 
              seller={mockData.seller}
              isFollowing={isFollowing}
              onToggleFollow={() => setIsFollowing(!isFollowing)}
            />
            <Stories stories={mockData.seller.stories} />
            <Lists lists={mockData.seller.lists} />
            <Categories categories={mockData.seller.categories} />
          </div>

          {/* Right Column - Products */}
          <div className="md:col-span-2 space-y-8">
            <ProductSection
              title="Best Selling"
              icon={<TrendingUp className="w-5 h-5" />}
              products={mockData.products.bestSelling}
            />
            <ProductSection
              title="Recommended For You"
              products={mockData.products.recommended}
            />
            {mockData.seller.categories.map(category => (
              <ProductSection
                key={category}
                title={category}
                products={mockData.products.byCategory[category] || []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}