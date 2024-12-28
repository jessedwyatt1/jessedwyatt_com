"use client"

import Link from "next/link"
import { NavMenu } from "@/components/nav-menu"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

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
        <NavMenu />
      </div>
    </header>
  )
}
