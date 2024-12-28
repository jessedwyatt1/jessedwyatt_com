import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  depth: number
  children: TOCItem[]
}

interface TOCProps {
  items: TOCItem[]
  level?: number
  activeId?: string
}

export function TableOfContents({ items, level = 0, activeId }: TOCProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Initialize with first level expanded
    if (level === 0) {
      return items.reduce((acc, item) => ({
        ...acc,
        [item.id]: true
      }), {});
    }
    return {};
  });

  const toggleSection = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <ul className={cn(
      "space-y-1",
      level === 0 ? "text-sm" : "ml-4 mt-1"
    )}>
      {items.map((item) => {
        const isExpanded = expanded[item.id]
        const hasChildren = item.children.length > 0
        const isActive = activeId === item.id

        return (
          <li key={item.id}>
            <div className="flex items-center group">
              {hasChildren && (
                <button
                  onClick={() => toggleSection(item.id)}
                  className="p-1 hover:bg-slate-800 rounded-md mr-1"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  )}
                </button>
              )}
              <a
                href={`#${item.id}`}
                className={cn(
                  "py-1 hover:text-blue-400 transition-colors flex-1",
                  isActive ? "text-blue-400" : "text-muted-foreground",
                  hasChildren ? "" : "ml-5"
                )}
              >
                {item.text}
              </a>
            </div>
            {hasChildren && isExpanded && (
              <TableOfContents 
                items={item.children} 
                level={level + 1}
                activeId={activeId}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
} 