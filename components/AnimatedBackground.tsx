"use client";

import React, { useState, useEffect } from 'react';

interface FloatingEmoji {
  emoji: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

export function AnimatedBackground() {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const faces = ['😊', '😢', '😃', '😔', '😄', '😞', '🙂', '☹️', '😁', '😟'];
    const count = 20; // Number of floating emojis

    const generatedEmojis = Array.from({ length: count }, (_, i) => ({
      emoji: faces[Math.floor(Math.random() * faces.length)],
      left: Math.random() * 100,
      duration: 15 + Math.random() * 20, // 15-35 seconds
      delay: Math.random() * 10, // 0-10 seconds delay
      size: 30 + Math.random() * 40, // 30-70px
    }));

    setEmojis(generatedEmojis);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {emojis.map((item, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: `${item.left}%`,
            bottom: '0',
            fontSize: `${item.size}px`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            opacity: 0, // Start invisible, animation will fade them in
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
