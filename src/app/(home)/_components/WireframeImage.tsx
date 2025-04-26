'use client';

import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import { type FC, useCallback, useState } from 'react';

export const WireframeImage: FC = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  scrollY.updateAndNotify = useCallback((y: number) => {
    if (y > innerHeight * 2) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, []);

  return (
    <motion.div
      className="fixed top-0 w-full h-dvh z-[-1]"
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src="/images/untitled.png"
        alt="Untitled"
        fill
        className="w-full h-full object-cover opacity-60"
      />
    </motion.div>
  );
};
