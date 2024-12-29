import { Button } from "@/components/ui/button"
import { Github, ExternalLink, BookOpen } from "lucide-react"

export function PersonalHero() {
  return (
    <section className="pt-20 pb-4 bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-purple-600/10">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Building Cool Stuff with Code
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            A collection of personal projects, experiments, and open source contributions
          </p>

          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/jessedwyatt1/jessedwyatt_com"
                target="_blank"
                rel="noopener noreferrer"
              >
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

            <a href="/blog">
              <Button
                size="lg"
                variant="secondary"
                className="
                  relative
                  flex
                  flex-col
                  gap-1
                  text-lg
                  px-12
                  py-8
                  w-[380px]
                  bg-gradient-to-r
                  from-blue-500/10
                  to-purple-500/10
                  hover:from-blue-500/20
                  hover:to-purple-500/20
                  border border-blue-500/50
                  rounded-xl
                  transition-transform
                  transform
                  hover:-translate-y-1
                  hover:shadow-lg
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-purple-500
                "
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-semibold">
                    Deep Dives &amp; Crazy Ideas
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  (Warning: Heavy Tech Content)
                </span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}