import { z } from 'zod';
import { OllamaEmbeddings } from './ollama-embeddings';

// Export schemas if they're used for validation
export const WorkExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  period: z.string(),
  type: z.enum(['Current Position', 'Previous Position']),
  responsibilities: z.array(z.string()),
});

export const SkillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

type WorkExperience = z.infer<typeof WorkExperienceSchema>;
type Skill = z.infer<typeof SkillSchema>;

interface EmbeddedDocument {
  key: string;
  content: string;
  embedding: number[];
  metadata: {
    type: 'work' | 'skill';
    positionType?: 'Current Position' | 'Previous Position';
    [key: string]: unknown;
  };
}

export class StructuredStore {
  private static instance: StructuredStore | null = null;
  private embedder: OllamaEmbeddings;
  private documents: EmbeddedDocument[] = [];
  private workExperience: WorkExperience[] = [];
  private skills: Skill[] = [];
  private workExperienceCache: string = '';
  
  private constructor(ollamaUrl: string) {
    this.embedder = new OllamaEmbeddings(ollamaUrl);
  }

  public static async getInstance(ollamaUrl: string): Promise<StructuredStore> {
    if (!StructuredStore.instance) {
      StructuredStore.instance = new StructuredStore(ollamaUrl);
      await StructuredStore.instance.initialize();
    }
    return StructuredStore.instance;
  }

  private async initialize() {
    try {
      await this.parseWorkExperienceFromFiles();
      await this.parseSkillsFromFiles();
      await this.generateEmbeddings();
      await this.initializeWorkExperienceCache();
      
      console.log(`Initialized store with ${this.documents.length} embedded documents`);
    } catch (error) {
      console.error('Error initializing structured store:', error);
      throw error;
    }
  }

  private async parseWorkExperienceFromFiles() {
    // Implementation for parsing work experience from files
    // This would replace the parseWorkExperience method
  }

  private async parseSkillsFromFiles() {
    // Implementation for parsing skills from files
    // This would replace the parseSkills method
  }

  private async generateEmbeddings() {
    // Generate embeddings for work experience
    for (const exp of this.workExperience) {
      const content = `
        Company: ${exp.company}
        Role: ${exp.role}
        Period: ${exp.period}
        Responsibilities:
        ${exp.responsibilities.join('\n')}
      `.trim();

      const embedding = await this.embedder.generateEmbedding(content);
      
      this.documents.push({
        key: `work-${exp.company}-${exp.role}`,
        content,
        embedding,
        metadata: {
          type: 'work',
          positionType: exp.type,
          company: exp.company,
          role: exp.role,
          period: exp.period
        }
      });
    }

    // Generate embeddings for skills
    for (const skill of this.skills) {
      const content = `
        Category: ${skill.category}
        Skills: ${skill.skills.join(', ')}
      `.trim();

      const embedding = await this.embedder.generateEmbedding(content);
      
      this.documents.push({
        key: `skill-${skill.category}`,
        content,
        embedding,
        metadata: {
          type: 'skill',
          category: skill.category
        }
      });
    }
  }

  private async initializeWorkExperienceCache() {
    const currentPosition = this.documents.find(
      doc => doc.metadata.type === 'work' && doc.metadata.positionType === 'Current Position'
    );
    
    if (currentPosition) {
      this.workExperienceCache = currentPosition.content;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  public async search(query: string): Promise<string> {
    try {
      const queryEmbedding = await this.embedder.generateEmbedding(query);

      const scored = this.documents.map(doc => ({
        ...doc,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

      const context = scored
        .map(doc => doc.content)
        .join('\n\n---\n\n');

      return context;
    } catch (error) {
      console.error('Error in search:', error);
      throw error;
    }
  }

  // Helper methods
  public getCurrentRole(): WorkExperience | null {
    return this.workExperience.find(exp => exp.type === 'Current Position') || null;
  }

  public getSkillsByCategory(category: string): string[] {
    const skillGroup = this.skills.find(
      s => s.category.toLowerCase() === category.toLowerCase()
    );
    return skillGroup?.skills || [];
  }

  public getExperienceByCompany(company: string): WorkExperience[] {
    return this.workExperience.filter(exp => 
      exp.company.toLowerCase().includes(company.toLowerCase())
    );
  }
} 