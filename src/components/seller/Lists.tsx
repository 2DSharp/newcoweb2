'use client';

import React from 'react';

interface List {
  title: string;
  products: number;
  image: string;
}

interface ListsProps {
  lists: List[];
}

export default function Lists({ lists }: ListsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Featured Lists</h2>
      <div className="space-y-4">
        {lists.map(list => (
          <div key={list.title} className="group cursor-pointer">
            <div className="relative h-32 rounded-lg overflow-hidden">
              <img 
                src={list.image} 
                alt={list.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-semibold">{list.title}</h3>
                  <p className="text-sm">{list.products} products</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}