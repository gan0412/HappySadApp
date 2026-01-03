"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plate, PlateContent, usePlateEditor } from '@platejs/core';
import { createPlatePlugins, initialValue } from '@/lib/plate-config';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { HappyElement } from './HappyElement';
import { SadElement } from './SadElement';
import { EmotionLeaf } from './EmotionLeaf';
import { useAI } from '@/hooks/useAI';
import { createCollaborationProvider, disconnectCollaboration } from '@/lib/collaboration';
import * as Y from 'yjs';

interface CollaborativeEditorProps {
  storageKey: string;
  mode: 'happy' | 'sad';
  roomId: string;
}

export function CollaborativeEditor({ storageKey, mode, roomId }: CollaborativeEditorProps) {
  const [value, setValue, isLoading] = useLocalStorage(storageKey, initialValue);
  const { rewriteText, isLoading: isAILoading } = useAI();
  const [isRewriting, setIsRewriting] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [doc, setDoc] = useState<Y.Doc | null>(null);

  useEffect(() => {
    if (roomId) {
      const { doc: yDoc, provider: yProvider } = createCollaborationProvider({
        roomId: `${mode}-${roomId}`,
      });
      setDoc(yDoc);
      setProvider(yProvider);

      return () => {
        disconnectCollaboration(yProvider);
      };
    }
  }, [roomId, mode]);

  const plugins = useMemo(() => createPlatePlugins(), []);

  const components = {
    'happy-text': HappyElement,
    'sad-text': SadElement,
  };

  const getEditorText = (nodes: any[]): string => {
    return nodes
      .map((node) => {
        if (node.children) {
          return getEditorText(node.children);
        }
        return node.text || '';
      })
      .join('');
  };

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

  const editor = usePlateEditor({
    plugins,
    value: value,
    decorate,
    onChange: (newValue: any) => {
      setValue(newValue as any);

      if (editor && newValue) {
        const text = getEditorText(newValue);

        if (text.includes('/rewrite') && !isRewriting) {
          setIsRewriting(true);
          const textToRewrite = text.replace('/rewrite', '').trim();

          if (textToRewrite) {
            rewriteText(textToRewrite, mode)
              .then((rewritten) => {
                const newValue = [{
                  id: '1',
                  type: 'p',
                  children: [{ text: rewritten }],
                }];
                setValue(newValue as any);

                if (editor.children) {
                  editor.children = newValue;
                  editor.onChange();
                }
              })
              .catch((error) => {
                console.error('Failed to rewrite:', error);
              })
              .finally(() => {
                setIsRewriting(false);
              });
          } else {
            setIsRewriting(false);
          }
        }
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading editor...</div>
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
            {mode === 'happy' ? '😊 Happy' : '😢 Sad'} Editor {roomId && `(Room: ${roomId})`}
          </h2>
          <p className="text-sm text-muted-foreground">
            Type &quot;/rewrite&quot; to transform your text. Try typing &quot;happy&quot; or &quot;sad&quot; to create interactive elements!
          </p>
          {provider && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Connected to collaboration room
            </p>
          )}
          {(isAILoading || isRewriting) && (
            <p className="text-sm text-blue-600 mt-1">AI is rewriting your text...</p>
          )}
        </div>
        <Plate
          editor={editor}
          components={components}
          renderLeaf={(props: any) => <EmotionLeaf {...props} />}
        >
          <PlateContent
            className="min-h-[400px] p-6 prose prose-sm max-w-none focus:outline-none"
            placeholder="Start typing..."
            renderLeaf={(props: any) => <EmotionLeaf {...props} />}
          />
        </Plate>
      </div>
    </div>
  );
}
