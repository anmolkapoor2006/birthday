'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis } from 'lenis/react';
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
 * Skiper 17 / StickyCard002 — Built with GSAP ScrollTrigger + Lenis
 * Cards slide up one by one, while previous card scales down (0.7) & rotates (5deg).
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

      // Initial states
      gsap.set(imageElements[0], { y: '0%', scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: '100%', scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.sticky-cards-container',
          start: 'top top',
          end: `+=${window.innerHeight * (totalCards * 0.85)}`,
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

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <ReactLenis root options={{ duration: 1.2, lerp: 0.08, smoothWheel: true }}>
      <div className={cn('relative w-full select-none', className)} ref={container}>
        {/* Section Title Header */}
        <div className="pt-12 pb-6 text-center z-20 relative">
          <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C] flex items-center justify-center gap-2">
            <span>Favorite Frames</span>
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Scroll down to watch our photos flip & reveal ✨
          </p>
        </div>

        {/* Sticky Cards Pin Area */}
        <div className="sticky-cards-container relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden p-3 lg:p-8">
          
          {/* Subtle Ambient Gradient Glow behind photos */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[540px] md:h-[540px] bg-gradient-to-tr from-pink-300/40 via-purple-200/40 to-rose-300/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-[460px] md:h-[460px] bg-gradient-to-br from-rose-400/25 via-pink-300/35 to-amber-200/30 rounded-full blur-2xl pointer-events-none" />

          <div
            className={cn(
              'relative h-[60vh] max-h-[520px] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl aspect-[16/10] overflow-hidden rounded-3xl bg-transparent shadow-2xl shadow-pink-200/60 border border-pink-100/80 z-10',
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
                <div className="w-full h-full relative">
                  <Image
                    src={photo.imageUrl}
                    alt="Showcase photo"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 380px, 420px"
                    priority={i === 0}
                  />
                  {/* Romantic Warm Golden Lighting Overlay & Soft Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-amber-200/10 pointer-events-none z-10" />
                  <div className="absolute inset-0 shadow-[inset_0_0_25px_rgba(224,139,166,0.3)] pointer-events-none z-10 rounded-3xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Replay Surprise Section at bottom */}
        <div className="py-20 flex flex-col items-center justify-center relative z-20">
          <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl text-center flex flex-col items-center justify-center">
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
    </ReactLenis>
  );
}
