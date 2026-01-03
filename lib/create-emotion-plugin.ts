import { createPluginFactory } from '@platejs/core';
import { Range } from 'slate';

export const EMOTION_DECORATOR_KEY = 'emotionDecorator';

export const createEmotionDecoratorPlugin = createPluginFactory({
  key: EMOTION_DECORATOR_KEY,
  decorate: ({ editor }) => {
    const decorations: any[] = [];

    if (!editor.children) return decorations;

    const searchWords = ['happy', 'sad'];
    const regex = /\b(happy|sad)\b/gi;

    for (const [node, path] of editor.children.entries()) {
      if (!node || typeof node !== 'object') continue;

      const walkNode = (n: any, p: number[]): void => {
        if (n.text && typeof n.text === 'string') {
          const text = n.text;
          let match;

          while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            decorations.push({
              anchor: { path: p, offset: start },
              focus: { path: p, offset: end },
              decoration: {
                type: 'emotion',
                word: match[0].toLowerCase(),
              },
            });
          }
        }

        if (n.children && Array.isArray(n.children)) {
          n.children.forEach((child: any, index: number) => {
            walkNode(child, [...p, index]);
          });
        }
      };

      walkNode(node, [path]);
    }

    return decorations;
  },
});
