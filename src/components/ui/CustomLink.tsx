'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  onClick?: () => void;
}

export function CustomLink({
  href,
  children,
  className,
  underlineColor = 'bg-primary',
  onClick,
}: CustomLinkProps): JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const textVariants = {
    initial: { color: isActive ? 'currentColor' : 'currentColor' },
    hover: { color: 'currentColor' },
  };

  const lineVariants = {
    initial: { width: isActive ? '100%' : '0%' },
    hover: { width: '100%' },
  };

  return (
    <motion.div className="relative inline-block" initial="initial" whileHover="hover">
      <Link
        href={href}
        className={cn(
          'relative inline-block text-sm md:text-base transition-colors',
          isActive ? 'text-foreground font-medium' : 'text-foreground/70',
          'hover:text-foreground',
          className,
        )}
        onClick={onClick}
      >
        <motion.span variants={textVariants} transition={{ duration: 0.3 }}>
          {children}
        </motion.span>
      </Link>
      <motion.span
        className={`h-[1px] ${underlineColor} absolute left-0 -bottom-0.5`}
        variants={lineVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

export function CustomButton({
  children,
  className,
  underlineColor = 'bg-primary',
  onClick,
}: Omit<CustomLinkProps, 'href'> & { underlineColor?: string }): JSX.Element {
  return (
    <motion.div className="relative inline-block" initial="initial" whileHover="hover">
      <button
        className={cn(
          'relative inline-block text-sm md:text-base transition-colors',
          'text-foreground/70 hover:text-foreground bg-transparent border-0 p-0 cursor-pointer text-left',
          className,
        )}
        onClick={onClick}
      >
        <motion.span
          variants={{
            initial: { color: 'currentColor' },
            hover: { color: 'currentColor' },
          }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.span>
      </button>
      <motion.span
        className={`h-[1px] ${underlineColor} absolute left-0 -bottom-0.5`}
        variants={{
          initial: { width: '0%' },
          hover: { width: '100%' },
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
