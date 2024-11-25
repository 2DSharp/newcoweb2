'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface VariantSelectorProps {
    variants: any[];
    selectedVariant: any;
    onVariantChange: (variant: any) => void;
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
    return (
        <div className="space-y-4">
            {variants.length > 1 && (
                <Label className="text-sm font-medium text-gray-900">
                    Available Options
                </Label>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {variants.map((variant) => {
                    const isSelected = variant.variantId === selectedVariant.variantId;
                    const thumbnailImage = variant.images?.find((img: any) => img.thumbnail)?.variations?.thumbnail;

                    return (
                        <Card
                            key={variant.variantId}
                            className={cn(
                                "relative cursor-pointer overflow-hidden transition-all",
                                isSelected 
                                    ? "ring-2 ring-black" 
                                    : "hover:ring-1 hover:ring-gray-300",
                                !variant.inStock && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => variant.inStock && onVariantChange(variant)}
                        >
                            <div className="aspect-square relative">
                                {thumbnailImage ? (
                                    <Image
                                        src={thumbnailImage}
                                        alt={variant.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-sm text-gray-900">
                                    {variant.name}
                                </h3>
                                <div className="mt-1 text-sm text-gray-500">
                                    {variant.pricing.finalPrice}
                                </div>
                                {!variant.inStock && (
                                    <span className="mt-1 text-xs text-red-500">
                                        Out of stock
                                    </span>
                                )}
                                {Object.entries(variant.details || {}).slice(0, 2).map(([key, value]) => (
                                    <div key={key} className="mt-1 text-xs text-gray-500">
                                        {key}: {value as string}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}