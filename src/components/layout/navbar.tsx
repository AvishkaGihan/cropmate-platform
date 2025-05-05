"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import UserDropdown from "./user-dropdown";
import { ModeToggle } from "../ui/modeToggle";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    if (query.trim()) {
      router.push(`/crops?q=${encodeURIComponent(query)}`);
    }
  };

  const navLinks = [
    { href: "/crops", label: "Browse Crops" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
          >
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-primary">Cropmate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden sm:block flex-1 max-w-md mx-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              type="search"
              placeholder="Search crops..."
              className="pl-8 w-full bg-background border-muted focus-visible:ring-primary/20"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {session ? (
            <UserDropdown user={session.user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile button only appears on small screens */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/crops")}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
