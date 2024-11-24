'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
    variant: any;
}

export function ProductActions({ variant }: ProductActionsProps) {
    return (
        <div className="w-full flex gap-4 py-6">
            <Button 
                className="flex-1 h-14 text-base font-medium border-2 border-black hover:bg-black/5 text-black hover:text-black transition-colors duration-200"
                variant="outline"
                disabled={!variant.inStock}
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
            <Button 
                className="flex-1 h-14 text-base font-medium hover:bg-black/90 text-white transition-colors duration-200"
                disabled={!variant.inStock}
            >
                Buy Now
            </Button>
        </div>
    );
} 