"use client"

import { useEffect, useState } from "react";
import { ProjectWithId } from "@/lib/projects/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Lock, Globe, BookOpen } from "lucide-react";
import Link from "next/link";

export function ProjectsGrid() {
  const [projects, setProjects] = useState<ProjectWithId[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <div key={project.id} className="group relative flex flex-col bg-slate-900/50 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-200">
                {project.title}
              </h3>
              <Badge 
                variant="outline" 
                className={`
                  text-xs px-2 h-5 shrink-0
                  ${project.isPublic 
                    ? 'border-green-800/50 bg-green-900/10 text-green-400 hover:bg-green-900/20' 
                    : 'border-orange-800/50 bg-orange-900/10 text-orange-400 hover:bg-orange-900/20'}
                `}
              >
                <span className="flex items-center gap-1">
                  {project.isPublic ? (
                    <>
                      <Globe className="h-3 w-3" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Private</span>
                    </>
                  )}
                </span>
              </Badge>
            </div>
            
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.tech.slice(0, 4).map((tech) => (
                <Badge 
                  key={tech} 
                  variant="secondary"
                  className="bg-slate-800/50 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  {tech}
                </Badge>
              ))}
              {project.tech.length > 4 && (
                <Badge 
                  variant="secondary"
                  className="bg-slate-800/50 text-slate-300 hover:bg-slate-800 text-xs"
                >
                  +{project.tech.length - 4}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {project.github && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                asChild
              >
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span className="text-xs">Code</span>
                </a>
              </Button>
            )}
            {project.live && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                asChild
              >
                <a 
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="text-xs">Demo</span>
                </a>
              </Button>
            )}
            {project.blogUrl && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 ml-auto" 
                asChild
              >
                <Link href={project.blogUrl} className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="text-xs">Read More</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 