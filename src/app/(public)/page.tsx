"use client";

import { useState, useEffect, useRef } from 'react';
import HeroBanner from '@/components/homepage/HeroBanner';
import CategorySection from '@/components/homepage/CategorySection';
import TrendingSection from '@/components/homepage/TrendingSection';
import ProductCollage from '@/components/homepage/ProductCollage';
import PopularCategories from '@/components/homepage/PopularCategories';
import FeaturedProductsSection from '@/components/homepage/FeaturedProductsSection';
import CategoryFilter from '@/components/homepage/CategoryFilter';
import { apiService } from '@/services/api';

// Homepage data interface
interface HomepageData {
  _id?: {
    timestamp: number;
    date: string;
  };
  key?: string;
  hero?: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  }[];
  categoryFilter?: {
    title: string;
    categories: {
      id: number;
      name: string;
    }[];
  };
  featuredProducts?: {
    heading: string;
    products: {
      id: number;
      name: string;
      price: string;
      image: string;
      category: string;
    }[];
  };
  popularCategories?: {
    heading: string;
    categories: {
      name: string;
      image: string;
    }[];
  };
  trendingSection?: {
    heading: string;
    items: {
      image: string;
      title: string;
      searches: string;
      href: string;
    }[];
  };
  productCollage?: {
    heading: string;
    products: {
      id: number;
      name: string;
      price: string;
      image: string;
      orientation: string;
    }[];
  };
}

export default function HomePage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true);
        const response = await apiService.cms.getHomepage();
        if (response && response.status === "SUCCESS") {
          setHomepageData(response.data);
        } else {
          setError("Failed to load homepage data");
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("An error occurred while fetching homepage data");
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with CategoryFilter */}
      {homepageData?.categoryFilter && (
        <div className="relative bg-gradient-to-b from-gray-50 to-white py-2 md:py-6">
          <div className="max-w-7xl mx-auto">
            <CategoryFilter 
              categories={homepageData.categoryFilter.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              title={homepageData.categoryFilter.title}
            />
          </div>
        </div>
      )}

      {/* Hero Banner - now with internal slider */}
      {homepageData?.hero && homepageData.hero.length > 0 && (
        <HeroBanner banners={homepageData.hero} />
      )}

      {/* Featured Products section */}
      {homepageData?.featuredProducts && (
        <div className="max-w-7xl mx-auto pt-2 pb-8">
          <FeaturedProductsSection 
            heading={homepageData.featuredProducts.heading}
            products={homepageData.featuredProducts.products}
          />
        </div>
      )}

      {/* Content divider */}
      <div className="border-t border-gray-100"></div>

      {/* Popular Categories */}
      {homepageData?.popularCategories && (
        <div className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PopularCategories 
              heading={homepageData.popularCategories.heading}
              categories={homepageData.popularCategories.categories}
            />
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {homepageData?.trendingSection && (
        <div className="bg-gray-50 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrendingSection 
              heading={homepageData.trendingSection.heading}
              items={homepageData.trendingSection.items}
            />
          </div>
        </div>
      )}

      {/* Content divider */}
      <div className="border-t border-gray-100"></div>

      {/* Product Collage */}
      {homepageData?.productCollage && (
        <div className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductCollage 
              heading={homepageData.productCollage.heading}
              products={homepageData.productCollage.products}
            />
          </div>
        </div>
      )}
    </main>
  );
} 