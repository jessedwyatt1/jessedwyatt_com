"use client"

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, RefreshCw, Trash, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectWithId } from "@/lib/projects/types";

export function ProjectManager() {
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch('/api/admin/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjects();
    }
  }, [isLoggedIn]);

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');
      await fetchProjects();
    } catch (error) {
      setError('Failed to delete project');
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You must be logged in to access this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Button onClick={fetchProjects} variant="secondary" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <a href="/admin/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </a>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <div className="flex gap-1">
                    {project.showOnPersonalPage ? (
                      <Badge variant="outline" className="border-green-800/50 bg-green-900/10 text-green-400">
                        Personal Page
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-slate-800/50 bg-slate-900/10 text-slate-400">
                        Hidden
                      </Badge>
                    )}
                    <Badge variant={project.isPublic ? "success" : "secondary"} className={`
                      ${project.isPublic ? 'bg-green-900/50 text-green-400' : 'bg-slate-800 text-slate-400'}
                    `}>
                      {project.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-slate-800">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/admin/projects/edit/${project.id}`}>
                    <Edit className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteProject(project.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 