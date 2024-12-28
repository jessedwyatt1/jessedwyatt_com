import { Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"

export function ProjectsGrid() {
  const projects = [
    {
      title: "AI Portfolio Chat",
      description: "Personal website featuring an AI-powered chat interface built with Next.js, TypeScript, and local LLM integration. Implements RAG (Retrieval Augmented Generation) for accurate information retrieval from a structured knowledge base. Features dark mode design, responsive UI, and seamless content management through Markdown files.",
      tech: [
        "Next.js",
        "TypeScript",
        "Ollama",
        "Tailwind CSS",
        "RAG",
        "Markdown",
        "Docker"
      ],
      features: [
        "Local LLM integration via Ollama",
        "RAG system for context retrieval",
        "Dark mode optimized interface",
        "Responsive design",
        "Markdown-based knowledge base",
        "Docker containerization"
      ],
      github: "https://github.com/jessedwyatt1/jessedwyatt_com",
      live: "https://jessedwyatt.com",
      isPublic: true,
    },
    {
      title: "MealForks.com",
      description: "A vibrant culinary community platform where users can share recipes, create collections, and engage in cooking challenges. Features include recipe forking (creating variations), private/public collections, and a ranking system for user engagement.",
      tech: [
        "Next.js",
        "React",
        "Redux Toolkit",
        "Chakra UI",
        "Formik",
        "Google Analytics",
        "Facebook SDK"
      ],
      features: [
        "Recipe sharing and forking system",
        "User collections and folders",
        "Rating and review system",
        "User progression/ranking system",
        "Responsive design",
        "Social media integration"
      ],
      // No GitHub link available in provided code
      live: "https://mealforks.com",
      isPublic: false,
      privateReason: "Protected IP and client data"
    },
    {
      "title": "Cinematix",
      "description": "A modern, AI-powered movie collection manager and Transmission interface built with React, TypeScript, and Tailwind CSS. Features intelligent movie organization through Plex integration, automated collection management via local LLM (Ollama), and real-time statistics. Implements a beautiful dark mode interface with responsive design and smooth animations.",
      "tech": [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Ollama",
        "Plex API",
        "WebSocket",
        "Framer Motion",
        "Docker"
      ],
      "features": [
        "AI-powered smart collections via Ollama",
        "Real-time torrent management",
        "Plex media server integration",
        "Advanced movie search and filtering",
        "Beautiful dark mode interface",
        "Real-time transfer statistics",
        "Responsive dashboard design",
        "Docker containerization"
      ],
      "codeHighlights": [
        {
          "file": "src/features/dashboard/Dashboard.tsx",
          "startLine": 14,
          "endLine": 165,
          "description": "Main dashboard implementation with real-time stats and system status"
        },
        {
          "file": "src/features/collections/Collections.tsx",
          "startLine": 160,
          "endLine": 206,
          "description": "AI-powered collection sync implementation"
        }
      ],
      "github": "https://github.com/jessedwyatt1/cinematix",
      "images": [
        "/cinematix-dashboard.png",
        "/cinematix-collections.png"
      ],
      isPublic: true,
    },
    {
      "title": "STIG Compliance Analyzer",
      "description": "A security compliance analysis tool built with Python and Streamlit that processes and validates Windows 11 STIG requirements against system configurations. Features an interactive web interface for analyzing XML-based security guidelines and provides automated assessment capabilities for DoD security standards compliance.",
      "tech": [
        "Python",
        "Streamlit",
        "XML Processing",
        "XCCDF",
        "Security Automation",
        "NIST Standards",
        "CPE",
        "pandas",
        "lxml",
        "Docker"
      ],
      "features": [
        "Interactive web dashboard",
        "Real-time STIG requirement parsing",
        "Automated compliance checking",
        "XML validation and processing",
        "Export capabilities for findings",
        "Responsive UI with Streamlit",
        "Docker containerization"
      ],
      "github": "https://github.com/yourusername/stig-analyzer",
      "live": "https://stig-analyzer.yourdomain.com",
      isPublic: false,
      privateReason: "Contains sensitive security implementations"
    },
    {
      "title": "Streaming Analytics Platform",
      "description": "Advanced analytics and management platform built with React and TypeScript. Features real-time performance monitoring, comprehensive SEO management, and partnership analytics. Implements dynamic data visualization using Recharts, with modular component architecture and responsive design patterns.",
      "tech": [
        "React",
        "TypeScript",
        "Recharts",
        "Framer Motion",
        "TailwindCSS",
        "MongoDB",
        "Redis",
        "Express"
      ],
      "features": [
        "Real-time performance monitoring and analytics",
        "Advanced SEO management system",
        "Partnership insights and metrics tracking",
        "Dynamic data visualization dashboards",
        "Responsive admin interface",
        "Multi-level caching strategy",
        "Automated testing framework",
        "Comprehensive API integration"
      ],
      "architecture": {
        "frontend": "React 18 with TypeScript",
        "state": "Zustand",
        "styling": "TailwindCSS with custom UI components",
        "monitoring": "Custom analytics and system metrics"
      },
      isPublic: false,
      privateReason: "Protected client IP and analytics logic"
    },
    {
      "title": "Ollama Load Balancer",
      "description": "A dynamic load balancer for distributing requests across multiple Ollama LLM instances. Features intelligent request routing, real-time monitoring, and comprehensive instance management. Implements multiple load balancing strategies and provides a rich CLI interface for system administration.",
      "tech": [
        "Python",
        "Ollama",
        "YAML",
        "Rich CLI",
        "Threading",
        "REST API",
        "Concurrent Processing"
      ],
      "features": [
        "Multiple load balancing strategies (Round Robin, Weighted Response Time, etc.)",
        "Real-time instance health monitoring",
        "Rich terminal UI with live statistics",
        "Dynamic instance management",
        "Graceful maintenance mode and request draining",
        "YAML-based configuration",
        "Comprehensive metrics collection"
      ],
      "github": null,
      "live": null,
      isPublic: true,
    }
    // Add more projects here
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-blue-950/50 to-slate-900/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Featured Projects
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Open source projects and experiments
        </p>
        
        <div className="flex justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="success" className="bg-green-900/50 text-green-400">Public</Badge>
            <span className="text-slate-400">Codebase available to public</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-800 text-slate-400">Private</Badge>
            <span className="text-slate-400">Codebase not available to public</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-100">
                    {project.title}
                  </h3>
                  <Tooltip content={project.isPublic ? "Public Repository" : `Private Repository - ${project.privateReason}`}>
                    <Badge variant={project.isPublic ? "success" : "secondary"} className={`
                      ${project.isPublic ? 'bg-green-900/50 text-green-400' : 'bg-slate-800 text-slate-400'}
                    `}>
                      {project.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </Tooltip>
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 