"use client";
import { useState } from "react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  
  const handleCategoryClick = (category: Category | null) => {
    onSelectCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <h1 className="text-4xl font-heading font-bold mb-4 md:mb-0">
          Discover <span className="text-primary">Handcrafted</span> Treasures
        </h1>
        
        <div className="flex items-center flex-wrap gap-2">
          <button 
            onClick={() => handleCategoryClick(null)}
            className={`${!selectedCategory ? 'bg-primary text-white' : 'bg-muted text-secondary hover:bg-primary/10'} px-4 py-2 rounded-full text-sm font-accent transition-colors`}
          >
            All Items
          </button>
          
          {categories.map(category => (
            <button 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`${selectedCategory?.id === category.id ? 'bg-primary text-white' : 'bg-muted text-black hover:bg-primary/10'} px-4 py-2 rounded-full text-sm font-accent transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
