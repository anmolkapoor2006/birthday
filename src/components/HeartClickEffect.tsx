'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FallingPetal {
  id: number;
  x: number;
  y: number;
  drift: number;
  size: number;
  color: string;
  rotation: number;
  type: 'heart' | 'petal' | 'sparkle';
}

const COLORS = [
  '#FF8FAB', // rose pink
  '#E879A0', // hot pink
  '#F9A8D4', // light pink
  '#DFBA6B', // warm gold
  '#F472B6', // soft blush
];

let idCounter = 0;

export default function HeartClickEffect() {
  const [petals, setPetals] = useState<FallingPetal[]>([]);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [role="button"]')) {
      return;
    }

    // Spawn 2-3 falling petals & sparkles per click
    const count = 3;
    const newItems: FallingPetal[] = Array.from({ length: count }).map((_, i) => ({
      id: ++idCounter,
      x: e.clientX + (Math.random() - 0.5) * 30,
      y: e.clientY + (Math.random() - 0.5) * 20,
      drift: (Math.random() - 0.5) * 80,
      size: Math.random() * 10 + 14,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: (Math.random() - 0.5) * 90,
      type: i === 0 ? 'heart' : i === 1 ? 'petal' : 'sparkle',
    }));

    setPetals((prev) => [...prev, ...newItems]);

    setTimeout(() => {
      setPetals((prev) => prev.filter((p) => !newItems.some((item) => item.id === p.id)));
    }, 1200);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{
              opacity: 1,
              scale: 0.6,
              x: petal.x - petal.size / 2,
              y: petal.y - petal.size / 2,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1.2,
              x: petal.x - petal.size / 2 + petal.drift,
              y: petal.y - petal.size / 2 + 100, // Gently float downwards
              rotate: petal.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{ position: 'fixed', width: petal.size, height: petal.size }}
          >
            {petal.type === 'heart' ? (
              <svg
                viewBox="0 0 24 24"
                style={{ width: '100%', height: '100%', fill: petal.color, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : petal.type === 'petal' ? (
              /* Rose Petal Shape */
              <svg
                viewBox="0 0 24 24"
                style={{ width: '100%', height: '100%', fill: petal.color, opacity: 0.9, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                <path d="M12 2C6.5 2 3 6.5 3 12c0 4.5 3 8 7 9.5 1.5.5 3.5.5 5 0 4-1.5 7-5 7-9.5 0-5.5-3.5-10-10-10z" />
              </svg>
            ) : (
              /* Sparkle */
              <svg
                viewBox="0 0 24 24"
                style={{ width: '100%', height: '100%', fill: petal.color }}
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

