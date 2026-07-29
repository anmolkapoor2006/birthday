'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import BackgroundParticles from '@/components/BackgroundParticles';
import HeartClickEffect from '@/components/HeartClickEffect';
import DrawingCursorEffect from '@/components/DrawingCursorEffect';
import VintageTapePlayer from '@/components/VintageTapePlayer';

export default function VoiceNotesPage() {
  return (
    <DrawingCursorEffect
      strokeColor="#e08ba6"
      cursorColor="#d9648a"
      className="min-h-screen"
    >
      <main className="relative min-h-[100dvh] w-full bg-gradient-to-tr from-[#FAF6F0] via-[#FFF0F2] to-[#F3E8FF] flex flex-col justify-between overflow-x-hidden">
        {/* Floating particles background */}
        <BackgroundParticles />
        {/* Heart & Rose Petal drop effect on click */}
        <HeartClickEffect />

        {/* Top Sticky Navigation Bar */}
        <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-rose-200/80 rounded-full text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-50 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Birthday Story</span>
          </Link>

          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md border border-pink-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-300 animate-pulse" />
            <span className="text-xs font-medium text-gray-700 font-script text-base">
              Priya&apos;s Vintage Audio Deck
            </span>
          </div>
        </header>


        {/* Main Content Area */}
        <div className="flex-1 w-full relative z-10 flex items-center justify-center py-6">
          <VintageTapePlayer />
        </div>

        {/* Footer */}
        <footer className="relative z-20 w-full text-center py-6 border-t border-rose-100/60 bg-white/40 backdrop-blur-xs">
          <p className="text-xs font-sans text-gray-500 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400" />
            <span>for Priya • Vintage Tape Player Voice Notes</span>
          </p>
        </footer>
      </main>
    </DrawingCursorEffect>
  );
}
