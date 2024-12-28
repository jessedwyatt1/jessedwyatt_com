export interface Project {
  title: string;
  description: string;
  tech: string[];
  features: string[];
  github?: string;
  live?: string;
  blogUrl?: string;
  isPublic: boolean;
  privateReason?: string;
}

export interface ProjectWithId extends Project {
  id: string;
} 