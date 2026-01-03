"use client";

import React, { useState } from "react";
import { PlateElement, PlateElementProps } from "@platejs/core";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getRandomHappyQuote } from "@/lib/quotes";

export function HappyElement({ children, ...props }: PlateElementProps) {
  const [quote, setQuote] = useState(getRandomHappyQuote());
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setQuote(getRandomHappyQuote());
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PlateElement
          {...props}
          as="span"
          className="cursor-pointer text-green-600 font-semibold hover:text-green-700 transition-colors"
          onClick={handleClick}
        >
          {children}
        </PlateElement>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium leading-none text-green-600">Happy Quote</h4>
          <p className="text-sm text-muted-foreground italic">{quote}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
