import { ProductInfo } from '@/components/ProductInfo';
import { ChevronRight } from 'lucide-react';
import { cookies } from 'next/headers';
import apiService from '@/services/api';

async function getProduct(id: string) {
    const res = await fetch(`http://localhost:8080/public/products/${id}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
}

async function getInitialCartQuantity(productId: string, variantId: string) {
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    if (token) {
        // For logged-in users
        try {
            const cart = await getCart();
            const cartItem = cart?.items?.find(
                item => item.productId === productId && item.variantId === variantId
            );
            return cartItem?.quantity || 0;
        } catch (error) {
            console.error('Error fetching cart:', error);
            return 0;
        }
    }
    
    return 0; // For server-side rendering, return 0 for guest users
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
    if (!product) return null;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center text-sm text-gray-500">
                <a href="#" className="hover:text-black">Home</a>
                <ChevronRight className="w-4 h-4 mx-2" />
                <a href="#" className="hover:text-black">{product.category}</a>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-black">{product.name}</span>
            </div>

            <ProductInfo 
                product={product}
            />
        </div>
    );
}
