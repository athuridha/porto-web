"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isToday: isCurrentMonth && day === today.getDate(),
        isSelected: day === selectedDate,
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    setSelectedDate(null)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today.getDate())
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="p-2">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday} className="px-3 py-2 text-sm">
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="p-2">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-7 gap-1 h-full">
          {days.map((dayInfo, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-center text-sm cursor-pointer rounded transition-colors min-h-[40px]
                ${
                  !dayInfo
                    ? ""
                    : dayInfo.isToday
                      ? "bg-blue-500 text-white font-semibold"
                      : dayInfo.isSelected
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-100"
                }
              `}
              onClick={() => dayInfo && setSelectedDate(dayInfo.day)}
            >
              {dayInfo?.day}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-sm text-gray-600 text-center">
          {selectedDate
            ? `Selected: ${monthNames[currentDate.getMonth()]} ${selectedDate}, ${currentDate.getFullYear()}`
            : "Click on a date to select it"}
        </div>
      </div>
    </div>
  )
}
