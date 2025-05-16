'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="relative w-full h-80 mb-8 overflow-hidden rounded-2xl"
          style={{
            WebkitMaskImage: 'radial-gradient(white, black)',
            maskImage: 'radial-gradient(white, black)',
          }}
        >
          <Image
            alt="Books not found illustration"
            className="object-contain rounded-2xl"
            fill
            priority
            src="/img/gif/404-img.gif"
          />
        </div>

        <motion.h1
          animate={{ opacity: 1 }}
          className="text-4xl font-bold mb-3 dark:text-amber-200"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          animate={{ opacity: 1 }}
          className="text-muted-foreground mb-8 text-lg"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Oops! It seems this page has wandered off our shelves. Let&apos;s help you find your way back to our
          collection.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Return to Homepage</Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/products">Browse Books</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
