import { CategoryCard } from './CategoryCard';

const categories = [
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
    itemCount: 1200,
    href: '/products/category/fashion'
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5',
    itemCount: 850,
    href: '/products/category/electronics'
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16',
    itemCount: 645,
    href: '/products/category/sports'
  },
  {
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
    itemCount: 920,
    href: '/products/category/home'
  },
];

export default function CategorySection() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
    </section>
  );
} 