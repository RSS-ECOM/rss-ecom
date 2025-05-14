/* eslint-disable import/no-extraneous-dependencies */

'use client';

import setLogin from '@/app/actions/set-login';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCustomer } from '@/hooks/use-customer';
import useAuthStore from '@/store/auth-store';
import { Book, ChevronDown, Menu, MoonIcon, Search, ShoppingCart, SunIcon, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useState } from 'react';

// eslint-disable-next-line max-lines-per-function
export default function Header(): JSX.Element {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { logout } = useCustomer();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const handleLogout = useCallback(async () => {
    try {
      await setLogin(null);
      logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  const handleLogoutClick = useCallback(() => {
    handleLogout().catch((error) => {
      console.error('Error during logout:', error);
    });
  }, [handleLogout]);

  const isActive = (path: string): boolean => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Book className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Story Hive</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="px-2" variant="ghost">
                  Books <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link className="w-full" href="/products">
                    All Books
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link className="w-full" href="/categories/fiction">
                    Fiction
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link className="w-full" href="/categories/non-fiction">
                    Non-Fiction
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link className="w-full" href="/categories/children">
                    Children Books
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/authors') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/authors"
            >
              Authors
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/events') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/events"
            >
              Events
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/about') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/about"
            >
              About
            </Link>
          </nav>
        </div>

        <Link className="-ml-3 flex items-center space-x-2 md:hidden" href="/">
          <Book className="h-5 w-5 text-primary" />
          <span className="font-bold">Story Hive</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="hidden md:flex">
            <Button className="rounded-r-none" size="icon" variant="ghost">
              <Search className="h-5 w-5" />
            </Button>
            <input
              className="max-w-[150px] border-y border-r rounded-r-md h-10 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search books..."
              type="text"
            />
          </div>

          <Button
            className="ml-2"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            size="icon"
            variant="ghost"
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <nav className="flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                <Link href="/cart">
                  <Button aria-label="Shopping Cart" size="icon" variant="ghost">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label="User Account" size="icon" variant="ghost">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="/account">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/wishlist">My Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogoutClick}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link className="hidden md:block" href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link className="hidden md:block" href="/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground/60 transition-colors hover:text-foreground md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container pb-3 md:hidden">
          <div className="flex pb-3 items-center">
            <input
              className="flex-grow border rounded-l-md h-9 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search books..."
              type="text"
            />
            <Button className="h-9 rounded-l-none" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-3">
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith('/products') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/products"
              onClick={() => setIsMenuOpen(false)}
            >
              All Books
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith('/categories/fiction') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/categories/fiction"
              onClick={() => setIsMenuOpen(false)}
            >
              Fiction
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith('/categories/non-fiction') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/categories/non-fiction"
              onClick={() => setIsMenuOpen(false)}
            >
              Non-Fiction
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith('/categories/children') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/categories/children"
              onClick={() => setIsMenuOpen(false)}
            >
              Children Books
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/authors') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/authors"
              onClick={() => setIsMenuOpen(false)}
            >
              Authors
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/events') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/events"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/about') ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {!isLoggedIn && (
              <>
                <Link
                  className="transition-colors hover:text-foreground/80"
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  className="transition-colors hover:text-foreground/80"
                  href="/sign-up"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
