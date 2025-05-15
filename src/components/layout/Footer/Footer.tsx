'use client';

import { CustomButton, CustomLink } from '@/components/ui/CustomLink';
import { useCustomer } from '@/hooks/use-customer';
import useAuthStore from '@/store/auth-store';
import { Book } from 'lucide-react';
import { useCallback } from 'react';

export default function Footer(): JSX.Element {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { logout } = useCustomer();

  const handleLogoutClick = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <footer className="bg-background">
      {/* 1 - nav links */}
      <div className="border-t bg-muted/40 py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Quick Navigation</h2>
              <p className="mx-auto max-w-[700px] text-sm md:text-base text-muted-foreground">
                Find your way around our virtual bookstore.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-3 md:grid-cols-3 gap-y-8 md:gap-8">
            {/* Account section */}
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-bold">Account</h3>
              <ul className="space-y-1.5 md:space-y-2">
                {isLoggedIn ? (
                  <>
                    <li>
                      <CustomLink href="/account">My Account</CustomLink>
                    </li>
                    <li>
                      <CustomLink href="/account/orders">My Orders</CustomLink>
                    </li>
                    <li>
                      <CustomButton onClick={handleLogoutClick}>Logout</CustomButton>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <CustomLink href="/login">Login</CustomLink>
                    </li>
                    <li>
                      <CustomLink href="/sign-up">Register</CustomLink>
                    </li>
                    <li>
                      <CustomLink href="/login">My Account</CustomLink>
                    </li>
                    <li>
                      <CustomLink href="/login">My Orders</CustomLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
            {/* Bookstore section */}
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-bold">Bookstore</h3>
              <ul className="space-y-1.5 md:space-y-2">
                <li>
                  <CustomLink href="/products">All Books</CustomLink>
                </li>
                <li>
                  <CustomLink href="/categories">Categories</CustomLink>
                </li>
                <li>
                  <CustomLink href="/authors">Authors</CustomLink>
                </li>
                <li>
                  <CustomLink href="/cart">Shopping Cart</CustomLink>
                </li>
              </ul>
            </div>
            {/* Information section */}
            <div className="space-y-3">
              <h3 className="text-lg md:text-xl font-bold">Information</h3>
              <ul className="space-y-1.5 md:space-y-2">
                <li>
                  <CustomLink href="/about">About Us</CustomLink>
                </li>
                <li>
                  <CustomLink href="/events">Book Events</CustomLink>
                </li>
                <li>
                  <CustomLink href="/privacy-policy">Privacy Policy</CustomLink>
                </li>
                <li>
                  <CustomLink href="/contact">Contact Us</CustomLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* footer bottom */}
      <div className="border-t py-4 md:py-6">
        <div className="container flex flex-col items-center md:flex-row md:justify-between gap-4">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Book className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <span className="font-bold text-lg md:text-xl">Story Hive</span>
          </div>

          <div className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-6">
            <nav className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-1 text-xs md:text-sm text-muted-foreground">
              <CustomLink className="px-1 text-xs md:text-sm text-muted-foreground hover:text-foreground" href="/about">
                About
              </CustomLink>
              <CustomLink
                className="px-1 text-xs md:text-sm text-muted-foreground hover:text-foreground"
                href="/contact"
              >
                Contact
              </CustomLink>
              <CustomLink
                className="px-1 text-xs md:text-sm text-muted-foreground hover:text-foreground"
                href="https://app.rs.school/"
              >
                RSSchool
              </CustomLink>
            </nav>

            <div className="text-xs md:text-sm text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} Story Hive. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
