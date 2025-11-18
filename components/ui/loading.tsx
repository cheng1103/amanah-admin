"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ className = "", size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        {/* Professional Lion Loading Animation */}
        <div className={cn("relative", sizeClasses[size])}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-spin"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            
            {/* Rotating Lion Head */}
            <ellipse
              cx="50"
              cy="50"
              rx="20"
              ry="18"
              fill="url(#loadingGradient)"
              stroke="#1e3a8a"
              strokeWidth="2"
            />
            
            {/* Eyes */}
            <ellipse
              cx="43"
              cy="45"
              rx="3"
              ry="4"
              fill="#1e3a8a"
            />
            <ellipse
              cx="57"
              cy="45"
              rx="3"
              ry="4"
              fill="#1e3a8a"
            />
            
            {/* Nose */}
            <path
              d="M50 52 L47 55 L53 55 Z"
              fill="#1e3a8a"
            />
          </svg>
        </div>
        
        {/* Pulsing Ring */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse",
          sizeClasses[size]
        )} />
      </div>
      
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Professional Spinner Component
export function Spinner({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  )
}

// Professional Skeleton Loading
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}
