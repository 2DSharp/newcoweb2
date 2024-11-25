"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: Array<{
    imgId: string
    url: string
    variations: {
      desktop: string
      mobile: string
      thumbnail: string
    }
  }>
  variant: any;
}

export function ImageGallery({ images, variant }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [variant, images])

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={selectedImage?.variations.desktop}
          alt="Product image"
          width={600}
          height={600}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Thumbnail Scroll */}
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
          {images.map((image) => (
            <button
              key={image.imgId}
              className={cn(
                "flex-shrink-0 w-28 aspect-square overflow-hidden rounded-lg cursor-pointer transition-all bg-gray-100",
                selectedImage?.imgId === image.imgId 
                  ? "ring-2 ring-black" 
                  : "hover:opacity-75"
              )}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.variations.thumbnail}
                alt="Product thumbnail"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

