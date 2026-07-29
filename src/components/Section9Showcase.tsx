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
 * Skiper 17 / StickyCard002 — Official Skiper UI 17 Effect (Viewport-Locked)
 * Cards slide up one by one, while previous card scales down (0.75) & rotates (3.5deg).
 * Locked to screen height so the entire website background NEVER scrolls out of view!
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

      // Initial states: Card 0 is visible, all others start below the frame
      gsap.set(imageElements[0], { y: '0%', scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: '100%', scale: 1, rotation: 0 });
      }

      // Exact Skiper 17 GSAP timeline
      const scrollTimeline = gsap.timeline({
        paused: true,
        onUpdate: () => {
          if (scrollTimeline.progress() >= 0.98) {
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

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.75,
            rotation: i % 2 === 0 ? 3.5 : -3.5,
            duration: 1,
            ease: 'power2.out',
          },
          position
        );

        scrollTimeline.to(
          nextImage,
          {
            y: '0%',
            duration: 1,
            ease: 'power2.out',
          },
          position
        );
      }

      timelineRef.current = scrollTimeline;

      return () => {
        scrollTimeline.kill();
      };
    },
    { scope: containerRef }
  );

  // Lock outer document body scrolling & handle native non-passive wheel/touch events
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevDocOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const timeline = timelineRef.current;
      if (!timeline) return;

      // Ultra-slow trackpad dampening formula (max step of 0.0015 per scroll event)
      const step = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.00008, 0.0015);
      const targetProgress = Math.max(0, Math.min(1, progressRef.current + step));
      progressRef.current = targetProgress;

      gsap.to(timeline, {
        progress: targetProgress,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const timeline = timelineRef.current;
      if (!timeline) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      touchStartY.current = currentY;

      const step = Math.sign(deltaY) * Math.min(Math.abs(deltaY) * 0.00008, 0.0015);
      const targetProgress = Math.max(0, Math.min(1, progressRef.current + step));
      progressRef.current = targetProgress;

      gsap.to(timeline, {
        progress: targetProgress,
        duration: 1.0,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevDocOverflow;

      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ touchAction: 'none' }}
      className={cn(
        'flex flex-col items-center justify-between h-[100dvh] w-full px-4 py-6 relative z-10 select-none overflow-hidden touch-none',
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

      {/* Sticky Cards Pin Area */}
      <div className="sticky-cards-container relative flex h-[58vh] max-h-[500px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl items-center justify-center my-auto p-2">
        
        {/* Soft Ambient Floating Gradient Glow */}
        <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-pink-300/30 via-rose-200/40 to-purple-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute w-72 h-72 sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-rose-300/20 via-pink-200/30 to-amber-100/30 rounded-full blur-2xl pointer-events-none" />

        <div
          className={cn(
            'relative h-full w-full aspect-[16/10] z-10',
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
                'absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-white border border-pink-100/70 shadow-xl shadow-pink-200/40 transform-gpu will-change-transform',
                imageClassName
              )}
            >
              {/* Photo Image */}
              <div className="w-full h-full relative">
                <Image
                  src={photo.imageUrl}
                  alt="Showcase photo"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 380px, 420px"
                  priority={i === 0}
                  unoptimized
                />
                {/* Romantic Warm Golden Lighting Overlay & Soft Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-200/10 pointer-events-none z-10" />
                <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed-Height Footer (prevents middle card deck from shrinking/compressing on last photo) */}
      <div className="h-[140px] min-h-[140px] flex-shrink-0 w-full max-w-md flex flex-col items-center justify-center relative z-20 px-2 pb-2">
        {isCompleted ? (
          <div className="w-full p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-pink-100 shadow-lg text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <h3 className="font-script text-2xl text-[#D38B9C] mb-1">
              {STORY_CONTINUES.heading}
            </h3>
            <p className="font-sans text-[11px] text-gray-600 mb-3 max-w-xs leading-tight">
              {STORY_CONTINUES.subheading}
            </p>

            <button
              onClick={onReplay}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-xs rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
