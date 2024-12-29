"use client"

import { Badge } from "@/components/ui/badge"
import { useState, forwardRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ExperienceTimeline = forwardRef<HTMLDivElement>((props, ref) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const experiences = [
    {
      company: "AeroVironment",
      role: "Cyber Security Engineer",
      period: "2024 - Present",
      current: true,
      highlights: [
        "Recently transitioned role focusing on cyber security engineering",
        "Continuing expertise in security architecture and RMF implementation"
      ]
    },
    {
      company: "Joint Tactics and Technologies",
      role: "Cyber Security Engineer",
      period: "2020 - 2024",
      highlights: [
        "Served as ISSE and NQV Subject Matter Expert",
        "Led RMF implementation through full lifecycle",
        "Managed eMASS on NIPR and SIPR networks",
        "Completed 10+ ATO and IATT packages"
      ]
    },
    {
      company: "The Marlin Alliance, Inc.",
      role: "Senior Systems Analyst",
      period: "2018 - 2020",
      highlights: [
        "Designed network and security architecture for Navy systems",
        "Led Information Assurance team through DISA accreditation",
        "Implemented cloud security in Azure GovCloud"
      ]
    },
    {
      company: "The Marlin Alliance, Inc.",
      role: "Network Engineer",
      period: "2017 - 2018",
      highlights: [
        "Focused on network security and infrastructure implementation",
        "Managed security protocols and vulnerability assessments"
      ]
    },
    {
      company: "Leidos",
      role: "Deployment Engineer III",
      period: "2015 - 2017",
      highlights: [
        "Led network security engineering for Defense Healthcare Management System Modernization",
        "Created and implemented firewall rules for over 100 DoD medical clinics",
        "Managed security consolidation for medical facilities"
      ]
    },
    {
      company: "The Marlin Alliance, Inc.",
      role: "Systems Engineer",
      period: "2015",
      highlights: [
        "Managed SAILOR system supporting 18,000+ users across NIPRnet and SIPRnet",
        "Developed security requirements for major IT projects",
        "Implemented security controls for classified systems"
      ]
    },
    {
      company: "U.S. Navy",
      role: "Systems Administrator / Budget Manager",
      period: "2011 - 2015",
      highlights: [
        "Led five-person team for system security and maintenance",
        "Managed classified and unclassified network security",
        "Provided 200+ hours of security training",
        "Managed $1 million budget with 99.99% accuracy"
      ]
    }
  ]

  const visibleExperiences = isExpanded ? experiences : experiences.slice(0, 2)

  return (
    <section ref={ref} id="professional-experience" className="py-16 bg-gradient-to-b from-slate-900/50 via-slate-800/50 to-slate-700/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Professional Experience</h2>
        <div className="max-w-3xl mx-auto">
          {visibleExperiences.map((exp, index) => (
            <div key={index} className="relative pl-8 pb-12 border-l border-border last:pb-0">
              <div className="absolute left-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              <div className="mb-1 flex items-center gap-3">
                <h3 className="text-xl font-semibold">{exp.company}</h3>
                {exp.current && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{exp.role} • {exp.period}</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {exp.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
          
          {experiences.length > 2 && (
            <div className="mt-6 text-center">
              <Button
                variant="secondary"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-2"
              >
                {isExpanded ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

ExperienceTimeline.displayName = 'ExperienceTimeline' 