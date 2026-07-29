'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
 * Section9Showcase — Ultra Smooth Native Sticky Photo Card Stack
 * Uses native CSS position: sticky + Framer Motion for 100% glitch-free 60fps performance on all devices.
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
  imageClassName,
}: Section9ShowcaseProps) {
  return (
    <div className={cn('relative w-full max-w-4xl mx-auto px-4 py-12 select-none', className)}>
      {/* Section Title Header */}
      <div className="text-center z-20 relative mb-12">
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
          <span>Favorite Frames</span>
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
        </h2>
        <p className="font-sans text-xs md:text-sm text-gray-500 mt-1">
          Scroll down to stack & reveal our special memories 📸✨
        </p>
      </div>

      {/* Sticky Photo Cards Stack Area */}
      <div className="relative w-full flex flex-col items-center justify-center space-y-16 md:space-y-24 pb-20">
        
        {/* Subtle Ambient Background Glows */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-pink-300/30 via-purple-200/30 to-rose-300/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {photos.map((photo, index) => {
          // Slight alternating rotation for a romantic scatter stack effect
          const rotationDegree = (index % 4 - 1.5) * 2.5;

          return (
            <div
              key={photo.id}
              className="sticky top-20 sm:top-24 md:top-28 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl transition-all duration-300"
              style={{
                zIndex: index + 1,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-pink-200/50 border-4 border-white transform-gpu transition-transform duration-300 hover:scale-[1.02]',
                  containerClassName,
                  imageClassName
                )}
                style={{
                  transform: `rotate(${rotationDegree}deg)`,
                }}
              >
                {/* Photo Image */}
                <div className="w-full h-full relative bg-pink-50">
                  <Image
                    src={photo.imageUrl}
                    alt={`Showcase memory ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 672px"
                    priority={index < 3}
                    unoptimized
                  />
                  
                  {/* Subtle Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-amber-200/10 pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(224,139,166,0.2)] pointer-events-none rounded-3xl" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Replay Surprise Section at bottom */}
      <div className="py-16 flex flex-col items-center justify-center relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-md p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl text-center flex flex-col items-center justify-center"
        >
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
        </motion.div>
      </div>
    </div>
  );
}
