// src/app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { VectorStore } from '@/lib/chat/memory-store'
import { OllamaClient } from '@/lib/chat/ollama-client'
import { SemanticChunker } from '@/lib/chat/semantic-chunker'
import { ChatRequest } from '@/types/chat';
import { OLLAMA_URL } from '@/lib/config';

const ollamaClient = new OllamaClient(OLLAMA_URL);

export async function POST(request: Request) {
  try {
    const { message } = await request.json() as ChatRequest;
    
    // Initialize vector store with existing embeddings
    const vectorStore = await VectorStore.getInstance(OLLAMA_URL);
    const rawContext = await vectorStore.search(message);
    
    // Chunk the context semantically
    const chunks = SemanticChunker.chunkDocument(rawContext, {
      maxChunkLength: 1024,
      overlapSize: 100
    });
    
    // Join chunks with clear separators
    const processedContext = chunks.join('\n---\n');
    
    console.log('Retrieved context chunks:', chunks.length);
    console.log('Total context length:', processedContext.length);

    // Set up streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start processing in the background
    const processStream = async () => {
      try {
        await ollamaClient.generateStreamingResponse(
          message,
          processedContext,
          async (token: string) => {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
            );
          }
        );
        
        await writer.write(encoder.encode('data: [DONE]\n\n'));
        await writer.close();
      } catch (error) {
        console.error('Stream processing error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
        );
        await writer.close();
      }
    };

    processStream().catch(console.error);

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}