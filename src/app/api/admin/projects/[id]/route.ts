import { NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';
import fs from 'fs/promises';
import path from 'path';
import { ProjectWithId } from '@/lib/projects/types';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

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

    const data = await request.json();
    const { id } = context.params;

    // Read current projects
    const content = await fs.readFile(PROJECTS_FILE, 'utf8');
    const projects: ProjectWithId[] = JSON.parse(content);

    // Find and update the project
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update project, ensuring blogUrl is properly handled
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...data,
      ...(data.blogUrl ? { blogUrl: data.blogUrl } : { blogUrl: undefined })
    };

    // Write back to file
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));

    return NextResponse.json({ success: true, project: projects[projectIndex] });
  } catch (error) {
    console.error('Error updating project:', error);
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

    const projects = await readProjects();
    const filteredProjects = projects.filter((p: ProjectWithId) => p.id !== context.params.id);

    if (projects.length === filteredProjects.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await writeProjects(filteredProjects);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function readProjects(): Promise<ProjectWithId[]> {
  try {
    const content = await fs.readFile(PROJECTS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeProjects(projects: ProjectWithId[]): Promise<void> {
  await fs.mkdir(path.dirname(PROJECTS_FILE), { recursive: true });
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
} 