import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavbarWrapper } from '@/components/NavbarWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buy special handmade items',
  description: 'Join thousands of successful sellers on our platform',
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