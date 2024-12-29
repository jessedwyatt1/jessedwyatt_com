import { Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function CertificationsGrid() {
  const certifications = [
    {
      title: "DoD 8570.01-M IAT2",
      subtitle: "Windows Server",
      category: "Department of Defense"
    },
    {
      title: "Windows Server 2012R2",
      subtitle: "70-410/411 Certification",
      category: "Microsoft"
    },
    {
      title: "CompTIA Security+",
      subtitle: "Security Certification",
      category: "CompTIA"
    },
    {
      title: "CompTIA Network+",
      subtitle: "Network Certification",
      category: "CompTIA"
    },
    {
      title: "CompTIA A+",
      subtitle: "Hardware/Software Certification",
      category: "CompTIA"
    },
    {
      title: "Windows 7 MCP",
      subtitle: "70-680 Certification",
      category: "Microsoft"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-slate-700/50 to-slate-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Certifications</h2>
          <p className="text-muted-foreground">
            Industry and DoD recognized certifications
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border border-border/50 bg-gradient-to-br from-card/50 to-card hover:from-card hover:to-card/80 transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1 flex items-start gap-4"
            >
              <Award className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.subtitle}</p>
                <div className="mt-2">
                  <Badge variant="secondary">
                    {cert.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 