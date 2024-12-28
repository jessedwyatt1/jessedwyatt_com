"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Settings, FolderKanban } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const items = [
    {
      title: "Blog Posts",
      href: "/admin/blog",
      icon: FileText
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: FolderKanban
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  return (
    <nav className="mb-8">
      <div className="flex space-x-6 border-b border-slate-800">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-blue-400",
              pathname === item.href
                ? "border-b-2 border-blue-400 text-blue-400"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
} 