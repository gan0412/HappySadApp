import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!mode || (mode !== 'happy' && mode !== 'sad')) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "happy" or "sad"' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = mode === 'happy'
      ? `Rewrite the following text to make it more positive, happy, and uplifting while maintaining the core meaning. Make it cheerful and optimistic:\n\n${text}`
      : `Rewrite the following text to make it more melancholic, sad, and somber while maintaining the core meaning. Make it more negative and pessimistic:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: mode === 'happy'
            ? 'You are a helpful assistant that rewrites text to be more positive and happy.'
            : 'You are a helpful assistant that rewrites text to be more negative and sad.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const rewrittenText = completion.choices[0]?.message?.content || text;

    return NextResponse.json({ rewrittenText });
  } catch (error: any) {
    console.error('Error in rewrite API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to rewrite text' },
      { status: 500 }
    );
  }
}
