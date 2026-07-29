'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound } from '@/utils/audio';

interface Section5CakeProps {
  onContinue: () => void;
}

interface Balloon {
  id: number;
  color: string;
  popped: boolean;
  xPercent: number; // Left position
  floatDelay: number;
}

export default function Section5Cake({ onContinue }: Section5CakeProps) {
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [isBlowing, setIsBlowing] = useState(false);
  const [cakeCompleted, setCakeCompleted] = useState(false);
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  // Initialize balloons on client mount
  useEffect(() => {
    const balloonColors = [
      'bg-pink-300/80 hover:bg-pink-400/80',
      'bg-purple-300/80 hover:bg-purple-400/80',
      'bg-blue-300/80 hover:bg-blue-400/80',
      'bg-teal-300/80 hover:bg-teal-400/80',
      'bg-yellow-300/80 hover:bg-yellow-400/80',
      'bg-red-300/80 hover:bg-red-400/80',
    ];
    const generated: Balloon[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      color: balloonColors[i % balloonColors.length],
      // Position them: 3 on left (5% to 20%), 3 on right (75% to 90%)
      xPercent: i < 3 ? 5 + i * 8 : 70 + (i - 3) * 8,
      floatDelay: i * 0.8,
      popped: false,
    }));
    setBalloons(generated);
  }, []);

  const handleBlowCandles = () => {
    if (isBlowing || cakeCompleted) return;
    setIsBlowing(true);

    // Staggered candle blowing out
    candlesLit.forEach((_, index) => {
      setTimeout(() => {
        setCandlesLit((prev) => {
          const next = [...prev];
          next[index] = false;
          return next;
        });

        // Small pop sound for each blown candle
        playPopSound();

        // When the last candle is blown out, trigger big confetti
        if (index === candlesLit.length - 1) {
          setTimeout(() => {
            triggerConfettiExplosion();
            setCakeCompleted(true);
            setIsBlowing(false);
          }, 400);
        }
      }, index * 400);
    });
  };

  const triggerConfettiExplosion = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#D8B4FE', '#FDE047', '#93C5FD', '#A7F3D0'],
    });
  };

  const handleBalloonPop = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Play the pop sound effect
    playPopSound();

    // Trigger local confetti burst at the click location
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x, y },
      colors: ['#FFC0CB', '#D8B4FE', '#FDE047', '#93C5FD'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4 py-8 relative z-10 select-none overflow-hidden">
      
      {/* Background Floating Balloons (poppable) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {balloons.map((balloon) => (
          <AnimatePresence key={balloon.id}>
            {!balloon.popped && (
              <motion.div
                initial={{ y: '100vh', opacity: 0 }}
                animate={{ y: '-10vh', opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{
                  y: {
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: balloon.floatDelay,
                  },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.2 },
                }}
                onClick={(e) => handleBalloonPop(e, balloon.id)}
                className={`absolute w-12 h-16 md:w-16 md:h-20 rounded-t-full rounded-b-[45%] pointer-events-auto cursor-pointer flex flex-col items-center shadow-lg ${balloon.color}`}
                style={{ left: `${balloon.xPercent}%` }}
              >
                {/* Balloon string */}
                <div className="absolute bottom-[-16px] w-0.5 h-4 bg-gray-400/40" />
                {/* Tie knot */}
                <div className="absolute bottom-[-2px] border-t-8 border-t-inherit border-x-4 border-x-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C]">
            Make a Wish 🎂
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
            Tap a floating balloon to pop it, and blow out the candles to unlock your final letter.
          </p>
        </motion.div>

        {/* SVG Cake Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 70 }}
          className="w-64 h-64 flex items-center justify-center relative mb-8"
        >
          {/* SVG Birthday Cake */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Candle 1 (Left) */}
            <g transform="translate(65, 30)">
              <rect x="0" y="15" width="6" height="30" fill="#D38B9C" rx="2" />
              <rect x="0" y="20" width="6" height="4" fill="#FAF6F0" />
              <rect x="0" y="30" width="6" height="4" fill="#FAF6F0" />
              {candlesLit[0] && (
                <motion.path
                  d="M3 0C5 6 6 10 3 15C0 10 1 6 3 0Z"
                  fill="url(#candleFlame)"
                  animate={{ scale: [1, 1.15, 0.9, 1], y: [0, -1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              )}
            </g>

            {/* Candle 2 (Center) */}
            <g transform="translate(97, 20)">
              <rect x="0" y="15" width="6" height="30" fill="#C5A059" rx="2" />
              <rect x="0" y="22" width="6" height="4" fill="#FAF6F0" />
              <rect x="0" y="32" width="6" height="4" fill="#FAF6F0" />
              {candlesLit[1] && (
                <motion.path
                  d="M3 0C5 6 6 10 3 15C0 10 1 6 3 0Z"
                  fill="url(#candleFlame)"
                  animate={{ scale: [1, 0.9, 1.2, 1], y: [0, 1, -1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }}
                />
              )}
            </g>

            {/* Candle 3 (Right) */}
            <g transform="translate(129, 30)">
              <rect x="0" y="15" width="6" height="30" fill="#D38B9C" rx="2" />
              <rect x="0" y="20" width="6" height="4" fill="#FAF6F0" />
              <rect x="0" y="30" width="6" height="4" fill="#FAF6F0" />
              {candlesLit[2] && (
                <motion.path
                  d="M3 0C5 6 6 10 3 15C0 10 1 6 3 0Z"
                  fill="url(#candleFlame)"
                  animate={{ scale: [1.1, 0.95, 1.05, 1.1], y: [0, -0.5, 0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }}
                />
              )}
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="candleFlame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="40%" stopColor="#F98C1C" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
              <linearGradient id="cakeIcing" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFE3E8" />
                <stop offset="100%" stopColor="#FFD3DC" />
              </linearGradient>
            </defs>

            {/* Plate */}
            <ellipse cx="100" cy="165" rx="75" ry="12" fill="#E2E8F0" stroke="#DFBA6B" strokeWidth="1.5" />

            {/* Cake Bottom Tier */}
            <path d="M 35 125 A 65 10 0 0 0 165 125 L 165 160 A 65 10 0 0 1 35 160 Z" fill="url(#cakeIcing)" />
            <ellipse cx="100" cy="125" rx="65" ry="10" fill="#FFE3E8" />

            {/* Drips Bottom Tier */}
            <path d="M 35 125 Q 45 137 55 125 Q 65 137 75 125 Q 90 142 105 125 Q 115 135 125 125 Q 140 138 150 125 Q 158 132 165 125 L 165 132 A 65 5 0 0 1 35 132 Z" fill="#FFC0CB" opacity="0.8" />

            {/* Cake Top Tier */}
            <path d="M 55 75 A 45 8 0 0 0 145 75 L 145 120 A 45 8 0 0 1 55 120 Z" fill="#F3E8FF" />
            <ellipse cx="100" cy="75" rx="45" ry="8" fill="#E8D5FF" />

            {/* Cake Drips Top Tier */}
            <path d="M 55 75 Q 65 85 75 75 Q 85 88 95 75 Q 110 88 120 75 Q 130 83 140 75 L 145 75 L 145 82 A 45 4 0 0 1 55 82 Z" fill="#D8B4FE" opacity="0.8" />

            {/* Strawberries/Cherries decoration */}
            <circle cx="70" cy="73" r="4" fill="#EF4444" />
            <circle cx="100" cy="71" r="4" fill="#EF4444" />
            <circle cx="130" cy="73" r="4" fill="#EF4444" />
          </svg>
        </motion.div>

        {/* Action Button */}
        {!cakeCompleted ? (
          <button
            onClick={handleBlowCandles}
            disabled={isBlowing}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-[#D38B9C] hover:from-pink-500 hover:to-[#C27A8B] text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBlowing ? 'Blowing...' : 'Blow out the candles 🌬️'}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <p className="text-[#C5A059] text-sm font-semibold tracking-wider uppercase mb-4 animate-bounce">
              Yay! Make a wish ✨
            </p>
            <button
              onClick={onContinue}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <span>Read your letter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

    </div>
  );
}
