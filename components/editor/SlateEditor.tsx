"use client";

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { createEditor, Descendant, BaseEditor, Transforms, Editor, Range } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialValue } from '@/lib/plate-config';
import { EmotionLeaf } from './EmotionLeaf';
import { useAI } from '@/hooks/useAI';
import { FormattingToolbar } from './FormattingToolbar';
import { SlashCommandMenu, type SlashCommand } from './SlashCommandMenu';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: { type: string; children: Descendant[] };
    Text: {
      text: string;
      emotion?: string;
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      code?: boolean;
    };
  }
}

interface SlateEditorProps {
  storageKey: string;
  mode: 'happy' | 'sad';
}

export function SlateEditor({ storageKey, mode }: SlateEditorProps) {
  const [value, setValue, isLoading] = useLocalStorage<Descendant[]>(storageKey, initialValue);
  const { rewriteText, isLoading: isAILoading } = useAI();
  const [isRewriting, setIsRewriting] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [slashRange, setSlashRange] = useState<Range | null>(null);
  const [filteredCommands, setFilteredCommands] = useState<SlashCommand[]>([]);
  const editableRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const executeRewriteCommand = useCallback(() => {
    if (!slashRange) return;

    // Get the text before the slash command
    const beforeText = Editor.string(editor, {
      anchor: Editor.start(editor, []),
      focus: slashRange.anchor,
    });

    if (beforeText.trim()) {
      setIsRewriting(true);
      rewriteText(beforeText.trim(), mode)
        .then((rewritten) => {
          Transforms.delete(editor, {
            at: {
              anchor: Editor.start(editor, []),
              focus: Editor.end(editor, []),
            },
          });

          Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{ text: rewritten }],
          });

          const newContent: Descendant[] = [{
            type: 'paragraph',
            children: [{ text: rewritten }],
          }];
          setValue(newContent);
        })
        .catch((error) => {
          console.error('Failed to rewrite:', error);
          alert('Failed to rewrite text. Please check your API key and try again.');
        })
        .finally(() => {
          setIsRewriting(false);
          setShowSlashMenu(false);
          setSlashRange(null);
        });
    } else {
      setShowSlashMenu(false);
      setSlashRange(null);
    }
  }, [editor, mode, rewriteText, setValue, slashRange]);

  const executeFormatCommand = useCallback((format: 'bold' | 'italic' | 'underline') => {
    if (!slashRange) return;

    // Get all text before the slash
    const beforeRange = {
      anchor: Editor.start(editor, []),
      focus: slashRange.anchor,
    };

    // Remove the slash command
    Transforms.delete(editor, { at: slashRange });

    // Apply the format to all text before the slash
    Transforms.select(editor, beforeRange);

    const marks = Editor.marks(editor);
    const isActive = marks?.[format] === true;

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }

    // Move cursor to the end
    Transforms.collapse(editor, { edge: 'end' });

    setShowSlashMenu(false);
    setSlashRange(null);
  }, [editor, slashRange]);

  const slashCommands: SlashCommand[] = useMemo(() => [
    {
      id: 'rewrite',
      label: 'Rewrite',
      description: `Rewrite text to be ${mode}`,
      icon: '✨',
      action: () => executeRewriteCommand(),
    },
    {
      id: 'bold',
      label: 'Bold',
      description: 'Make text bold',
      icon: '𝐁',
      action: () => executeFormatCommand('bold'),
    },
    {
      id: 'italicize',
      label: 'Italicize',
      description: 'Make text italic',
      icon: '𝐼',
      action: () => executeFormatCommand('italic'),
    },
    {
      id: 'underline',
      label: 'Underline',
      description: 'Underline text',
      icon: 'U̲',
      action: () => executeFormatCommand('underline'),
    },
  ], [mode, executeRewriteCommand, executeFormatCommand]);

  const getEditorText = (nodes: Descendant[]): string => {
    return nodes
      .map((node: any) => {
        if (node.children) {
          return getEditorText(node.children);
        }
        return node.text || '';
      })
      .join('\n');
  };

  const handleCommandSelect = useCallback((command: SlashCommand) => {
    if (slashRange) {
      // Remove the "/" character
      Transforms.delete(editor, { at: slashRange });
    }
    setShowSlashMenu(false);
    setSlashRange(null);
    command.action();
  }, [editor, slashRange]);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);

    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);

      // Match "/" followed by any characters (e.g., "/", "/r", "/rew", "/rewrite")
      const beforeMatch = beforeText && beforeText.match(/\/(\w*)$/);

      if (beforeMatch) {
        const searchText = beforeMatch[1].toLowerCase(); // Text after the "/"

        // Filter commands based on search text (only match command label)
        const filtered = slashCommands.filter(cmd =>
          cmd.label.toLowerCase().startsWith(searchText)
        );

        if (filtered.length > 0) {
          setFilteredCommands(filtered);
          setSlashRange(beforeRange);
          setShowSlashMenu(true);
          setSelectedCommandIndex(0);

          // Position the menu
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const domRange = domSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            setSlashMenuPosition({
              top: rect.bottom + window.scrollY + 5,
              left: rect.left + window.scrollX,
            });
          }
        } else {
          // No matching commands, hide menu
          setShowSlashMenu(false);
          setSlashRange(null);
        }
      } else {
        setShowSlashMenu(false);
        setSlashRange(null);
      }
    }
  }, [editor, setValue, slashCommands]);

  const decorate = useCallback(([node, path]: [any, any]) => {
    const ranges: any[] = [];

    if (node.text && typeof node.text === 'string') {
      const regex = /\b(happy|sad)\b/gi;
      let match;

      while ((match = regex.exec(node.text)) !== null) {
        ranges.push({
          anchor: { path, offset: match.index },
          focus: { path, offset: match.index + match[0].length },
          emotion: match[0].toLowerCase(),
        });
      }
    }

    return ranges;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children } = props;

    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }
    if (props.leaf.underline) {
      children = <u>{children}</u>;
    }
    if (props.leaf.strikethrough) {
      children = <s>{children}</s>;
    }
    if (props.leaf.code) {
      children = <code className="bg-gray-100 px-1 rounded text-sm font-mono">{children}</code>;
    }

    return <EmotionLeaf {...props}>{children}</EmotionLeaf>;
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`rounded-lg border-2 ${
        mode === 'happy' ? 'border-green-300' : 'border-blue-300'
      } bg-white shadow-lg`}>
        <div className={`px-4 py-2 ${
          mode === 'happy' ? 'bg-green-50' : 'bg-blue-50'
        } border-b`}>
          <h2 className="text-lg font-semibold">
            {mode === 'happy' ? '😊 Happy' : '😢 Sad'} Editor
          </h2>
          <p className="text-sm text-gray-600">
            Type &quot;/&quot; to open commands menu. Try typing &quot;happy&quot; or &quot;sad&quot; to create interactive elements!
          </p>
          {(isAILoading || isRewriting) && (
            <p className="text-sm text-blue-600 mt-1">AI is rewriting your text...</p>
          )}
        </div>
        <Slate editor={editor} initialValue={value} onChange={handleChange}>
          <FormattingToolbar />
          <div className="p-6">
            <Editable
              decorate={decorate}
              renderLeaf={renderLeaf}
              placeholder="Start typing..."
              className="min-h-[400px] focus:outline-none"
              onKeyDown={(event) => {
                // Handle slash menu navigation
                if (showSlashMenu) {
                  switch (event.key) {
                    case 'ArrowDown': {
                      event.preventDefault();
                      setSelectedCommandIndex((prev) =>
                        prev < filteredCommands.length - 1 ? prev + 1 : 0
                      );
                      return;
                    }
                    case 'ArrowUp': {
                      event.preventDefault();
                      setSelectedCommandIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredCommands.length - 1
                      );
                      return;
                    }
                    case 'Enter': {
                      event.preventDefault();
                      handleCommandSelect(filteredCommands[selectedCommandIndex]);
                      return;
                    }
                    case 'Escape': {
                      event.preventDefault();
                      setShowSlashMenu(false);
                      setSlashRange(null);
                      return;
                    }
                  }
                }

                // Handle formatting shortcuts
                if (!event.ctrlKey && !event.metaKey) {
                  return;
                }

                switch (event.key) {
                  case 'b': {
                    event.preventDefault();
                    const marks = Editor.marks(editor);
                    const isActive = marks?.bold === true;
                    if (isActive) {
                      Editor.removeMark(editor, 'bold');
                    } else {
                      Editor.addMark(editor, 'bold', true);
                    }
                    break;
                  }
                  case 'i': {
                    event.preventDefault();
                    const marks = Editor.marks(editor);
                    const isActive = marks?.italic === true;
                    if (isActive) {
                      Editor.removeMark(editor, 'italic');
                    } else {
                      Editor.addMark(editor, 'italic', true);
                    }
                    break;
                  }
                  case 'u': {
                    event.preventDefault();
                    const marks = Editor.marks(editor);
                    const isActive = marks?.underline === true;
                    if (isActive) {
                      Editor.removeMark(editor, 'underline');
                    } else {
                      Editor.addMark(editor, 'underline', true);
                    }
                    break;
                  }
                }
              }}
            />
          </div>
        </Slate>
        {showSlashMenu && (
          <SlashCommandMenu
            commands={filteredCommands}
            position={slashMenuPosition}
            selectedIndex={selectedCommandIndex}
            onSelect={handleCommandSelect}
          />
        )}
      </div>
    </div>
  );
}
