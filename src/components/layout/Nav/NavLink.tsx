'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export default function NavLink({ children, className, href }: NavLinkProps): JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      className={cn(
        'relative group transition-colors hover:text-foreground/80',
        isActive ? 'text-foreground font-semibold' : 'text-foreground/60',
        className,
      )}
      href={href}
    >
      {children}
      <span
        className={cn(
          'h-[1px] inline-block bg-primary absolute left-0 -bottom-1',
          'group-hover:w-full transition-[width] duration-300 ease-in-out',
          isActive ? 'w-full' : 'w-0',
        )}
      />
    </Link>
  );
}
