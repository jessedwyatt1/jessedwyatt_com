// src/lib/chat/ollama-embeddings.ts

interface EmbeddingResponse {
    embedding: number[];
  }
  
  export class OllamaEmbeddings {
    private baseUrl: string;
    private model: string;
  
    constructor(baseUrl: string, model = 'nomic-embed-text') {
      this.baseUrl = baseUrl;
      this.model = model;
    }
  
    async generateEmbedding(text: string): Promise<number[]> {
      try {
        const response = await fetch(`${this.baseUrl}/api/embeddings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            prompt: text,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json() as EmbeddingResponse;
        return data.embedding;
      } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
      }
    }
  }