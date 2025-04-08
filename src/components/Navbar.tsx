'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService } from '@/services/api';

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

// Define types for search suggestions
type Suggestion = {
  text: string;
  type: string;
};

type SuggestionResponse = {
  categories: string[];
  suggestions: Suggestion[];
};

// Helper functions for URL parameter handling
const encodeSearchQuery = (query: string) => {
  return query.trim().replace(/\s+/g, '+');
};

const decodeSearchQuery = (query: string) => {
  return query.replace(/\+/g, ' ');
};

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync search query with URL parameter
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(decodeSearchQuery(query));
    }
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const authData = localStorage.getItem('buyer_data');
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

  // Debounce function for search suggestions
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiService.search.getSuggestions(query);
        setSuggestions(response.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex].text);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Update highlighted suggestion in search box
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      setSearchQuery(suggestions[highlightedIndex].text);
    }
  }, [highlightedIndex, suggestions]);

  // Scroll highlighted suggestion into view
  useEffect(() => {
    if (suggestionsRef.current && highlightedIndex >= 0) {
      const highlightedElement = suggestionsRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    router.push(`/search?q=${encodeSearchQuery(suggestion)}`);
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setHighlightedIndex(-1);
    fetchSuggestions(query);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      router.push(`/search?q=${encodeSearchQuery(searchQuery)}`);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Add a small delay to allow click events on suggestions to fire first
        setTimeout(() => {
          setShowSuggestions(false);
        }, 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
                        <Image
                              src="/faveron.svg"
                              alt="Logo"
                              width={100}
                              height={50}
                              className="mx-auto"
                            />
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
                <Image
                              src="/faveron.svg"
                              alt="Logo"
                              width={180}
                              height={50}
                              className="mx-auto"
                            />
                </Link>
              </div>

              {/* Search and Actions container */}
              <div className="flex flex-1 items-center gap-4">
                {/* Search - Desktop */}
                <div 
                  className="hidden md:flex flex-1 max-w-3xl relative ml-4" 
                  ref={searchRef}
                >
                  <form 
                    className="w-full" 
                    onSubmit={handleSearch}
                  >
                    <div className="relative w-full flex">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pr-16 px-4 rounded-full border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-base"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                        style={{ WebkitAppearance: 'none' }}
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
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto"
                      onMouseDown={(e) => {
                        // Prevent the blur event from hiding suggestions
                        e.preventDefault();
                      }}
                    >
                      {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
                      ) : suggestions.length > 0 ? (
                        <ul ref={suggestionsRef}>
                          {suggestions.map((suggestion, index) => (
                            <li 
                              key={index}
                              className={`px-4 py-2 cursor-pointer flex items-center ${
                                index === highlightedIndex 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleSuggestionClick(suggestion.text)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                            >
                              <Search className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{suggestion.text}</span>
                              {suggestion.type && (
                                <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {suggestion.type}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : searchQuery.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">No suggestions found</div>
                      ) : null}
                    </div>
                  )}
                </div>

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
            <div 
              className="md:hidden relative"
              ref={searchRef}
            >
              <form 
                onSubmit={handleSearch}
              >
                <div className="relative w-full flex">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pr-16 rounded-full border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-base"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                    style={{ WebkitAppearance: 'none' }}
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
              
              {/* Mobile Search Suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
                  ) : suggestions.length > 0 ? (
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={() => handleSuggestionClick(suggestion.text)}
                        >
                          <Search className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{suggestion.text}</span>
                          {suggestion.type && (
                            <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {suggestion.type}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">No suggestions found</div>
                  ) : null}
                </div>
              )}
            </div>
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