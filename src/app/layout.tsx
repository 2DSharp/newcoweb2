import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {Providers} from "@/app/providers/providers";
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seller Onboarding',
  description: 'Join thousands of successful sellers on our platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
      <Providers>
        <Navbar />
        {children}
        </Providers>
      </body>
    </html>
  );
}