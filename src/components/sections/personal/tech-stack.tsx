import { Code2, Terminal, Database, Cloud, Server, Shield } from "lucide-react"

export function TechStack() {
  const categories = [
    {
      title: "Languages",
      icon: Code2,
      items: ["TypeScript", "Python", "Go", "Rust", "Shell Script"]
    },
    {
      title: "Frontend",
      icon: Terminal,
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Redux Toolkit", "Chakra UI"]
    },
    {
      title: "Backend & Data",
      icon: Database,
      items: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "MongoDB", "Vector DBs"]
    },
    {
      title: "Infrastructure",
      icon: Cloud,
      items: ["Docker", "Kubernetes", "Proxmox", "Nginx", "Terraform"]
    },
    {
      title: "DevOps & Monitoring",
      icon: Server,
      items: ["Portainer", "Ansible", "Prometheus", "Grafana", "CI/CD"]
    },
    {
      title: "Security & IAM",
      icon: Shield,
      items: ["Keycloak", "OpenSCAP", "STIG", "OAuth2", "Zero Trust"]
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-t from-blue-950/50 to-slate-900/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Tech Stack
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Technologies I love working with
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-slate-100">{category.title}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item, i) => (
                  <li key={i} className="text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 