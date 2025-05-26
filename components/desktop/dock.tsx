"use client"

import { Code, Folder } from "lucide-react"

interface DockProps {
  onOpenWindow: (section: string) => void
  openWindows: string[]
  onCloseWindow: (section: string) => void
}

const dockItems = [
  { id: "finder", label: "Finder", icon: Folder, color: "bg-blue-500" },
  { id: "projects", label: "Projects", icon: Code, color: "bg-green-500" },
]

export function Dock({ onOpenWindow, openWindows, onCloseWindow }: DockProps) {
  const handleItemClick = (itemId: string) => {
    onOpenWindow(itemId)
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2 border border-white/30 shadow-2xl">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          {dockItems.map((item, index) => {
            const isOpen = openWindows.includes(item.id)
            const Icon = item.icon

            return (
              <div key={item.id} className="relative group">
                <button
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${item.color} hover:scale-110 md:hover:scale-125 active:scale-95 transition-all duration-200 text-white relative overflow-hidden transform hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-lg touch-manipulation flex items-center justify-center`}
                  onClick={() => handleItemClick(item.id)}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    handleItemClick(item.id)
                  }}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:scale-110" />
                  {isOpen && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>

                {/* Tooltip - only show on desktop */}
                <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-95 group-hover:scale-100">
                  {item.label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
