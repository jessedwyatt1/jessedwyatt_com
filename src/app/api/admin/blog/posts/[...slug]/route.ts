import { NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { revalidateBlogPaths } from '@/lib/blog/revalidate';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

interface RouteContext {
  params: Promise<{
    slug: string[];
  }>;
}

export async function PUT(
  request: Request, 
  context: RouteContext
) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { params } = context;
    const slugParams = await params;
    const data = await request.json();
    const { title, description, content, tags, date, slug: newSlug, showInList, project } = data;

    // Validate required fields
    if (!title || !description || !content || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!slugParams?.slug || !Array.isArray(slugParams.slug) || slugParams.slug.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid current slug format' },
        { status: 400 }
      );
    }

    const [currentYear, currentMonth, currentName] = slugParams.slug;
    const currentFilePath = path.join(
      BLOG_DIR,
      currentYear,
      currentMonth,
      `${currentName}.md`
    );

    // If the slug in the body changed, move/rename the file
    if (newSlug && newSlug !== slugParams.slug.join('/')) {
      const [newYear, newMonth, newName] = newSlug.split('/');
      const newDirPath = path.join(BLOG_DIR, newYear, newMonth);
      const newFilePath = path.join(newDirPath, `${newName}.md`);

      await fs.mkdir(newDirPath, { recursive: true });

      try {
        await fs.access(newFilePath);
        return NextResponse.json(
          { error: 'Target post already exists' },
          { status: 409 }
        );
      } catch {
        // File doesn't exist, okay to proceed
      }

      const frontmatter = {
        title,
        date,
        description,
        tags: tags || [],
        ...(showInList === false && { showInList }),
        ...(project && { project })
      };

      const markdown = matter.stringify(content, frontmatter);

      await fs.writeFile(newFilePath, markdown);
      await fs.unlink(currentFilePath);

      try {
        await fs.rmdir(path.join(BLOG_DIR, currentYear, currentMonth));
        await fs.rmdir(path.join(BLOG_DIR, currentYear));
      } catch {
        // Ignore if directories aren't empty
      }

      await revalidateBlogPaths(slugParams.slug.join('/'));
      await revalidateBlogPaths(newSlug);
    } else {
      const frontmatter = {
        title,
        date,
        description,
        tags: tags || [],
        ...(showInList === false && { showInList }),
        ...(project && { project })
      };

      const markdown = matter.stringify(content, frontmatter);
      await fs.writeFile(currentFilePath, markdown);
      await revalidateBlogPaths(slugParams.slug.join('/'));
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
  context: RouteContext
) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { params } = context;
    const slugParams = await params;

    if (!slugParams?.slug || !Array.isArray(slugParams.slug) || slugParams.slug.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    const [year, month, postName] = slugParams.slug;
    const filePath = path.join(BLOG_DIR, year, month, `${postName}.md`);

    await fs.unlink(filePath);

    try {
      await fs.rmdir(path.join(BLOG_DIR, year, month));
      await fs.rmdir(path.join(BLOG_DIR, year));
    } catch {
      // Ignore if directories aren't empty
    }

    await revalidateBlogPaths(slugParams.slug.join('/'));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 