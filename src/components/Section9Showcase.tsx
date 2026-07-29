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
 * Single Showcase Card Component driven by Framer Motion scroll progress.
 * Animates GPU transforms (translate3d, scale, rotate) cleanly without React re-renders.
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

  // Card 0 is visible from start; other cards slide up from y: 100% to 0%
  const y = useTransform(
    scrollYProgress,
    index === 0 ? [0, 1] : [start - step * 0.5, start],
    index === 0 ? ['0%', '0%'] : ['100%', '0%']
  );

  // Active card scales to 1; as next card enters, scale down to 0.75 and rotate
  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [1, index === total - 1 ? 1 : 0.75]
  );

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
      className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white border border-pink-100/80 shadow-xl shadow-pink-200/40 transform-gpu will-change-transform"
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
        {/* Romantic Warm Golden Lighting Overlay & Soft Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-200/10 pointer-events-none z-10" />
        <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
      </div>
    </motion.div>
  );
}

/**
 * Skiper 17 — Production-Ready Sticky Scroll Showcase
 * Uses native CSS position: sticky + Framer Motion useScroll for 60 FPS performance,
 * single page scrollbar, zero page locks, and smooth natural release.
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
}: Section9ShowcaseProps) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const totalPhotos = photos.length;

  // Native scroll progress clamped between 0 and 1
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Replay box opacity fade in on last photo
  const replayOpacity = useTransform(
    scrollYProgress,
    [0.92, 0.98],
    [0, 1]
  );

  return (
    <div
      ref={targetRef}
      style={{ height: `${totalPhotos * 65}vh` }}
      className={cn('relative w-full select-none', className)}
    >
      {/* Native Sticky Container (Pins at top: 0 during outer scroll, releases naturally) */}
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

        {/* Middle Photo Card Stack Container */}
        <div className="sticky-cards-container relative flex h-[46vh] max-h-[380px] md:max-h-[420px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl aspect-[16/10] items-center justify-center my-auto p-2 overflow-hidden rounded-3xl border border-pink-100/60 shadow-2xl shadow-pink-200/50 bg-white/40 backdrop-blur-xs z-10 flex-shrink-0">
          
          {/* Ambient Soft Floating Gradient Glow */}
          <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-pink-300/30 via-rose-200/40 to-purple-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute w-72 h-72 sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-rose-300/20 via-pink-200/30 to-amber-100/30 rounded-full blur-2xl pointer-events-none" />

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

        {/* Footer with Replay Surprise */}
        <div className="h-[90px] min-h-[90px] flex-shrink-0 w-full max-w-md flex flex-col items-center justify-center relative z-20 px-2 pb-2">
          <motion.div style={{ opacity: replayOpacity }} className="w-full">
            <div className="w-full p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-pink-100 shadow-lg text-center flex flex-col items-center justify-center">
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
