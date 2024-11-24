'use client';

import { useState } from 'react';
import Link from 'next/link'
import { Search, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  // Only render after component mounts to prevent hydration mismatch
  useState(() => {
    setMounted(true);
  }, []);

  // Show nothing until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-white">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col py-4 gap-4">
            {/* Top Row */}
            <div className="flex items-center justify-between w-full">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <div className="h-8 w-24 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                  LOGO
                </div>
              </Link>

              {/* Search - Desktop */}
              <form className="hidden md:flex flex-1 max-w-2xl mx-8" onSubmit={(e) => e.preventDefault()}>
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-8 w-8" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-medium text-white bg-black rounded-full flex items-center justify-center">
                      2
                    </span>
                  </Button>
                </Link>
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-12 w-12" />
                  </Button>
                </Link>
                <Link href="/login" className="hidden md:block">
                  <Button variant="default">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search - Mobile */}
            <form className="md:hidden" onSubmit={(e) => e.preventDefault()}>
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
        </nav>
      </header>
    </div>
  );
} 