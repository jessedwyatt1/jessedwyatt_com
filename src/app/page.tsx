import { ChatInterface } from "@/components/chat/chat-interface"
import { HeroSection } from "@/components/sections/professional/hero"
import { HighlightsSection } from "@/components/sections/professional/highlights"
import { ExperienceTimeline } from "@/components/sections/professional/experience-timeline"
import { CertificationsGrid } from "@/components/sections/professional/certifications"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Main content */}
      <div>
        <HeroSection />
        <HighlightsSection />
        <ExperienceTimeline />
        <CertificationsGrid />
      </div>

      {/* Chat Interface */}
      <ChatInterface />
    </main>
  )
}