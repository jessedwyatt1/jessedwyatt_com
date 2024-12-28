import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMeta } from './types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const files = await fs.readdir(BLOG_DIR);
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
        const { data } = matter(content);
        
        return {
          slug: file.replace('.md', ''),
          title: data.title,
          date: data.date,
          description: data.description,
          tags: data.tags || [],
          project: data.project,
        };
      })
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const content = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      content: markdownContent,
      tags: data.tags || [],
      project: data.project,
    };
  } catch {
    return null;
  }
}

export function extractHeadings(content: string) {
  const headings: Array<{ id: string, text: string, level: number }> = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      headings.push({ id, text, level });
    }
  }

  return headings;
} 