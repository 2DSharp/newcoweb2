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
    href: "/products/list/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Seller Portal</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-md font-medium",
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

      {/* Mobile Hamburger and Sheet */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}