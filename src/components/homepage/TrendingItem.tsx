import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp } from 'lucide-react'

interface TrendingItemProps {
  image: string;
  title: string;
  searches: string;
  href?: string;
}

export function TrendingItem({ image, title, searches, href = "#" }: TrendingItemProps) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="relative w-16 h-16">
          <Image
            src={image}
            alt={title}
            fill
            className="rounded-lg object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{searches} searches</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 