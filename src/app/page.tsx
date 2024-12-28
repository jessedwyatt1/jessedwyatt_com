"use client"

import { useRef } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { HeroSection } from "@/components/sections/professional/hero"
import { HighlightsSection } from "@/components/sections/professional/highlights"
import { ExperienceTimeline } from "@/components/sections/professional/experience-timeline"
import { CertificationsGrid } from "@/components/sections/professional/certifications"

export default function Home() {
  const experienceRef = useRef<HTMLDivElement>(null)

  return (
    <main className="min-h-screen bg-background">
      <div>
        <HeroSection experienceRef={experienceRef} />
        <HighlightsSection />
        <ExperienceTimeline ref={experienceRef} />
        <CertificationsGrid />
      </div>
      <ChatInterface />
    </main>
  )
}