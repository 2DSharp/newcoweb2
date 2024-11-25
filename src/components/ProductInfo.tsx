'use client';

import { useState } from 'react';
import { ImageGallery } from '@/components/image-gallery';
import { ProductActions } from '@/components/ProductActions';
import { VariantSelector } from '@/components/VariantSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Truck, StarHalf } from 'lucide-react';
import { format, addDays } from 'date-fns';
import Link from 'next/link';
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

export function ProductInfo({ product }: { product: any }) {
    const [selectedVariant, setSelectedVariant] = useState(product.stock.variations[0]);

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
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {selectedVariant.pricing.finalPrice}
                                </p>
                                {selectedVariant.pricing.discount && (
                                    <>
                                        <p className="text-lg text-gray-500 line-through">
                                            {selectedVariant.pricing.originalPrice}
                                        </p>
                                        <p className="text-green-600 font-medium">
                                            {selectedVariant.pricing.discount}% off
                                        </p>
                                    </>
                                )}
                            </div>
                            <RatingSummary />
                        </div>
                        <Link 
                            href={`/store/${product.storeId}`}
                            className="inline-block text-sm text-gray-500 hover:text-gray-700 hover:underline"
                        >
                            <b>Sold by {product.storeName}</b>
                        </Link>
                        <div className="hidden lg:block">
                            <VariantSelector
                                variants={product.stock.variations}
                                selectedVariant={selectedVariant}
                                onVariantChange={setSelectedVariant}
                            />
                        </div>
                    </div>

                    {/* Mobile Content */}
                    <div className="lg:hidden space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {selectedVariant.pricing.finalPrice}
                                </p>
                                {selectedVariant.pricing.discount && (
                                    <>
                                        <p className="text-lg text-gray-500 line-through">
                                            {selectedVariant.pricing.originalPrice}
                                        </p>
                                        <p className="text-green-600 font-medium">
                                            {selectedVariant.pricing.discount}% off
                                        </p>
                                    </>
                                )}
                            </div>
                            <RatingSummary />
                        </div>
                        {/* Mobile Variant Selector */}
                        <div className="overflow-x-auto pb-4 -mx-4 px-4">
                            <div className="inline-flex gap-4">
                                <VariantSelector
                                    variants={product.stock.variations}
                                    selectedVariant={selectedVariant}
                                    onVariantChange={setSelectedVariant}
                                />
                            </div>
                        </div>
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
                        <ProductActions variant={selectedVariant} />

                        {/* Description */}
                        <div>
                            <h3 className="text-base font-medium text-gray-900 mb-2">Description</h3>
                            <div 
                                className="text-sm text-gray-600"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
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
                <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
                <div className="space-y-8">
                    {/* Rating Summary */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gray-900">4.5</div>
                            <div className="flex items-center justify-center mt-2">
                                <Star className="w-5 h-5 fill-current text-yellow-400" />
                                <Star className="w-5 h-5 fill-current text-yellow-400" />
                                <Star className="w-5 h-5 fill-current text-yellow-400" />
                                <Star className="w-5 h-5 fill-current text-yellow-400" />
                                <StarHalf className="w-5 h-5 fill-current text-yellow-400" />
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Based on 128 reviews</div>
                        </div>
                        
                        {/* Rating Bars */}
                        <div className="flex-1 max-w-md">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 w-6">{rating}</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full"
                                            style={{ 
                                                width: `${rating === 5 ? 70 : 
                                                        rating === 4 ? 20 : 
                                                        rating === 3 ? 5 : 
                                                        rating === 2 ? 3 : 2}%` 
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-8">
                                        {rating === 5 ? '70%' : 
                                         rating === 4 ? '20%' : 
                                         rating === 3 ? '5%' : 
                                         rating === 2 ? '3%' : '2%'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Options */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <Button 
                            variant="outline" 
                            className="whitespace-nowrap rounded-full px-6"
                        >
                            Most Popular
                        </Button>
                        <Button 
                            variant="outline" 
                            className="whitespace-nowrap rounded-full px-6"
                        >
                            Most Recent
                        </Button>
                        <Button 
                            variant="outline" 
                            className="whitespace-nowrap rounded-full px-6"
                        >
                            Most Critical
                        </Button>
                        <Button 
                            variant="outline" 
                            className="whitespace-nowrap rounded-full px-6"
                        >
                            Most Positive
                        </Button>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-6">
                        {[
                            {
                                name: "Sarah Johnson",
                                rating: 5,
                                date: "1 month ago",
                                verified: true,
                                review: "Absolutely love this product! The quality is exceptional and it exceeded my expectations. The delivery was quick and the packaging was excellent.",
                                helpful: 24
                            },
                            {
                                name: "Michael Chen",
                                rating: 4,
                                date: "2 months ago",
                                verified: true,
                                review: "Great product overall. The only minor issue is that the color is slightly different from what's shown in the pictures. Otherwise, very satisfied with the purchase.",
                                helpful: 15
                            },
                            {
                                name: "Emma Wilson",
                                rating: 3,
                                date: "3 months ago",
                                verified: true,
                                review: "Decent product but took longer than expected to arrive. The quality is good but I feel it's a bit overpriced for what you get.",
                                helpful: 8
                            }
                        ].map((review, index) => (
                            <div key={index} className="border-b border-gray-200 pb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium">{review.name}</span>
                                    {review.verified && (
                                        <span style={{textAlign: 'center'}} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                            Verified Purchase
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500">· {review.date}</span>
                                </div>
                                <p className="text-gray-600 mb-3">{review.review}</p>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-xs"
                                    >
                                        Helpful ({review.helpful})
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-xs text-gray-500"
                                    >
                                        Report
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="text-center">
                        <Button 
                            variant="outline" 
                            className="px-8"
                        >
                            Load More Reviews
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}