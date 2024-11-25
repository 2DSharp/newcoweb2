'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PriceRangeSlider } from './PriceRangeSlider';

const filters = {
  price: {
    name: 'Price',
    options: [
      { value: '0-50', label: '$0 - $50', count: 120 },
      { value: '50-100', label: '$50 - $100', count: 75 },
      { value: '100-200', label: '$100 - $200', count: 40 },
      { value: '200+', label: '$200+', count: 10 },
    ],
  },
  category: {
    name: 'Category',
    options: [
      { value: 'fashion', label: 'Fashion', count: 85 },
      { value: 'electronics', label: 'Electronics', count: 42 },
      { value: 'home', label: 'Home & Living', count: 63 },
      { value: 'sports', label: 'Sports', count: 35 },
      { value: 'beauty', label: 'Beauty', count: 20 },
    ],
  },
  brand: {
    name: 'Brand',
    options: [
      { value: 'nike', label: 'Nike', count: 25 },
      { value: 'adidas', label: 'Adidas', count: 18 },
      { value: 'samsung', label: 'Samsung', count: 15 },
      { value: 'apple', label: 'Apple', count: 12 },
      { value: 'sony', label: 'Sony', count: 10 },
    ],
  },
  rating: {
    name: 'Rating',
    options: [
      { value: '4+', label: '4 Stars & Up', count: 150 },
      { value: '3+', label: '3 Stars & Up', count: 85 },
      { value: '2+', label: '2 Stars & Up', count: 35 },
      { value: '1+', label: '1 Star & Up', count: 10 },
    ],
  },
  color: {
    name: 'Color',
    options: [
      { value: 'black', label: 'Black', count: 45 },
      { value: 'white', label: 'White', count: 32 },
      { value: 'blue', label: 'Blue', count: 28 },
      { value: 'red', label: 'Red', count: 20 },
      { value: 'green', label: 'Green', count: 15 },
    ],
  },
};

export default function FilterSidebar() {
  const [expanded, setExpanded] = useState<string[]>(Object.keys(filters));

  const toggleSection = (section: string) => {
    setExpanded(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Price Range</h3>
        <PriceRangeSlider 
          min={0}
          max={10000}
          step={100}
          onRangeChange={(range) => {
            console.log('Price range changed:', range);
            // Handle price range change
          }}
        />
      </div>

      {/* Other filters */}
      {Object.entries(filters).map(([key, section]) => (
        <div key={key} className="border-b pb-6">
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => toggleSection(key)}
          >
            <h3 className="text-sm font-semibold text-gray-900">{section.name}</h3>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                expanded.includes(key) ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          {expanded.includes(key) && (
            <div className="mt-4 space-y-3">
              {section.options.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    {option.label}
                    <span className="ml-1 text-gray-400">({option.count})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}