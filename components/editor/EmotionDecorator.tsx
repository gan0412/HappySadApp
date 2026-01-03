"use client";

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getRandomHappyQuote, getRandomSadQuote } from '@/lib/quotes';

interface EmotionDecoratorProps {
  children: React.ReactNode;
  word: 'happy' | 'sad';
  text: string;
}

export function EmotionDecorator({ children, word, text }: EmotionDecoratorProps) {
  const [quote, setQuote] = useState(
    word === 'happy' ? getRandomHappyQuote() : getRandomSadQuote()
  );
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setQuote(word === 'happy' ? getRandomHappyQuote() : getRandomSadQuote());
    setOpen(true);
  };

  const colorClass = word === 'happy' ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700';
  const titleColor = word === 'happy' ? 'text-green-600' : 'text-blue-600';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          className={`cursor-pointer font-semibold ${colorClass} transition-colors`}
          onClick={handleClick}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className={`font-medium leading-none ${titleColor}`}>
            {word === 'happy' ? 'Happy' : 'Sad'} Quote
          </h4>
          <p className="text-sm text-muted-foreground italic">{quote}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
