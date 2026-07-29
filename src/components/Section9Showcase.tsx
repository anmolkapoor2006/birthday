'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
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
 * Skiper 17 / StickyCard002 — Viewport-Locked Smooth Scroll Card Stack
 * Exact original GSAP card sliding/scaling/rotation effect, but 100% locked to screen height
 * so the entire website background DOES NOT scroll!
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
  imageClassName,
}: Section9ShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef(0);
  const touchStartY = useRef(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useGSAP(
    () => {
      const imageElements = imageRefs.current.filter(Boolean);
      const totalCards = imageElements.length;

      if (!imageElements[0] || totalCards === 0) return;

      // Set initial states: Card 0 is visible, all others start below the frame
      gsap.set(imageElements[0], { y: '0%', scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: '100%', scale: 1, rotation: 0 });
      }

      // Master GSAP Timeline scrubbed smoothly by wheel/touch
      const timeline = gsap.timeline({
        paused: true,
        onUpdate: () => {
          if (timeline.progress() >= 0.98) {
            setIsCompleted(true);
          } else {
            setIsCompleted(false);
          }
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;

        if (!currentImage || !nextImage) continue;

        timeline.to(
          currentImage,
          {
            scale: 0.75,
            rotation: i % 2 === 0 ? 3.5 : -3.5,
            duration: 1,
            ease: 'power2.out',
          },
          position
        );

        timeline.to(
          nextImage,
          {
            y: '0%',
            duration: 1,
            ease: 'power2.out',
          },
          position
        );
      }

      timelineRef.current = timeline;

      return () => {
        timeline.kill();
      };
    },
    { scope: containerRef }
  );

  // Smooth wheel scroll progress controller
  const handleWheel = (e: React.WheelEvent) => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    // Delta progress step per scroll notch
    const delta = e.deltaY > 0 ? 0.045 : -0.045;
    const targetProgress = Math.max(0, Math.min(1, progressRef.current + delta));
    progressRef.current = targetProgress;

    gsap.to(timeline, {
      progress: targetProgress,
      duration: 0.35,
      ease: 'power1.out',
      overwrite: true,
    });
  };

  // Mobile touch gesture progress controller
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY;
    touchStartY.current = currentY;

    const delta = deltaY > 0 ? 0.03 : -0.03;
    const targetProgress = Math.max(0, Math.min(1, progressRef.current + delta));
    progressRef.current = targetProgress;

    gsap.to(timeline, {
      progress: targetProgress,
      duration: 0.25,
      ease: 'power1.out',
      overwrite: true,
    });
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={cn(
        'flex flex-col items-center justify-between min-h-[100dvh] w-full px-4 py-6 relative z-10 select-none overflow-hidden touch-none',
        className
      )}
    >
      {/* Section Title Header */}
      <div className="pt-4 pb-2 text-center z-20 relative">
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
          <span>Favorite Frames</span>
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-1">
          Scroll down to watch our photos flip & reveal ✨
        </p>
      </div>

      {/* Pinned Viewport Card Stack Container */}
      <div className="sticky-cards-container relative flex h-[58vh] max-h-[500px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl items-center justify-center overflow-hidden my-auto p-2">
        
        {/* Ambient Glows */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-gradient-to-tr from-pink-300/40 via-purple-200/40 to-rose-300/40 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div
          className={cn(
            'relative h-full w-full aspect-[16/10] overflow-hidden rounded-3xl bg-transparent shadow-2xl shadow-pink-200/60 border border-pink-100/80 z-10',
            containerClassName
          )}
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className={cn(
                'absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white border border-pink-100 shadow-md transform-gpu will-change-transform',
                imageClassName
              )}
            >
              {/* Photo Image */}
              <div className="w-full h-full relative bg-pink-50">
                <Image
                  src={photo.imageUrl}
                  alt={`Showcase memory ${i + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 380px, 600px"
                  priority={i === 0}
                  unoptimized
                />
                {/* Lighting Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-200/10 pointer-events-none z-10" />
                <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replay Surprise Section at bottom */}
      <div className="pb-6 pt-2 flex flex-col items-center justify-center relative z-20">
        {isCompleted ? (
          <div className="w-full max-w-md p-6 bg-white/90 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <h3 className="font-script text-2xl md:text-3xl text-[#D38B9C] mb-2">
              {STORY_CONTINUES.heading}
            </h3>
            <p className="font-sans text-xs text-gray-600 mb-4 max-w-xs leading-relaxed">
              {STORY_CONTINUES.subheading}
            </p>

            <button
              onClick={onReplay}
              className="flex items-center space-x-2 px-7 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-xs rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
