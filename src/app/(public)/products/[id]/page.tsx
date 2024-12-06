import { ProductInfo } from '@/components/ProductInfo';
import { ChevronRight } from 'lucide-react';
import apiService from '@/services/api';

async function getProduct(id: string) {
    const res = await fetch(`https://dev-api.faveron.com/public/products/${id}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
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
