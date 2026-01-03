"use client";

import React, { useMemo, useCallback, useState } from 'react';
import { createEditor, Descendant, BaseEditor, Transforms, Editor } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initialValue } from '@/lib/plate-config';
import { EmotionLeaf } from './EmotionLeaf';
import { useAI } from '@/hooks/useAI';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: { type: string; children: Descendant[] };
    Text: { text: string; emotion?: string };
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

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

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

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);

    const text = getEditorText(newValue);

    if (text.includes('/rewrite') && !isRewriting) {
      setIsRewriting(true);
      const textToRewrite = text.replace('/rewrite', '').trim();

      if (textToRewrite) {
        rewriteText(textToRewrite, mode)
          .then((rewritten) => {
            // Use Slate's Transforms API to properly update the editor
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

            // Save the new content
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
          });
      } else {
        setIsRewriting(false);
      }
    }
  }, [editor, mode, rewriteText, setValue, isRewriting]);

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
    return <EmotionLeaf {...props} />;
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
            Type &quot;/rewrite&quot; to transform your text. Try typing &quot;happy&quot; or &quot;sad&quot; to create interactive elements!
          </p>
          {(isAILoading || isRewriting) && (
            <p className="text-sm text-blue-600 mt-1">AI is rewriting your text...</p>
          )}
        </div>
        <div className="p-6">
          <Slate editor={editor} initialValue={value} onChange={handleChange}>
            <Editable
              decorate={decorate}
              renderLeaf={renderLeaf}
              placeholder="Start typing..."
              className="min-h-[400px] focus:outline-none"
            />
          </Slate>
        </div>
      </div>
    </div>
  );
}
