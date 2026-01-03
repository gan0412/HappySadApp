"use client";

import { useEffect } from 'react';
import { useEditorState, getEditorString, insertNodes } from '@platejs/core';
import { useAI } from '@/hooks/useAI';

interface AISlashCommandProps {
  mode: 'happy' | 'sad';
}

export function useAISlashCommand(mode: 'happy' | 'sad', editor: any) {
  const { rewriteText, isLoading } = useAI();

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const selection = editor.selection;
      if (!selection) return;

      const editorText = getEditorString(editor, []);

      if (editorText.includes('/rewrite')) {
        e.preventDefault();

        const textToRewrite = editorText.replace('/rewrite', '').trim();

        if (textToRewrite) {
          try {
            const rewritten = await rewriteText(textToRewrite, mode);

            editor.children = [{
              type: 'p',
              children: [{ text: rewritten }],
            }];

            editor.onChange();
          } catch (error) {
            console.error('Failed to rewrite text:', error);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, mode, rewriteText]);

  return { isLoading };
}
