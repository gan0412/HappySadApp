import { createPluginFactory } from '@platejs/core';

export const ELEMENT_HAPPY_TEXT = 'happy-text';
export const ELEMENT_SAD_TEXT = 'sad-text';

export const createEmotionPlugin = createPluginFactory({
  key: 'emotion',
  handlers: {
    onChange: (editor) => () => {
      const { children } = editor;

      if (!children) return;

      let hasChanges = false;

      const processNode = (node: any): any => {
        if (node.text && typeof node.text === 'string') {
          const text = node.text;
          const happyMatch = text.match(/\bhappy\b/i);
          const sadMatch = text.match(/\bsad\b/i);

          if (happyMatch || sadMatch) {
            return node;
          }
        }

        if (node.children) {
          return {
            ...node,
            children: node.children.map(processNode),
          };
        }

        return node;
      };

      if (hasChanges) {
        editor.children = children.map(processNode);
      }
    },
  },
});
