'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { SHOWCASE_PHOTOS, ShowcasePhotoContent, STORY_CONTINUES } from '@/constants/content';
import { triggerHapticFeedback } from '@/utils/haptics';
import { playPopSound } from '@/utils/audio';
import { cn } from '@/lib/utils';

interface Section9ShowcaseProps {
  onReplay: () => void;
  photos?: ShowcasePhotoContent[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

/**
 * Section9Showcase — Fixed Screen Interactive Photo Stack
 * 100% locked to screen height with ZERO document page scrolling.
 * Allows tapping/swiping through cards with smooth animations & instant photo loads.
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
  imageClassName,
}: Section9ShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalPhotos = photos.length;
  const isLast = currentIndex === totalPhotos - 1;

  const handleNext = () => {
    if (currentIndex < totalPhotos - 1) {
      triggerHapticFeedback([15, 25]);
      playPopSound();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      triggerHapticFeedback([15, 25]);
      playPopSound();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-between min-h-[100dvh] w-full px-4 py-6 relative z-10 select-none overflow-hidden', className)}>
      
      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-20 mt-2 mb-2"
      >
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
          <span>Favorite Frames</span>
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
        </h2>
        <p className="font-sans text-xs md:text-sm text-gray-500 mt-1 font-medium">
          Tap photo or arrows to reveal our special memories 📸 ({currentIndex + 1} / {totalPhotos})
        </p>
      </motion.div>

      {/* ── MAIN PHOTO CARD STACK CONTAINER ── */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[16/10] h-[48vh] max-h-[460px] my-auto flex items-center justify-center">
        
        {/* Soft Ambient Glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-pink-300/40 via-purple-200/40 to-rose-300/40 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute -left-3 md:-left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-pink-100 transition-transform active:scale-95 cursor-pointer z-30"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Next Button */}
        {!isLast && (
          <button
            onClick={handleNext}
            className="absolute -right-3 md:-right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-pink-100 transition-transform active:scale-95 cursor-pointer z-30"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Card Flip Animation */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.92, rotate: indexRotation(currentIndex) }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onClick={!isLast ? handleNext : undefined}
            className={cn(
              'relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-2xl shadow-pink-200/70 border-4 border-white cursor-pointer transform-gpu',
              containerClassName,
              imageClassName
            )}
          >
            <Image
              src={photos[currentIndex].imageUrl}
              alt={`Memory ${currentIndex + 1}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 380px, 512px"
              priority
              unoptimized
            />

            {/* Warm Golden Soft Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-amber-200/10 pointer-events-none z-10" />
            <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />

            {/* Photo Counter Badge */}
            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full z-20 border border-white/20">
              {currentIndex + 1} / {totalPhotos}
            </div>

            {/* Tap Hint */}
            {!isLast && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/35 backdrop-blur-xs text-white/90 text-[11px] px-3.5 py-1 rounded-full z-20 font-sans tracking-wide">
                Tap card for next photo ✨
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FOOTER / REPLAY SURPRISE ── */}
      <div className="w-full max-w-sm text-center mb-2 z-20">
        {isLast ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center space-y-2 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-pink-100 shadow-lg"
          >
            <h3 className="font-script text-2xl text-[#D38B9C]">
              {STORY_CONTINUES.heading}
            </h3>
            <p className="font-sans text-xs text-gray-600 max-w-xs leading-relaxed">
              {STORY_CONTINUES.subheading}
            </p>
            <button
              onClick={onReplay}
              className="mt-1 flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] text-[#D38B9C] font-semibold text-xs rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay surprise</span>
            </button>
          </motion.div>
        ) : (
          <div className="flex justify-center items-center space-x-1 text-xs text-gray-400">
            <span>Tap card or use arrows to flip photos</span>
          </div>
        )}
      </div>
    </div>
  );
}

function indexRotation(index: number) {
  const angles = [-3, 3, -2, 4, -4, 2];
  return angles[index % angles.length];
}
