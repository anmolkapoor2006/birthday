'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Radio,
  Music,
  Info,
  Disc3,
  Repeat,
  Flame
} from 'lucide-react';
import { VOICE_NOTES, VoiceNote } from '@/constants/content';
import { playTapeClickSound, playCassetteEjectSound } from '@/utils/audio';
import { triggerHapticFeedback } from '@/utils/haptics';
import confetti from 'canvas-confetti';

/**
 * Analog Mechanical Needle VU Meter Component
 * Renders an authentic 1970s backlit VU gauge with a physical pivoting needle.
 */
function AnalogVuGauge({ label, level }: { label: string; level: number }) {
  // Convert 0-100 level to angle (-45deg to +45deg)
  const needleAngle = -45 + (level / 100) * 90;

  return (
    <div className="bg-gradient-to-b from-[#2B2319] via-[#1F1811] to-[#120D08] border-2 border-[#8B6B3E]/60 rounded-xl p-3 shadow-inner relative overflow-hidden flex flex-col items-center">
      {/* Warm Yellow Backlight Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-400/25 via-amber-500/10 to-transparent pointer-events-none" />

      {/* Meter Scale Label */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono text-amber-200/90 z-10 mb-1">
        <span className="font-bold">{label}</span>
        <span className="text-rose-400 font-semibold">VU LEVEL</span>
      </div>

      {/* SVG Analog Gauge Face */}
      <div className="w-full h-20 relative flex items-end justify-center z-10">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Gauge Arc */}
          <path
            d="M 25 90 A 75 75 0 0 1 175 90"
            fill="none"
            stroke="#5A472E"
            strokeWidth="3"
          />
          {/* Red Overload Arc Zone */}
          <path
            d="M 140 37 A 75 75 0 0 1 175 90"
            fill="none"
            stroke="#EF4444"
            strokeWidth="5"
          />

          {/* Tick Marks & Values */}
          {[-20, -10, -7, -5, -3, -1, 0, 1, 3].map((val, idx) => {
            const angle = -45 + (idx / 8) * 90;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = 100 + 72 * Math.cos(rad);
            const y1 = 90 + 72 * Math.sin(rad);
            const x2 = 100 + 64 * Math.cos(rad);
            const y2 = 90 + 64 * Math.sin(rad);
            const textX = 100 + 52 * Math.cos(rad);
            const textY = 90 + 52 * Math.sin(rad);

            return (
              <g key={val}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={val >= 0 ? '#EF4444' : '#FCD34D'}
                  strokeWidth={val === 0 || val === 3 ? '2.5' : '1.5'}
                />
                <text
                  x={textX}
                  y={textY}
                  fill={val >= 0 ? '#EF4444' : '#FDE68A'}
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* Pivoting Needle */}
          <g transform={`rotate(${needleAngle}, 100, 90)`} className="transition-transform duration-75 ease-out">
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="15"
              stroke="#DC2626"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Needle Cap */}
            <circle cx="100" cy="90" r="7" fill="#1C1917" stroke="#9A3412" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Glass Reflection Highlight */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}

export default function VintageTapePlayer() {
  // Playlist & active tape state
  const [tapes, setTapes] = useState<VoiceNote[]>(VOICE_NOTES);
  const [activeTape, setActiveTape] = useState<VoiceNote>(VOICE_NOTES[0]);
  const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Vintage Audio Effects
  const [isTapeHissEnabled, setIsTapeHissEnabled] = useState<boolean>(true);
  const [isWarmMode, setIsWarmMode] = useState<boolean>(true);
  const [tapeType, setTapeType] = useState<'TYPE I' | 'TYPE II (CrO2)' | 'METAL'>('TYPE II (CrO2)');

  // Tape Deck State
  const [isDeckOpen, setIsDeckOpen] = useState<boolean>(false);
  const [isFlippingTape, setIsFlippingTape] = useState<boolean>(false);
  const [vuLevelLeft, setVuLevelLeft] = useState<number>(10);
  const [vuLevelRight, setVuLevelRight] = useState<number>(15);

  // Recorder State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [selectedInspectTape, setSelectedInspectTape] = useState<VoiceNote | null>(null);

  // Audio & Web Audio API Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const vuAnimRef = useRef<number | null>(null);

  // Web Audio Context for Tape Hiss Noise Generator
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // Audio setup and duration listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = isWarmMode ? 0.96 : 1.0; // Subtle warm tape pitch drop

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFC0CB', '#D38B9C', '#FFD700']
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, isMuted, isWarmMode]);

  // Handle Tape Hiss Background Web Audio Synthesis
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isPlaying && isTapeHissEnabled) {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Create tape hiss buffer (warm pink noise)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.012; // Soft subtle background tape hiss volume
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.015 * (isMuted ? 0 : volume), ctx.currentTime);

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        noiseNodeRef.current = whiteNoise;
        noiseGainRef.current = gainNode;
      } catch (e) {
        console.warn('Tape hiss audio synthesis error:', e);
      }
    } else {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch {}
        noiseNodeRef.current = null;
      }
    }

    return () => {
      if (noiseNodeRef.current) {
        try {
          (noiseNodeRef.current as AudioBufferSourceNode).stop();
        } catch {}
        noiseNodeRef.current = null;
      }
    };
  }, [isPlaying, isTapeHissEnabled, volume, isMuted]);

  // Handle active tape change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = activeTape.audioUrl;
    audio.load();
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }
  }, [activeTape]);

  // VU Needle Simulation Loop
  useEffect(() => {
    let timer: number;

    if (isPlaying) {
      const updateVu = () => {
        const baseL = Math.min(95, Math.max(20, Math.random() * 65 + 30));
        const baseR = Math.min(95, Math.max(18, Math.random() * 65 + 25));
        setVuLevelLeft(baseL);
        setVuLevelRight(baseR);
        vuAnimRef.current = requestAnimationFrame(updateVu);
      };
      vuAnimRef.current = requestAnimationFrame(updateVu);
    } else if (isRecording) {
      const updateVuRec = () => {
        const level = Math.random() * 75 + 20;
        setVuLevelLeft(level);
        setVuLevelRight(level * 0.9);
        vuAnimRef.current = requestAnimationFrame(updateVuRec);
      };
      vuAnimRef.current = requestAnimationFrame(updateVuRec);
    } else {
      timer = window.setTimeout(() => {
        setVuLevelLeft(5);
        setVuLevelRight(5);
      }, 0);
    }

    return () => {
      if (vuAnimRef.current) cancelAnimationFrame(vuAnimRef.current);
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, isRecording]);

  // Controls
  const handlePlayPause = () => {
    triggerHapticFeedback(30);
    playTapeClickSound();

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      if (isDeckOpen) setIsDeckOpen(false);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsPaused(false);
        })
        .catch((err) => {
          console.warn('Playback failed:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleStop = () => {
    triggerHapticFeedback(40);
    playTapeClickSound();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const handleRewind = () => {
    triggerHapticFeedback(25);
    playTapeClickSound();
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
      setCurrentTime(audio.currentTime);
    }
  };

  const handleFastForward = () => {
    triggerHapticFeedback(25);
    playTapeClickSound();
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      setCurrentTime(audio.currentTime);
    }
  };

  const handleEject = () => {
    triggerHapticFeedback([40, 30]);
    playCassetteEjectSound();

    if (isPlaying) handleStop();
    setIsDeckOpen((prev) => !prev);
  };

  const handleSelectTape = (tape: VoiceNote) => {
    triggerHapticFeedback(50);
    playCassetteEjectSound();

    if (isPlaying) handleStop();
    setIsDeckOpen(true);

    setTimeout(() => {
      setActiveTape(tape);
      setCurrentSide(tape.side || 'A');
      setTimeout(() => {
        setIsDeckOpen(false);
      }, 450);
    }, 350);
  };

  const handleFlipTape = () => {
    triggerHapticFeedback(40);
    playTapeClickSound();
    setIsFlippingTape(true);

    setTimeout(() => {
      setCurrentSide((prev) => (prev === 'A' ? 'B' : 'A'));
      setIsFlippingTape(false);
    }, 350);
  };

  // Mic Recording
  const startRecording = async () => {
    try {
      playTapeClickSound();
      triggerHapticFeedback([50, 50]);

      if (isPlaying) handleStop();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newTape: VoiceNote = {
          id: `recorded-${Date.now()}`,
          title: `Personal Voice Note 🎙️`,
          subtitle: `Recorded live • Side A`,
          duration: formatTime(recordingTime),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          audioUrl: audioUrl,
          cassetteColor: 'from-amber-700 via-[#8C5D38] to-[#5C3E26]',
          label: `Recorded Voice Note 💖`,
          side: 'A',
          note: `A sweet live voice message recorded on ${new Date().toLocaleDateString()}!`,
          tags: ['Live Recorded', 'Vintage Memory']
        };

        setTapes((prev) => [newTape, ...prev]);
        setActiveTape(newTape);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone permission error:', err);
      alert('Microphone access is required to record a custom voice note!');
    }
  };

  const stopRecording = () => {
    playTapeClickSound();
    triggerHapticFeedback(40);

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const leftSpoolRadius = Math.max(14, 38 * (1 - progressRatio * 0.7));
  const rightSpoolRadius = Math.max(14, 38 * (0.3 + progressRatio * 0.7));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center select-none font-sans">
      
      {/* Page Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-900/10 border border-amber-800/30 rounded-full mb-3 shadow-2xs">
          <Flame className="w-4 h-4 text-amber-700 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-900 font-mono">
            Authentic 1970s Analog Tape Console
          </span>
        </div>
        <h1 className="font-script text-4xl md:text-6xl text-[#6B4426] font-bold tracking-wide">
          Vintage Tape Deck & Voice Notes 📻
        </h1>
        <p className="text-sm md:text-base text-stone-600 mt-1 max-w-lg mx-auto font-sans">
          Listen to warm analog romantic voice notes on vintage cassette tapes, or record your own personal voice message live!
        </p>
      </motion.div>

      {/* Main Vintage Stereo Tape Deck Cabinet */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-b from-[#3B261D] via-[#2A1911] to-[#1C100A] rounded-3xl p-5 md:p-8 shadow-2xl border-8 border-[#4A3225] relative overflow-hidden"
      >
        {/* Rich Walnut Wood Grain Side Trim Borders */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-[#21120B] via-[#4A2D1F] to-[#2B170E] border-r border-[#6B4426]/40 shadow-inner" />
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-[#21120B] via-[#4A2D1F] to-[#2B170E] border-l border-[#6B4426]/40 shadow-inner" />

        {/* Top Champagne Gold / Brass Metallic Bezel Header */}
        <div className="relative z-10 bg-gradient-to-r from-[#D4B270] via-[#F5E2B8] to-[#B89452] p-3 md:p-4 rounded-xl shadow-md border border-[#8C6D37] flex justify-between items-center mb-6">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-800 to-amber-600 border-2 border-[#5C3E26] flex items-center justify-center shadow-md">
              <Disc3 className="w-5 h-5 text-amber-200 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs md:text-sm font-extrabold text-[#3B261D] uppercase tracking-widest block font-mono">
                ANTIGRAVITY VINTAGE TAPE-9000
              </span>
              <span className="text-[10px] text-[#6E4723] font-bold tracking-wider uppercase block">
                SOLID STATE • STEREO CASSETTE RECORDER • HI-FI ANALOG
              </span>
            </div>
          </div>

          {/* Retro Power & Indicator LEDs */}
          <div className="flex items-center space-x-4">
            {/* Red REC LED */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-[#4A3225] font-extrabold uppercase">REC</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-[#5A1212] transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-600 shadow-[0_0_12px_#dc2626] animate-ping'
                    : 'bg-red-950/80'
                }`}
              />
            </div>
            {/* Green PLAY LED */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-[#4A3225] font-extrabold uppercase">PLAY</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-[#0B3B24] transition-all duration-300 ${
                  isPlaying
                    ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                    : 'bg-emerald-950/80'
                }`}
              />
            </div>
            {/* Amber PAUSE LED */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-[#4A3225] font-extrabold uppercase">PAUSE</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-[#4D3305] transition-all duration-300 ${
                  isPaused
                    ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]'
                    : 'bg-amber-950/80'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Center Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Glass Cassette Window Compartment */}
          <div className="lg:col-span-2 bg-[#0F0A07] border-4 border-[#3D281C] rounded-2xl p-5 relative shadow-inner overflow-hidden flex flex-col justify-between min-h-[250px]">
            
            {/* Warm Incandescent Bulb Glow inside Deck */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/15 via-amber-700/5 to-transparent pointer-events-none" />

            {/* Top Deck Info Strip */}
            <div className="relative z-10 flex justify-between items-center text-xs font-mono border-b border-[#2E1E14] pb-2">
              <div className="text-amber-300 font-semibold flex items-center space-x-1.5 truncate max-w-[240px]">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">{activeTape.title}</span>
              </div>
              <div className="flex items-center space-x-2 text-stone-400 text-[11px]">
                <span>{activeTape.subtitle}</span>
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded border border-amber-800/60 font-bold">
                  SIDE {currentSide}
                </span>
              </div>
            </div>

            {/* Physical Cassette Shell & Spinning Reel Spools */}
            <div className="relative z-10 my-4 flex items-center justify-center">
              <motion.div
                animate={{
                  rotateY: isFlippingTape ? 180 : 0,
                  y: isDeckOpen ? -45 : 0,
                  scale: isDeckOpen ? 0.94 : 1,
                  opacity: isDeckOpen ? 0.6 : 1
                }}
                transition={{ duration: 0.4 }}
                className={`w-full max-w-md h-36 rounded-xl bg-gradient-to-r ${activeTape.cassetteColor} p-3 shadow-2xl relative border-2 border-amber-200/40 flex flex-col justify-between transform-gpu`}
              >
                {/* Worn Handwritten Scotch Tape Label */}
                <div className="bg-[#FFF9EA] text-stone-900 rounded-lg px-3 py-1.5 shadow-md flex justify-between items-center border border-amber-300/80">
                  <span className="font-handwriting text-lg font-bold text-amber-950 tracking-wide truncate max-w-[240px]">
                    {activeTape.label}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-mono bg-[#3B261D] text-amber-300 px-1.5 py-0.5 rounded font-bold">
                      SIDE {currentSide}
                    </span>
                    <button
                      onClick={handleFlipTape}
                      title="Flip Cassette Side"
                      className="p-1 hover:bg-amber-200 rounded transition-colors text-amber-900"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cassette Center Spool Window */}
                <div className="bg-[#0C0805]/95 rounded-lg p-2 flex items-center justify-around border border-amber-900/60 shadow-inner relative">
                  
                  {/* Left Spool Reel */}
                  <div className="relative flex items-center justify-center">
                    {/* Dark Brown Ribbon Mass */}
                    <div
                      className="rounded-full bg-[#3D251A] border border-[#24150F] transition-all duration-300 flex items-center justify-center shadow-md"
                      style={{ width: `${leftSpoolRadius * 2}px`, height: `${leftSpoolRadius * 2}px` }}
                    />
                    {/* Spinning Teeth Hub */}
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="w-10 h-10 rounded-full border-2 border-stone-300 bg-amber-100 flex items-center justify-center absolute shadow-inner"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1F140D] border border-amber-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-200" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Tape Magnet Head Bridge */}
                  <div className="flex-1 h-3.5 bg-[#2B1A12] mx-4 relative overflow-hidden rounded border border-amber-950">
                    <div
                      className={`w-full h-full bg-[#4A2F22] ${isPlaying ? 'animate-pulse' : ''}`}
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer" />
                    )}
                  </div>

                  {/* Right Spool Reel */}
                  <div className="relative flex items-center justify-center">
                    {/* Dark Brown Ribbon Mass */}
                    <div
                      className="rounded-full bg-[#3D251A] border border-[#24150F] transition-all duration-300 flex items-center justify-center shadow-md"
                      style={{ width: `${rightSpoolRadius * 2}px`, height: `${rightSpoolRadius * 2}px` }}
                    />
                    {/* Spinning Teeth Hub */}
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="w-10 h-10 rounded-full border-2 border-stone-300 bg-amber-100 flex items-center justify-center absolute shadow-inner"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#1F140D] border border-amber-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-200" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Cassette Type Specs */}
                <div className="flex justify-between items-center text-[9px] font-mono text-amber-100/80 px-1 font-bold">
                  <span>{tapeType}</span>
                  <span>DOLBY NR [ON] • C-90</span>
                </div>
              </motion.div>
            </div>

            {/* Scrubber Progress Bar */}
            <div className="relative z-10 flex items-center space-x-3 pt-2 border-t border-[#2E1E14]">
              <span className="text-xs font-mono text-amber-400">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current) audioRef.current.currentTime = val;
                }}
                className="flex-1 h-2 bg-[#26170F] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-xs font-mono text-stone-500">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Analog VU Meters & Nixie Display Column */}
          <div className="bg-[#18110B] border-4 border-[#3D281C] rounded-2xl p-4 flex flex-col justify-between shadow-inner space-y-4">
            
            {/* Nixie Tube Glowing Amber Counter */}
            <div className="bg-[#0D0805] rounded-xl p-3 border border-amber-900/60 text-center shadow-inner">
              <span className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest block mb-1 font-bold">
                NIXIE TAPE COUNTER
              </span>
              <div className="bg-[#050302] border border-amber-900/80 rounded p-2 flex justify-center items-center shadow-inner">
                <span className="font-mono text-3xl font-extrabold text-amber-500 tracking-widest shadow-[0_0_10px_#f59e0b]">
                  {formatTime(isRecording ? recordingTime : currentTime)}
                </span>
              </div>
            </div>

            {/* Dual Analog Needle VU Meters */}
            <div className="space-y-3">
              <AnalogVuGauge label="LEFT CHANNEL" level={vuLevelLeft} />
              <AnalogVuGauge label="RIGHT CHANNEL" level={vuLevelRight} />
            </div>

            {/* Volume Control Knob & Slider */}
            <div className="flex items-center space-x-3 bg-[#241810] p-3 rounded-xl border border-amber-900/50">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-amber-400 hover:text-amber-200 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-2 bg-[#120B07] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-xs font-mono text-amber-300 min-w-[28px] font-bold">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Vintage Brass Toggles & Effects Control Bar */}
        <div className="bg-gradient-to-r from-[#2B1A12] via-[#3D251A] to-[#2B1A12] border-2 border-amber-800/40 rounded-xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-amber-200">
          {/* Tape Hiss Toggle */}
          <button
            onClick={() => setIsTapeHissEnabled((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-2 transition-all ${
              isTapeHissEnabled
                ? 'bg-amber-900/60 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-stone-900/80 border-stone-700 text-stone-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>TAPE HISS NOISE: {isTapeHissEnabled ? 'ON 📻' : 'OFF'}</span>
          </button>

          {/* Warm Vintage Tone */}
          <button
            onClick={() => setIsWarmMode((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-2 transition-all ${
              isWarmMode
                ? 'bg-amber-900/60 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-stone-900/80 border-stone-700 text-stone-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>WARM PITCH: {isWarmMode ? '96% VINTAGE 🔥' : '100% NORMAL'}</span>
          </button>

          {/* Tape Type Selector */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-amber-400 uppercase mr-1">TAPE:</span>
            {(['TYPE I', 'TYPE II (CrO2)', 'METAL'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTapeType(type)}
                className={`px-2 py-1 text-[10px] rounded border ${
                  tapeType === type
                    ? 'bg-amber-500 text-amber-950 font-bold border-amber-300'
                    : 'bg-[#1F130B] text-amber-300/70 border-amber-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Heavy Mechanical Push Buttons Console */}
        <div className="bg-gradient-to-b from-[#1C120C] via-[#281A12] to-[#120B07] border-4 border-[#3B261D] rounded-2xl p-4 md:p-6 shadow-2xl flex flex-wrap items-center justify-around gap-4">
          
          {/* REWIND */}
          <button
            onClick={handleRewind}
            title="Rewind (5s)"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 md:w-15 md:h-15 rounded-xl bg-gradient-to-b from-stone-600 via-stone-700 to-stone-900 border-2 border-stone-500 flex items-center justify-center text-amber-100 shadow-xl group-hover:text-white group-active:translate-y-1 transition-all">
              <Rewind className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1.5">REW</span>
          </button>

          {/* PLAY */}
          <button
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div
              className={`w-15 h-15 md:w-18 md:h-18 rounded-xl border-2 flex items-center justify-center shadow-2xl group-active:translate-y-1 transition-all ${
                isPlaying
                  ? 'bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-900 border-emerald-400 text-white shadow-[0_0_18px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 border-amber-500 text-amber-100 group-hover:text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1.5">
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </span>
          </button>

          {/* FAST FORWARD */}
          <button
            onClick={handleFastForward}
            title="Fast Forward (5s)"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 md:w-15 md:h-15 rounded-xl bg-gradient-to-b from-stone-600 via-stone-700 to-stone-900 border-2 border-stone-500 flex items-center justify-center text-amber-100 shadow-xl group-hover:text-white group-active:translate-y-1 transition-all">
              <FastForward className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1.5">FF</span>
          </button>

          {/* STOP */}
          <button
            onClick={handleStop}
            title="Stop"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="w-13 h-13 md:w-15 md:h-15 rounded-xl bg-gradient-to-b from-stone-600 via-stone-700 to-stone-900 border-2 border-stone-500 flex items-center justify-center text-amber-100 shadow-xl group-hover:text-white group-active:translate-y-1 transition-all">
              <Square className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1.5">STOP</span>
          </button>

          {/* EJECT */}
          <button
            onClick={handleEject}
            title="Eject Cassette"
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div
              className={`w-13 h-13 md:w-15 md:h-15 rounded-xl border-2 flex items-center justify-center shadow-xl group-active:translate-y-1 transition-all ${
                isDeckOpen
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300 text-white shadow-lg'
                  : 'bg-gradient-to-b from-stone-600 via-stone-700 to-stone-900 border-stone-500 text-amber-100 group-hover:text-white'
              }`}
            >
              <RotateCcw className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase mt-1.5">EJECT</span>
          </button>

          {/* RECORD MIC */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? 'Stop Recording' : 'Record Live Voice Note'}
            className="flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div
              className={`w-13 h-13 md:w-15 md:h-15 rounded-xl border-2 flex items-center justify-center shadow-xl group-active:translate-y-1 transition-all ${
                isRecording
                  ? 'bg-gradient-to-b from-red-600 to-red-800 border-red-400 text-white animate-pulse shadow-[0_0_18px_rgba(220,38,38,0.6)]'
                  : 'bg-gradient-to-b from-red-950 via-red-900 to-stone-900 border-red-800 text-red-200 group-hover:text-white'
              }`}
            >
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold uppercase mt-1.5">
              {isRecording ? 'STOP REC' : 'RECORD'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Wooden Cassette Rack Shelf */}
      <div className="w-full mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-script text-3xl md:text-4xl text-[#5C3E26] font-bold">
              Wooden Cassette Rack Collection 📻
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Select any cassette tape from the rack to load it into the vintage player!
            </p>
          </div>

          <button
            onClick={startRecording}
            className="px-4 py-2 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-amber-100 rounded-full text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all transform hover:scale-105 border border-amber-600/50"
          >
            <Mic className="w-3.5 h-3.5 text-amber-300" />
            <span>Record New Tape</span>
          </button>
        </div>

        {/* Cassettes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {tapes.map((tape) => {
            const isCurrent = activeTape.id === tape.id;

            return (
              <motion.div
                key={tape.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTape(tape)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-lg flex flex-col justify-between ${
                  isCurrent
                    ? 'border-amber-600 bg-amber-100/80 shadow-amber-300/40'
                    : 'border-amber-900/30 bg-[#FFFDF7] hover:border-amber-600/60'
                }`}
              >
                {/* Vintage Top Color Accent */}
                <div className={`h-3 w-full rounded-t-md bg-gradient-to-r ${tape.cassetteColor} mb-3`} />

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-amber-950 text-base flex items-center space-x-2">
                      <span>{tape.title}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-amber-800 text-amber-100 text-[10px] font-mono rounded-full font-bold">
                          LOADED IN DECK
                        </span>
                      )}
                    </h4>
                    <p className="text-xs font-mono text-amber-800/80 mt-0.5">
                      {tape.subtitle} • {tape.date}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-amber-900 bg-amber-200/80 px-2 py-1 rounded border border-amber-300 font-bold">
                    {tape.duration}
                  </span>
                </div>

                {/* Tape Liner Note Snippet */}
                <p className="font-handwriting text-base text-stone-800 line-clamp-2 mb-3 bg-[#FAF3E0] p-2.5 rounded-lg border border-amber-200/90 shadow-2xs">
                  &quot;{tape.note}&quot;
                </p>

                {/* Footer Tag Actions */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/60">
                  <div className="flex items-center space-x-1.5">
                    {tape.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInspectTape(tape);
                    }}
                    className="text-amber-800 hover:text-amber-950 font-bold flex items-center space-x-1 text-xs"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Inspect Tape J-Card</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cassette Note Inspection J-Card Modal */}
      <AnimatePresence>
        {selectedInspectTape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedInspectTape(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF4E6] border-4 border-[#5C3E26] rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div
                className={`h-4 w-full rounded-t-xl bg-gradient-to-r ${selectedInspectTape.cassetteColor} mb-4`}
              />

              <h3 className="font-script text-3xl text-amber-950 font-bold mb-1">
                {selectedInspectTape.title}
              </h3>
              <p className="text-xs font-mono text-amber-800 mb-4">
                {selectedInspectTape.subtitle} • Recorded on {selectedInspectTape.date}
              </p>

              {/* J-Card Sleeve Note */}
              <div className="bg-[#FFFDF7] border-2 border-amber-300 rounded-2xl p-5 shadow-sm mb-6 relative">
                <div className="absolute top-[-10px] right-4 bg-amber-800 text-amber-100 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  Vintage J-Card Liner Note
                </div>
                <p className="font-handwriting text-xl text-stone-800 leading-relaxed">
                  {selectedInspectTape.note}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    handleSelectTape(selectedInspectTape);
                    setSelectedInspectTape(null);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 font-bold text-xs rounded-xl shadow-md flex items-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-amber-100" />
                  <span>Load Tape & Play</span>
                </button>

                <button
                  onClick={() => setSelectedInspectTape(null)}
                  className="px-4 py-2.5 border border-amber-800/40 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
