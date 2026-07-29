'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section1EnvelopeProps {
  onOpen: () => void;
}

export default function Section1Envelope({ onOpen }: Section1EnvelopeProps) {
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isLetterOut, setIsLetterOut] = useState(false);

  const handleSealClick = () => {
    if (isSealBroken) return;
    setIsSealBroken(true);

    // 1. Break the seal
    // 2. Open the envelope flap
    setTimeout(() => {
      setIsFlapOpen(true);
      
      // 3. Slide the card/letter up slightly
      setTimeout(() => {
        setIsLetterOut(true);
        
        // 4. Trigger transition to Section 2
        setTimeout(() => {
          onOpen();
        }, 1200);
      }, 700);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4 relative z-10 select-none">
      {/* Script Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center mb-10"
      >
        <h1 className="font-script text-3xl md:text-5xl text-[#D38B9C] drop-shadow-sm">
          A little something for you, Priya 💌
        </h1>
        <p className="font-sans text-xs md:text-sm text-gray-500/80 mt-2 tracking-wide uppercase">
          Sent with love
        </p>
      </motion.div>

      {/* Envelope Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative w-72 h-48 md:w-96 md:h-64"
        style={{ perspective: '1000px' }}
      >
        {/* Glow / Shadow behind Envelope */}
        <div className="absolute inset-0 bg-[#FFD3DC]/30 rounded-xl blur-xl -z-10 animate-pulse" />

        {/* 1. Letter Card (Inside Envelope) */}
        <motion.div
          className="absolute inset-x-4 bg-white rounded-lg shadow-md border border-[#FFE3E8] p-4 flex flex-col justify-between -z-10"
          style={{ height: '85%', bottom: '5%' }}
          animate={isLetterOut ? { y: '-40%', scale: 1.02 } : { y: '0%', scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="border border-dashed border-[#FFD3DC] h-full rounded-md flex flex-col items-center justify-center p-2 text-center">
            <span className="text-pink-400 text-xl md:text-2xl animate-bounce">❤️</span>
            <p className="font-script text-lg md:text-2xl text-[#C5A059] mt-1">For Priya</p>
          </div>
        </motion.div>

        {/* 2. Envelope Back & Bottom Flap (Base) */}
        <div className="absolute inset-0 bg-[#FFF0F2] border border-[#FFE3E8]/80 rounded-xl shadow-lg -z-20 overflow-hidden">
          {/* Internal diagonal side lines to look like an envelope */}
          <div className="absolute inset-0 border-t-[96px] border-t-transparent border-b-[96px] border-b-transparent border-l-[144px] border-l-[#FFEBF0]/70 border-r-[144px] border-r-[#FFEBF0]/70 md:border-t-[128px] md:border-b-[128px] md:border-l-[192px] md:border-r-[192px]" />
          {/* Bottom triangle */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#FFD3DC]/30 border-t border-[#FFE3E8] origin-bottom clip-path-bottom-flap" />
        </div>

        {/* 3. Top Flap (Opens Upwards) */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-[#FFE3E8] origin-top border-b border-[#FFF0F2] rounded-t-xl"
          style={{
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
          }}
          animate={isFlapOpen ? { rotateX: 180, zIndex: -15 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* 4. Wax Seal Button */}
        <AnimatePresence>
          {!isSealBroken && (
            <motion.button
              onClick={handleSealClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ['0 0 0 0 rgba(223,186,107,0.4)', '0 0 0 10px rgba(223,186,107,0)', '0 0 0 0 rgba(223,186,107,0.4)'],
              }}
              transition={{
                boxShadow: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#DFBA6B] to-[#C5A059] rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer z-10"
            >
              {/* Inner stamp ring */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/40 flex items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 5. Split Wax Seal Animation (Breaking Seal) */}
        <AnimatePresence>
          {isSealBroken && !isFlapOpen && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex z-10 pointer-events-none">
              {/* Left half */}
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: -30, opacity: 0, rotate: -15 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-[#DFBA6B] to-[#D5B25F] rounded-l-full border-y-4 border-l-4 border-white border-r-0 flex items-center justify-end overflow-hidden"
              >
                <div className="w-10 h-16 border border-white/20 rounded-l-full translate-x-2 flex items-center justify-end">
                  <svg className="w-8 h-8 text-white fill-current translate-x-4" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </motion.div>
              {/* Right half */}
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 30, opacity: 0, rotate: 15 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-1/2 h-full bg-gradient-to-l from-[#C5A059] to-[#D5B25F] rounded-r-full border-y-4 border-r-4 border-white border-l-0 flex items-center justify-start overflow-hidden"
              >
                <div className="w-10 h-16 border border-white/20 rounded-r-full -translate-x-2 flex items-center justify-start">
                  <svg className="w-8 h-8 text-white fill-current -translate-x-4" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tap Hint */}
      <AnimatePresence>
        {!isSealBroken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="font-sans text-sm text-[#C5A059] font-medium tracking-wide"
            >
              Tap the seal to open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
