import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  image: string;
  name: string;
  itemCount: number;
  href?: string;
}

export function CategoryCard({ image, name, itemCount, href = "#" }: CategoryCardProps) {
  return (
    <Link href={href} className="block">
      <div className="relative group cursor-pointer">
        <div className="aspect-square rounded-2xl overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors">
            <div className="flex flex-col items-center justify-center h-full text-white">
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-sm opacity-90">{itemCount} items</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 