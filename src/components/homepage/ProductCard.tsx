import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  category: string;
  aspectRatio?: 'portrait' | 'square';
  href?: string;
}

export function ProductCard({ 
  image, 
  title, 
  price, 
  category, 
  aspectRatio = 'square',
  href = "#" 
}: ProductCardProps) {
  return (
    <Link href={href} className="block">
      <div className="relative space-y-4 group rounded-xl overflow-hidden">
        <div className={aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'}>
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-sm font-medium text-gray-200">{category}</p>
            <h3 className="text-lg font-semibold truncate font-playfair">{title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold">{price}</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 