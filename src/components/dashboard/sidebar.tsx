"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Home,
  Package,
  ShoppingCart,
  Truck,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardSidebarProps } from "@/types";

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const customerLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/customer",
      icon: Home,
    },
    {
      name: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingCart,
    },
    {
      name: "Profile",
      href: "/dashboard/customer/profile",
      icon: User,
    },
  ];

  const farmerLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/farmer",
      icon: Home,
    },
    {
      name: "My Crops",
      href: "/dashboard/farmer/crops",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/dashboard/farmer/orders",
      icon: ShoppingCart,
    },
    {
      name: "Profile",
      href: "/dashboard/farmer/profile",
      icon: User,
    },
  ];

  const driverLinks = [
    {
      name: "Dashboard",
      href: "/dashboard/driver",
      icon: Home,
    },
    {
      name: "Deliveries",
      href: "/dashboard/driver/deliveries",
      icon: Truck,
    },
    {
      name: "Profile",
      href: "/dashboard/driver/profile",
      icon: User,
    },
  ];

  const links =
    role === "FARMER"
      ? farmerLinks
      : role === "DRIVER"
      ? driverLinks
      : customerLinks;

  const commonLinks = [
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block h-screen sticky top-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-cropmate-primary">Cropmate</span>
          </Link>
        </div>

        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === link.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}
          </nav>

          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 border-t">
            {commonLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === link.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
