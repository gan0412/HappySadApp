"use client";

import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

interface ToolbarButtonProps {
  format: string;
  icon: React.ReactNode;
  tooltip: string;
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

function ToolbarButton({ format, icon, tooltip }: ToolbarButtonProps) {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <button
      type="button"
      title={tooltip}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className={`px-3 py-1.5 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 font-semibold' : ''
      }`}
    >
      {icon}
    </button>
  );
}

export function FormattingToolbar() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b bg-gray-50">
      <ToolbarButton
        format="bold"
        icon={<span className="font-bold">B</span>}
        tooltip="Bold (Ctrl+B)"
      />
      <ToolbarButton
        format="italic"
        icon={<span className="italic">I</span>}
        tooltip="Italic (Ctrl+I)"
      />
      <ToolbarButton
        format="underline"
        icon={<span className="underline">U</span>}
        tooltip="Underline (Ctrl+U)"
      />
      <ToolbarButton
        format="strikethrough"
        icon={<span className="line-through">S</span>}
        tooltip="Strikethrough"
      />
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <ToolbarButton
        format="code"
        icon={<span className="font-mono text-sm">{"</>"}</span>}
        tooltip="Code"
      />
    </div>
  );
}
