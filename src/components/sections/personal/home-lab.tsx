import { Server, Network, Shield, Terminal } from "lucide-react"

export function HomeLab() {
  const sections = [
    {
      title: "Hardware Stack",
      icon: Server,
      items: [
        "Raspberry Pi Kubernetes Cluster (PoE)",
        "Cisco & Aumox PoE Switches",
        "QNAP NAS (50TB RAID 5)",
        "CyberPower UPS",
        "2x Custom x86 Compute Servers"
      ]
    },
    {
      title: "Infrastructure",
      icon: Network,
      items: [
        "Portainer (K8s/Docker Management)",
        "Proxmox Virtual Environment",
        "Nginx Proxy Manager",
        "Keycloak IAM",
        "Apache Guacamole",
        "Foreman & Katello"
      ]
    },
    {
      title: "Security & Automation",
      icon: Shield,
      items: [
        "OpenSCAP Configuration",
        "Ansible Automation",
        "Spiderfoot OSINT",
        "Custom LLM Interface",
        "Patch Management"
      ]
    },
    {
      title: "Applications",
      icon: Terminal,
      items: [
        "Kanboard Project Management",
        "Plex Media Server",
        "Custom Development Environment",
        "Monitoring Stack",
        "Backup Solutions"
      ]
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900/50 to-blue-950/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Home Lab Setup
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Personal infrastructure and development environment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="p-6 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-slate-100">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 