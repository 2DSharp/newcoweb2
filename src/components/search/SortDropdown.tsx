'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(sortOptions[0]);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Sort by: {selected.label}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                selected.value === option.value ? 'text-indigo-600' : 'text-gray-700'
              }`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}