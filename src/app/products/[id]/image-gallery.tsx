"use client"

import { useState } from 'react'
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
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg">
        <img
          src={selectedImage.variations.desktop}
          alt="Product image"
          width={600}
          height={600}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.imgId}
            className={cn(
              "aspect-square overflow-hidden rounded-lg cursor-pointer",
              selectedImage.imgId === image.imgId && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.variations.thumbnail}
              alt="Product thumbnail"
              width={150}
              height={150}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

