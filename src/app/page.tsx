"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChatInterface } from "@/components/chat/chat-interface"
import { HeroSection } from "@/components/sections/professional/hero"
import { HighlightsSection } from "@/components/sections/professional/highlights"
import { ExperienceTimeline } from "@/components/sections/professional/experience-timeline"
import { CertificationsGrid } from "@/components/sections/professional/certifications"
// import { SectionDivider } from "@/components/ui/section-divider"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  const experienceRef = useRef<HTMLDivElement>(null)

  return (
    <main className="min-h-screen bg-background">
      <div>
        <HeroSection experienceRef={experienceRef} />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <HighlightsSection />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <ExperienceTimeline ref={experienceRef} />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
        >
          <CertificationsGrid />
        </motion.div>
      </div>
      <ChatInterface />
    </main>
  )
}