"use client";

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getRandomHappyQuote, getRandomSadQuote } from '@/lib/quotes';

export interface EmotionLeafProps {
  attributes?: any;
  children?: React.ReactNode;
  leaf?: any;
}

export function EmotionLeaf({ attributes, children, leaf }: EmotionLeafProps) {
  const [quote, setQuote] = useState('');
  const [open, setOpen] = useState(false);

  if (!leaf?.emotion) {
    return <span {...attributes}>{children}</span>;
  }

  const word = leaf.emotion;
  const isHappy = word === 'happy';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuote(isHappy ? getRandomHappyQuote() : getRandomSadQuote());
    setOpen(true);
  };

  const colorClass = isHappy
    ? 'text-green-600 hover:text-green-700'
    : 'text-blue-600 hover:text-blue-700';
  const titleColor = isHappy ? 'text-green-600' : 'text-blue-600';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          {...attributes}
          className={`cursor-pointer font-semibold ${colorClass} transition-colors`}
          onClick={handleClick}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className={`font-medium leading-none ${titleColor}`}>
            {isHappy ? 'Happy' : 'Sad'} Quote
          </h4>
          <p className="text-sm text-muted-foreground italic">{quote}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
