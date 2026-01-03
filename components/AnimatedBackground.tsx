"use client";

import React, { useMemo } from 'react';

interface FloatingEmoji {
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

export function AnimatedBackground() {
  const emojis = useMemo(() => {
    const faces = ['😊', '😢', '😃', '😔', '😄', '😞', '🙂', '☹️', '😁', '😟'];
    const count = 20; // Number of floating emojis

    return Array.from({ length: count }, (_, i) => ({
      emoji: faces[Math.floor(Math.random() * faces.length)],
      left: Math.random() * 100,
      duration: 15 + Math.random() * 20, // 15-35 seconds
      delay: Math.random() * 10, // 0-10 seconds delay
      size: 30 + Math.random() * 40, // 30-70px
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {emojis.map((item, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-20"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
