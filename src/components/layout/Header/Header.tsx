'use client';

import LogoDesktop from '@/components/ui/Logo/LogoDesktop';
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
import { Menu, MoonIcon, Search, ShoppingCart, SunIcon, User, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

import MobileMenu from '../Nav/MobileMenu';
import NavMenu from '../Nav/NavMenu';

export default function Header(): JSX.Element {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { logout } = useCustomer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const handleLogoutClick = useCallback(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-6">
          <LogoDesktop className="dark:filter dark:brightness-200 dark:contrast-50" />
        </div>
        <div className="mr-4 hidden md:flex items-center">
          <NavMenu />
        </div>

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

      <MobileMenu isLoggedIn={isLoggedIn} isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
