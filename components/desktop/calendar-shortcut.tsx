"use client"

import type React from "react"

import { CalendarDays } from "lucide-react"

interface CalendarShortcutProps {
  onDoubleClick: () => void
}

export function CalendarShortcut({ onDoubleClick }: CalendarShortcutProps) {
  const handleClick = () => {
    onDoubleClick()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    onDoubleClick()
  }

  return (
    <div className="absolute top-36 right-4 md:right-8 animate-in fade-in duration-500 delay-1400">
      <div
        className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200 group touch-manipulation"
        onDoubleClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          // Handle single click on mobile as double click
          if (window.innerWidth < 768) {
            handleClick()
          }
        }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
          <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <span className="text-white text-xs md:text-sm font-medium text-center px-2 py-1 bg-black/20 rounded backdrop-blur-sm">
          Calendar
        </span>
      </div>
    </div>
  )
}
