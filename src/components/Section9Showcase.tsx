'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { SHOWCASE_PHOTOS, ShowcasePhotoContent, STORY_CONTINUES } from '@/constants/content';
import { triggerHapticFeedback } from '@/utils/haptics';
import { cn } from '@/lib/utils';

interface Section9ShowcaseProps {
  onReplay: () => void;
  photos?: ShowcasePhotoContent[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

/**
 * Section9Showcase — Full Height Silky-Smooth Interactive Photo Showcase
 * 1. Full height photo frame matching exact photo aspect ratio
 * 2. Silky spring transitions on scroll, touch, or arrow tap
 * 3. Perfectly positioned Replay Surprise overlay card on final photo
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
  const isScrollingRef = useRef(false);
  const touchStartY = useRef(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const goNext = () => {
    if (isScrollingRef.current) return;
    setCurrentIndex((prev) => {
      if (prev < totalPhotos - 1) {
        isScrollingRef.current = true;
        triggerHapticFeedback([15]);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 320);
        return prev + 1;
      }
      return prev;
    });
  };

  const goPrev = () => {
    if (isScrollingRef.current) return;
    setCurrentIndex((prev) => {
      if (prev > 0) {
        isScrollingRef.current = true;
        triggerHapticFeedback([15]);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 320);
        return prev - 1;
      }
      return prev;
    });
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 12) {
        if (e.deltaY > 0) {
          goNext();
        } else {
          goPrev();
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY.current - touchEndY;
        if (Math.abs(deltaY) > 25) {
          if (deltaY > 0) {
            goNext();
          } else {
            goPrev();
          }
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [totalPhotos]);

  return (
    <div
      ref={sectionRef}
      className={cn(
        'flex flex-col items-center justify-between h-[100dvh] max-h-[100dvh] w-full px-4 py-4 relative z-10 select-none overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="pt-2 pb-1 text-center z-20 relative flex-shrink-0">
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
          <span>Favorite Frames</span>
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-1 font-medium">
          Scroll down or tap to flip photos ✨ ({currentIndex + 1} / {totalPhotos})
        </p>
      </div>

      {/* Main Full-Size Photo Frame Container */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl aspect-[4/3] md:aspect-[16/10] h-[54vh] max-h-[480px] my-auto flex items-center justify-center">
        
        {/* Soft Ambient Floating Gradient Glow */}
        <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-pink-300/30 via-rose-200/40 to-purple-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Previous Arrow Button */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute -left-3 md:-left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-pink-100 transition-transform active:scale-95 cursor-pointer z-30"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Next Arrow Button */}
        {!isLast && (
          <button
            onClick={goNext}
            className="absolute -right-3 md:-right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg border border-pink-100 transition-transform active:scale-95 cursor-pointer z-30"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Animated Main Active Photo Card Frame */}
        <div
          className={cn(
            'relative h-full w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl z-10 border-4 border-white shadow-2xl shadow-pink-200/60 bg-white/40',
            containerClassName
          )}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.94, rotate: indexRotation(currentIndex) }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
              }}
              onClick={!isLast ? goNext : undefined}
              className={cn(
                'absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white cursor-pointer transform-gpu will-change-transform z-10',
                imageClassName
              )}
            >
              <div className="w-full h-full relative bg-pink-50">
                <Image
                  src={photos[currentIndex].imageUrl}
                  alt={`Showcase memory ${currentIndex + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 380px, 600px"
                  priority
                  unoptimized
                />
                {/* Lighting Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-amber-200/10 pointer-events-none z-10" />
                <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />

                {/* Photo Badge */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full z-20 border border-white/20">
                  {currentIndex + 1} / {totalPhotos}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Perfectly Positioned Replay Surprise Overlay on Last Photo */}
          {isLast && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-sm p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-pink-100 shadow-2xl text-center flex flex-col items-center justify-center z-30"
            >
              <h3 className="font-script text-2xl text-[#D38B9C] mb-1">
                {STORY_CONTINUES.heading}
              </h3>
              <p className="font-sans text-xs text-gray-600 mb-3 max-w-xs leading-relaxed">
                {STORY_CONTINUES.subheading}
              </p>

              <button
                onClick={onReplay}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-xs rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay surprise</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Navigation Hint */}
      <div className="h-[40px] flex-shrink-0 w-full flex items-center justify-center relative z-20 pb-2">
        <div className="text-center text-xs text-gray-400 font-sans tracking-wide">
          {!isLast ? 'Scroll down, tap photo, or use arrows to flip ✨' : 'Click replay to experience it again ❤️'}
        </div>
      </div>
    </div>
  );
}

function indexRotation(index: number) {
  const angles = [-3, 3, -2, 4, -4, 2];
  return angles[index % angles.length];
}
