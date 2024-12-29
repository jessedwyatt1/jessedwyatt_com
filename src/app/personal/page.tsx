"use client"
import { PersonalHero } from "@/components/sections/personal/hero"
import { ProjectsGrid } from "@/components/sections/personal/projects-grid"
import { TechStack } from "@/components/sections/personal/tech-stack"
import { HomeLab } from "@/components/sections/personal/home-lab"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SectionDivider } from "@/components/ui/section-divider"
import { GradientCursor } from "@/components/ui/gradient-cursor"
import { useEffect, useState } from "react"
import QuantumTunnel from "@/components/effects/QuantumTunnel"

// Konami code sequence
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
]

export default function PersonalPage() {
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === KONAMI_CODE[konamiIndex]) {
        if (konamiIndex === KONAMI_CODE.length - 1) {
          setShowEasterEgg(true)
          setKonamiIndex(0)
          // Reset after 5 seconds
          setTimeout(() => setShowEasterEgg(false), 5000)
        } else {
          setKonamiIndex(konamiIndex + 1)
        }
      } else {
        setKonamiIndex(0)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [konamiIndex])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      <GradientCursor />

      {/* Easter egg visual effect */}
      {showEasterEgg && (
        <QuantumTunnel 
          isActive={showEasterEgg}
          speed={1.5}
          colorStart="#60A5FA"  // blue-400
          colorEnd="#A855F7"    // purple-500
        />
      )}

      {/* Main content with fade effect */}
      <div 
        className={`transition-all duration-500 ${
          showEasterEgg ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="physics-content">
          <PersonalHero />
        </div>
        <SectionDivider />
        <div className="physics-content">
          <ProjectsGrid />
        </div>
        <SectionDivider />
        <div className="physics-content">
          <HomeLab />
        </div>
        <SectionDivider />
        <div className="physics-content">
          <TechStack />
        </div>
        <SectionDivider />
      </div>

      {/* Chat interface outside of main content div */}
      <ChatInterface />
    </main>
  )
}