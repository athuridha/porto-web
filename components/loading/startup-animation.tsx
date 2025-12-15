"use client"

import { useState, useEffect } from "react"

interface StartupAnimationProps {
  onComplete: () => void
}

export function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500)
    const timer2 = setTimeout(() => setStage(2), 1500)
    const timer3 = setTimeout(() => setStage(3), 2500)
    const timer4 = setTimeout(() => onComplete(), 4000)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      {/* Logo/Text Animation */}
      <div className="mb-16">
        <div
          className={`text-6xl md:text-8xl font-thin text-white transition-all duration-1000 ${
            stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          amar
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 md:w-80">
        <div
          className={`h-1 bg-gray-800 rounded-full overflow-hidden transition-opacity duration-500 ${
            stage >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading Text */}
      <div
        className={`mt-8 text-white text-sm transition-opacity duration-500 ${
          stage >= 3 ? "opacity-100" : "opacity-0"
        }`}
      >
        Starting up...
      </div>

      {/* Fade out animation */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
          stage >= 3 ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
    </div>
  )
}
