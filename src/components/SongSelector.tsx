'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ListMusic, Music, Heart, Volume2, VolumeX } from 'lucide-react';
import { songs, Song } from '@/constants/content';

interface SongSelectorProps {
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

export default function SongSelector({
  currentSong,
  setCurrentSong,
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  seekAudio,
  volume,
  setVolume,
}: SongSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSongSelect = (song: Song) => {
    if (song.id === currentSong.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setIsOpen(false);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    seekAudio(percent);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-[#FFE3E8] p-4 flex flex-col space-y-3 relative z-20">
      
      {/* Upper Control Bar */}
      <div className="flex items-center space-x-3.5">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#FFE3E8] hover:bg-[#FFD3DC] transition-colors flex items-center justify-center text-[#D38B9C] focus:outline-none flex-shrink-0 cursor-pointer shadow-xs"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Track Title and Artist */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {currentSong.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {currentSong.artist}
          </p>
        </div>

        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
            isOpen ? 'bg-[#FFD3DC] text-[#D38B9C]' : 'bg-[#FFF0F2] text-[#D38B9C] hover:bg-[#FFE3E8]'
          }`}
        >
          <ListMusic className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-2 px-1">
        <span className="text-[9px] text-gray-400 font-mono w-7">{formatTime(currentTime)}</span>
        <div
          onClick={handleProgressBarClick}
          className="flex-1 h-1.5 bg-[#FFF0F2] rounded-full cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-pink-300 to-pink-400 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[9px] text-gray-400 font-mono w-7">{formatTime(duration)}</span>
      </div>

      {/* Volume Control Bar */}
      <div className="flex items-center space-x-2 px-1 pt-1 border-t border-[#FFE3E8]/50">
        <button
          onClick={() => setVolume(volume === 0 ? 0.1 : 0)}
          className="text-[#D38B9C] hover:text-pink-600 cursor-pointer focus:outline-none flex-shrink-0"
          title="Toggle Mute"
        >
          {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-[#FFF0F2] rounded-lg appearance-none cursor-pointer accent-[#D38B9C]"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
        <span className="text-[9px] text-gray-400 font-mono w-6 text-right flex-shrink-0">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Dropdown Playlist Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[#FFE3E8]/40 pt-2"
          >
            <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {songs.map((song) => {
                const isActive = song.id === currentSong.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => handleSongSelect(song)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-pink-50 text-[#D38B9C]'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold truncate">{song.title}</p>
                      <p className="text-[10px] text-gray-500 truncate">{song.artist}</p>
                    </div>
                    {isActive ? (
                      <Heart className="w-3 h-3 text-pink-400 fill-pink-300 flex-shrink-0 animate-pulse" />
                    ) : (
                      <Music className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFE3E8;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FFD3DC;
        }
      `}</style>

    </div>
  );
}
