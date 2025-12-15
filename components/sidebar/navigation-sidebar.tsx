"use client"

import type React from "react"
import { User, Briefcase, Mail, GraduationCap } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  isFolder?: boolean
  isExpanded?: boolean
  children?: SidebarItem[]
}

interface NavigationSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function NavigationSidebar({ activeSection, onSectionChange }: NavigationSidebarProps) {
  const sidebarItems: SidebarItem[] = [
    {
      id: "about",
      label: "About Me",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Mail className="w-4 h-4" />,
    },
  ]

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isActive = activeSection === item.id
    const paddingLeft = level * 16 + 12

    return (
      <div key={item.id} className="animate-in slide-in-from-left duration-300">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:bg-blue-100 active:scale-95 ${
            isActive ? "bg-blue-500 text-white shadow-md" : "text-gray-700 hover:text-blue-600"
          }`}
          style={{ paddingLeft }}
          onClick={() => onSectionChange(item.id)}
        >
          <div className="transition-transform duration-200 hover:scale-110">{item.icon}</div>
          <span className="transition-all duration-200">{item.label}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 animate-in slide-in-from-left duration-500">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 animate-in fade-in duration-700">
        Profile
      </h3>
      <div className="space-y-1">{sidebarItems.map((item) => renderSidebarItem(item))}</div>
    </div>
  )
}
