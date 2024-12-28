import { Award, Shield, Users } from "lucide-react"

export function HighlightsSection() {
  const highlights = [
    {
      icon: Shield,
      title: "Security Expertise",
      description: "Led RMF implementation through full lifecycle and completed over 10 ATO packages for various systems.",
      stat: "10+",
      statLabel: "ATOs Completed"
    },
    {
      icon: Users,
      title: "Technical Leadership",
      description: "Managed security implementation for complex DoD systems and led cross-functional teams.",
      stat: "13+",
      statLabel: "Years Experience"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Multiple DoD 8570.01-M and industry certifications including Security+, Network+, and more.",
      stat: "6+",
      statLabel: "Certifications"
    }
  ]

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Career Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-card rounded-lg border border-border">
              <highlight.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
              <p className="text-muted-foreground mb-4">{highlight.description}</p>
              <div className="mt-auto">
                <div className="text-3xl font-bold text-primary">{highlight.stat}</div>
                <div className="text-sm text-muted-foreground">{highlight.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 