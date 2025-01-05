"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

export function Footer() {
  const { mode } = useTheme()

  return (
    <footer className={cn(
      "border-t border-border/50",
      mode === 'professional' 
        ? "bg-slate-800/50" 
        : "bg-blue-950/50 border-blue-800/50"
    )}>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Contact</h3>
            <div className="space-y-2">
              <Link 
                href="#"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                href="/"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Professional
              </Link>
              <Link 
                href="/personal"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Personal
              </Link>
              <Link 
                href="/blog"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">Connect</h3>
            <div className="flex gap-2">
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
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jesse D. Wyatt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}