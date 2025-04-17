'use client';

import { useState, useEffect } from 'react';
import { ImageGallery } from '@/components/image-gallery';
import { ProductActions } from '@/components/ProductActions';
import { VariantSelector } from '@/components/VariantSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Truck, StarHalf, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Link from 'next/link';
import { MarkdownRenderer } from './MarkdownRenderer';
import apiService from '@/services/api';
import { Reviews } from './Reviews';

interface Review {
    id: number;
    productId: string;
    productName: string;
    reviewerId: string;
    reviewerName: string;
    rating: number;
    comment: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface ProductRating {
    averageRating: number;
    count: number;
}

interface ReviewsData {
    reviews: Review[];
    canAddReview: boolean;
    productRating: ProductRating;
}

interface ProductInfoProps {
    product: any;
    initialVariantId?: string;
}

function RatingSummary() {
  return (
      <div className="flex items-center gap-2">
          <div className="flex">
              {[...Array(5)].map((_, i) => (
                  <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                  />
              ))}
          </div>
          <span className="text-sm font-medium text-gray-700">4.2</span>
          <span className="text-sm text-gray-500">·</span>
          <span className="text-sm text-gray-500">128 ratings</span>
      </div>
  );
}
// Local component for price display
export function PriceDisplay({ selectedVariant, displayStyle }: { selectedVariant: any, displayStyle?: string }) {
  return (
    <div className="flex items-baseline gap-2">
        {displayStyle === "small" ? (
            <p className="text-lg font-medium text-gray-900">
                ₹{selectedVariant.pricing.finalPrice}
            </p>
        ) : (
            
      <p className="text-2xl font-semibold text-gray-900">
      ₹{selectedVariant.pricing.finalPrice}
            </p>
        )}
      {selectedVariant.pricing.discount && (
        <>
          <p className="text-lg text-gray-500 line-through">
          ₹{selectedVariant.pricing.originalPrice}
          </p>
          <p className="text-green-600 font-medium">
            {selectedVariant.pricing.discount.discountType === 'PERCENTAGE' && 
              `${selectedVariant.pricing.discount.applicableDiscount}% off`
            }
            {selectedVariant.pricing.discount.discountType === 'FIXED' &&
              `₹${selectedVariant.pricing.discount.applicableDiscount} off`
            }
            {selectedVariant.pricing.discount.discountType === 'BUY_AND_GET_FREE' &&
              `Buy ${selectedVariant.pricing.discount.condition.minPurchaseQty} Get Free`
            }
            {selectedVariant.pricing.discount.condition.type === 'MIN_PURCHASE_QTY' && 
              selectedVariant.pricing.discount.condition.minPurchaseQty > 1 && 
              ` on buying ${selectedVariant.pricing.discount.condition.minPurchaseQty} + items`
            
            }
            {selectedVariant.pricing.discount.condition.type === 'MIN_PURCHASE_AMOUNT' &&
              ` on orders above ₹${selectedVariant.pricing.discount.condition.minPurchaseAmount}`
            }
          </p>
        </>
      )}
    </div>
  );
}

export function ProductInfo({ product, initialVariantId }: ProductInfoProps) {
    // Find the specified variant or default to the first one
    const initialVariant = initialVariantId 
        ? product.stock.variations.find((v: any) => v.id === initialVariantId) || product.stock.variations[0]
        : product.stock.variations[0];
        
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column - Now Sticky */}
                <div className="relative">
                    <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
                        {/* Mobile Header */}
                        <div className="lg:hidden">
                            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                            {selectedVariant.name && (
                                <p className="mt-1 text-lg text-gray-500">{selectedVariant.name}</p>
                            )}
                        </div>

                        {/* Image Gallery */}
                        <div className="mt-4 lg:mt-0">
                            <ImageGallery 
                                images={selectedVariant.images}
                                variant={selectedVariant}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Desktop Header */}
                    <div className="hidden lg:block space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            {selectedVariant.name && (
                                <p className="mt-1 text-lg text-gray-500">{selectedVariant.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <PriceDisplay selectedVariant={selectedVariant} displayStyle="large" />
                            <RatingSummary />
                        </div>
                        <Link 
                            href={`/store/${product.storeId}`}
                            className="inline-block text-sm text-gray-500 hover:text-gray-700 hover:underline"
                        >
                            <b>Handcrafted by {product.storeName}</b>
                        </Link>, sold by Craftisque
                        <div className="hidden lg:block">{product.stock.variations.length > 1 &&
                            <VariantSelector
                                variants={product.stock.variations}
                                selectedVariant={selectedVariant}
                                onVariantChange={setSelectedVariant}
                            />}
                        </div>
                    </div>

                    {/* Mobile Content */}
                    <div className="lg:hidden space-y-6">
                        <div className="space-y-2">
                            <PriceDisplay selectedVariant={selectedVariant} displayStyle="large" />
                            <RatingSummary />
                        </div>
                        {/* Mobile Variant Selector */}
                        {product.stock.variations.length > 1 &&
                        <div className="overflow-x-auto pb-4 -mx-4 px-4">
                            <div className="inline-flex gap-4">
                            <VariantSelector
                                variants={product.stock.variations}
                                selectedVariant={selectedVariant}
                                onVariantChange={setSelectedVariant}
                            />
                            </div>
                        </div>
                        }
                    </div>

                    {/* Common Content for Both Mobile and Desktop */}
                    <div className="space-y-6 mt-6">
                        {/* Delivery Box */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Truck className="h-5 w-5" />
                                <span>Estimated delivery by {format(addDays(new Date(), (selectedVariant.processingTime || 0) + 2), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Enter pincode"
                                    className="max-w-[200px]"
                                />
                                <Button variant="outline">Check</Button>
                            </div>
                        </div>

                        {/* Product Actions */}
                        <ProductActions productId={product.id} variant={selectedVariant} />

                        {/* Description */}
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-2">Description</h3>
                            <div className="text-sm text-gray-600">
                                <MarkdownRenderer content={product.description} />
                            </div>
                        </div>

                        {/* Product Details - Now shown for both desktop and mobile */}
                        {selectedVariant.details && Object.keys(selectedVariant.details).length > 0 && (
                            <div>
                                <h3 className="text-base font-medium text-gray-900 mb-2">Product Details</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="divide-y divide-gray-200">
                                            {Object.entries(selectedVariant.details).map(([key, value]) => (
                                                <tr key={key}>
                                                    <td className="px-4 py-2 text-sm text-gray-500 bg-gray-50">{key}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{value as string}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
                <Reviews productId={product.id} />
            </div>
        </div>
    );
}