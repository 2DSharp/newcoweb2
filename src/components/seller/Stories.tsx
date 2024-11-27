'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  image: string;
  excerpt: string;
}

interface StoriesProps {
  stories: Story[];
}

export default function Stories({ stories }: StoriesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Stories</h2>
        <button className="text-blue-600 hover:text-blue-700 flex items-center">
          View all <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        {stories.map(story => (
          <div key={story.id} className="group cursor-pointer">
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img 
                src={story.image} 
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <h3 className="mt-2 font-semibold group-hover:text-blue-600">{story.title}</h3>
            <p className="text-sm text-gray-600">{story.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}