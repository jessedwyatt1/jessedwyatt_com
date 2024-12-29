import { NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';
import { readProjects, writeProjects } from '@/lib/projects/utils';
import { revalidateProjectPaths } from '@/lib/projects/revalidate';
import { ProjectWithId } from '@/lib/projects/types';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id } = await context.params;

    // Read current projects using utility function
    const projects = await readProjects();

    // Find and update the project
    const projectIndex = projects.findIndex((p: ProjectWithId) => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update project, ensuring blogUrl is properly handled
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...data,
      ...(data.blogUrl ? { blogUrl: data.blogUrl } : { blogUrl: undefined })
    };

    // Write using utility function
    await writeProjects(projects);

    // Revalidate project paths
    await revalidateProjectPaths();

    return NextResponse.json({ success: true, project: projects[projectIndex] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Read current projects using utility function
    const projects = await readProjects();

    // Find project index
    const projectIndex = projects.findIndex((p: ProjectWithId) => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Remove project
    projects.splice(projectIndex, 1);

    // Write using utility function
    await writeProjects(projects);

    // Revalidate project paths
    await revalidateProjectPaths();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 