import { NextRequest, NextResponse } from 'next/server';
import { generateChatCompletion, parseUserIntent } from '@/lib/nearai-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, mode = 'chat' } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // If mode is 'intent', parse the user's intent
    if (mode === 'intent') {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        const intent = await parseUserIntent(lastMessage.content);
        return NextResponse.json({ intent });
      }
    }

    // Regular chat completion
    const response = await generateChatCompletion(messages);

    return NextResponse.json({
      content: response.content,
      role: response.role,
    });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

