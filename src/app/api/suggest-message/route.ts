import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { messages }: { messages: UIMessage[] } = body;

    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        {
          success: false,
          message: "Invalid messages format. Expected an array of messages."
        },
        { status: 400 }
      );
    }

    // Check if messages array is empty
    if (messages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages provided."
        },
        { status: 400 }
      );
    }

    // Attempt to generate AI response
    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Error in suggest-message API:', error);

    // Handle specific error types
    if (error.name === 'SyntaxError') {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON format in request body."
        },
        { status: 400 }
      );
    }

    // Handle OpenAI API errors
    if (error.code === 'insufficient_quota') {
      return Response.json(
        {
          success: false,
          message: "OpenAI API quota exceeded. Please try again later."
        },
        { status: 429 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return Response.json(
        {
          success: false,
          message: "Invalid OpenAI API key configuration."
        },
        { status: 401 }
      );
    }

    // Handle rate limiting
    if (error.status === 429) {
      return Response.json(
        {
          success: false,
          message: "Rate limit exceeded. Please try again later."
        },
        { status: 429 }
      );
    }

    // Generic error response
    return Response.json(
      {
        success: false,
        message: "Failed to generate AI suggestion. Please try again."
      },
      { status: 500 }
    );
  }
}