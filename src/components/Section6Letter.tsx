'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { LETTER_CONTENT } from '@/constants/content';

interface Section6LetterProps {
  onReplay: () => void;
}

export default function Section6Letter({ onReplay }: Section6LetterProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4 py-12 relative z-10 select-none">
      
      {/* Stationery Paper Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#F3EDE2] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[500px]"
      >
        {/* Subtle background notebook lines for handwritten look */}
        <div className="absolute inset-0 bg-notebook-lines opacity-[0.12] pointer-events-none" />

        {/* Pressed Flower Accent Top-Right */}
        <div className="absolute top-4 right-4 w-12 h-12 text-[#C5A059]/40 opacity-60">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5c-.3.6-.8 1.1-1.4 1.4C7.9 10.3 7 10 6 10a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5c-.3.6-.8 1.1-1.4 1.4c-.4.2-.6.7-.4 1.1c.2.4.7.6 1.1.4c1.1-.6 1.7-1.8 1.7-3c1.5 0 2.8-.8 3.5-2c.6.3 1.1.8 1.4 1.4c-.6.7-.9 1.6-.9 2.6c0 2.2 1.8 4 4 4s4-1.8 4-4c0-1-.3-1.9-.9-2.6c.3-.6.8-1.1 1.4-1.4c.7 1.2 2 2 3.5 2c0 1.2.6 2.4 1.7 3c.4.2.9 0 1.1-.4c.2-.4 0-.9-.4-1.1c-.6-.3-1.1-.8-1.4-1.4c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4c-1 0-1.9.3-2.6.9c-.3-.6-.8-1.1-1.4-1.4c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm-6 8c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm12 0c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2zm-6 6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2z" />
          </svg>
        </div>

        {/* Letter Content */}
        <div className="flex-1 flex flex-col justify-start relative z-10">
          {/* Salutation */}
          <h3 className="font-script text-2xl md:text-3xl text-[#D38B9C] mb-6">
            {LETTER_CONTENT.heading}
          </h3>

          {/* Letter Body (Scrollable if overflow) */}
          <div className="font-script text-lg md:text-xl text-gray-700 space-y-4 md:space-y-6 leading-relaxed max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
            {LETTER_CONTENT.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Signoff & Bottom Decorator */}
        <div className="mt-8 pt-6 border-t border-[#F3EDE2] flex justify-between items-end relative z-10">
          <div>
            <p className="font-script text-base text-[#C5A059]">{LETTER_CONTENT.closing}</p>
            <p className="font-script text-xl md:text-2xl text-[#D38B9C] font-semibold mt-1">
              {LETTER_CONTENT.sender}
            </p>
          </div>
          
          {/* Small heart/flower doodles */}
          <div className="text-xl md:text-2xl animate-pulse text-pink-300">
            🌸 ✨
          </div>
        </div>
      </motion.div>

      {/* Replay Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <button
          onClick={onReplay}
          className="flex items-center space-x-2 px-6 py-2.5 bg-white hover:bg-pink-50/50 text-[#D38B9C] border border-[#FFE3E8] font-semibold text-xs rounded-full shadow-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay surprise</span>
        </button>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        .bg-notebook-lines {
          background-image: linear-gradient(#D38B9C 1px, transparent 1px);
          background-size: 100% 2rem;
          line-height: 2rem;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
