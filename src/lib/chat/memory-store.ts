// src/lib/chat/memory-store.ts

import { join } from 'path'
import { readdir, readFile } from 'fs/promises'
import { COMPANY_NAMES } from '../constants'
import { OllamaEmbeddings } from './ollama-embeddings'

interface CustomDocument {
  id: string;
  content: string;
  metadata: {
    source: string;
    section: string;
    type: string;
    priority?: number;
    company?: string;
    role?: string;
    period?: string;
    originalName?: string;
    isCurrentRole?: boolean;
  };
  embedding?: number[];
}

export class VectorStore {
  private static instance: VectorStore | null = null;
  private documents: CustomDocument[] = [];
  private initialized: boolean = false;
  private readonly maxContextLength = 12000;
  private workExperienceCache: string = '';
  private embedder: OllamaEmbeddings;
  private messageEmbeddingCache: Map<string, number[]> = new Map();

  private static companyNameVariants: Map<string, Set<string>> = new Map(
    Array.from(COMPANY_NAMES).map(name => {
      const normalized = VectorStore.normalizeCompanyName(name);
      return [normalized, new Set([name])];
    })
  );

  public static normalizeCompanyName(rawName: string): string {
    return rawName.replace(/\(.*?\)/g, '').trim();
  }

  public static getCompanyVariants(name: string): Set<string> {
    const normalized = this.normalizeCompanyName(name);
    return this.companyNameVariants.get(normalized) || new Set([name]);
  }

  private constructor(ollamaUrl: string) {
    this.embedder = new OllamaEmbeddings(ollamaUrl);
  }

