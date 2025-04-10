import { TrendingItem } from './TrendingItem';

interface TrendingItemType {
  image: string;
  title: string;
  searches: string;
  href: string;
}

interface TrendingSectionProps {
  heading: string;
  items?: TrendingItemType[];
}

export default function TrendingSection({
  heading,
  items = [
    {
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      title: 'Red Sneakers',
      searches: '50K+',
      href: '/products/category/fashion/sneakers'
    },
    {
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
      title: 'Smart Watch',
      searches: '42K+',
      href: '/products/category/electronics/watches'
    },
    {
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
      title: 'Fitness Band',
      searches: '38K+',
      href: '/products/category/electronics/fitness'
    },
  ]
}: TrendingSectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 font-playfair">{heading}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <TrendingItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
} 