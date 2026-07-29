'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music, ChevronRight } from 'lucide-react';
import { GREETINGS, MUSIC_TRACK } from '@/constants/content';

interface Section2CardProps {
  onContinue: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  seekAudio: (percent: number) => void;
}

export default function Section2Card({
  onContinue,
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  seekAudio,
}: Section2CardProps) {
  const [isCardOpened, setIsCardOpened] = useState(false);

  // Format time (e.g., 01:23)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    seekAudio(percent);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-10 relative z-10 select-none">
      
      {/* 3D Card Container */}
      <div 
        className="relative w-full max-w-sm h-[400px] md:h-[440px] mb-8 cursor-pointer"
        style={{ perspective: '1500px' }}
        onClick={() => !isCardOpened && setIsCardOpened(true)}
      >
        {/* The Greeting Card */}
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={isCardOpened ? { rotateY: -150 } : { rotateY: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* FRONT COVER (Visible before opened) */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#FFE3E8] to-[#FFF0F2] rounded-2xl shadow-xl border border-pink-200/50 p-6 flex flex-col justify-between"
            style={{ 
              backfaceVisibility: 'hidden',
              zIndex: 2 
            }}
          >
            {/* Elegant Cover Design */}
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

          {/* INSIDE LEFT (The reverse of the front cover - acts as card spine/inside blank/pastel page) */}
          <div 
            className="absolute inset-0 bg-[#FFF3F5] rounded-2xl border border-pink-100 p-6 flex items-center justify-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)',
              zIndex: 1 
            }}
          >
            <div className="text-center p-4">
              <p className="font-script text-2xl text-pink-300">With Love</p>
              <p className="text-xs text-gray-400 font-sans tracking-widest mt-2 uppercase">Anmol</p>
            </div>
          </div>
        </motion.div>

        {/* INSIDE RIGHT (Static back page - visible once front cover rotates away) */}
        <div 
          className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-[#FFE3E8] p-6 flex flex-col justify-between -z-10"
          style={{ transform: 'translateZ(-1px)' }}
        >
          {/* Card Message */}
          <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
            <h2 className="font-script text-3xl md:text-4xl text-[#D38B9C] mb-4">
              {GREETINGS.title}
            </h2>
            <p className="text-[#C5A059] font-sans text-xs uppercase tracking-widest font-medium mb-4">
              {GREETINGS.subtitle}
            </p>
            <p className="font-sans text-sm md:text-base text-gray-600 leading-relaxed font-light">
              {GREETINGS.message}
            </p>
          </div>

          {/* Miniature Floating Heart Accent */}
          <div className="flex justify-center text-[#FFE3E8] text-2xl">
            🌸 💖 🌸
          </div>
        </div>
      </div>

      {/* Audio Player Component (Fades in / pops up when card is open) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isCardOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-[#FFE3E8] p-4 flex items-center space-x-4"
      >
        {/* Album Art Cover */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-inner flex-shrink-0 bg-pink-100 flex items-center justify-center">
          {MUSIC_TRACK.albumArtUrl ? (
            <img 
              src={MUSIC_TRACK.albumArtUrl} 
              alt="Album Art" 
              className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'rotate-album' : ''}`}
            />
          ) : (
            <Music className="w-8 h-8 text-pink-300" />
          )}
          {/* Vinyl center hole look */}
          <div className="absolute w-3 h-3 bg-white border border-pink-200 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Track details & custom controls */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{MUSIC_TRACK.title}</h3>
          <p className="text-xs text-gray-500 truncate mb-2">{MUSIC_TRACK.artist}</p>
          
          {/* Custom Progress Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-gray-400 font-mono w-8">{formatTime(currentTime)}</span>
            <div 
              onClick={handleProgressBarClick}
              className="flex-1 h-1.5 bg-[#FFF0F2] rounded-full cursor-pointer relative overflow-hidden"
            >
              <div 
                className="h-full bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-mono w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play/Pause pill-circle button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#FFE3E8] hover:bg-[#FFD3DC] transition-colors flex items-center justify-center text-[#D38B9C] focus:outline-none flex-shrink-0 cursor-pointer shadow-sm"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>
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
      
      {/* Vinyl record rotation animation styling */}
      <style jsx global>{`
        @keyframes rotateAlbum {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rotate-album {
          animation: rotateAlbum 12s linear infinite;
        }
      `}</style>

    </div>
  );
}
