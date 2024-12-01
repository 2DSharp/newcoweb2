import HeroBanner from '@/components/homepage/HeroBanner';
import CategorySection from '@/components/homepage/CategorySection';
import TrendingSection from '@/components/homepage/TrendingSection';
import ProductCollage from '@/components/homepage/ProductCollage';
import PopularCategories from '@/components/homepage/PopularCategories';

export default function HomePage() {
  return (
    <main className="min-h-screen">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-center">
        A passion driven marketplace connecting artisans to you
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        <PopularCategories heading="Browse by category" />
        <TrendingSection heading="Trending Searches" />
        <ProductCollage heading="Explore" />
      </div>
    </main>
  );
} 