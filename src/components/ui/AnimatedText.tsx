'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
  wordSpacing?: number;
}

const quote = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const singleWord = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};

export default function AnimatedText({
  text,
  className = '',
  once = false,
  delay = 0.5,
  wordSpacing = 0.08,
}: AnimatedTextProps): JSX.Element {
  const customQuote = {
    ...quote,
    animate: {
      ...quote.animate,
      transition: {
        ...quote.animate.transition,
        delay,
        staggerChildren: wordSpacing,
      },
    },
  };

  return (
    <div className="w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden sm:py-0">
      <motion.h1
        className={cn('inline-block w-full font-bold', className)}
        variants={customQuote}
        initial="initial"
        animate="animate"
        viewport={{ once }}
      >
        {text.split(' ').map((word, index) => (
          <motion.span key={`${word}-${index}`} className="inline-block" variants={singleWord}>
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
