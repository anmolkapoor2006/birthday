'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, ListMusic, Volume2, VolumeX, Disc } from 'lucide-react';
import { songs, Song } from '@/constants/content';

interface FloatingMusicPlayerProps {
  currentSong: Song;
  setCurrentSong: (song: Song) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  seekAudio?: (percent: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  visible: boolean;
}

export default function FloatingMusicPlayer({
  currentSong,
  setCurrentSong,
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  volume,
  setVolume,
  visible,
}: FloatingMusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  if (!visible) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSongSelect = (song: Song) => {
    if (song.id === currentSong.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      setShowPlaylist(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-[#FFE3E8] p-3.5 flex flex-col space-y-2.5"
          >
            {/* Header / Track Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: isPlaying ? Infinity : 0, duration: 4, ease: 'linear' }}
                  className="w-8 h-8 rounded-full bg-[#FFE3E8] text-[#D38B9C] flex items-center justify-center flex-shrink-0"
                >
                  <Disc className="w-5 h-5" />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-gray-800 truncate">
                    {currentSong.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 truncate">
                    {currentSong.artist}
                  </p>
                </div>
              </div>

              {/* Toggle Playlist / Close */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="p-1.5 rounded-full hover:bg-pink-50 text-[#D38B9C] transition-colors cursor-pointer"
                  title="Playlist"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer"
                  title="Minimize"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Playback Controls & Progress */}
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#FFE3E8] hover:bg-[#FFD3DC] text-[#D38B9C] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex-1 flex flex-col justify-center space-y-1">
                <div className="w-full h-1 bg-pink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D38B9C] rounded-full"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-gray-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <button
                onClick={() => setVolume(volume === 0 ? 0.2 : 0)}
                className="text-[#D38B9C] hover:text-pink-600 cursor-pointer p-1"
                title="Toggle Mute"
              >
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Playlist Dropdown */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-[#FFE3E8]/50 pt-2"
                >
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {songs.map((song) => {
                      const isActive = song.id === currentSong.id;
                      return (
                        <div
                          key={song.id}
                          onClick={() => handleSongSelect(song)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                            isActive
                              ? 'bg-pink-50 text-[#D38B9C] font-medium'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate text-[11px]">{song.title}</p>
                            <p className="truncate text-[9px] text-gray-400">{song.artist}</p>
                          </div>
                          <Music className="w-3 h-3 text-pink-300 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Minimized Disk Button */
          <motion.button
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] text-[#D38B9C] shadow-xl border-2 border-white flex items-center justify-center cursor-pointer relative group"
            title="Music Player"
          >
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 4, ease: 'linear' }}
            >
              <Disc className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>

            {/* Glowing active indicator */}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
