"use client"

import { X, RotateCcw, RotateCw, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WindowControlsProps {
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onUndo?: () => void
  onRedo?: () => void
  isMaximized?: boolean
}

export function WindowControls({
  onClose,
  onMinimize,
  onMaximize,
  onUndo,
  onRedo,
  isMaximized = false,
}: WindowControlsProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side - Traffic lights */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full p-0 group transition-all duration-150 hover:scale-110"
          onClick={onClose}
        >
          <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full p-0 group transition-all duration-150 hover:scale-110"
          onClick={onMaximize}
        >
          {isMaximized ? (
            <Minimize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          ) : (
            <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          )}
        </Button>
      </div>

      {/* Center - Undo/Redo controls */}
      {(onUndo || onRedo) && (
        <div className="flex items-center gap-2">
          {onUndo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              className="p-1 hover:bg-gray-200 transition-colors duration-150"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </Button>
          )}
          {onRedo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              className="p-1 hover:bg-gray-200 transition-colors duration-150"
            >
              <RotateCw className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>
      )}

      {/* Right side - Spacer */}
      <div className="w-16"></div>
    </div>
  )
}
