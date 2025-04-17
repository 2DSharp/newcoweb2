import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavbarWrapper } from '@/components/NavbarWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shop for special handmade items in India: Jewellery, Home Decor, Art, Clothing and more',
  description: 'Craftisque.com: Join the community of artisans and craftspeople. Free shipping and Cash On Delivery on all orders. Authentic, Unique, and Made with Love',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
}