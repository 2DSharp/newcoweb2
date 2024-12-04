'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiService from '@/services/api';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
    productId: string;
    variant: any;
}

export function ProductActions({ productId, variant }: ProductActionsProps) {
    const router = useRouter();
    const { toast } = useToast();
    
    const addToCart = async () => {

        try {
            const authData = localStorage.getItem('auth_data');
            if (authData) {
                const { loginType } = JSON.parse(authData);
                if (loginType === 'BUYER') {
                    await apiService.cart.addItem({
                        product: productId,
                        variantId: variant.variantId,
                        quantity: 1,
                        pricingVariantId: variant.pricing.pricingId
                    });
                    return;
                }
            }
            
            // Local storage cart
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItemIndex = cart.findIndex(
                item => item.productId === productId && item.variantId === variant.variantId
            );

            if (existingItemIndex !== -1) {
                // If item exists, increase quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // If item doesn't exist, add new item
                cart.push({
                    productId: productId,
                    variantId: variant.variantId,
                    pricingId: variant.pricing.pricingId,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('cartUpdated'));

            // Update cart count
            router.push('/cart?added=true&productId=' + productId);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart",
                variant: "destructive",
            });
        }
    };

 
    return (
        <div className="w-full flex gap-4 py-6">
            <Button 
                className="flex-1 h-14 text-base font-medium border-2 border-black hover:bg-black/5 text-black hover:text-black transition-colors duration-200"
                variant="outline"
                disabled={!variant.inStock}
                onClick={addToCart}
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
            <Button 
                className="flex-1 h-14 text-base font-medium hover:bg-black/90 text-white transition-colors duration-200"
                disabled={!variant.inStock}
                onClick={() => router.push(`/checkout?product=${productId}&variantId=${variant.variantId}&quantity=1&pricingVariantId=${variant.pricing.pricingId}`)}
            >
                Buy Now
            </Button>
        </div>
    );
} 