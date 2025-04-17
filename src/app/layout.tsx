import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import {Providers} from "@/app/providers/providers";

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Shop for special handmade items in India: Jewellery, Home Decor, Art, Clothing and more',
  description: 'Craftisque.com: Join the community of artisans and craftspeople. Free shipping and Cash On Delivery on all orders. Authentic, Unique, and Made with Love',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable}`} suppressHydrationWarning>
      <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}