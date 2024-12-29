"use client"

import { useEffect, useState } from "react";
import { ProjectWithId } from "@/lib/projects/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Lock, Globe, BookOpen, Info } from "lucide-react";
import Link from "next/link";
import { createPortal } from 'react-dom';

export function ProjectsGrid() {
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [tooltipContent, setTooltipContent] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        const visibleProjects = data.projects.filter(
          (p: ProjectWithId) => p.showOnPersonalPage
        );
        setProjects(visibleProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-purple-600/10 via-blue-700/10 to-blue-800/10">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Projects
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          A collection of personal and open source projects
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="group relative flex flex-col bg-slate-900/50 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-all hover:translate-y-[-4px] duration-300 ease-in-out">
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
                          {project.privateReason && (
                            <div 
                              className="group/info relative"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                if (project.privateReason) {
                                  setTooltipContent({
                                    text: project.privateReason,
                                    x: rect.left,
                                    y: rect.top
                                  });
                                }
                              }}
                              onMouseLeave={() => setTooltipContent(null)}
                            >
                              <Info className="h-3 w-3" />
                            </div>
                          )}
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
      </div>

      {tooltipContent && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed pointer-events-none bg-slate-800 text-xs rounded-md px-2 py-1 transition-opacity"
          style={{
            left: tooltipContent.x,
            top: tooltipContent.y - 30,
            transform: 'translateX(-50%)',
            zIndex: 9999
          }}
        >
          {tooltipContent.text}
        </div>,
        document.body
      )}
    </section>
  );
} 