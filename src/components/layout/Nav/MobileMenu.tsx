'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface MobileMenuProps {
  isLoggedIn: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isLoggedIn, isOpen, onClose }: MobileMenuProps): JSX.Element {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    const timer = setTimeout(() => {
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
    }, 100);

    return (): void => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return (): void => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function MobileNavLink({ children, href }: { children: React.ReactNode; href: string }): JSX.Element {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        className={cn(
          'relative transition-colors hover:text-foreground/80 w-full block py-2',
          isActive ? 'text-foreground font-semibold' : 'text-foreground/60',
          'group',
        )}
        href={href}
        onClick={onClose}
      >
        {children}
        <span
          className={cn(
            'h-[1px] inline-block bg-primary absolute left-0 -bottom-0.5',
            'group-hover:w-full transition-[width] duration-300 ease-in-out',
            isActive ? 'w-full' : 'w-0',
          )}
        />
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 max-h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 ease-in-out',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
      )}
      ref={menuRef}
    >
      <div className="container py-4 md:hidden">
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
        <nav className="flex flex-col space-y-1">
          <MobileNavLink href="/products">All Books</MobileNavLink>
          <MobileNavLink href="/categories/fiction">Fiction</MobileNavLink>
          <MobileNavLink href="/categories/non-fiction">Non-Fiction</MobileNavLink>
          <MobileNavLink href="/categories/children">Children Books</MobileNavLink>
          <MobileNavLink href="/authors">Authors</MobileNavLink>
          <MobileNavLink href="/events">Events</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>

          {!isLoggedIn && (
            <>
              <MobileNavLink href="/login">Login</MobileNavLink>
              <MobileNavLink href="/sign-up">Sign Up</MobileNavLink>
            </>
          )}
        </nav>

        <div className="mt-6 bg-gradient-to-r from-rose-100 to-indigo-100 dark:from-rose-900/20 dark:to-indigo-900/20 rounded-lg p-4 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Summer Reading Collection</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Discover our handpicked selection of books perfect for lazy summer days.
            </p>
            <Button className="text-sm" size="sm" variant="outline">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
