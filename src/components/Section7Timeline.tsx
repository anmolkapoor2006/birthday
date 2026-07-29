'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight, ArrowDown } from 'lucide-react';
import { TIMELINE_MILESTONES } from '@/constants/content';

interface Section7TimelineProps {
  onContinue: () => void;
}

export default function Section7Timeline({ onContinue }: Section7TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (containerRef.current.scrollTop > 50) {
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
        className="text-center mb-6"
      >
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C]">
          Our Journey Together 💫
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-2 uppercase tracking-wide">
          Milestones of our love story
        </p>
      </motion.div>

      {/* Timeline Scroll Box */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full max-w-lg h-[400px] md:h-[460px] overflow-y-auto px-4 py-8 scroll-smooth custom-scrollbar relative border border-dashed border-pink-100 rounded-2xl bg-[#FFFBFB]/30"
      >
        <div className="space-y-12 relative z-10">
          {/* Continuous Glowing Vertical Line connecting all milestones */}
          <div className="absolute left-6 md:left-1/2 top-3 bottom-3 w-1 bg-gradient-to-b from-pink-300 via-rose-400 to-pink-500 rounded-full -translate-x-1/2 pointer-events-none z-0 shadow-[0_0_8px_rgba(244,114,182,0.4)]" />
          {TIMELINE_MILESTONES.map((milestone, index) => {
            const isLast = index === TIMELINE_MILESTONES.length - 1;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: isEven ? -30 : 30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`flex flex-col md:flex-row items-start md:items-center w-full ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* 1. Date (Desktop left/right, mobile aligned) */}
                <div className={`w-full md:w-1/2 flex px-8 ${
                  isEven ? 'md:justify-start' : 'md:justify-end'
                } justify-start mb-2 md:mb-0`}>
                  <span className="text-xs font-semibold text-[#C5A059] tracking-wider bg-[#FFFBF0] px-2.5 py-1 rounded-full border border-[#F5E6CC]/40">
                    {milestone.date}
                  </span>
                </div>

                {/* 2. Timeline Point Marker (Glowing Dot) */}
                <div className="absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-white border-2 border-pink-300 -translate-x-1/2 flex items-center justify-center shadow-xs">
                  <div className="absolute inset-0 bg-pink-300/40 rounded-full blur-xs animate-pulse pointer-events-none" />
                  <motion.div 
                    animate={isLast ? { scale: [1, 1.3, 1] } : { scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                    className={`w-2 h-2 rounded-full ${isLast ? 'bg-pink-500' : 'bg-pink-400'}`} 
                  />
                </div>

                {/* 3. Milestone Card */}
                <div className="w-full md:w-1/2 px-8">
                  <div 
                    className={`p-4 rounded-xl border bg-white shadow-xs flex items-center space-x-3.5 ${
                      isLast 
                        ? 'border-pink-300 ring-2 ring-pink-100 shadow-md scale-102 bg-gradient-to-br from-white to-pink-50/20' 
                        : 'border-[#FFE3E8]'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    {milestone.imageUrl && (
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100 relative">
                        <Image 
                          src={milestone.imageUrl} 
                          alt={milestone.title} 
                          fill
                          className="object-cover"
                          sizes="64px"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Text Content */}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{milestone.title}</h4>
                      <p className="text-xs text-gray-500 font-light mt-1 leading-relaxed">
                        {milestone.description}
                      </p>
                      {isLast && (
                        <p className="text-[10px] text-pink-400 font-semibold tracking-wider uppercase mt-1">
                          ...and many more to come 💫
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom padding */}
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
          <span>Scroll to see our path</span>
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
          <span>Read final letter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Custom Scrollbar Styles */}
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
