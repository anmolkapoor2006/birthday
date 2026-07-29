'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { SHOWCASE_PHOTOS, ShowcasePhotoContent, STORY_CONTINUES } from '@/constants/content';
import { cn } from '@/lib/utils';

interface Section9ShowcaseProps {
  onReplay: () => void;
  photos?: ShowcasePhotoContent[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

/**
 * Individual Showcase Card Component
 * Clean white container with floating drop shadow. Zero image overlays, zero blur filters.
 */
function ShowcaseCard({
  photo,
  index,
  total,
  scrollYProgress,
}: {
  photo: ShowcasePhotoContent;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const isLast = index === total - 1;
  const targetRotation = index % 4 === 0 ? 4 : index % 4 === 1 ? -4.5 : index % 4 === 2 ? 3 : -3.5;
  const exitEnd = Math.min(1, end + step * 0.7);

  // GPU Transforms: translate3d (y), scale, rotate
  const y = useTransform(
    scrollYProgress,
    isLast
      ? [Math.max(0, start - step * 0.45), start, 1]
      : index === 0
      ? [0, end, exitEnd]
      : [Math.max(0, start - step * 0.45), start, end, exitEnd],
    isLast
      ? ['120%', '0%', '0%']
      : index === 0
      ? ['0%', '0%', '-120%']
      : ['120%', '0%', '0%', '-120%']
  );

  const scale = useTransform(
    scrollYProgress,
    isLast ? [start, 1] : [start, end],
    isLast ? [1, 1] : [1, 0.8]
  );

  const rotate = useTransform(
    scrollYProgress,
    isLast ? [start, 1] : [start, end],
    isLast ? [0, 0] : [0, targetRotation]
  );

  const opacity = useTransform(
    scrollYProgress,
    isLast ? [0, 1] : [start, end, exitEnd],
    isLast ? [1, 1] : [1, 1, 0]
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        rotate,
        opacity,
        zIndex: index,
      }}
      className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white shadow-xl shadow-pink-200/30 transform-gpu will-change-transform"
    >
      <div className="w-full h-full relative bg-white">
        <Image
          src={photo.imageUrl}
          alt={`Showcase memory ${index + 1}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 380px, 600px"
          priority={index === 0}
          unoptimized
        />
      </div>
    </motion.div>
  );
}

/**
 * Skiper UI Scroll Showcase
 * Soft background gradient attached strictly to page background (-z-10).
 * Cards float cleanly with subtle box-shadows. Zero backdrop-filters or image overlays.
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
}: Section9ShowcaseProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const totalPhotos = photos.length;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="w-full relative select-none">
      {/* Outer Section Background Layer - Fixed behind all content */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#FFF5F7] via-[#FFEBF0] to-[#FAF0F4] pointer-events-none -z-10" />

      {/* 1. Outer Wrapper with Calculated Scroll Height */}
      <div
        ref={targetRef}
        style={{ height: `${totalPhotos * 85}vh` }}
        className={cn('relative w-full', className)}
      >
        {/* 2. Inner Sticky Container (Pinned at top: 0, 100vh height) */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between px-4 py-6 overflow-hidden">
          
          {/* Header */}
          <div className="pt-4 pb-2 text-center z-20 relative flex-shrink-0">
            <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
              <span>Favorite Frames</span>
              <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            </h2>
            <p className="font-sans text-xs text-gray-500 mt-1 font-medium">
              Scroll down to watch our photos flip & reveal ✨
            </p>
          </div>

          {/* Middle Card Stack Frame Container */}
          <div className="sticky-cards-container relative flex h-[54vh] max-h-[480px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl aspect-[16/10] items-center justify-center my-auto p-2 z-10 flex-shrink-0">
            
            <div
              className={cn(
                'relative h-full w-full aspect-[16/10] overflow-hidden rounded-3xl z-10 shadow-xl shadow-pink-200/25 isolate',
                containerClassName
              )}
            >
              {photos.map((photo, i) => (
                <ShowcaseCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  total={totalPhotos}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>

          {/* Footer Hint */}
          <div className="h-[40px] flex-shrink-0 w-full flex items-center justify-center relative z-20 pb-2">
            <div className="text-center text-xs text-gray-400 font-sans tracking-wide">
              Scroll down to flip through our memories ✨
            </div>
          </div>
        </div>
      </div>

      {/* Replay Surprise Block (Appears after sticky container releases) */}
      <div className="w-full py-20 px-4 flex flex-col items-center justify-center relative z-20">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-pink-100 shadow-xl text-center flex flex-col items-center justify-center">
          <h3 className="font-script text-3xl md:text-4xl text-[#D38B9C] mb-3">
            {STORY_CONTINUES.heading}
          </h3>
          <p className="font-sans text-xs md:text-sm text-gray-600 mb-6 max-w-xs leading-relaxed">
            {STORY_CONTINUES.subheading}
          </p>

          <button
            onClick={onReplay}
            className="flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay surprise</span>
          </button>
        </div>
      </div>
    </div>
  );
}
