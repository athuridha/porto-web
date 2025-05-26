"use client"

import type React from "react"

interface DesktopBackgroundProps {
  children: React.ReactNode
}

export function DesktopBackground({ children }: DesktopBackgroundProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: "url('/images/wp.jpg')",
      }}
    >
      {/* Mobile gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 md:hidden"></div>

      {children}
    </div>
  )
}
