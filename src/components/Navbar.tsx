'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MENU_ITEMS = [
  { name: "Explore", href: "/explore" },
  { name: "Gift Ideas", href: "/gifts" },
  { name: "Season Must Haves", href: "/seasonal" },
  { name: "Home Decor", href: "/home-decor" },
  { name: "Fresh Arrivals", href: "/new-arrivals" },
  { name: "Today's Deals", href: "/deals" },
  { name: "Stories", href: "/stories" },
  { name: "Near me", href: "/nearby" },
  { name: "Live sessions", href: "/live" },
  { name: "Sell", href: "/seller" }
] as const;

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useState(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const authData = localStorage.getItem('auth_data');
      if (authData) {
        const { loginType } = JSON.parse(authData);
        if (loginType === 'BUYER') {
          // TODO: Implement API call to get cart count
          return;
        }
      }
      
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  if (!mounted) return null;

  return (
    <div className="sticky top-0 z-50 bg-white">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col py-4 gap-4">
            {/* Top Row */}
            <div className="flex items-center w-full">
              {/* Left section with hamburger and logo */}
              <div className="flex items-center gap-4">
                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-8 w-8" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] p-0">
                    <div className="flex flex-col h-full">
                      {/* Logo in Mobile Menu */}
                      <div className="p-4 border-b">
                        <Link href="/" className="flex-shrink-0">
                          <div className="h-10 w-28 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                            LOGO
                          </div>
                        </Link>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="py-2">
                          {MENU_ITEMS.map((item) => (
                            <Link 
                              key={item.name} 
                              href={item.href}
                              className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                  <div className="h-10 w-28 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                    LOGO
                  </div>
                </Link>
              </div>

              {/* Search and Actions container */}
              <div className="flex flex-1 items-center justify-end gap-4">
                {/* Search - Desktop */}
                <form 
                  className="hidden md:flex flex-1 max-w-3xl" 
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="relative w-full flex">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="w-full pr-16 px-4 rounded-full border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-base"
                    />
                    <Button 
                      type="submit"
                      variant="ghost" 
                      className="absolute right-0 rounded-full h-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <Search className="h-6 w-6" />
                    </Button>
                  </div>
                </form>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link href="/account">
                  <button className="p-2 flex items-center gap-1 text-gray-600 hover:text-gray-800 relative">

                      <User size={28} />
                      <span className="hidden md:inline-block text-sm text-gray-600">
                        Account
                      </span>
                    </button>
                  </Link>
                  <Link href="/cart">
                  <button className="p-2 flex items-center gap-1 text-gray-600 hover:text-gray-800 relative">
                      <ShoppingCart size={28} />
                
                      <span className="absolute -top-1 -right-1 h-5 w-5 text-xs font-medium text-white bg-primary rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                      <span className="hidden md:inline-block text-sm text-gray-600">
                        Cart
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Search - Mobile */}
            <form 
              className="md:hidden" 
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative w-full flex">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pr-16 rounded-full border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-base"
                />
                <Button 
                  type="submit"
                  variant="ghost" 
                  className="absolute right-0 rounded-full h-full hover:bg-primary hover:text-white transition-colors"
                >
                  <Search className="h-6 w-6" />
                </Button>
              </div>
            </form>
          </div>
        </nav>

        {/* Desktop Menu */}
        <div className="hidden lg:block border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide py-4">
              {MENU_ITEMS.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="text-sm font-medium text-gray-600 whitespace-nowrap hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
} 