"use client"

import { Button } from "@/components/ui/button"
import { Github, Shield, Server, Code } from "lucide-react"
import { RefObject } from "react"

interface HeroSectionProps {
  experienceRef: RefObject<HTMLDivElement | null>
}

export function HeroSection({ experienceRef }: HeroSectionProps) {
  const handleScrollToExperience = () => {
    if (experienceRef.current) {
      experienceRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700/50">
      <div className="container relative">
        <div className="absolute inset-0 hero-pattern opacity-50" />
        <div className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Cyber Architect & Problem Solver
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Building & implementing secure, scalable solutions for the modern enterprise.
            </p>
            <div className="flex flex-col items-center gap-4 mb-12">
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleScrollToExperience}>View Experience</Button>
                <a href="https://github.com/jessedwyatt1/jessedwyatt_com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Github className="w-4 h-4" />
                    View Page Repo
                  </Button>
                </a>
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
                    from-slate-500/10
                    to-slate-600/10
                    hover:from-slate-500/20
                    hover:to-slate-600/20
                    border border-slate-500/50
                    rounded-xl
                    transition-transform
                    transform
                    hover:-translate-y-1
                    hover:shadow-lg
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-slate-500
                  "
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="bg-gradient-to-r from-slate-400 to-slate-200 text-transparent bg-clip-text font-semibold">
                      Check Out My Tech Blog
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Technical deep dives into various topics
                  </div>
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Security Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Expert in RMF implementation, Defense in Depth, and Enterprise Security Architecture
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Server className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Systems Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Designing secure, scalable, and integrated systems for modern enterprises
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Code className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Innovative Problem Solving</h3>
                <p className="text-sm text-muted-foreground">
                  Innovating at the intersection of technology, security, and usability
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 