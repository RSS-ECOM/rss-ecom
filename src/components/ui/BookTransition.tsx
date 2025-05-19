'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BookPageTransitionProps {
  children: React.ReactNode;
}

export default function BookPageTransition({ children }: BookPageTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(1);
  const [prevPath, setPrevPath] = useState('');

  useEffect(() => {
    if (prevPath && prevPath !== pathname) {
      const prevDepth = prevPath.split('/').filter(Boolean).length;
      const currentDepth = pathname.split('/').filter(Boolean).length;

      if (prevDepth === currentDepth) {
        setDirection((prev) => prev * -1);
      } else {
        setDirection(currentDepth > prevDepth ? 1 : -1);
      }
    }

    setPrevPath(pathname);
  }, [pathname, prevPath]);

  const angle = direction > 0 ? -180 : 180;

  return (
    <div className="book-container perspective-1000 w-full h-full">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          className="w-full h-full relative bg-background"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.5,
              when: 'beforeChildren',
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.2,
              delay: 0.4,
              when: 'afterChildren',
            },
          }}
        >
          <div className="page-content">{children}</div>

          <motion.div
            className="absolute top-0 right-0 bottom-0 left-0 bg-background overflow-hidden"
            style={{
              originX: direction > 0 ? 0 : 1,
              boxShadow: direction > 0 ? '-5px 0 15px rgba(0,0,0,0.25)' : '5px 0 15px rgba(0,0,0,0.25)',
              zIndex: 10,
            }}
            initial={{
              rotateY: 0,
            }}
            exit={{
              rotateY: angle,
              transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                duration: 0.6,
              },
            }}
          >
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none"
              initial={{ opacity: 0 }}
              exit={{ opacity: 0.2 }}
              transition={{ duration: 0.5 }}
            />

            <div className="page-texture" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
