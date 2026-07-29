'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  type: 'petal' | 'heart' | 'sparkle';
  x: number; // percentage width
  size: number; // size in px
  duration: number; // animation duration
  delay: number; // start delay
  drift: number; // horizontal drift amplitude
}

export default function BackgroundParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate pre-scattered particles on client mount to avoid SSR layout shift/mismatch
    const generated: Particle[] = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      type: i % 3 === 0 ? 'petal' : i % 3 === 1 ? 'heart' : 'sparkle',
      x: Math.random() * 100,
      size: Math.random() * 14 + 10, // 10px to 24px
      duration: Math.random() * 25 + 20, // 20s to 45s
      delay: Math.random() * -45, // negative delay so particles start scattered across screen
      drift: Math.random() * 80 - 40, // -40px to 40px drift
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {particles.map((p) => {
        let color = '';
        let svgContent = null;

        if (p.type === 'petal') {
          // Blush pink petal
          color = 'text-[#FFD3DC]/40 fill-[#FFD3DC]/20';
          svgContent = (
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12 2C7 6 5 12 12 22C19 12 17 6 12 2Z" />
            </svg>
          );
        } else if (p.type === 'heart') {
          // Lavender heart
          color = 'text-[#E5D5FF]/45 fill-[#E5D5FF]/20';
          svgContent = (
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          );
        } else {
          // Soft gold sparkle
          color = 'text-[#F9E2AF]/50 fill-[#F9E2AF]/25';
          svgContent = (
            <svg viewBox="0 0 24 24" className="w-full h-full animate-pulse">
              <path d="M12 2L14.8 9.2L22 10.4L16.2 15.6L17.8 22.8L12 18.8L6.2 22.8L7.8 15.6L2 10.4L9.2 9.2Z" />
            </svg>
          );
        }

        return (
          <motion.div
            key={p.id}
            className={`absolute ${color}`}
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              bottom: '-10%',
            }}
            animate={{
              y: ['0vh', '-120vh'],
              x: [0, p.drift, -p.drift, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: p.delay,
            }}
          >
            {svgContent}
          </motion.div>
        );
      })}
    </div>
  );
}