  public static async getInstance(ollamaUrl = 'http://localhost:11434'): Promise<VectorStore> {
    if (!VectorStore.instance) {
      VectorStore.instance = new VectorStore(ollamaUrl);
      await VectorStore.instance.initialize();
    }
    return VectorStore.instance;
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const knowledgeBasePath = join(process.cwd(), 'knowledge_base');
      await this.addDocumentsFromDirectory(knowledgeBasePath);
      await this.initializeWorkExperienceCache();
      this.initialized = true;
      console.log('Vector store initialized successfully');
      console.log(`Indexed ${this.documents.length} documents from knowledge base`);
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw new Error('Failed to initialize vector store');
    }
  }

  private async addDocumentsFromDirectory(dirPath: string): Promise<void> {
    try {
      const files = await readdir(dirPath);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const content = await readFile(join(dirPath, file), 'utf-8');
          const documents = this.processMarkdownContent(content, file);
          
          for (const doc of documents) {
            // Generate embedding using Ollama
            doc.embedding = await this.embedder.generateEmbedding(doc.content);
            this.documents.push(doc);
          }
        }
      }
      
      console.log(`Indexed ${this.documents.length} documents from ${dirPath}`);
    } catch (error) {
      console.error('Error adding documents:', error);
      throw error;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async search(query: string): Promise<string> {
    try {
      // Check cache first
      let queryEmbedding: number[];
      if (this.messageEmbeddingCache.has(query)) {
        queryEmbedding = this.messageEmbeddingCache.get(query)!;
      } else {
        queryEmbedding = await this.embedder.generateEmbedding(query);
        this.messageEmbeddingCache.set(query, queryEmbedding);
      }

      // First, get critical work experience documents
      const criticalDocs = this.documents.filter(doc => 
        doc.metadata.source === 'work-experience.md' && 
        (doc.metadata.company === 'AeroVironment' || 
         doc.metadata.company === 'Joint Tactics and Technologies')
      );

      // Then get other relevant documents
      const scoredDocs = this.documents
        .filter(doc => !criticalDocs.some(cd => cd.id === doc.id))
        .map(doc => ({
          content: doc.content,
          score: this.cosineSimilarity(queryEmbedding, doc.embedding!),
          priority: doc.metadata.priority || 1,
          isWorkExperience: doc.metadata.source === 'work-experience.md'
        }))
        .sort((a, b) => {
          const scoreA = a.score * Math.log2(a.priority + 1);
          const scoreB = b.score * Math.log2(b.priority + 1);
          return scoreB - scoreA;
        });

      // Start with critical work experience
      let contextString = criticalDocs.map(doc => doc.content).join('\n\n---\n\n');
      
      // Add work experience cache if not already included
      if (!contextString.includes(this.workExperienceCache)) {
        contextString = this.workExperienceCache + '\n\n---\n\n' + contextString;
      }

      // Calculate remaining space
      const criticalReserve = contextString.length + 100;
      const adjustedMaxLength = this.maxContextLength - criticalReserve;

      // Add other relevant documents
      let i = 0;
      while (i < scoredDocs.length && contextString.length < adjustedMaxLength) {
        const doc = scoredDocs[i];
        if (!doc.isWorkExperience) {
          const newContext = contextString + '\n\n---\n\n' + doc.content;
          if (newContext.length <= adjustedMaxLength) {
            contextString = newContext;
          } else {
            break;
          }
        }
        i++;
      }

      return contextString.trim();
    } catch (error) {
      console.error('Error in search:', error);
      throw error;
    }
  }

  private async initializeWorkExperienceCache(): Promise<void> {
    const workExperienceDocs = this.documents.filter(
      doc => doc.metadata.source === 'work-experience.md' && doc.metadata.isCurrentRole
    );

    if (workExperienceDocs.length > 0) {
      this.workExperienceCache = workExperienceDocs
        .map(doc => doc.content)
        .join('\n\n---\n\n');
    }
  }

  private processMarkdownContent(content: string, filename: string): CustomDocument[] {
    const documents: CustomDocument[] = [];
    
    if (filename === 'work-experience.md') {
      return this.processWorkExperience(content, filename);
    }

    // Split content into sections based on headers
    const sections = content.split(/(?=^#+ )/m).filter(section => section.trim());
    
    for (const section of sections) {
      const lines = section.split('\n');
      const headerMatch = lines[0].match(/^(#+)\s+(.+)$/);
      
      if (headerMatch) {
        const title = headerMatch[2];
        const content = lines.slice(1).join('\n').trim();
        
        if (content) {
          documents.push({
            id: `${filename}-${title}`.replace(/\s+/g, '-').toLowerCase(),
            content: `${title}\n\n${content}`,
            metadata: {
              source: filename,
              section: title,
              type: this.determineDocumentType(filename),
              priority: this.assignPriority(filename, title)
            }
          });
        }
      }
    }
    
    return documents;
  }

  private processWorkExperience(content: string, filename: string): CustomDocument[] {
    const documents: CustomDocument[] = [];
    
    // Split content into company sections
    const companySections = content.split(/(?=^###\s+[A-Z])/m)
      .filter(section => section.trim());
    
    for (const section of companySections) {
      const lines = section.split('\n');
      const companyMatch = lines[0].match(/^###\s+(.+)$/);
      
      if (companyMatch) {
        const companyName = companyMatch[1];
        const normalizedName = VectorStore.normalizeCompanyName(companyName);
        
        let role = '';
        let period = '';
        let isCurrentRole = false;
        const responsibilities: string[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('- role:')) {
            role = line.replace('- role:', '').trim();
          } else if (line.startsWith('- period:')) {
            period = line.replace('- period:', '').trim();
          } else if (line.startsWith('- type:')) {
            isCurrentRole = line.includes('Current Position');
          } else if (line.startsWith('-') && !line.includes(':')) {
            responsibilities.push(line);
          }
        }
        
        const content = `
Company: ${companyName}
Role: ${role}
Period: ${period}
Responsibilities:
${responsibilities.join('\n')}`.trim();

        documents.push({
          id: `${filename}-${normalizedName}-${role}`.replace(/\s+/g, '-').toLowerCase(),
          content,
          metadata: {
            source: filename,
            section: normalizedName,
            type: 'work_experience',
            company: normalizedName,
            role,
            period,
            originalName: companyName,
            isCurrentRole,
            priority: isCurrentRole ? 5 : 3
          }
        });
      }
    }
    
    return documents;
  }

  private determineDocumentType(filename: string): string {
    const types: { [key: string]: string } = {
      'work-experience.md': 'work_experience',
      'technical-skills.md': 'skills',
      'professional-overview.md': 'overview',
      'recommendations.md': 'recommendations'
    };
    return types[filename] || 'general';
  }

  private assignPriority(filename: string, section: string): number {
    // Higher priority for current work experience and core skills
    if (filename === 'work-experience.md') {
      return section.toLowerCase().includes('current') ? 5 : 3;
    }
    if (filename === 'technical-skills.md') {
      return 4;
    }
    if (filename === 'professional-overview.md') {
      return 4;
    }
    return 2;
  }
}