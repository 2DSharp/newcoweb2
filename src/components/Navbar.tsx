'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent, useMemo } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, MapPin, Plus, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { apiService } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressForm } from '@/components/address/AddressForm';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface Category {
  id: number;
  name: string;
  path: string;
  children?: Category[];
}

// Define the MenuItem type for better type safety
type MenuItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

// Update the MENU_ITEMS type
const MENU_ITEMS: MenuItem[] = [
  { name: "All Categories", href: "/categories", icon: <Menu className="h-4 w-4 mr-2" /> },
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
];

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

interface Address {
  id: string;
  label?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: number;
  isDefault: boolean;
  landmark?: string;
}

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [savedAddressDetails, setSavedAddressDetails] = useState<{
    id: string;
    name: string;
    city: string;
    pinCode: string;
  } | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [profile, setProfile] = useState<{
    firstName: string | null;
    lastName: string | null;
    defaultAddress: {
      name: string;
      city: string;
      pinCode: string;
    } | null;
    cartItemCount: number;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync search query with URL parameter
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(decodeSearchQuery(query));
    }
  }, [searchParams]);

  // This effect handles loading user profile, cart data, and address information
  // It will run on initial mount and whenever the URL (pathname or searchParams) changes
  useEffect(() => {
    // Function to load cart and profile data
    const loadUserData = async () => {
      try {
        const authData = localStorage.getItem('buyer_data');
        if (authData) {
          const { loginType } = JSON.parse(authData);
          if (loginType === 'BUYER') {
            // Authenticated user - get profile from API
            const response = await apiService.accounts.getProfile();
            if (response.successful) {
              setProfile(response.data);
              setCartCount(response.data.cartItemCount);
            }
          } else {
            // Non-buyer user - get cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
          }
        } else {
          // Unauthenticated user - get cart from localStorage
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartCount(cart.length);
        }

        // Load selected address details from localStorage
        const savedAddressDetailsStr = localStorage.getItem('selectedAddressDetails');
        if (savedAddressDetailsStr) {
          try {
            const details = JSON.parse(savedAddressDetailsStr);
            setSavedAddressDetails(details);
          } catch (error) {
            console.error('Error parsing saved address details:', error);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    // Load data on mount and URL changes
    loadUserData();

    // Also listen for cart update events
    const handleCartUpdate = () => loadUserData();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [pathname, searchParams]); // Re-run when URL changes

  // Load addresses when modal opens
  const loadAddresses = async () => {
    try {
      const response = await apiService.accounts.getAddresses();
      if (response.successful) {
        console.log("Loaded addresses:", response.data);
        setAddresses(response.data);

        // If no address is selected yet, use default or first one
        if (!savedAddressDetails && response.data.length > 0) {
          const defaultAddress = response.data.find(addr => addr.isDefault || (addr as any).default);
          const addressToSelect = defaultAddress || response.data[0];

          if (addressToSelect) {
            const addressDetails = {
              id: addressToSelect.id,
              name: formatName(addressToSelect.name),
              city: addressToSelect.city,
              pinCode: addressToSelect.pinCode || addressToSelect.pincode
            };

            localStorage.setItem('selectedAddressDetails', JSON.stringify(addressDetails));
            setSavedAddressDetails(addressDetails);
          }
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleOpenAddressModal = () => {
    setShowAddressModal(true);
    loadAddresses();
  };

  const handleSelectAddress = (addressId: string) => {
    const selectedAddr = addresses.find(addr => addr.id === addressId);
    if (selectedAddr) {
      saveAddressToLocalStorage(selectedAddr);
    }
    setShowAddressModal(false);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleSubmitAddress = async (addressData: any) => {
    try {
      let response;
      if (editingAddress) {
        response = await apiService.accounts.updateAddress(editingAddress.id, addressData);
      } else {
        response = await apiService.accounts.addAddress(addressData);
      }

      if (response.successful) {
        await loadAddresses();
        setShowAddressForm(false);

        // If this is a new address and it should be selected
        if (!editingAddress) {
          saveAddressToLocalStorage(response.data);
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  // Get selected address details
  const selectedAddress = addresses.find(addr => addr.id === savedAddressDetails?.id);

  // Format name to get first word only
  const formatName = (name: string) => {
    return name?.split(' ')[0] || '';
  };

  // Get the pincode value handling different property names
  const getPincode = (address: any) => {
    // Handle different property names that might come from the API
    return address?.pinCode || address?.pincode || '';
  };

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
    // Use router.push with replace to prevent adding to history stack
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

  // Save address details to localStorage
  const saveAddressToLocalStorage = (address: any) => {
    if (!address) return;

    const addressDetails = {
      id: address.id,
      name: formatName(address.name),
      city: address.city,
      pinCode: getPincode(address)
    };

    localStorage.setItem('selectedAddressDetails', JSON.stringify(addressDetails));
    setSavedAddressDetails(addressDetails);
  };

  // Fetch and cache categories
  const fetchCategories = useCallback(async () => {
    // Check if categories are already in sessionStorage
    const cachedCategories = sessionStorage.getItem('categories');
    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
      return;
    }

    setIsLoadingCategories(true);
    try {
      const response = await apiService.cms.getCategories(3);
      if (response) {
        setCategories(response);
        // Cache categories in sessionStorage
        sessionStorage.setItem('categories', JSON.stringify(response));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Load categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!categorySearchTerm.trim()) return categories;

    const searchLower = categorySearchTerm.toLowerCase();

    const filterCategoriesRecursive = (categories: Category[]): Category[] => {
      const result: Category[] = [];

      for (const category of categories) {
        // Check if current category matches search
        if (category.name.toLowerCase().includes(searchLower)) {
          result.push(category);
          continue;
        }

        // If category has children, check them recursively
        if (category.children && category.children.length > 0) {
          const matchingChildren = filterCategoriesRecursive(category.children);

          if (matchingChildren.length > 0) {
            // Create a shallow copy with just the matching children
            result.push({
              ...category,
              children: matchingChildren,
            });
          }
        }
      }

      return result;
    };

    return filterCategoriesRecursive(categories);
  }, [categories, categorySearchTerm]);

  // When search term changes, expand all categories that have matching children
  useEffect(() => {
    if (categorySearchTerm.trim()) {
      // Function to find all category IDs that should be expanded
      const findCategoryIdsToExpand = (categories: Category[]): number[] => {
        let ids: number[] = [];

        for (const category of categories) {
          if (category.children && category.children.length > 0) {
            // If this category contains children, add its ID to be expanded
            ids.push(category.id);
            // Also check its children recursively
            ids = [...ids, ...findCategoryIdsToExpand(category.children)];
          }
        }

        return ids;
      };

      // Get all IDs to expand and update the expanded categories set
      const idsToExpand = findCategoryIdsToExpand(filteredCategories);
      setExpandedCategories(new Set(idsToExpand));
    }
  }, [filteredCategories, categorySearchTerm]);

  // Reset category search when sidebar closes
  useEffect(() => {
    if (!showCategorySidebar) {
      setCategorySearchTerm('');
    }
  }, [showCategorySidebar]);

  // Handle category click in sidebar
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);

    if (category.children && category.children.length > 0) {
      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category.id)) {
          newSet.delete(category.id);
        } else {
          newSet.add(category.id);
        }
        return newSet;
      });
    }
  };

  // Reset selected category when sidebar closes
  useEffect(() => {
    if (!showCategorySidebar) {
      setSelectedCategory(null);
    }
  }, [showCategorySidebar]);

  // Render category item
  const renderCategoryItem = (category: Category, level: number) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;

    // For leaf nodes (categories without children), use Link
    if (!hasChildren) {
      return (
        <div key={category.id} className="category-item">
          <Link
            href={`/c/${category.path}?category=${encodeURIComponent(category.name)}`}
            className={`
              flex items-center justify-between py-3 px-4 
              hover:bg-gray-50 cursor-pointer 
              ${level > 0 ? 'pl-' + (level * 4 + 4) + 'px' : ''} 
              ${isSelected ? 'bg-gray-50' : ''}
            `}
            onClick={() => setShowCategorySidebar(false)}
          >
            <span className={`
              ${level === 0 ? 'text-[15px] font-semibold' : 'text-sm'} 
              ${isSelected ? 'font-bold text-primary' : ''}
              ${level === 0 && !isSelected ? 'text-gray-800' : ''}
              transition-colors
            `}>
              {category.name}
            </span>
          </Link>
        </div>
      );
    }

    // For parent categories (with children), use the expandable UI
    return (
      <div key={category.id} className="category-item">
        <div
          className={`
            flex items-center justify-between py-3 px-4 
            hover:bg-gray-50 cursor-pointer 
            ${level > 0 ? 'pl-' + (level * 4 + 4) + 'px' : ''} 
            ${isSelected ? 'bg-gray-50' : ''}
          `}
          onClick={() => handleCategoryClick(category)}
        >
          <span className={`
            ${level === 0 ? 'text-[15px] font-semibold' : 'text-sm'} 
            ${isSelected ? 'font-bold text-primary' : ''}
            ${hasChildren && level > 0 ? 'font-medium' : ''}
            ${level === 0 && !isSelected ? 'text-gray-800' : ''}
            transition-colors
          `}>
            {category.name}
            {hasChildren && (
              <span className="text-xs text-gray-400 ml-1">
                ({category.children?.length})
              </span>
            )}
          </span>
          {hasChildren && (
            <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-200 ease-in-out ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </div>
        {hasChildren && (
          <div
            className={`category-children overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          >
            {/* Add "All {Category}" as first item */}
            <Link
              href={`/c/${category.path}?category2=${encodeURIComponent(category.name)}`}
              className={`
                flex items-center py-3 px-4 
                hover:bg-gray-50 cursor-pointer 
                pl-${(level + 1) * 4 + 4}px
              `}
              onClick={() => setShowCategorySidebar(false)}
            >
              <span className="text-sm font-medium text-gray-600">
                All {category.name}
              </span>
            </Link>
            {category.children.map(child => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render category items
  const renderCategoryItems = (categories: Category[], level = 0) => {
    return categories.map(category => renderCategoryItem(category, level));
  };

  if (!mounted) return null;

  return (
    <div className="sticky top-0 z-50 bg-white">
      <header className="border-b">
        <nav className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col py-4 gap-4">
            {/* Top Row */}
            <div className="flex items-center justify-between w-full">
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
                            width={140}
                            height={70}
                            className="mx-auto"
                          />
                        </Link>
                      </div>

                      {/* Menu Items */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="py-2">
                          {MENU_ITEMS.map((item) => (
                            item.name === "All Categories" ? (
                              <button
                                key={item.name}
                                className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                onClick={() => {
                                  setShowCategorySidebar(true);
                                }}
                              >
                                {item.name}
                                <ChevronRight className="ml-auto h-4 w-4" />
                              </button>
                            ) : (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              >
                                {item.icon}
                                {item.name}
                              </Link>
                            )
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

                {/* Delivery Address Button */}
                {(selectedAddress || savedAddressDetails || profile?.defaultAddress) && (
                  <button
                    onClick={handleOpenAddressModal}
                    className="hidden md:flex items-start gap-3 text-sm border-l pl-4 pr-4 py-1 max-w-[240px] hover:bg-gray-50 rounded group"
                  >
                    <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="flex items-center text-xs">
                        <span className="text-gray-500">Deliver to: </span>
                        <span className="font-medium text-gray-800 ml-1 max-w-[120px] truncate">
                          {selectedAddress
                            ? formatName(selectedAddress.name)
                            : savedAddressDetails
                              ? savedAddressDetails.name
                              : profile?.defaultAddress
                                ? formatName(profile.defaultAddress.name)
                                : ''}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {selectedAddress
                          ? `${selectedAddress.city}, ${getPincode(selectedAddress)}`
                          : savedAddressDetails
                            ? `${savedAddressDetails.city}, ${savedAddressDetails.pinCode}`
                            : profile?.defaultAddress
                              ? `${profile.defaultAddress.city}, ${profile.defaultAddress.pinCode || ''}`
                              : ''}
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Search and Actions container */}
              <div className="flex flex-1 items-center justify-center gap-4 mx-4">
                {/* Search - Desktop */}
                <div
                  className="hidden md:flex flex-1 relative"
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
                              className={`px-4 py-2 cursor-pointer flex items-center ${index === highlightedIndex
                                  ? 'bg-primary/10 text-primary'
                                  : 'hover:bg-gray-50'
                                }`}
                              onClick={() => handleSuggestionClick(suggestion.text)}
                              onMouseDown={() => handleSuggestionClick(suggestion.text)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                            >
                              <Search className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{suggestion.text}</span>
                        
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

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link href="/account">
                  <button className="p-2 flex items-center gap-1 text-gray-600 hover:text-gray-800 relative">
                    <User size={28} />
                    <span className="hidden md:inline-block text-sm text-gray-600">
                      {profile?.firstName || 'Account'}
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
          <div className="max-w-[1536px] mx-auto px-4">
            <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide py-4">
              {MENU_ITEMS.map((item) => {
                // Special case for All Categories
                if (item.name === "All Categories") {
                  return (
                    <Sheet key={item.name} open={showCategorySidebar} onOpenChange={setShowCategorySidebar}>
                      <SheetTrigger asChild>
                        <button
                          className="flex items-center text-sm font-medium text-gray-600 whitespace-nowrap hover:text-gray-900 transition-colors"
                        >
                          <Menu className="h-4 w-4 mr-2" />
                          {item.name}
                        </button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[350px] p-0">
                        <div className="flex flex-col h-full">
                          <div className="p-4 border-b flex items-center">
                            <button 
                              onClick={() => setShowCategorySidebar(false)} 
                              className="flex items-center text-gray-700 mr-auto"
                            >
                              <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                              <span>Back</span>
                            </button>
                            <h2 className="font-medium text-lg absolute left-1/2 -translate-x-1/2">All Categories</h2>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowCategorySidebar(false)}
                              className="ml-auto"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="p-4 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Search categories..."
                                value={categorySearchTerm}
                                onChange={(e) => setCategorySearchTerm(e.target.value)}
                                className="pl-8 w-full"
                                autoComplete="off"
                              />
                              {categorySearchTerm && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1 h-8 w-8"
                                  onClick={() => setCategorySearchTerm('')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto relative">
                            {isLoadingCategories ? (
                              <div className="p-4 text-center">
                                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent mb-2"></div>
                                <p className="text-gray-500">Loading categories...</p>
                              </div>
                            ) : categories.length > 0 ? (
                              <div className="py-1">
                                {categorySearchTerm ? (
                                  renderCategoryItems(filteredCategories)
                                ) : (
                                  renderCategoryItems(categories)
                                )}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                {categories.length > 0 ? 'No matching categories found' : 'No categories found'}
                              </div>
                            )}

                            {/* Scroll indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-gray-600 whitespace-nowrap hover:text-gray-900 transition-colors"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Address Selection Modal */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </DialogHeader>

          {showAddressForm ? (
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleSubmitAddress}
              onCancel={() => setShowAddressForm(false)}
            />
          ) : (
            <div className="py-4">
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mb-4">
                  {addresses.map((address) => {
                    const isSelected = address.id === savedAddressDetails?.id;
                    return (
                      <Card
                        key={address.id}
                        className={`cursor-pointer hover:border-primary transition-colors ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => handleSelectAddress(address.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {address.name}
                                {address.label && (
                                  <span className="text-xs text-gray-500">({address.label})</span>
                                )}
                                {(address.isDefault || (address as any).default) && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{address.addressLine1}</p>
                              <p className="text-sm text-gray-500">{address.addressLine2}</p>
                              <p className="text-sm text-gray-500">
                                {address.city}, {address.state} - {getPincode(address)}
                              </p>
                              <p className="text-sm text-gray-500">Phone: {address.phone}</p>
                            </div>
                            {isSelected && (
                              <div className="bg-primary text-white rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <p>No addresses found</p>
                </div>
              )}

              <Button onClick={handleAddNewAddress} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 