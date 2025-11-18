"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
  onClose?: () => void
}

export function Toast({
  title,
  description,
  variant = "default",
  duration = 5000,
  onClose
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const variantStyles = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200"
  }

  const iconColors = {
    default: "text-gray-600",
    success: "text-logo-darkGold",
    error: "text-red-600",
    warning: "text-yellow-600"
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-lg border p-4 shadow-lg transition-all",
        variantStyles[variant],
        "animate-in slide-in-from-bottom-5"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <p className={cn("text-sm font-semibold", iconColors[variant])}>
              {title}
            </p>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className={cn("flex-shrink-0 rounded-md p-1 hover:bg-gray-100 transition-colors", iconColors[variant])}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
