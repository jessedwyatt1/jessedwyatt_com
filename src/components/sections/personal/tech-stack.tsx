import { Code2, Terminal, Database, Cloud } from "lucide-react"

export function TechStack() {
  const categories = [
    {
      title: "Languages",
      icon: Code2,
      items: ["TypeScript", "Python", "Go", "Rust"]
    },
    {
      title: "Frontend",
      icon: Terminal,
      items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"]
    },
    {
      title: "Backend",
      icon: Database,
      items: ["Node.js", "FastAPI", "PostgreSQL", "Redis"]
    },
    {
      title: "Infrastructure",
      icon: Cloud,
      items: ["Docker", "Kubernetes", "AWS", "Terraform"]
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
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