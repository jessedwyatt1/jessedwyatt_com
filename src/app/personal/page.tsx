import { PersonalHero } from "@/components/sections/personal/hero"
import { ProjectsGrid } from "@/components/sections/personal/projects-grid"
import { TechStack } from "@/components/sections/personal/tech-stack"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function PersonalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Main content */}
      <div>
        <PersonalHero />
        <ProjectsGrid />
        <TechStack />
      </div>

      {/* Chat Interface */}
      <ChatInterface />
    </main>
  )
} 