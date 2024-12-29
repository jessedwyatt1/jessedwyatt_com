// src/lib/chat/memory-store.ts

import { join } from 'path'
import { readdir, readFile } from 'fs/promises'
import { COMPANY_NAMES } from '../constants'
import { OllamaEmbeddings } from './ollama-embeddings'
import { readProjects } from '../projects/utils';

interface DocumentMetadata {
  source: string;
  section: string;
  type: string;
  priority?: number;
  company?: string;
  role?: string;
  period?: string;
  originalName?: string;
  isCurrentRole?: boolean;
  projectId?: string;
  projectTitle?: string;
}

interface CustomDocument {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  embedding?: number[];
}

interface ProjectDocument extends CustomDocument {
  metadata: {
    source: string;
    section: string;
    type: string;
    priority?: number;
    projectId?: string;
    projectTitle?: string;
  };
}

interface ScoredDocument {
  content: string;
  score: number;
  priority: number;
  type?: string;
  projectId?: string;
}

interface Document {
  id: string;
  content: string;
  metadata: {
    type: string;
    priority?: number;
    projectId?: string;
    projectTitle?: string;
    source: string;
    section: string;
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
  private projectDocuments: ProjectDocument[] = [];

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
      await this.initializeProjectDocuments();
      
      // Sort documents by priority
      this.documents.sort((a, b) => 
        (b.metadata.priority || 0) - (a.metadata.priority || 0)
      );
      
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

  public async search(query: string): Promise<string> {
    const queryLower = query.toLowerCase();
    const isProjectQuery = queryLower.includes('project') || 
                          queryLower.includes('portfolio') || 
                          queryLower.includes('work') ||
                          queryLower.includes('built') ||
                          queryLower.includes('created');

    // Always include current work experience
    const workDocs = this.documents.filter(doc => 
      doc.metadata.type === 'work_experience' && 
      (doc.metadata.isCurrentRole || doc.content.includes('AeroVironment') || doc.content.includes('Joint Tactics'))
    );

    // Debug logging
    if (isProjectQuery) {
      const projectDocs = this.documents.filter((doc: Document) => 
        doc.metadata.type === 'project'
      );
      console.log(`Found ${projectDocs.length} project documents`);
      console.log('Project titles:', projectDocs.map(doc => doc.metadata.projectTitle));
    }

    const queryEmbedding = await this.embedder.generateEmbedding(query);
    
    // Get relevant documents based on query
    const relevantDocs: ScoredDocument[] = [];
    if (isProjectQuery) {
      const projectDocs = this.documents.filter((doc: Document) => 
        doc.metadata.type === 'project'
      );

      if (projectDocs.length > 0) {
        // Score all project documents with randomization
        const scoredProjectDocs = projectDocs
          .map(doc => ({
            content: doc.content,
            score: this.cosineSimilarity(queryEmbedding, doc.embedding!) * (0.9 + Math.random() * 0.2), // Add 10% random variation
            priority: doc.metadata.priority || 3,
            type: 'project',
            projectId: doc.metadata.projectId
          }))
          .sort((a, b) => b.score - a.score);

        // Take top 3 projects after randomization
        relevantDocs.push(...scoredProjectDocs.slice(0, 3));
        
        // Debug logging
        console.log('Selected projects:', relevantDocs.map(doc => doc.content.split('\n')[0]));
      }
    }

    // Score and sort remaining documents
    const otherDocs = this.documents
      .filter((doc: Document) => !relevantDocs.some(rd => rd.content === doc.content))
      .map(doc => ({
        content: doc.content,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding!),
        priority: doc.metadata.priority || 1
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Combine documents, ensuring work experience is included
    const finalDocs = [
      ...workDocs.map(doc => ({
        content: doc.content,
        score: 1,
        priority: 5 // Highest priority for work experience
      })),
      ...relevantDocs,
      ...otherDocs
    ];

    // Sort by priority and score
    finalDocs.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.score - a.score;
    });

    return finalDocs
      .map(doc => doc.content)
      .join('\n\n---\n\n');
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

  private async initializeProjectDocuments(): Promise<void> {
    try {
      const projects = await readProjects();
      
      for (const project of projects) {
        if (project.showOnPersonalPage) {
          // Create main project document with all available information
          const mainContent = `
            Project: ${project.title}
            Description: ${project.description}
            Technologies: ${project.tech.join(', ')}
            Features: ${project.features.map(f => `- ${f}`).join('\n')}
            ${project.github ? `GitHub Repository: ${project.github}` : ''}
            ${project.live ? `Live Site: ${project.live}` : ''}
            ${project.blogUrl ? `Blog Post: ${project.blogUrl}` : ''}
          `.trim();

          this.projectDocuments.push({
            id: `project-${project.id}`,
            content: mainContent,
            metadata: {
              source: 'projects.json',
              section: project.title,
              type: 'project',
              priority: 3,
              projectId: project.id,
              projectTitle: project.title
            }
          });

          // Create technical details document
          const techContent = `
            ${project.title} Technical Implementation:
            Tech Stack: ${project.tech.join(', ')}
            ${project.features.map(f => `- ${f}`).join('\n')}
          `.trim();

          this.projectDocuments.push({
            id: `project-${project.id}-tech`,
            content: techContent,
            metadata: {
              source: 'projects.json',
              section: `${project.title} Technical Details`,
              type: 'project_technical',
              priority: 2,
              projectId: project.id,
              projectTitle: project.title
            }
          });
        }
      }

      // Generate embeddings for project documents
      for (const doc of this.projectDocuments) {
        doc.embedding = await this.embedder.generateEmbedding(doc.content);
      }

      // Add project documents to main documents array
      this.documents.push(...this.projectDocuments);

      console.log(`Added ${this.projectDocuments.length} project documents to vector store`);
    } catch (error) {
      console.error('Error initializing project documents:', error);
      throw error;
    }
  }
}