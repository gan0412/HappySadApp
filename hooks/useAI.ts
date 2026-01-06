"use client";

import { useState } from 'react';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewriteText = async (text: string, mode: 'happy' | 'sad'): Promise<string> => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to rewrite text');
      }

      const data = await response.json();
      return data.rewrittenText;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { rewriteText, isLoading, error };
}
