export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  showInList?: boolean;
  project?: {
    name: string;
    github?: string;
    live?: string;
  };
  social?: {
    image?: string;
    title?: string;
    description?: string;
  };
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  showInList?: boolean;
  project?: {
    name: string;
    github?: string;
    live?: string;
  };
}

export type BlogParams = Promise<{
  slug: string[];
}>; 