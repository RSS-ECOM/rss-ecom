'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isRight, setIsRight] = useState(true);
  const [prevPath, setPrevPath] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prevPath && prevPath !== pathname) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }

    setPrevPath(pathname);
  }, [pathname, prevPath]);

  useEffect(() => {
    if (prevPath && prevPath !== pathname) {
      const prevDepth = (prevPath.match(/\//g) || []).length;
      const currentDepth = (pathname.match(/\//g) || []).length;

      setIsRight(currentDepth >= prevDepth);
    }

    setPrevPath(pathname);
  }, [pathname, prevPath]);

  const pageVariants = {
    initial: (custom: boolean) => ({
      rotateY: custom ? 45 : -45,
      x: custom ? '100%' : '-100%',
      opacity: 0.5,
      transformOrigin: custom ? 'left center' : 'right center',
      boxShadow: custom ? '-20px 0 40px rgba(0,0,0,0.3)' : '20px 0 40px rgba(0,0,0,0.3)',
      scale: 0.9,
      backgroundColor: 'rgba(255,255,255,0.9)',
    }),
    animate: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      backgroundColor: 'rgba(255,255,255,0)',
      transition: {
        duration: 0.8,
        x: { type: 'spring', stiffness: 200, damping: 25 },
        rotateY: { duration: 0.8 },
        opacity: { duration: 0.6 },
      },
    },
    exit: (custom: boolean) => ({
      rotateY: custom ? 45 : -45,
      x: custom ? '100%' : '-100%',
      opacity: 0.2,
      transformOrigin: custom ? 'left center' : 'right center',
      boxShadow: custom ? '-20px 0 40px rgba(0,0,0,0.3)' : '20px 0 40px rgba(0,0,0,0.3)',
      scale: 0.9,
      backgroundColor: 'rgba(255,255,255,0.9)',
      transition: {
        duration: 0.8,
        x: { type: 'spring', stiffness: 200, damping: 25 },
        rotateY: { duration: 0.8 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={false} custom={isRight}>
        <motion.div
          key={pathname}
          custom={isRight}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-[calc(100vh-4rem)] bg-background"
          style={{
            perspective: '1500px',
            pointerEvents: isAnimating ? 'none' : 'auto',
            position: 'relative',
          }}
        >
          {/* shadow */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{
              opacity: 0.7,
              background: isRight
                ? 'linear-gradient(to right, rgba(0,0,0,0.3), transparent)'
                : 'linear-gradient(to left, rgba(0,0,0,0.3), transparent)',
            }}
          />

          <div className="page-content relative">{children}</div>
        </motion.div>
      </AnimatePresence>

      {/* book page style */}
      <style jsx global>{`
        .page-content {
          position: relative;
          pointer-events: auto;
        }

        .page-content::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
      `}</style>
    </>
  );
}
