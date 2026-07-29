'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
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
 * Skiper 17 — Fixed Viewport Card Stack
 * Fits strictly inside 100dvh to eliminate extra document height, infinite scroll, and extra whitespace.
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
        }, 300);
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
        }, 300);
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
          Scroll down to watch our photos flip & reveal ✨ ({currentIndex + 1} / {totalPhotos})
        </p>
      </div>

      {/* Middle Photo Card Stack Container */}
      <div className="sticky-cards-container relative flex h-[44vh] max-h-[360px] md:max-h-[400px] w-full max-w-sm sm:max-w-md md:max-w-lg aspect-[16/10] items-center justify-center my-auto p-2 overflow-hidden rounded-3xl border border-pink-100/60 shadow-2xl shadow-pink-200/50 bg-white/40 backdrop-blur-xs z-10 flex-shrink-0">
        
        {/* Soft Ambient Floating Gradient Glow */}
        <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-pink-300/30 via-rose-200/40 to-purple-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div
          className={cn(
            'relative h-full w-full aspect-[16/10] overflow-hidden rounded-3xl z-10',
            containerClassName
          )}
        >
          {/* Animated Main Active Card */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92, rotate: indexRotation(currentIndex) }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.75, rotate: currentIndex % 2 === 0 ? 3.5 : -3.5 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
              className={cn(
                'absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white border border-pink-100/80 shadow-lg shadow-pink-200/30 transform-gpu will-change-transform z-10',
                imageClassName
              )}
            >
              <div className="w-full h-full relative bg-pink-50">
                <Image
                  src={photos[currentIndex].imageUrl}
                  alt={`Showcase memory ${currentIndex + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 380px, 480px"
                  priority
                  unoptimized
                />
                {/* Lighting Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-200/10 pointer-events-none z-10" />
                <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed-Height Footer */}
      <div className="h-[90px] min-h-[90px] flex-shrink-0 w-full max-w-md flex flex-col items-center justify-center relative z-20 px-2 pb-2">
        {isLast ? (
          <div className="w-full p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-pink-100 shadow-lg text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <h3 className="font-script text-xl md:text-2xl text-[#D38B9C] mb-0.5">
              {STORY_CONTINUES.heading}
            </h3>
            <p className="font-sans text-[11px] text-gray-600 mb-2 max-w-xs leading-tight">
              {STORY_CONTINUES.subheading}
            </p>

            <button
              onClick={onReplay}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-xs rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay surprise</span>
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-400 font-sans tracking-wide">
            Scroll down to watch photos flip ✨
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
