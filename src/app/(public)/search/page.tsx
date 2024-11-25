import { Filter, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '@/components/search/ProductGrid';
import FilterSidebar from '@/components/search/FilterSidebar';
import SortDropdown from '@/components/search/SortDropdown';
import ActiveFilters from '@/components/search/ActiveFilters';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function SearchResults() {
  return (
    <div className="min-h-screen bg-gray-50 pt-4 sm:pt-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            <span className="text-gray-500">Found 245 items</span>
          </h1>
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button with Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="h-full overflow-y-auto py-6 px-4">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
            <SortDropdown />
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-4">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              <ActiveFilters />
              <ProductGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}