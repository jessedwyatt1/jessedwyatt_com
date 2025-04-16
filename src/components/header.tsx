"use client"

import Link from "next/link"
import { NavMenu } from "@/components/nav-menu"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { mode } = useTheme()

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b border-border/50",
      mode === 'professional' 
        ? "bg-slate-800/50 backdrop-blur-sm" 
        : "bg-blue-950/50 border-blue-800/50 backdrop-blur-sm"
    )}>
      <div className="container flex h-16 items-center justify-between relative">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className={cn(
              "text-lg font-bold transition-colors",
              mode === 'professional'
                ? "text-primary hover:text-primary/80"
                : "text-blue-400 hover:text-blue-300"
            )}
          >
            Jesse D. Wyatt
          </Link>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              asChild
            >
              <a href="https://github.com/jessedwyatt1" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              asChild
            >
              <a href="https://linkedin.com/in/jessedwyatt" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              asChild
            >
              <a href="mailto:jessedwyatt@gmail.com" rel="noopener noreferrer">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          </div>
        </div>
        <NavMenu />
      </div>
    </header>
  )
}
