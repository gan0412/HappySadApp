"use client";

import React, { useEffect, useRef } from 'react';

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}

interface SlashCommandMenuProps {
  commands: SlashCommand[];
  position: { top: number; left: number };
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
}

export function SlashCommandMenu({
  commands,
  position,
  selectedIndex,
  onSelect,
}: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll selected item into view
    if (menuRef.current) {
      const selectedElement = menuRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (commands.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[280px] max-h-[300px] overflow-y-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {commands.map((command, index) => (
        <button
          key={command.id}
          onClick={() => onSelect(command)}
          className={`w-full px-3 py-2 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors ${
            index === selectedIndex ? 'bg-blue-50' : ''
          }`}
        >
          <span className="text-xl mt-0.5">{command.icon}</span>
          <div className="flex-1">
            <div className="font-medium text-sm">{command.label}</div>
            <div className="text-xs text-gray-500">{command.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
