import Image from 'next/image'
import Link from 'next/link'
import { PrimaryButton } from "@/components/ui/primary-button"

export default function HeroBanner() {
  return (
    <div className="relative bg-gray-900 text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Shopping"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
          quality={90}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover Trending Products
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">
          Shop the latest trends and discover unique products from around the world.
          Your perfect find is just a click away.
        </p>
        <Link href="/products">
          <PrimaryButton className="mt-8 px-8 py-3 bg-white text-gray-900 hover:bg-gray-100">
            Shop Now
          </PrimaryButton>
        </Link>
      </div>
    </div>
  )
} 