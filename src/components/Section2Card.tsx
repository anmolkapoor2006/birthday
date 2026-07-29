'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GREETINGS, Song } from '@/constants/content';
import SongSelector from './SongSelector';

interface Section2CardProps {
  onContinue: () => void;
  currentSong: Song;
  setCurrentSong: (song: Song) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  seekAudio: (percent: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export default function Section2Card({
  onContinue,
  currentSong,
  setCurrentSong,
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  seekAudio,
  volume,
  setVolume,
}: Section2CardProps) {
  const [isCardOpened, setIsCardOpened] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-8 relative z-10 select-none">
      
      {/* 3D Card Container */}
      <div 
        className="relative w-full max-w-sm h-[400px] md:h-[440px] mb-8 cursor-pointer"
        style={{ perspective: '1500px' }}
        onClick={() => !isCardOpened && setIsCardOpened(true)}
      >
        {/* The Greeting Card — flips on Y axis */}
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={isCardOpened ? { rotateY: -180 } : { rotateY: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* ── FRONT COVER ── */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#FFE3E8] to-[#FFF0F2] rounded-2xl shadow-xl border border-pink-200/50 p-6 flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="border-2 border-dashed border-[#DFBA6B]/50 h-full rounded-xl p-4 flex flex-col justify-between items-center text-center">
              <span className="text-[#C5A059] text-sm tracking-widest font-semibold uppercase mt-4">
                Especially for You
              </span>
              
              <div className="flex flex-col items-center">
                <motion.div 
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="text-pink-400 text-5xl mb-4"
                >
                  💝
                </motion.div>
                <h2 className="font-script text-3xl text-[#D38B9C]">
                  Tap to Open Card
                </h2>
              </div>

              <div className="w-10 h-0.5 bg-[#DFBA6B]/30 mb-4" />
            </div>
          </div>

          {/* ── BACK FACE (message — revealed on flip) ── */}
          <div 
            className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-[#FFE3E8] p-6 flex flex-col justify-between"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Card Message */}
            <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
              <h2 className="font-script text-3xl md:text-4xl text-[#D38B9C] mb-3">
                {GREETINGS.title}
              </h2>
              <p className="text-[#C5A059] font-sans text-xs uppercase tracking-widest font-medium mb-3">
                {GREETINGS.subtitle}
              </p>
              <p className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
                {GREETINGS.message}
              </p>
            </div>

            {/* Decorative footer */}
            <div className="flex justify-center text-[#FFE3E8] text-2xl">
              🌸 💖 🌸
            </div>
          </div>
        </motion.div>
      </div>

      {/* Audio Player — fades in after card opens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isCardOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-full max-w-sm flex justify-center"
      >
        <SongSelector
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          seekAudio={seekAudio}
          volume={volume}
          setVolume={setVolume}
        />
      </motion.div>

      {/* Navigation Continue Button */}
      {isCardOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={onContinue}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <span>Continue the surprise</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

    </div>
  );
}
