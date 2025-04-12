"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Settings,
  Menu,
  X,
  Store,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import apiService from "@/services/api";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/seller/dashboard",
  },
  {
    label: "Products",
    icon: Package,
    href: "/seller/products",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/seller/orders",
  },
  {
    label: "Discounts",
    icon: Tags,
    href: "/seller/discounts",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/seller/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await apiService.identity.logout();
      
      // Clear seller-specific data
      localStorage.removeItem('seller_data');
      
      // Redirect to login/home page
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      <div className="p-6 border-b flex items-center justify-between">
        <Image
          src="/faveron.svg"
          alt="Faveron"
          width={180}
          height={40}
          className="mx-auto md:mx-0"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 space-y-4 p-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-4 py-3 text-md font-medium transition-colors",
              pathname === route.href
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{route.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t mt-auto">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-white">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-white flex items-center justify-between px-4 md:hidden z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-full sm:w-80 p-0"
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <Image
          src="/faveron.svg"
          alt="Faveron"
          width={150}
          height={32}
          className="absolute left-1/2 -translate-x-1/2"
        />
      </div>

      {/* Mobile Spacer */}
      <div className="h-16 md:hidden" />
    </>
  );
}