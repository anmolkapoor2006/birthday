'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronRight as ContinueIcon } from 'lucide-react';
import Image from 'next/image';
import { GALLERY_PHOTOS } from '@/constants/content';

interface Section3GalleryProps {
  onContinue: () => void;
}

export default function Section3Gallery({ onContinue }: Section3GalleryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [zIndices, setZIndices] = useState<number[]>(() => GALLERY_PHOTOS.map((_, i) => i + 1));

  const bringToFront = (index: number) => {
    setZIndices((prev) => {
      const currentMax = Math.max(...prev, GALLERY_PHOTOS.length);
      if (currentMax > 30) {
        const sorted = [...prev].map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
        const next = new Array(prev.length);
        sorted.forEach((item, rank) => {
          next[item.i] = rank + 1;
        });
        next[index] = prev.length + 1;
        return next;
      }
      const next = [...prev];
      next[index] = currentMax + 1;
      return next;
    });
  };

  const openLightbox = (index: number) => {
    bringToFront(index);
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex === null) return;
    const nextIdx = activePhotoIndex < GALLERY_PHOTOS.length - 1 ? activePhotoIndex + 1 : 0;
    bringToFront(nextIdx);
    setActivePhotoIndex(nextIdx);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex === null) return;
    const prevIdx = activePhotoIndex > 0 ? activePhotoIndex - 1 : GALLERY_PHOTOS.length - 1;
    bringToFront(prevIdx);
    setActivePhotoIndex(prevIdx);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4 py-8 relative z-10 select-none">
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6"
      >
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C]">
          Moments of You 📸❤️
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
          Toss them, rearrange them, or tap to enlarge and look closer
        </p>
      </motion.div>

      {/* Scattered Polaroid Desk Container */}
      <div className="relative w-full max-w-md h-[400px] md:h-[460px] flex items-center justify-center overflow-visible border border-dashed border-pink-100 rounded-2xl bg-[#FFFBFB]/40 p-4">
        
        {GALLERY_PHOTOS.map((photo, index) => {
          // Semi-randomized coordinates based on index to scatter them beautifully
          const offsetX = (index - 2.5) * 18; // spread out X
          const offsetY = (index % 2 === 0 ? -1 : 1) * 15; // wiggle Y
          
          return (
            <motion.div
              key={photo.id}
              drag
              dragConstraints={{ left: -140, right: 140, top: -140, bottom: 140 }}
              dragElastic={0.2}
              whileDrag={{ scale: 1.08, rotate: 0 }}
              onDragStart={() => bringToFront(index)}
              onPointerDown={() => bringToFront(index)}
              initial={{ opacity: 0, scale: 0.8, rotate: photo.rotation * 3 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: photo.rotation,
                x: offsetX,
                y: offsetY,
                zIndex: zIndices[index] || index + 1
              }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 80 }}
              onTap={() => openLightbox(index)}
              className="absolute w-44 h-56 md:w-48 md:h-60 bg-white p-3 rounded-sm shadow-md border border-gray-100 cursor-grab active:cursor-grabbing flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="w-full h-full overflow-hidden bg-gray-50 rounded-sm relative pointer-events-none">
                <Image
                  src={photo.imageUrl}
                  alt="Memory photo"
                  fill
                  className="object-cover"
                  sizes="192px"
                  loading="lazy"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} // don't close when tapping card
              className="relative w-full max-w-sm bg-white p-4 rounded-lg shadow-2xl flex flex-col justify-between"
            >
              {/* Navigation Arrows */}
              <button
                onClick={prevPhoto}
                className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg cursor-pointer transition-colors z-20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg cursor-pointer transition-colors z-20"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Polaroid Image */}
              <div className="w-full h-80 md:h-96 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 relative">
                <Image
                  src={GALLERY_PHOTOS[activePhotoIndex].imageUrl}
                  alt="Memory photo"
                  fill
                  className="object-cover"
                  sizes="384px"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-8 z-10"
      >
        <button
          onClick={onContinue}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <span>Reveal wishes</span>
          <ContinueIcon className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
