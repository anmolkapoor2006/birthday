'use client';

import React, { useEffect, useRef } from 'react';

export interface DrawingCursorEffectProps {
  children?: React.ReactNode;
  strokeColor?: string;
  strokeWidth?: number;
  fadeAlpha?: number;
  cursorEase?: number;
  cursorColor?: string;
  cursorSize?: number;
  className?: string;
}

/**
 * DrawingCursorEffect
 * Canvas-based cursor trail with a heart-shaped custom cursor.
 */
export default function DrawingCursorEffect({
  children,
  strokeColor = '#e08ba6',
  strokeWidth = 3,
  fadeAlpha = 0.05,
  cursorEase = 0.18,
  cursorColor = '#d9648a',
  cursorSize = 22,
  className = '',
}: DrawingCursorEffectProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<SVGSVGElement | null>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!stage || !canvas) return;
      canvas.width = stage.clientWidth;
      canvas.height = stage.clientHeight;
    }
    resize();

    mouse.current = { x: canvas.width / 2, y: canvas.height / 2 };
    last.current = { ...mouse.current };
    cursorPos.current = { ...mouse.current };

    function handleMouseMove(e: MouseEvent) {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      if (!hasMoved.current) {
        last.current.x = mouse.current.x;
        last.current.y = mouse.current.y;
        hasMoved.current = true;
      }
    }

    function loop() {
      if (!canvas || !ctx) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      if (hasMoved.current) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(last.current.x, last.current.y);
        ctx.lineTo(mouse.current.x, mouse.current.y);
        ctx.stroke();
        last.current.x = mouse.current.x;
        last.current.y = mouse.current.y;
      }

      cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * cursorEase;
      cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * cursorEase;

      if (cursorRef.current && stage) {
        if (!hasMoved.current) {
          cursorRef.current.style.display = 'none';
        } else {
          cursorRef.current.style.display = 'block';
          const rect = stage.getBoundingClientRect();
          const half = cursorSize / 2;
          cursorRef.current.style.transform = `translate(${
            cursorPos.current.x + rect.left - half
          }px, ${cursorPos.current.y + rect.top - half}px)`;
        }
      }

      rafId.current = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    stage.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      stage.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [strokeColor, strokeWidth, fadeAlpha, cursorEase, cursorSize]);

  return (
    <div
      ref={stageRef}
      className={className}
      style={{ position: 'relative', width: '100%' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <svg
        ref={cursorRef}
        viewBox="0 0 32 29.6"
        width={cursorSize}
        height={cursorSize}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          pointerEvents: 'none',
          display: 'none',
        }}
      >
        <path
          fill={cursorColor}
          d="M23.6,0c-3.4,0-6.3,1.9-7.6,4.7C14.7,1.9,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4
          c0,9.2,10.5,14.4,14.5,18.4l1.5,1.4l1.5-1.4C21.5,22.8,32,17.6,32,8.4C32,3.8,28.2,0,23.6,0z"
        />
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
