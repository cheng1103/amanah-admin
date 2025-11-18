"use client"

import * as React from "react"

interface IconProps {
  className?: string;
  size?: number;
}

// Professional Lightning Icon for Fast Approval
export function LightningIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        fill="url(#lightningGradient)"
        stroke="#d97706"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Professional Money/Currency Icon for Low Interest
export function MoneyIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="moneyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#moneyGradient)"
        stroke="#047857"
        strokeWidth="1"
      />
      <path
        d="M12 6v12M8 10h8M8 14h8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        RM
      </text>
    </svg>
  )
}

// Professional Shield Icon for Security
export function ShieldIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l8 3v7c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l8-3z"
        fill="url(#shieldGradient)"
        stroke="#1e40af"
        strokeWidth="1"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Professional Calculator Icon
export function CalculatorIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="calculatorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        fill="url(#calculatorGradient)"
        stroke="#475569"
        strokeWidth="1"
      />
      <rect
        x="6"
        y="4"
        width="12"
        height="6"
        rx="1"
        fill="#1e3a8a"
      />
      <circle cx="8" cy="13" r="1" fill="#64748b" />
      <circle cx="12" cy="13" r="1" fill="#64748b" />
      <circle cx="16" cy="13" r="1" fill="#64748b" />
      <circle cx="8" cy="17" r="1" fill="#64748b" />
      <circle cx="12" cy="17" r="1" fill="#64748b" />
      <circle cx="16" cy="17" r="1" fill="#64748b" />
      <circle cx="8" cy="21" r="1" fill="#64748b" />
      <circle cx="12" cy="21" r="1" fill="#64748b" />
      <rect x="15" y="20" width="2" height="2" rx="1" fill="#059669" />
    </svg>
  )
}

// Professional Phone Icon
export function PhoneIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        fill="url(#phoneGradient)"
        stroke="#1d4ed8"
        strokeWidth="1"
      />
    </svg>
  )
}

// Professional Email Icon
export function EmailIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        fill="url(#emailGradient)"
        stroke="#7c3aed"
        strokeWidth="1"
      />
      <polyline
        points="22,6 12,13 2,6"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

// Professional Location Icon
export function LocationIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="locationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        fill="url(#locationGradient)"
        stroke="#dc2626"
        strokeWidth="1"
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        fill="white"
      />
    </svg>
  )
}

// Professional Clock Icon
export function ClockIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#clockGradient)"
        stroke="#d97706"
        strokeWidth="1"
      />
      <polyline
        points="12,6 12,12 16,14"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

// Professional Star Icon for Ratings
export function StarIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill="url(#starGradient)"
        stroke="#f59e0b"
        strokeWidth="1"
      />
    </svg>
  )
}
