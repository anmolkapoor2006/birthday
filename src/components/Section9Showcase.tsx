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
 * Animates ONLY transform GPU properties (y, scale, rotate) driven by normalized scroll progress.
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

  // Card 0 is visible at y:0; cards 1..N slide up smoothly from y:100% to 0%
  const y = useTransform(
    scrollYProgress,
    index === 0 ? [0, 1] : [start - step * 0.4, start],
    index === 0 ? ['0%', '0%'] : ['100%', '0%']
  );

  // Active card scales to 1; as next card enters, scale down to 0.75
  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [1, index === total - 1 ? 1 : 0.75]
  );

  // Rotate slightly alternating (+3.5deg / -3.5deg) as card recedes
  const rotate = useTransform(
    scrollYProgress,
    [start, end],
    [0, index === total - 1 ? 0 : index % 2 === 0 ? 3.5 : -3.5]
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        rotate,
        zIndex: index,
      }}
      className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white border border-pink-100 shadow-xl shadow-pink-200/40 transform-gpu will-change-transform"
    >
      <div className="w-full h-full relative bg-pink-50">
        <Image
          src={photo.imageUrl}
          alt={`Showcase memory ${index + 1}`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 380px, 600px"
          priority={index === 0}
          unoptimized
        />
        {/* Lighting Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-200/10 pointer-events-none z-10" />
        <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
      </div>
    </motion.div>
  );
}

/**
 * Skiper UI Exact Scroll Architecture Implementation
 * 1. Single outer wrapper with calculated height (photos.length * 60vh)
 * 2. Inner sticky container (position: sticky; top: 0; height: 100vh)
 * 3. Animated GPU transforms driven by normalized scroll progress
 * 4. Natural release after last card into normal document page scroll
 * 5. Exactly ONE page scrollbar, 0 overflow hacks, 0 nested scroll containers
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
}: Section9ShowcaseProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const totalPhotos = photos.length;

  // Normalized scroll progress (0 -> 1) scoped strictly to targetRef
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div className="w-full relative select-none">
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

          {/* Middle Card Stack Frame */}
          <div className="sticky-cards-container relative flex h-[54vh] max-h-[480px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl aspect-[16/10] items-center justify-center my-auto p-2 overflow-hidden rounded-3xl z-10 flex-shrink-0">
            
            {/* Ambient Soft Glow */}
            <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-pink-300/30 via-rose-200/40 to-purple-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div
              className={cn(
                'relative h-full w-full aspect-[16/10] overflow-hidden rounded-3xl z-10',
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

          {/* Footer Hint inside sticky section */}
          <div className="h-[40px] flex-shrink-0 w-full flex items-center justify-center relative z-20 pb-2">
            <div className="text-center text-xs text-gray-400 font-sans tracking-wide">
              Scroll down to flip through our memories ✨
            </div>
          </div>
        </div>
      </div>

      {/* 3. Replay Surprise Block (Normal Document Flow - Appears after sticky container releases) */}
      <div className="w-full py-20 px-4 flex flex-col items-center justify-center relative z-20 bg-gradient-to-b from-transparent to-pink-50/50">
        <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl text-center flex flex-col items-center justify-center">
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
