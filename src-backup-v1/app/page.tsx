'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundParticles from '@/components/BackgroundParticles';
import Section1Envelope from '@/components/Section1Envelope';
import Section2Card from '@/components/Section2Card';
import Section3Gallery from '@/components/Section3Gallery';
import Section4Wishes from '@/components/Section4Wishes';
import Section5Cake from '@/components/Section5Cake';
import Section6Letter from '@/components/Section6Letter';
import { MUSIC_TRACK } from '@/constants/content';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Synchronize audio status
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

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

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio autoplay blocked or failed:", err));
    }
  };

  const seekAudio = (percent: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(audio.duration)) return;
    const newTime = percent * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleReplay = () => {
    setCurrentSection(1);
    setIsPlaying(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <Section1Envelope onOpen={() => setCurrentSection(2)} />;
      case 2:
        return (
          <Section2Card
            onContinue={() => setCurrentSection(3)}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            currentTime={currentTime}
            duration={duration}
            seekAudio={seekAudio}
          />
        );
      case 3:
        return <Section3Gallery onContinue={() => setCurrentSection(4)} />;
      case 4:
        return <Section4Wishes onContinue={() => setCurrentSection(5)} />;
      case 5:
        return <Section5Cake onContinue={() => setCurrentSection(6)} />;
      case 6:
        return <Section6Letter onReplay={handleReplay} />;
      default:
        return <Section1Envelope onOpen={() => setCurrentSection(2)} />;
    }
  };

  return (
    <main className="relative min-h-[100dvh] w-full bg-gradient-to-tr from-[#FAF6F0] via-[#FFF0F2] to-[#F3E8FF] overflow-hidden flex flex-col justify-between">
      {/* Floating particles background across the whole site */}
      <BackgroundParticles />

      {/* Page transitions */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="flex-1 w-full flex items-center justify-center"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hidden HTML5 Audio tag controlled via Custom UI */}
      <audio ref={audioRef} src={MUSIC_TRACK.audioUrl} preload="auto" />
    </main>
  );
}
