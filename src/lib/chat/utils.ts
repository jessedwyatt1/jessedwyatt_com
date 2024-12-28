// src/lib/chat/utils.ts

const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with'
  ]);
  
  export function removeStopwords(text: string): string {
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => !stopwords.has(word))
      .join(' ');
  }