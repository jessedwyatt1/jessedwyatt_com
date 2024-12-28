import { NextRequest, NextResponse } from 'next/server';
import { checkServerAuth } from '@/lib/auth-server';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { Project, ProjectWithId } from '@/lib/projects/types';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

export async function GET() {
  try {
    const isAuthenticated = await checkServerAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await readProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
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

    const data = await req.json() as Project;
    const projects = await readProjects();

    const newProject = {
      id: nanoid(),
      ...data,
    };

    projects.push(newProject);
    await writeProjects(projects);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
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