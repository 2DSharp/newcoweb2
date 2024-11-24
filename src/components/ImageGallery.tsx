'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: ProductImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentIndex = images.findIndex(img => img.imgId === selectedImage.imgId);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setSelectedImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col-reverse md:flex-row md:gap-4">
        {/* Thumbnail List */}
        <div className="flex mt-4 md:mt-0 md:flex-col md:w-20 gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[500px] scrollbar-hide">
          {images.map((image) => (
            <button
              key={image.imgId}
              className={`flex-shrink-0 aspect-square overflow-hidden rounded-lg cursor-pointer transition-all
                ${selectedImage.imgId === image.imgId 
                  ? 'ring-2 ring-black' 
                  : 'hover:opacity-75'}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.variations.thumbnail}
                alt="Product thumbnail"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* Main Image Container */}
        <div className="flex-1 relative group">
          <div 
            className="aspect-square overflow-hidden rounded-lg relative cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={selectedImage.variations.desktop}
              alt="Product"
              width={800}
              height={800}
              className={`object-cover w-full h-full transition-transform duration-500 ${
                isZoomed ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-black/20 hover:bg-black/40 border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-black/20 hover:bg-black/40 border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>
            </>
          )}
        </div>
      </div>

     
    </div>
  );
}