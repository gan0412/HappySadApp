import { TElement, TText } from '@platejs/core';

export interface HappyTextElement extends TElement {
  type: 'happy-text';
  children: TText[];
}

export interface SadTextElement extends TElement {
  type: 'sad-text';
  children: TText[];
}

export type CustomElement = HappyTextElement | SadTextElement;
