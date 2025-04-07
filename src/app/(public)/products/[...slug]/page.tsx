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

export default async function ProductPage({ params }: { params: { slug: string[] } }) {
    // Extract the product ID from the last segment of the URL
    if (!params.slug || params.slug.length < 1) {
        return notFound();
    }

    const productId = params.slug[params.slug.length - 1];
    const product = await getProduct(productId);
    
    if (!product) {
        return notFound();
    }

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
            />
        </div>
    );
} 