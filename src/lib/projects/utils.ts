import fs from 'fs/promises';
import path from 'path';
import { ProjectWithId } from './types';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

export async function readProjects(): Promise<ProjectWithId[]> {
  try {
    const content = await fs.readFile(PROJECTS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function writeProjects(projects: ProjectWithId[]): Promise<void> {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
} 