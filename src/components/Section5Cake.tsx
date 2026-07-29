'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Mic, MicOff, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPopSound } from '@/utils/audio';
import { triggerHapticFeedback } from '@/utils/haptics';

interface Section5CakeProps {
  onContinue: () => void;
}

interface Balloon {
  id: number;
  color: string;
  popped: boolean;
  xPercent: number; // Left position
  floatDelay: number;
}

const BALLOON_COLORS = [
  'bg-pink-300/80 hover:bg-pink-400/80',
  'bg-purple-300/80 hover:bg-purple-400/80',
  'bg-blue-300/80 hover:bg-blue-400/80',
  'bg-teal-300/80 hover:bg-teal-400/80',
  'bg-yellow-300/80 hover:bg-yellow-400/80',
  'bg-red-300/80 hover:bg-red-400/80',
];

const INITIAL_BALLOONS: Balloon[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  color: BALLOON_COLORS[i % BALLOON_COLORS.length],
  xPercent: i < 3 ? 5 + i * 8 : 70 + (i - 3) * 8,
  floatDelay: i * 0.8,
  popped: false,
}));

export default function Section5Cake({ onContinue }: Section5CakeProps) {
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [isBlowing, setIsBlowing] = useState(false);
  const [cakeCompleted, setCakeCompleted] = useState(false);
  const [balloons, setBalloons] = useState<Balloon[]>(INITIAL_BALLOONS);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const blowHoldRef = useRef(0);

  // Enable Microphone Blowing Detection
  const startMicDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setMicActive(true);
      blowHoldRef.current = 0;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Accurate scaling: talking is ~15-30%, steady blowing fills 65%-80%
        const volumePercent = Math.min(100, Math.max(0, Math.round((average / 100) * 100)));
        setMicVolume(volumePercent);

        // Blow out candles ONLY when pink bar reaches 65%+ and is sustained for 6 frames
        if (volumePercent >= 65) {
          blowHoldRef.current += 1;
          if (blowHoldRef.current >= 6 && !isBlowing && !cakeCompleted) {
            handleBlowCandles();
            stopMicDetection();
            return;
          }
        } else {
          blowHoldRef.current = Math.max(0, blowHoldRef.current - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    } catch (err) {
      console.warn("Microphone access not granted or unavailable: ", err);
      setMicActive(false);
    }
  };

  const stopMicDetection = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setMicActive(false);
    setMicVolume(0);
  };

  useEffect(() => {
    return () => {
      stopMicDetection();
    };
  }, []);

  const handleBlowCandles = () => {
    if (isBlowing || cakeCompleted) return;
    setIsBlowing(true);
    triggerHapticFeedback([30, 40, 50]);

    // Staggered candle blowing out with sound and individual puffs
    candlesLit.forEach((_, index) => {
      setTimeout(() => {
        setCandlesLit((prev) => {
          const next = [...prev];
          next[index] = false;
          return next;
        });

        playPopSound();
        triggerHapticFeedback(20);

        // When the last candle is blown out, trigger multi-stage confetti
        if (index === candlesLit.length - 1) {
          setTimeout(() => {
            triggerConfettiExplosion();
            setCakeCompleted(true);
            setIsBlowing(false);
          }, 300);
        }
      }, index * 350);
    });
  };

  const triggerConfettiExplosion = () => {
    // Stage 1: Central explosion
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#D8B4FE', '#FDE047', '#93C5FD', '#A7F3D0'],
    });

    // Stage 2: Left and right cannons
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FFD3DC', '#FFE3E8', '#DFBA6B'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FFD3DC', '#FFE3E8', '#DFBA6B'],
      });
    }, 200);
  };

  const handleBalloonPop = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    playPopSound();
    triggerHapticFeedback(25);

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#FFC0CB', '#D8B4FE', '#FDE047', '#93C5FD'],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4 py-8 relative z-10 select-none overflow-hidden">
      
      {/* Background Floating Balloons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {balloons.map((balloon) => (
          <AnimatePresence key={balloon.id}>
            {!balloon.popped && (
              <motion.div
                initial={{ y: '100vh', opacity: 0 }}
                animate={{ y: '-10vh', opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{
                  y: {
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: balloon.floatDelay,
                  },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.2 },
                }}
                onClick={(e) => handleBalloonPop(e, balloon.id)}
                className={`absolute w-12 h-16 md:w-16 md:h-20 rounded-t-full rounded-b-[45%] pointer-events-auto cursor-pointer flex flex-col items-center shadow-lg ${balloon.color}`}
                style={{ left: `${balloon.xPercent}%` }}
              >
                <div className="absolute bottom-[-16px] w-0.5 h-4 bg-gray-400/40" />
                <div className="absolute bottom-[-2px] border-t-8 border-t-inherit border-x-4 border-x-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="font-script text-3xl md:text-5xl text-[#D38B9C]">
            Make a Wish 🎂
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-2 leading-relaxed">
            Blow into your microphone 🌬️ or tap the candles to blow them out and unlock your letter!
          </p>
        </motion.div>

        {/* SVG Cake Container (Clickable to blow candles) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 70 }}
          onClick={handleBlowCandles}
          className="w-64 h-64 flex items-center justify-center relative mb-6 cursor-pointer group"
        >
          {/* SVG Birthday Cake */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Candle 1 (Left) */}
            <g transform="translate(65, 30)">
              <rect x="0" y="15" width="6" height="30" fill="#D38B9C" rx="2" />
              <rect x="0" y="20" width="6" height="4" fill="#FAF6F0" />
              <rect x="0" y="30" width="6" height="4" fill="#FAF6F0" />
              {candlesLit[0] ? (
                <motion.path
                  d="M3 0C5 6 6 10 3 15C0 10 1 6 3 0Z"
                  fill="url(#candleFlame)"
                  animate={{ scale: [1, 1.15, 0.9, 1], y: [0, -1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              ) : (
                /* Smoke Puff */
                <motion.circle cx="3" cy="5" r="3" fill="#A1A1AA" opacity="0.6" animate={{ y: -15, opacity: 0, scale: 2 }} transition={{ duration: 1 }} />
              )}
            </g>

            {/* Candle 2 (Center) */}
            <g transform="translate(97, 20)">
              <rect x="0" y="15" width="6" height="30" fill="#C5A059" rx="2" />
              <rect x="0" y="22" width="6" height="4" fill="#FAF6F0" />
              <rect x="0" y="32" width="6" height="4" fill="#FAF6F0" />
              {candlesLit[1] ? (
                <motion.path
                  d="M3 0C5 6 6 10 3 15C0 10 1 6 3 0Z"
                  fill="url(#candleFlame)"
                  animate={{ scale: [1, 0.9, 1.2, 1], y: [0, 1, -1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }}
                />
              ) : (
                /* Smoke Puff */
                <motion.circle cx="3" cy="5" r="3" fill="#A1A1AA" opacity="0.6" animate={{ y: -15, opacity: 0, scale: 2 }} transition={{ duration: 1, delay: 0.1 }} />
              )}
            </g>

            {/* Candle 3 (Right) */}
            <g transform="translate(129, 30)">
              <rect x="0" y="15" width="6" height="30" fill="#D38B9C" rx="2" />
              <rect x="0" y="20" width="6" height="4" fill="#FAF6F0" />
              <rect x="0" y="30" width="6" height="4" fill="#FAF6F0" />
              {candlesLit[2] ? (
                <motion.path
                  d="M3 0C5 6 6 10 3 15C0 10 1 6 3 0Z"
                  fill="url(#candleFlame)"
                  animate={{ scale: [1.1, 0.95, 1.05, 1.1], y: [0, -0.5, 0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }}
                />
              ) : (
                /* Smoke Puff */
                <motion.circle cx="3" cy="5" r="3" fill="#A1A1AA" opacity="0.6" animate={{ y: -15, opacity: 0, scale: 2 }} transition={{ duration: 1, delay: 0.2 }} />
              )}
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="candleFlame" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="40%" stopColor="#F98C1C" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
              <linearGradient id="cakeIcing" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFE3E8" />
                <stop offset="100%" stopColor="#FFD3DC" />
              </linearGradient>
            </defs>

            {/* Plate */}
            <ellipse cx="100" cy="165" rx="75" ry="12" fill="#E2E8F0" stroke="#DFBA6B" strokeWidth="1.5" />

            {/* Cake Bottom Tier */}
            <path d="M 35 125 A 65 10 0 0 0 165 125 L 165 160 A 65 10 0 0 1 35 160 Z" fill="url(#cakeIcing)" />
            <ellipse cx="100" cy="125" rx="65" ry="10" fill="#FFE3E8" />

            {/* Drips Bottom Tier */}
            <path d="M 35 125 Q 45 137 55 125 Q 65 137 75 125 Q 90 142 105 125 Q 115 135 125 125 Q 140 138 150 125 Q 158 132 165 125 L 165 132 A 65 5 0 0 1 35 132 Z" fill="#FFC0CB" opacity="0.8" />

            {/* Cake Top Tier */}
            <path d="M 55 75 A 45 8 0 0 0 145 75 L 145 120 A 45 8 0 0 1 55 120 Z" fill="#F3E8FF" />
            <ellipse cx="100" cy="75" rx="45" ry="8" fill="#E8D5FF" />

            {/* Cake Drips Top Tier */}
            <path d="M 55 75 Q 65 85 75 75 Q 85 88 95 75 Q 110 88 120 75 Q 130 83 140 75 L 145 75 L 145 82 A 45 4 0 0 1 55 82 Z" fill="#D8B4FE" opacity="0.8" />

            {/* Strawberries decoration */}
            <circle cx="70" cy="73" r="4" fill="#EF4444" />
            <circle cx="100" cy="71" r="4" fill="#EF4444" />
            <circle cx="130" cy="73" r="4" fill="#EF4444" />
          </svg>
        </motion.div>

        {/* Microphone Status Indicator */}
        {!cakeCompleted && (
          <div className="mb-4 flex items-center justify-center space-x-2">
            {!micActive ? (
              <button
                onClick={startMicDetection}
                className="flex items-center space-x-2 text-xs text-[#D38B9C] hover:text-pink-600 bg-pink-50 hover:bg-pink-100 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer border border-pink-200"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Enable Mic to Blow 🎙️</span>
              </button>
            ) : (
              <div className="flex flex-col items-center space-y-1.5 bg-pink-50/90 backdrop-blur-xs text-[#D38B9C] px-4 py-2 rounded-2xl border border-pink-200 shadow-xs">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 animate-pulse text-pink-500" />
                  <span className="text-xs font-semibold">Blow to reach 65%! 🌬️</span>
                  <span className="text-[10px] font-mono text-pink-500 font-bold">{micVolume}%</span>
                </div>
                {/* Volume bar */}
                <div className="w-36 h-2 bg-pink-200/80 rounded-full overflow-hidden p-0.5 border border-pink-300/40">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-75 shadow-xs"
                    style={{ width: `${micVolume}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {!cakeCompleted ? (
          <button
            onClick={handleBlowCandles}
            disabled={isBlowing}
            className="px-8 py-3 bg-gradient-to-r from-pink-400 to-[#D38B9C] hover:from-pink-500 hover:to-[#C27A8B] text-white font-semibold text-sm rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isBlowing ? 'Blowing...' : 'Blow out the candles 🌬️'}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <p className="text-[#C5A059] text-sm font-semibold tracking-wider uppercase mb-4 animate-bounce flex items-center gap-1">
              <span>Yay! Wish Made</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
            </p>
            <button
              onClick={onContinue}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#FFE3E8] to-[#FFD3DC] hover:from-[#FFD3DC] hover:to-[#FFC0CB] text-[#D38B9C] font-semibold text-sm rounded-full shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <span>Read your letter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

    </div>
  );
}

