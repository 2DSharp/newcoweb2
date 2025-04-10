import Image from 'next/image'

interface Category {
  name: string;
  image: string;
}

interface PopularCategoriesProps {
  heading: string;
  categories: Category[];
}

export default function PopularCategories({
  heading,
  categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050" },
    { name: "Home & Garden", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211" },
    { name: "Books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d" },
    { name: "Toys", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4" },
    { name: "Automotive", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7" }
  ]
}: PopularCategoriesProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-playfair">{heading}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {categories.map((category, index) => (
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
        ))}
      </div>
    </section>
  )
}

