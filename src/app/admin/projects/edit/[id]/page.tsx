import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import fs from 'fs/promises';
import path from 'path';
import { ProjectWithId } from "@/lib/projects/types";

const PROJECTS_FILE = path.join(process.cwd(), 'data', 'projects.json');

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(id: string): Promise<ProjectWithId | null> {
  try {
    const content = await fs.readFile(PROJECTS_FILE, 'utf8');
    const projects = JSON.parse(content);
    return projects.find((p: ProjectWithId) => p.id === id) || null;
  } catch (error) {
    console.error('Error reading project:', error);
    return null;
  }
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectEditor project={project} mode="edit" />;
} 