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
  ChevronRight,
  Leaf,
  ArrowLeft,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardSidebarProps } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

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

  const roleLabel =
    role === "FARMER" ? "Farmer" : role === "DRIVER" ? "Driver" : "Customer";

  return (
    <div
      className={cn(
        "h-screen sticky top-0 border-r bg-card transition-all duration-300 shadow-sm",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Leaf className="h-6 w-6 text-primary" />
            {expanded && (
              <span className="text-primary text-lg font-bold">Cropmate</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="ml-auto rounded-full h-8 w-8 cursor-pointer"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                !expanded && "rotate-180"
              )}
            />
          </Button>
        </div>

        <div className="px-2 pt-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all",
              !expanded && "justify-center"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {expanded && <span>Back to Home</span>}
          </Link>
        </div>

        <div className={cn("px-3 pt-6", expanded && "px-4")}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            {expanded && (
              <div>
                <p className="font-medium text-sm">{roleLabel}</p>
                <p className="text-xs text-muted-foreground">Account</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <nav className="grid gap-1 px-2 py-3">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  pathname === link.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {expanded && link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-6">
            <div className={cn("px-3 mb-2", expanded && "px-4")}>
              {expanded && (
                <p className="text-xs font-medium text-muted-foreground">
                  SETTINGS
                </p>
              )}
            </div>
            <nav className="grid gap-1 px-2">
              {commonLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    pathname === link.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {expanded && link.name}
                </Link>
              ))}

              <Button
                variant="ghost"
                className={cn(
                  "justify-start gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer",
                  !expanded && "justify-center"
                )}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                {expanded && "Sign Out"}
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
