import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMeta } from './types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const posts: BlogPostMeta[] = [];
  const years = await fs.readdir(BLOG_DIR);

  for (const year of years) {
    if (!year.match(/^\d{4}$/)) continue;
    const yearPath = path.join(BLOG_DIR, year);
    
    const months = await fs.readdir(yearPath);
    for (const month of months) {
      if (!month.match(/^\d{2}$/)) continue;
      const monthPath = path.join(yearPath, month);
      
      const files = await fs.readdir(monthPath);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const content = await fs.readFile(path.join(monthPath, file), 'utf8');
        const { data } = matter(content);
        
        posts.push({
          slug: `${year}/${month}/${file.replace('.md', '')}`,
          title: data.title,
          date: data.date,
          description: data.description,
          tags: data.tags || [],
          project: data.project
        });
      }
    }
  }

  // Sort posts by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // Ensure slug exists and has the right format
    if (!slug || typeof slug !== 'string') {
      return null;
    }

    // Split the slug into parts and validate
    const slugParts = slug.split('/');
    if (slugParts.length !== 3) {
      return null;
    }

    const [year, month, postName] = slugParts;
    
    // Validate each part
    if (!year || !month || !postName) {
      return null;
    }

    const filePath = path.join(BLOG_DIR, year, month, `${postName}.md`);
    
    // Read and parse the file
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content: markdownContent } = matter(fileContent);
    
    // Return properly typed blog post
    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      content: markdownContent,
      tags: data.tags || [],
      project: data.project,
    };
  } catch (error) {
    // Log error for debugging but return null for consistency
    console.error(`Error reading blog post for slug ${slug}:`, error);
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