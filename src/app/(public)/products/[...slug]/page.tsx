import { ProductInfo } from '@/components/ProductInfo';
import { ChevronRight } from 'lucide-react';
import apiService from '@/services/api';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
    try {
        const res = await apiService.products.getProduct(id);
        return res.data;
    } catch (error) {
        return null;
    }
}

export default async function ProductPage({ 
    params, 
    searchParams 
}: { 
    params: { slug: string[] }, 
    searchParams: { v?: string } 
}) {
    if (!params.slug || params.slug.length < 1) {
        return notFound();
    }

    // Default: just product ID
    let productId = params.slug[0];
    let pathVariantId = undefined;
    
    // Check if we have a more complex URL format with product name
    if (params.slug.length > 1) {
        productId = params.slug[1]; // Second segment is product ID
        
        // If we have three segments, the last one is variant ID
        if (params.slug.length > 2) {
            pathVariantId = params.slug[2];
        }
    }
    
    const product = await getProduct(productId);
    
    if (!product) {
        return notFound();
    }

    // Prefer query parameter variant ID over path variant ID
    const variantId = searchParams.v || pathVariantId;

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center text-sm text-gray-500">
                <a href="/" className="hover:text-black">Home</a>
                <ChevronRight className="w-4 h-4 mx-2" />
                <a href="#" className="hover:text-black">{product.category}</a>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-black">{product.name}</span>
            </div>

            <ProductInfo 
                product={product}
                initialVariantId={variantId}
            />
        </div>
    );
} 