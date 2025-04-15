'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Package, ShoppingCart, MapPin, CreditCard, Heart, Bell, Settings, LogOut } from "lucide-react";
import apiService from "@/services/api";

function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authData = localStorage.getItem('buyer_data');
      if (!authData) {
        const referrer = searchParams.get('referrer');
        const redirectUrl = referrer || '/account';
        router.push(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
        return;
      }

      try {
        // Just set basic user data from local storage
        const parsedData = JSON.parse(authData);
        // Get user profile from API
        const response = await apiService.accounts.getProfile();
        if (response.successful) {
          setUserData({ 
            userId: parsedData.userId,
            name: response.data.firstName + ' ' + response.data.lastName
          });
        } else {
          setUserData({ 
            userId: parsedData.userId,
            name: "User"
          });
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout API
      await apiService.identity.logout();
      
      // Clear refresh token cookie through API
      await fetch('/api/auth/set-refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: '' }),
      });
      
      // Clear all relevant localStorage items
      localStorage.removeItem('buyer_data');
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_data');
      localStorage.removeItem('selectedAddressDetails');
      
      // Clear any cart data
      localStorage.removeItem('cart');
      
      // Navigate to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Fallback: clear local storage manually if API fails
      localStorage.removeItem('buyer_data');
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth_data');
      localStorage.removeItem('selectedAddressDetails');
      localStorage.removeItem('cart');
      
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const menuItems = [
    { label: "Orders", icon: <Package className="mr-2 h-4 w-4" />, href: "/orders" },
    { label: "Cart", icon: <ShoppingCart className="mr-2 h-4 w-4" />, href: "/cart" },
    { label: "Addresses", icon: <MapPin className="mr-2 h-4 w-4" />, href: "/account/addresses" },
    { label: "Payment Methods", icon: <CreditCard className="mr-2 h-4 w-4" />, href: "/account/payments" },
    { label: "Wishlist", icon: <Heart className="mr-2 h-4 w-4" />, href: "/account/wishlist" },
    { label: "Notifications", icon: <Bell className="mr-2 h-4 w-4" />, href: "/account/notifications" },
    { label: "Settings", icon: <Settings className="mr-2 h-4 w-4" />, href: "/account/settings" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>{userData.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{userData.name}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {React.cloneElement(item.icon, { className: "h-6 w-6 text-primary" })}
                    </div>
                    <h3 className="font-medium text-lg">{item.label}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {item.label === "Orders" && "View your order history and status"}
                      {item.label === "Cart" && "View items in your shopping cart"}
                      {item.label === "Addresses" && "Manage your delivery addresses"}
                      {item.label === "Payment Methods" && "Manage your payment methods"}
                      {item.label === "Wishlist" && "View items you've saved for later"}
                      {item.label === "Notifications" && "View your notifications"}
                      {item.label === "Settings" && "Manage your account settings"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage; 