import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ProjectWithId } from '@/lib/projects/types';

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

export async function GET() {
  try {
    console.log('Reading projects from:', PROJECTS_FILE);
    const content = await fs.readFile(PROJECTS_FILE, 'utf8');
    console.log('Projects content:', content);
    const projects = JSON.parse(content) as ProjectWithId[];
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error reading projects file:', error);
    return NextResponse.json({ projects: [] });
  }
} 