"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Settings,
  Menu,
  X,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

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
    label: "Store",
    icon: Store,
    href: "/seller/store",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/seller/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-md font-medium transition-colors",
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