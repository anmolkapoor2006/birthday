'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronRight as ContinueIcon, HelpCircle } from 'lucide-react';
import { GALLERY_PHOTOS } from '@/constants/content';

interface Section3GalleryProps {
  onContinue: () => void;
}

export default function Section3Gallery({ onContinue }: Section3GalleryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev !== null && prev < GALLERY_PHOTOS.length - 1 ? prev + 1 : 0));
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_PHOTOS.length - 1));
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
          Our Memory Lane 📸
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
              whileDrag={{ scale: 1.08, zIndex: 40, rotate: 0 }}
              initial={{ opacity: 0, scale: 0.8, rotate: photo.rotation * 3 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: photo.rotation,
                x: offsetX,
                y: offsetY
              }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 80 }}
              // Framer Motion onTap is perfect here because it won't trigger if the user was dragging
              onTap={() => openLightbox(index)}
              className="absolute w-44 h-56 md:w-48 md:h-60 bg-white p-3 rounded-sm shadow-md border border-gray-100 cursor-grab active:cursor-grabbing flex flex-col justify-between"
            >
              {/* Photo Area */}
              <div className="w-full h-[76%] overflow-hidden bg-gray-50 rounded-sm relative pointer-events-none">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Caption Area (Polaroid style spacing) */}
              <div className="h-[20%] flex items-center justify-center pointer-events-none">
                <p className="font-script text-xs md:text-sm text-gray-700 text-center truncate px-1">
                  {photo.caption}
                </p>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4"
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
                className="absolute left-[-20px] md:left-[-50px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-[-20px] md:right-[-50px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg cursor-pointer transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Polaroid Image */}
              <div className="w-full h-80 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                <img
                  src={GALLERY_PHOTOS[activePhotoIndex].imageUrl}
                  alt={GALLERY_PHOTOS[activePhotoIndex].caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Polaroid Caption */}
              <div className="mt-4 py-2 text-center border-t border-gray-50">
                <p className="font-script text-base md:text-lg text-[#D38B9C]">
                  {GALLERY_PHOTOS[activePhotoIndex].caption}
                </p>
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
