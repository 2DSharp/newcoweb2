"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ImageGallery } from './image-gallery'
import { VariantSelector } from './variant-selector'
import { ShoppingCart, Clock, Leaf } from 'lucide-react'

interface ProductDetailsProps {
  product: any // Replace 'any' with a proper type definition for your product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.stock.variations[0])

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <ImageGallery images={selectedVariant.images} />
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold mt-2">{selectedVariant.pricing.finalPrice}</p>
        </div>
        <div>
          <Badge variant="outline">{product.category}</Badge>
          <Badge variant="outline" className="ml-2">{product.subCategory}</Badge>
        </div>
        <Separator />
        <VariantSelector
          variants={product.stock.variations}
          selectedVariant={selectedVariant}
          onVariantChange={handleVariantChange}
        />
        <Separator />
        <div>
          <h2 className="text-lg font-semibold mb-2">Product Details</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Processing Time: {product.processingTime} days
            </li>
            <li className="flex items-center">
              <Leaf className="mr-2 h-4 w-4" />
              Material: {product.materialType.join(", ")}
            </li>
          </ul>
        </div>
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {product.searchability.keywords.map((keyword: string) => (
                <Badge key={keyword} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

