import { formatProductUrl } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link';

interface Product {
  id: string | number;
  name: string;
  price: string;
  image: string;
  orientation: string;
}

interface ProductCollageProps {
  heading: string;
  products?: Product[];
}

export default function ProductCollage({
  heading,
  products = [
    { id: 1, name: "Vintage Camera", price: "129.99", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", orientation: "portrait" },
    { id: 2, name: "Leather Backpack", price: "89.99", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62", orientation: "square" },
    { id: 3, name: "Wireless Earbuds", price: "79.99", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df", orientation: "portrait" },
    { id: 4, name: "Smart Watch", price: "199.99", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12", orientation: "square" },
    { id: 5, name: "Polaroid Camera", price: "59.99", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", orientation: "portrait" },
    { id: 6, name: "Vintage Typewriter", price: "149.99", image: "https://images.unsplash.com/photo-1558000143-a78f8299c40b", orientation: "square" },
    { id: 7, name: "Desk Lamp", price: "39.99", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c", orientation: "portrait" },
    { id: 8, name: "Wireless Headphones", price: "129.99", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90", orientation: "square" }
  ]
}: ProductCollageProps) {
  // For mobile view (2 columns), we'll reorganize the products
  const mobileLeftColumn = products.slice(0, products.length / 2);
  const mobileRightColumn = products.slice(products.length / 2);
  
  // Desktop view (4 columns) remains the same
  const leftColumn = products.slice(0, Math.min(8, products.length / 4));
  const middleColumns = products.slice(Math.min(8, products.length / 4), Math.min(20, products.length * 3 / 4));
  const rightColumn = products.slice(Math.min(20, products.length * 3 / 4));

  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-playfair">{heading}</h2>
      
      {/* Mobile Layout (2 columns) */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        <div className="space-y-4">
          {mobileLeftColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="space-y-4">
          {mobileRightColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Desktop Layout (4 columns) */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        <div className="space-y-4">
          {leftColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {middleColumns.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="space-y-4">
          {rightColumn.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative overflow-hidden rounded-lg group">
      <Link href={formatProductUrl(product.name, String(product.id))}>
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={product.orientation === 'portrait' ? 400 : 300}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link href={formatProductUrl(product.name, String(product.id))}>
          <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
        </Link>
      </div>
    </div>
  )
}

