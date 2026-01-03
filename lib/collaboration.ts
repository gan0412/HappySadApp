"use client";

import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export interface CollaborationConfig {
  roomId: string;
  username?: string;
}

export function createCollaborationProvider(config: CollaborationConfig) {
  const doc = new Y.Doc();

  const provider = new WebrtcProvider(config.roomId, doc, {
    signaling: [
      'wss://signaling.yjs.dev',
      'wss://y-webrtc-signaling-eu.herokuapp.com',
      'wss://y-webrtc-signaling-us.herokuapp.com'
    ],
  });

  return { doc, provider };
}

export function disconnectCollaboration(provider: WebrtcProvider) {
  if (provider) {
    provider.disconnect();
    provider.destroy();
  }
}
