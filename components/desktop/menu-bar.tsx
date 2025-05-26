"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Mail, Linkedin, Github } from "lucide-react"

interface MenuBarProps {
  onOpenFinder?: () => void
}

export function MenuBar({ onOpenFinder }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [showContactDropdown, setShowContactDropdown] = useState(false)
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      if (isMobile) {
        // Shorter format for mobile
        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
        setCurrentTime(now.toLocaleDateString("en-US", options))
      } else {
        // Full format for desktop
        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
        setCurrentTime(now.toLocaleDateString("en-US", options))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [isMobile])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowContactDropdown(false)
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendarDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getCurrentDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return now.toLocaleDateString("en-US", options)
  }

  const getCalendarDays = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = now.getDate()

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return { days, today }
  }

  const { days, today } = getCalendarDays()

  const handleLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between text-white">
      <div className="flex items-center px-2 md:px-4">
        <span
          className={`font-medium cursor-pointer hover:bg-white/10 px-1 md:px-2 py-1 rounded transition-colors ${
            isMobile ? "text-xs" : "text-sm"
          }`}
          onClick={onOpenFinder}
        >
          {isMobile ? "Amara" : "Amara Thuridha"}
        </span>
        <div className="relative ml-2 md:ml-4" ref={dropdownRef}>
          <span
            className={`cursor-pointer hover:text-blue-300 px-1 md:px-2 py-1 rounded transition-colors ${
              isMobile ? "text-xs" : "text-sm"
            }`}
            onClick={() => setShowContactDropdown(!showContactDropdown)}
          >
            Contact
          </span>

          {showContactDropdown && (
            <div
              className={`absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-800 z-60 animate-in slide-in-from-top-2 duration-200 ${
                isMobile ? "w-64" : "w-72"
              }`}
            >
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">My contacts</h3>

                <div className="space-y-2">
                  <div
                    className="flex items-center gap-3 text-sm text-gray-700 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={(e) => handleLinkClick("mailto:athuridhaa@gmail.com", e)}
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span>athuridhaa@gmail.com</span>
                  </div>

                  <div
                    className="flex items-center gap-3 text-sm text-gray-700 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={(e) => handleLinkClick("https://linkedin.com/in/amara-thuridha-3baa3122b", e)}
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span>linkedin.com/in/amara-thuridha-3baa3122b</span>
                  </div>

                  <div
                    className="flex items-center gap-3 text-sm text-gray-700 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                    onClick={(e) => handleLinkClick("https://github.com/athuridha", e)}
                  >
                    <Github className="w-4 h-4 text-gray-800" />
                    <span>github.com/athuridha</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative px-2 md:px-4" ref={calendarRef}>
        <div
          className={`text-right cursor-pointer hover:bg-white/10 px-1 md:px-2 py-1 rounded transition-colors ${
            isMobile ? "text-xs" : "text-sm"
          }`}
          onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
        >
          {currentTime}
        </div>

        {showCalendarDropdown && (
          <div
            className={`absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-800 z-60 animate-in slide-in-from-top-2 duration-200 ${
              isMobile ? "w-72" : "w-80"
            }`}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{getCurrentDate()}</h3>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center py-2 text-sm rounded transition-colors ${
                      day === today
                        ? "bg-blue-500 text-white font-semibold"
                        : day
                          ? "hover:bg-gray-100 cursor-pointer"
                          : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
