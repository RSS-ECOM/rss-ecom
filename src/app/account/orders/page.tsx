'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface UnderDevelopmentProps {
  imagePath?: string;
  message?: string;
  returnLabel?: string;
  returnPath?: string;
  title?: string;
}

export default function UnderDevelopment({
  imagePath = '/img/webp/dev.webp',
  message = "We're currently working on implementing this feature. Please check back soon!",
  returnLabel = 'Return to Homepage',
  returnPath = '/',
  title = 'Page Under Development',
}: UnderDevelopmentProps): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center">
          <Construction className="h-12 w-12 text-primary" />
        </div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full h-60 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Image alt="Page under development" className="object-contain" fill priority src={imagePath} />
        </motion.div>

        <motion.h1
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold mb-3"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          animate={{ opacity: 1 }}
          className="text-muted-foreground mb-8 text-lg"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {message}
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button asChild size="lg">
            <Link className="flex items-center gap-2" href={returnPath}>
              <ArrowLeft className="h-4 w-4" />
              {returnLabel}
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
