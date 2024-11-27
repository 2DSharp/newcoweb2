'use client';

import React from 'react';
import { Heart, Star, StarHalf } from 'lucide-react';
import { Seller } from '@/types/seller';

interface SellerProfileProps {
  seller: Seller;
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export default function SellerProfile({ seller, isFollowing, onToggleFollow }: SellerProfileProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-4">
        <img 
          src={seller.logo} 
          alt={seller.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
              ))}
              <StarHalf className="w-4 h-4 fill-current text-yellow-400" />
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {seller.rating} ({seller.reviews.toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-gray-600">{seller.description}</p>
      
      <button
        onClick={onToggleFollow}
        className={`mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
          isFollowing 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
        <span>{isFollowing ? 'Following' : 'Follow'}</span>
        <span className="text-sm">({seller.followers.toLocaleString()})</span>
      </button>
    </div>
  );
}