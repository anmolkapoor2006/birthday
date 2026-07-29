'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { LETTER_CONTENT } from '@/constants/content';
import { triggerHapticFeedback } from '@/utils/haptics';
import { playPopSound } from '@/utils/audio';

interface Section8LetterProps {
  onContinue: () => void;
}

export default function Section8Letter({ onContinue }: Section8LetterProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const letterScrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const el = letterScrollRef.current;
    if (!el) return;

    // Detect if user has scrolled near bottom (within 40px)
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      triggerHapticFeedback([20, 30]);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const el = letterScrollRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 10;
    // If already at bottom and scrolling down again, advance to showcase
    if (isAtBottom && e.deltaY > 20) {
      triggerHapticFeedback([30]);
      playPopSound();
      onContinue();
    }
  };

  const handleButtonClick = () => {
    triggerHapticFeedback([40]);
    playPopSound();
    onContinue();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4 py-8 relative z-10 select-none">
      
      {/* Stationery Paper Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#F3EDE2] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[520px] max-h-[85vh]"
      >
        {/* Subtle background notebook lines for handwritten look */}
        <div className="absolute inset-0 bg-notebook-lines opacity-[0.12] pointer-events-none" />

        {/* Pressed Flower Accent Top-Right */}
        <div className="absolute top-4 right-4 w-10 h-10 text-[#C5A059]/40 opacity-60 pointer-events-none">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5c-.3.6-.8 1.1-1.4 1.4C7.9 10.3 7 10 6 10a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5c-.3.6-.8 1.1-1.4 1.4c-.4.2-.6.7-.4 1.1c.2.4.7.6 1.1.4c1.1-.6 1.7-1.8 1.7-3c1.5 0 2.8-.8 3.5-2c.6.3 1.1.8 1.4 1.4c-.6.7-.9 1.6-.9 2.6c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1-.3-1.9-.9-2.6c.3-.6.8-1.1 1.4-1.4c.7 1.2 2 2 3.5 2c0 1.2.6 2.4 1.7 3c.4.2.9 0 1.1-.4c.2-.4 0-.9-.4-1.1c-.6-.3-1.1-.8-1.4-1.4c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4c-1 0-1.9.3-2.6.9c-.3-.6-.8-1.1-1.4-1.4c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm-6 8c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm12 0c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm-6 6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2z" />
          </svg>
        </div>

        {/* Letter Content */}
        <div className="flex-1 flex flex-col justify-start relative z-10 overflow-hidden">
          {/* Golden Stationery Header Date Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-[#C5A059] text-[11px] font-mono tracking-widest uppercase font-semibold">
              Written with love • 2026 ✒️
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-[#DFBA6B]/40 to-transparent" />
          </div>

          {/* Salutation */}
          <h3 className="font-script text-2xl md:text-3xl text-[#D38B9C] mb-4">
            {LETTER_CONTENT.heading}
          </h3>

          {/* Scrollable Letter Body */}
          <div
            ref={letterScrollRef}
            onScroll={handleScroll}
            onWheel={handleWheel}
            className="font-script text-base md:text-lg text-gray-700 space-y-4 leading-relaxed max-h-[380px] md:max-h-[420px] overflow-y-auto pr-3 custom-scrollbar font-normal scroll-smooth"
          >
            {LETTER_CONTENT.paragraphs.map((para, i) => (
              <p key={i} className="text-gray-700">
                {para}
              </p>
            ))}

            {/* Letter Signoff inside scroll area */}
            <div className="pt-6 border-t border-[#F3EDE2] mt-4">
              <p className="font-script text-base text-[#C5A059]">{LETTER_CONTENT.closing}</p>
              <p className="font-script text-xl md:text-2xl text-[#D38B9C] font-semibold mt-0.5">
                {LETTER_CONTENT.sender}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="mt-4 pt-3 border-t border-[#F3EDE2] flex justify-between items-center relative z-10">
          <div className="text-[11px] font-sans text-gray-400">
            {!hasScrolledToBottom ? 'Scroll down to finish reading 📜' : 'End of letter ✨'}
          </div>

          {/* Button shows smoothly when scrolled to bottom or available */}
          <AnimatePresence>
            <motion.button
              onClick={handleButtonClick}
              initial={{ opacity: 0.6, scale: 0.95 }}
              animate={
                hasScrolledToBottom
                  ? { opacity: 1, scale: [1, 1.04, 1], transition: { repeat: Infinity, duration: 2 } }
                  : { opacity: 0.7, scale: 1 }
              }
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-xs md:text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <span>Move to next page</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        .bg-notebook-lines {
          background-image: linear-gradient(#D38B9C 1px, transparent 1px);
          background-size: 100% 2rem;
          line-height: 2rem;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFE3E8;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FFD3DC;
        }
      `}</style>

    </div>
  );
}
