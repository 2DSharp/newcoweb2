'use client';

import { X } from 'lucide-react';

const activeFilters = [
  { id: 1, type: 'Category', value: 'Electronics' },
  { id: 2, type: 'Price', value: '$100 - $200' },
  { id: 3, type: 'Brand', value: 'Samsung' },
];

export default function ActiveFilters() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        {activeFilters.map((filter) => (
          <span
            key={filter.id}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
          >
            {filter.type}: {filter.value}
            <button className="hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
        {activeFilters.length > 0 && (
          <button className="text-sm text-indigo-600 hover:text-indigo-500">
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}