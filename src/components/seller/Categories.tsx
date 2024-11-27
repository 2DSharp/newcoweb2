'use client';

import React from 'react';

interface CategoriesProps {
  categories: string[];
}

export default function Categories({ categories }: CategoriesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(category => (
          <div 
            key={category}
            className="bg-gray-50 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-sm font-medium">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}