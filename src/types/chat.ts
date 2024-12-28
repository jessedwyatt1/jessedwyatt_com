// src/types/chat.ts

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
  error?: string
}