'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, ArrowDown } from 'lucide-react';
import { REASONS_I_LOVE_YOU } from '@/constants/content';

interface Section6ReasonsProps {
  onContinue: () => void;
}

export default function Section6Reasons({ onContinue }: Section6ReasonsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const [readCount, setReadCount] = useState(1);

  // Hide scroll hint and calculate read count based on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const progress = Math.min(1, scrollTop / Math.max(1, scrollHeight - clientHeight));
    const count = Math.max(1, Math.min(REASONS_I_LOVE_YOU.length, Math.ceil(progress * REASONS_I_LOVE_YOU.length)));
    setReadCount(count);

    if (scrollTop > 50) {
      setShowScrollHint(false);
    } else {
      setShowScrollHint(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-8 relative z-10 select-none">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6 flex flex-col items-center"
      >
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C]">
          Reasons I Love You ❤️
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-2 uppercase tracking-wide">
          Little things that make you so special
        </p>

        {/* Progress Counter Badge */}
        <div className="mt-3 px-3.5 py-1 bg-pink-50 border border-pink-200/60 rounded-full flex items-center space-x-1.5 shadow-2xs">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-300 animate-pulse" />
          <span className="text-[11px] font-medium text-[#D38B9C] tracking-wide">
            Unlocked {readCount} of {REASONS_I_LOVE_YOU.length} reasons
          </span>
        </div>
      </motion.div>

      {/* Note Cards Scrollable Box */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full max-w-sm h-[400px] md:h-[460px] overflow-y-auto px-4 py-6 space-y-6 scroll-smooth custom-scrollbar relative border border-dashed border-pink-100 rounded-2xl bg-[#FFFBFB]/30"
      >
        {REASONS_I_LOVE_YOU.map((reason, index) => {
          // Alternating rotations and soft pastel card background styles
          const rotations = [-2, 1.5, -1, 2, -1.5, 3, -2.5, 1];
          const rotateAngle = rotations[index % rotations.length];
          const pastelColors = [
            'bg-[#FFFBF0] border-[#FCE8D5]', // Cream
            'bg-[#FFF0F3] border-[#FCD5DC]', // Soft pink
            'bg-[#F5F3FF] border-[#E8D5FF]', // Soft lavender
            'bg-[#F0FDF4] border-[#DCFCE7]', // Soft mint
          ];
          const cardColor = pastelColors[index % pastelColors.length];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
              style={{ rotate: `${rotateAngle}deg` }}
              className={`w-full p-5 rounded-xl border shadow-sm relative flex flex-col justify-between ${cardColor} transition-transform hover:rotate-0`}
            >
              {/* Note Header Tape Aesthetic */}
              <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-16 h-4 bg-white/60 backdrop-blur-xs border-x border-dashed border-gray-300/40 shadow-2xs rotate-[1deg]" />

              {/* Heart Icon in Top Right */}
              <div className="absolute top-3 right-3">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-300/30 animate-pulse" />
              </div>

              {/* Note Content */}
              <p className="font-script font-normal text-base md:text-xl text-gray-700 leading-relaxed pt-1 pr-3 font-light">
                {reason}
              </p>
            </motion.div>
          );
        })}

        {/* Padding at the bottom of notes */}
        <div className="h-6" />
      </div>

      {/* Scroll Down Hint */}
      {showScrollHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-3 flex items-center space-x-1 text-gray-400 text-xs animate-bounce"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Scroll to read more</span>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-6 z-10"
      >
        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <span>See our timeline</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
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
