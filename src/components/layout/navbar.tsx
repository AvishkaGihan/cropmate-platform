"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import UserDropdown from "./user-dropdown";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    router.push(`/crops?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-green-700">Cropmate</span>
          </Link>
          <nav className="flex items-center text-sm font-medium">
            <Link
              href="/crops"
              className={`transition-colors hover:text-primary ${
                pathname === "/crops"
                  ? "text-cropmate-primary"
                  : "text-foreground/60"
              }`}
            >
              Browse Crops
            </Link>
          </nav>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              type="search"
              placeholder="Search crops..."
              className="pl-8"
            />
          </div>
        </form>

        <div className="flex items-center space-x-2">
          {session ? (
            <UserDropdown user={session.user} />
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
