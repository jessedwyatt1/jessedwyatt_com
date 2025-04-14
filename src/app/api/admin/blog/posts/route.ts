import { NextRequest, NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogPostMeta } from '@/lib/blog/types';
import { revalidateBlogPaths } from '@/lib/blog/revalidate';

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog');

export async function GET() {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts: BlogPostMeta[] = [];
    const years = await fs.readdir(POSTS_DIR);

    for (const year of years) {
      if (!year.match(/^\d{4}$/)) continue;
      const yearPath = path.join(POSTS_DIR, year);
      
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
            showInList: data.showInList !== false,
            project: data.project
          });
        }
      }
    }

    // Sort posts by date, newest first
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, description, content, tags, date, slug, showInList, project } = data;

    // Validate required fields
    if (!title || !description || !content || !date || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create directory structure if it doesn't exist
    const [year, month] = slug.split('/');
    const dirPath = path.join(POSTS_DIR, year, month);
    await fs.mkdir(dirPath, { recursive: true });

    // Create the markdown file
    const filePath = path.join(dirPath, `${slug.split('/')[2]}.md`);
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: 'Post already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, we can continue
    }

    // Prepare frontmatter
    const frontmatter = {
      title,
      date,
      description,
      tags: tags || [],
      ...(showInList === false && { showInList }),
      ...(project && { project })
    };

    // Create markdown content with frontmatter
    const markdown = matter.stringify(content, frontmatter);

    // Write the file
    await fs.writeFile(filePath, markdown);

    // Revalidate paths
    await revalidateBlogPaths(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 