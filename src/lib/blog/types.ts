export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  project?: {
    name: string;
    github?: string;
    live?: string;
  };
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  project?: {
    name: string;
    github?: string;
    live?: string;
  };
}

export type BlogParams = Promise<{
  slug: string[];
}>; 