'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Flower, Sparkle, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WISH_CARDS } from '@/constants/content';
import { playCardFlipSound } from '@/utils/audio';
import { triggerHapticFeedback } from '@/utils/haptics';

interface Section4WishesProps {
  onContinue: () => void;
}

export default function Section4Wishes({ onContinue }: Section4WishesProps) {
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  const handleCardClick = (id: number) => {
    triggerHapticFeedback(15);
    playCardFlipSound();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getIcon = (iconName: string) => {
    const className = "w-10 h-10 transition-transform duration-300";
    switch (iconName) {
      case 'heart':
        return <Heart className={`${className} text-pink-400 fill-pink-300/40`} />;
      case 'star':
        return <Star className={`${className} text-[#C5A059] fill-[#F9E2AF]/40`} />;
      case 'flower':
        return <Flower className={`${className} text-purple-400 fill-purple-300/40`} />;
      case 'sparkle':
        return <Sparkle className={`${className} text-yellow-500 fill-yellow-300/40`} />;
      default:
        return <Heart className={`${className} text-pink-400`} />;
    }
  };

  const revealedCount = Object.values(flippedCards).filter(Boolean).length;
  const totalCards = WISH_CARDS.length;
  const allRevealed = revealedCount === totalCards;

  useEffect(() => {
    if (allRevealed && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFC0CB', '#D8B4FE', '#FDE047', '#93C5FD'],
      });
    }
  }, [allRevealed, hasTriggeredConfetti]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-12 relative z-10 select-none">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C]">
          Wishes For You ✨
        </h2>
        <p className="font-sans text-xs text-gray-500 mt-2 tracking-wide uppercase">
          Tap each card to reveal a special wish
        </p>
      </motion.div>

      {/* Cards Deck / Stack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl justify-items-center mb-10">
        {WISH_CARDS.map((card, idx) => {
          const isFlipped = !!flippedCards[card.id];

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="w-64 h-48 md:w-48 md:h-64 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {/* CARD FRONT */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#FFF0F2] via-white to-[#FDF5F7] border border-pink-200/50 rounded-2xl p-6 shadow-md flex flex-col justify-between items-center text-center"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div
                      animate={!isFlipped ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                      className="p-4 bg-pink-50/50 rounded-full"
                    >
                      {getIcon(card.icon)}
                    </motion.div>
                  </div>
                  <p className="text-xs font-semibold text-[#D38B9C] tracking-wider uppercase mt-2">
                    {card.frontText}
                  </p>
                </div>

                {/* CARD BACK */}
                <div
                  className="absolute inset-0 bg-white border border-[#DFBA6B]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-center items-center text-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Small gold sparkle indicator on back */}
                  <div className="text-[#C5A059] text-xs mb-2">✦ ✦ ✦</div>
                  <p className="font-sans text-xs md:text-sm text-gray-700 leading-relaxed font-light whitespace-pre-line">
                    {card.backText}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex space-x-2">
          {WISH_CARDS.map((card) => (
            <motion.div
              key={card.id}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                flippedCards[card.id] ? 'w-6 bg-pink-400' : 'w-2.5 bg-pink-200'
              }`}
              layout
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 font-sans tracking-widest uppercase">
          {revealedCount} of {totalCards} wishes revealed
        </p>
      </div>

      {/* Continue Button (fades in only when all wishes are revealed) */}
      <div className="h-16 mt-8 flex items-center justify-center">
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <button
              onClick={onContinue}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer animate-pulse"
            >
              <span>Make a wish & cut cake</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

    </div>
  );
}
