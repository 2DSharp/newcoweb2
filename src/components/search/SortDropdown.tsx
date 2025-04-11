'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export interface SortOption {
  value: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

interface SortDropdownProps {
  onSortChange?: (option: SortOption) => void;
}

export default function SortDropdown({ onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SortOption>(sortOptions[0]);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize from URL if sort parameter exists
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      const option = sortOptions.find(opt => opt.value === sortParam);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [searchParams]);

  const handleSortSelection = (option: SortOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    
    // Notify parent component about the sort change
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between w-44 px-4 py-2 bg-white rounded-lg border shadow-sm"
      >
        <span className="text-sm font-medium text-gray-900">{selectedOption.label}</span>
        <ChevronDown
          className={`ml-2 h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelection(option)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedOption.value === option.value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}