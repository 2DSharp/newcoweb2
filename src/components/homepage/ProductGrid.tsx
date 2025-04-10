import { ProductCard } from './ProductCard';

const products = [
  {
    title: 'Premium Watch',
    price: '$299.99',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Accessories',
    href: '/products/premium-watch'
  },
  // ... other products
];

export default function ProductGrid() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-playfair">Discover More</h2>
      <div className="masonry-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.title} 
            {...product} 
            aspectRatio={Math.random() > 0.5 ? 'portrait' : 'square'}
          />
        ))}
      </div>
    </section>
  );
} 