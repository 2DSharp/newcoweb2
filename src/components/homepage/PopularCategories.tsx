import Image from 'next/image'
import Link from 'next/link';

interface Category {
  name: string;
  image: string;
  path: string;
}

interface PopularCategoriesProps {
  heading: string;
  categories: Category[];
}

export default function PopularCategories({
  heading,
  categories = [
    ]
}: PopularCategoriesProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-playfair">{heading}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {categories.map((category, index) => (
          <Link href={`/c/${category.path}?category2=${encodeURIComponent(category.name)}`} key={index}>
          <div key={index} className="relative overflow-hidden rounded-lg shadow-md h-40">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-xl font-semibold font-playfair">{category.name}</h3>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

