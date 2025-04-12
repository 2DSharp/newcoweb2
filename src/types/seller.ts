export interface Seller {
  name: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  followers: number;
  categories: string[];
  stories: {
    id: number;
    title: string;
    image: string;
    excerpt: string;
  }[];
  lists: {
    title: string;
    products: number;
    image: string;
  }[];
}