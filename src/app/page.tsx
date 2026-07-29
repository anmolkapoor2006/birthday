'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundParticles from '@/components/BackgroundParticles';
import HeartClickEffect from '@/components/HeartClickEffect';
import DrawingCursorEffect from '@/components/DrawingCursorEffect';
import Section1Envelope from '@/components/Section1Envelope';
import Section2Card from '@/components/Section2Card';
import Section3Gallery from '@/components/Section3Gallery';
import Section4Wishes from '@/components/Section4Wishes';
import Section5Cake from '@/components/Section5Cake';
import Section6Reasons from '@/components/Section6Reasons';
import Section7Timeline from '@/components/Section7Timeline';
import Section8Letter from '@/components/Section8Letter';
import Section9Showcase from '@/components/Section9Showcase';
import FloatingMusicPlayer from '@/components/FloatingMusicPlayer';
import confetti from 'canvas-confetti';
import { triggerHapticFeedback } from '@/utils/haptics';
import { songs, Song } from '@/constants/content';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Global Audio State
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(0.8);

  // Synchronize audio elements & event listeners
  useEffect(() => {
    document.title = "Happy Birthday Priya 💖 | A Surprise For You";
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Update volume on state change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle active track change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentSong.file;
    audio.volume = volume;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Playback failed or file missing: ", err);
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = volume;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio file might be missing: ", err);
          setIsPlaying(false);
        });
    }
  };

  const seekAudio = (percent: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;
    audio.currentTime = percent * audio.duration;
    setCurrentTime(audio.currentTime);
  };

  const handleSongEnd = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const handleReplay = () => {
    triggerHapticFeedback([40, 50, 40]);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#FFD3DC', '#D38B9C', '#DFBA6B'],
    });

    setTimeout(() => {
      setCurrentSection(1);
      setIsPlaying(false);
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }, 400);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <Section1Envelope onOpen={() => setCurrentSection(2)} />;
      case 2:
        return (
          <Section2Card
            onContinue={() => setCurrentSection(3)}
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
        );
      case 3:
        return <Section3Gallery onContinue={() => setCurrentSection(4)} />;
      case 4:
        return <Section4Wishes onContinue={() => setCurrentSection(5)} />;
      case 5:
        return <Section5Cake onContinue={() => setCurrentSection(6)} />;
      case 6:
        return <Section6Reasons onContinue={() => setCurrentSection(7)} />;
      case 7:
        return <Section7Timeline onContinue={() => setCurrentSection(8)} />;
      case 8:
        return <Section8Letter onContinue={() => setCurrentSection(9)} />;
      case 9:
        return <Section9Showcase onReplay={handleReplay} />;
      default:
        return <Section1Envelope onOpen={() => setCurrentSection(2)} />;
    }
  };

  return (
    <DrawingCursorEffect
      strokeColor="#e08ba6"
      cursorColor="#d9648a"
      className="min-h-screen"
    >
      <main className="relative min-h-[100dvh] w-full bg-gradient-to-tr from-[#FAF6F0] via-[#FFF0F2] to-[#F3E8FF] overflow-hidden flex flex-col justify-between">
        {/* Floating particles background across the whole site */}
        <BackgroundParticles />
        {/* Heart & Rose Petal drop effect on background clicks */}
        <HeartClickEffect />

        {/* Page transitions */}
        <div className="flex-1 flex flex-col w-full relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="flex-1 w-full flex items-center justify-center will-change-transform transform-gpu"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Persistent Floating Music Player across sections */}
        <FloatingMusicPlayer
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          seekAudio={seekAudio}
          volume={volume}
          setVolume={setVolume}
          visible={currentSection > 1}
        />

        {/* Persistent global audio tag */}
        <audio ref={audioRef} preload="auto" onEnded={handleSongEnd} />
      </main>
    </DrawingCursorEffect>
  );
}
