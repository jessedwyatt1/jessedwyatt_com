import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

export function PersonalHero() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Building Cool Things with Code
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A collection of personal projects, experiments, and open source contributions
          </p>
          <div className="flex justify-center gap-4 mb-12">
            <a href="https://github.com/jessedwyatt1/jessedwyatt_com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <Github className="w-4 h-4" />
                View GitHub
              </Button>
            </a>
            <Button size="lg" variant="secondary" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Live Demos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 