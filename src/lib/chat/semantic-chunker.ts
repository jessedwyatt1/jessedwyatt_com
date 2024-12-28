// src/lib/chat/semantic-chunker.ts

interface ChunkOptions {
    maxChunkLength?: number;
    overlapSize?: number;
  }
  
  export class SemanticChunker {
    private static readonly defaultOptions: Required<ChunkOptions> = {
      maxChunkLength: 512,
      overlapSize: 50
    };
  
    static chunkDocument(text: string, options: ChunkOptions = {}): string[] {
      const opts = { ...this.defaultOptions, ...options };
      const chunks: string[] = [];
      
      // Split into semantic units (sentences/paragraphs)
      const units = text
        .split(/(?<=[.!?])\s+(?=[A-Z])/)
        .filter(unit => unit.trim().length > 0);
      
      let currentChunk = '';
      let previousOverlap = '';
  
      for (const unit of units) {
        if ((currentChunk + unit).length > opts.maxChunkLength) {
          if (currentChunk) {
            chunks.push(currentChunk);
            // Store overlap from end of current chunk
            previousOverlap = currentChunk.slice(-opts.overlapSize);
          }
          // Start new chunk with overlap + current unit
          currentChunk = previousOverlap + unit;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + unit;
        }
      }
  
      if (currentChunk) {
        chunks.push(currentChunk);
      }
  
      return chunks;
    }
  
    static chunkMarkdown(markdown: string, options: ChunkOptions = {}): string[] {
      // Split at headers but preserve hierarchy
      const sections = markdown.split(/(?=^#{1,3} )/m);
      
      const chunks: string[] = [];
      let currentHeader = '';
      
      for (const section of sections) {
        const headerMatch = section.match(/^(#{1,3})\s+(.+)$/m);
        
        if (headerMatch) {
          const [fullHeader, hashes, title] = headerMatch;
          const level = hashes.length;
          
          if (level === 1) {
            currentHeader = title;
          }
          
          const content = section.slice(fullHeader.length).trim();
          if (content) {
            const textChunks = this.chunkDocument(content, options);
            
            // Add header context to each chunk
            textChunks.forEach(chunk => {
              chunks.push(`[Section: ${currentHeader}] ${chunk}`);
            });
          }
        }
      }
      
      return chunks;
    }
  }