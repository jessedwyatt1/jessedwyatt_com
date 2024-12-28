import { PersonalHero } from "@/components/sections/personal/hero"
import { ProjectsGrid } from "@/components/sections/personal/projects-grid"
import { TechStack } from "@/components/sections/personal/tech-stack"
import { HomeLab } from "@/components/sections/personal/home-lab"
import { ChatInterface } from "@/components/chat/chat-interface"

export default async function PersonalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Main content */}
      <div>
        <PersonalHero />
        <ProjectsGrid />
        <HomeLab />
        <TechStack />
      </div>

      {/* Chat Interface */}
      <ChatInterface />
    </main>
  )
} 