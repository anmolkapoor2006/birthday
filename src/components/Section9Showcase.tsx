'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
 * Skiper 17 / StickyCard002 — Pinned Single Viewport Photo Stack
 * Cards slide up one by one in a single viewport card frame, while previous cards scale down & rotate.
 */
export default function Section9Showcase({
  onReplay,
  photos = SHOWCASE_PHOTOS,
  className,
  containerClassName,
  imageClassName,
}: Section9ShowcaseProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current.filter(Boolean);
      const totalCards = imageElements.length;

      if (!imageElements[0] || totalCards === 0) return;

      // Initial state: Card 0 is visible, all other cards are below the frame
      gsap.set(imageElements[0], { y: '0%', scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: '100%', scale: 1, rotation: 0 });
      }

      // Smooth scroll timeline with exact scroll distance
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.sticky-cards-container',
          start: 'top top+=60',
          end: `+=${totalCards * 320}`,
          pin: true,
          scrub: 1.0,
          pinSpacing: true,
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
            scale: 0.8,
            rotation: i % 2 === 0 ? 3 : -3,
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

      // Refresh ScrollTrigger after DOM renders
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        clearTimeout(timer);
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className={cn('relative w-full select-none', className)} ref={container}>
      {/* Section Title Header */}
      <div className="pt-10 pb-4 text-center z-20 relative">
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
          <span>Favorite Frames</span>
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-1">
          Scroll down to watch our photos flip & reveal ✨
        </p>
      </div>

      {/* Pinned Single Viewport Photo Card Stack */}
      <div className="sticky-cards-container relative flex min-h-[75vh] md:min-h-[80vh] w-full items-center justify-center overflow-hidden p-3 lg:p-6">
        
        {/* Ambient Gradient Glow behind photo card frame */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-gradient-to-tr from-pink-300/35 via-purple-200/35 to-rose-300/35 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div
          className={cn(
            'relative h-[55vh] max-h-[500px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl aspect-[16/10] overflow-hidden rounded-3xl bg-transparent shadow-2xl shadow-pink-200/60 border border-pink-100/80 z-10',
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-amber-200/10 pointer-events-none z-10" />
                <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replay Surprise Section at bottom */}
      <div className="py-16 flex flex-col items-center justify-center relative z-20">
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
