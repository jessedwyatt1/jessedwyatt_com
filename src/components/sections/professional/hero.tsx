import { Button } from "@/components/ui/button"
import { Shield, Server, Code } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Cyber Security Engineer & Technical Leader
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Specializing in Information Systems Security Engineering (ISSE), 
            Risk Management Framework (RMF), and System Security Architecture
          </p>
          <div className="flex justify-center gap-4 mb-12">
            <Button size="lg">View Experience</Button>
            <Button size="lg" variant="secondary">Download Resume</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Security Focused</h3>
              <p className="text-sm text-muted-foreground">
                Expert in RMF implementation and ATO processes
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Server className="h-12 w-12 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">System Integration</h3>
              <p className="text-sm text-muted-foreground">
                Complex system security architecture and implementation
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Code className="h-12 w-12 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Technical Leadership</h3>
              <p className="text-sm text-muted-foreground">
                Proven track record in leading technical teams
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 