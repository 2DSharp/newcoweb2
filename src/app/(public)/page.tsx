"use client";

import HeroBanner from '@/components/homepage/HeroBanner';
import CategorySection from '@/components/homepage/CategorySection';
import TrendingSection from '@/components/homepage/TrendingSection';
import ProductCollage from '@/components/homepage/ProductCollage';
import PopularCategories from '@/components/homepage/PopularCategories';
import FeaturedProductsSection from '@/components/homepage/FeaturedProductsSection';
import CategoryFilter from '@/components/homepage/CategoryFilter';
import { useState } from 'react';

// Sample categories for the CategoryFilter
const categories = [
  { id: 1, name: 'Furniture' },
  { id: 2, name: 'Accessories' },
  { id: 3, name: 'Textiles' },
  { id: 4, name: 'Home Decor' },
  { id: 5, name: 'Art' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <main className="min-h-screen">
      {/* Hero Section with CategoryFilter */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white py-2 md:py-6">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Featured Products section (right after hero) */}
      <div className="max-w-7xl mx-auto pt-2 pb-8">
        <FeaturedProductsSection />
      </div>

      {/* Content divider */}
      <div className="border-t border-gray-100"></div>

      {/* Popular Categories */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PopularCategories heading="Browse by category" />
        </div>
      </div>

      {/* Trending Searches */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrendingSection heading="Trending Searches" />
        </div>
      </div>

      {/* Content divider */}
      <div className="border-t border-gray-100"></div>

      {/* Product Collage */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCollage heading="Explore our collection" />
        </div>
      </div>
    </main>
  );
} 