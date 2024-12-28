import { NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function PUT(
  request: Request, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use context.params, but skip strict typing for slug
    const { params } = context;
    const data = await request.json();
    const { title, description, content, tags, date, slug: newSlug, project } = data;

    // Validate required fields
    if (!title || !description || !content || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!params?.slug || !Array.isArray(params.slug) || params.slug.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid current slug format' },
        { status: 400 }
      );
    }

    const [currentYear, currentMonth, currentName] = params.slug;
    const currentFilePath = path.join(
      BLOG_DIR,
      currentYear,
      currentMonth,
      `${currentName}.md`
    );

    // If the slug in the body changed, move/rename the file
    if (newSlug && newSlug !== params.slug.join('/')) {
      const [newYear, newMonth, newName] = newSlug.split('/');
      const newDirPath = path.join(BLOG_DIR, newYear, newMonth);
      const newFilePath = path.join(newDirPath, `${newName}.md`);

      // Create new directory if it doesn't exist
      await fs.mkdir(newDirPath, { recursive: true });

      // Check if target file already exists
      try {
        await fs.access(newFilePath);
        return NextResponse.json(
          { error: 'Target post already exists' },
          { status: 409 }
        );
      } catch {
        // File doesn't exist, okay to proceed
      }

      // Prepare frontmatter
      const frontmatter = {
        title,
        date,
        description,
        tags: tags || [],
        ...(project && { project })
      };

      // Create markdown content with frontmatter
      const markdown = matter.stringify(content, frontmatter);

      // Write new file, delete old one
      await fs.writeFile(newFilePath, markdown);
      await fs.unlink(currentFilePath);

      // Attempt cleanup of empty directories
      try {
        await fs.rmdir(path.join(BLOG_DIR, currentYear, currentMonth));
        await fs.rmdir(path.join(BLOG_DIR, currentYear));
      } catch {
        // Ignore if directories aren't empty
      }
    } else {
      // Otherwise, just update the existing file
      const frontmatter = {
        title,
        date,
        description,
        tags: tags || [],
        ...(project && { project })
      };

      const markdown = matter.stringify(content, frontmatter);
      await fs.writeFile(currentFilePath, markdown);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request, 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { params } = context;
    if (!params?.slug || !Array.isArray(params.slug) || params.slug.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    const [year, month, postName] = params.slug;
    const filePath = path.join(BLOG_DIR, year, month, `${postName}.md`);

    await fs.unlink(filePath);

    // Attempt to clean up empty directories
    try {
      await fs.rmdir(path.join(BLOG_DIR, year, month));
      await fs.rmdir(path.join(BLOG_DIR, year));
    } catch {
      // Ignore if directories aren't empty
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 