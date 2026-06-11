"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TextFadeProps = {
  texts: string[];
  interval?: number;
  className?: string;
};

export default function TextFade({ texts, interval = 3000, className = '' }: TextFadeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={`relative h-12 md:h-16 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center w-full"
        >
          <span className="text-2xl md:text-4xl font-bold text-center">
            {texts[currentIndex]}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
