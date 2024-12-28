import { Github, ExternalLink, Star, GitFork } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ProjectsGrid() {
  const projects = [
    {
      title: "AI Portfolio Chat",
      description: "Personal website with AI-powered chat interface using local LLM (Ollama) and RAG implementation.",
      tech: ["Next.js", "TypeScript", "Ollama", "Tailwind"],
      github: "https://github.com/jessedwyatt1/portfolio-chat",
      live: "https://jessedwyatt.com",
      stats: {
        stars: 42,
        forks: 12
      }
    },
    {
      title: "Security Scanner CLI",
      description: "Command-line tool for automated security assessments and RMF compliance checks.",
      tech: ["Python", "Click", "Docker"],
      github: "https://github.com/jessedwyatt1/security-scanner",
      stats: {
        stars: 28,
        forks: 8
      }
    },
    // Add more projects here
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-blue-950/50 to-slate-900/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Featured Projects
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Open source projects and experiments
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-slate-100">
                  {project.title}
                </h3>
                <div className="flex gap-2">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-100 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-100 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-300">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {project.stats.stars}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {project.stats.forks}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 