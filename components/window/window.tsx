"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { WindowControls } from "./window-controls"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeft } from "lucide-react"

interface WindowProps {
  title: string
  children: React.ReactNode
  onClose: () => void
  isMaximized?: boolean
  onMaximize?: () => void
  showSidebar?: boolean
  onToggleSidebar?: () => void
  sidebar?: React.ReactNode
  windowId: string
}

export function Window({
  title,
  children,
  onClose,
  isMaximized = false,
  onMaximize,
  showSidebar = false,
  onToggleSidebar,
  sidebar,
  windowId,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 900, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState("")
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  // Check for mobile device and set initial size/position
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Set responsive size and center position
      if (mobile) {
        setSize({ width: window.innerWidth - 20, height: window.innerHeight - 120 })
        setPosition({ x: 10, y: 30 })
      } else {
        // Desktop sizing based on window type
        let windowWidth = 900
        let windowHeight = 600

        if (windowId === "calculator") {
          windowWidth = 400
          windowHeight = 500
        } else if (windowId === "calendar") {
          windowWidth = 800
          windowHeight = 600
        } else if (windowId === "finder") {
          windowWidth = 1000
          windowHeight = 700
        }

        // Center the window
        const centerX = (window.innerWidth - windowWidth) / 2
        const centerY = (window.innerHeight - windowHeight) / 2

        setSize({ width: windowWidth, height: windowHeight })
        setPosition({
          x: Math.max(0, centerX),
          y: Math.max(24, centerY), // Account for menu bar
        })
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [windowId])

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return

    setIsDragging(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized || isMobile) return

    const touch = e.touches[0]
    setIsDragging(true)
    const rect = windowRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMaximized || isMobile || windowId === "calculator") return

    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
  }

  const handleMaximize = () => {
    if (onMaximize && windowId !== "calculator") {
      onMaximize()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized && !isMobile) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // Constrain to viewport
        const maxX = window.innerWidth - size.width
        const maxY = window.innerHeight - size.height

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(24, Math.min(newY, maxY)), // Account for menu bar
        })
      }

      if (isResizing && !isMaximized && !isMobile && windowId !== "calculator") {
        const rect = windowRef.current?.getBoundingClientRect()
        if (!rect) return

        let newWidth = size.width
        let newHeight = size.height
        let newX = position.x
        let newY = position.y

        const minWidth = 400
        const minHeight = 300

        if (resizeDirection.includes("right")) {
          newWidth = Math.max(minWidth, e.clientX - rect.left)
        }
        if (resizeDirection.includes("left")) {
          const deltaX = e.clientX - rect.left
          newWidth = Math.max(minWidth, size.width - deltaX)
          if (newWidth > minWidth) {
            newX = position.x + deltaX
          }
        }
        if (resizeDirection.includes("bottom")) {
          newHeight = Math.max(minHeight, e.clientY - rect.top)
        }
        if (resizeDirection.includes("top")) {
          const deltaY = e.clientY - rect.top
          newHeight = Math.max(minHeight, size.height - deltaY)
          if (newHeight > minHeight) {
            newY = position.y + deltaY
          }
        }

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newX, y: newY })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && !isMaximized && !isMobile) {
        const touch = e.touches[0]
        const newX = touch.clientX - dragOffset.x
        const newY = touch.clientY - dragOffset.y

        // Constrain to viewport
        const maxX = window.innerWidth - size.width
        const maxY = window.innerHeight - size.height

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(24, Math.min(newY, maxY)), // Account for menu bar
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection("")
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, isMaximized, size, position, resizeDirection, isMobile, windowId])

  const getWindowStyle = () => {
    if (isMaximized) {
      return {
        top: 24, // Account for menu bar height (24px)
        left: 0,
        width: "100vw",
        height: "calc(100vh - 24px)", // Subtract menu bar height
        transform: "scale(1)",
        borderRadius: "0px",
      }
    }

    // Mobile-first responsive sizing
    if (isMobile) {
      return {
        top: position.y,
        left: position.x,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: isAnimating ? "scale(0.95)" : "scale(1)",
        borderRadius: "12px",
      }
    }

    // Desktop sizing
    return {
      top: position.y,
      left: position.x,
      width: `${size.width}px`,
      height: `${size.height}px`,
      maxWidth: "calc(100vw - 20px)",
      maxHeight: "calc(100vh - 40px)",
      transform: isAnimating ? "scale(0.8)" : "scale(1)",
      borderRadius: "12px",
    }
  }

  const isCalculatorApp = windowId === "calculator"

  return (
    <div
      ref={windowRef}
      className={`fixed bg-white shadow-2xl overflow-hidden z-40 transition-all duration-300 ease-out touch-manipulation ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
      style={getWindowStyle()}
    >
      {/* Resize handles - only show on desktop and not for calculator */}
      {!isMaximized && !isMobile && !isCalculatorApp && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "top")}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "left")}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "right")}
          />
        </>
      )}

      {/* Title Bar */}
      <div
        className={`bg-gray-100 px-4 py-3 border-b select-none transition-all duration-200 ${
          !isMaximized && !isMobile ? "cursor-move hover:bg-gray-200" : ""
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center justify-between">
          <WindowControls
            onClose={onClose}
            onMinimize={() => {}}
            onMaximize={isCalculatorApp ? undefined : handleMaximize}
            isMaximized={isMaximized}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className={`text-gray-700 font-medium ${isMobile ? "text-sm" : ""}`}>{title}</span>
          </div>
        </div>
      </div>

      {/* Toolbar - only show for non-calculator apps */}
      {!isCalculatorApp && (
        <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between transition-all duration-200">
          <div className="flex items-center gap-2">
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="p-1 hover:bg-gray-200 transition-colors duration-150"
              >
                {showSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
              </Button>
            )}
          </div>
          <div className={`text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>{title}</div>
          <div className="w-8"></div>
        </div>
      )}

      {/* Content */}
      <div className="flex h-full">
        {showSidebar && sidebar && !isCalculatorApp && (
          <div
            className={`bg-gray-50 border-r overflow-y-auto transition-all duration-300 ${
              showSidebar ? `${isMobile ? "w-48" : "w-64"} opacity-100` : "w-0 opacity-0"
            }`}
          >
            {sidebar}
          </div>
        )}
        <div className="flex-1 overflow-y-auto transition-all duration-200">{children}</div>
      </div>
    </div>
  )
}
