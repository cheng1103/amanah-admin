"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users, MessageSquare, BarChart3, ShieldCheck, Settings, Activity,
  LogOut, ChevronLeft, Menu, Home, Eye, Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdminSidebarProps {
  user?: any
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await fetch('https://api.amanahbestcredit.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      router.push('/')
    }
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Leads',
      icon: Users,
      href: '/leads',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Testimonials',
      icon: MessageSquare,
      href: '/testimonials',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Reports',
      icon: BarChart3,
      href: '/reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Admin Users',
      icon: ShieldCheck,
      href: '/users',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      adminOnly: true
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      adminOnly: true
    },
    {
      title: 'Audit Logs',
      icon: Activity,
      href: '/logs',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      adminOnly: true
    }
  ]

  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user) {
      return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
    }
    return true
  })

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-white" />
                <span className="font-bold text-white text-lg">Admin Panel</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white hover:bg-blue-500"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                    isActive
                      ? `${item.bgColor} ${item.color} font-medium`
                      : "text-gray-700 hover:bg-gray-50",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? item.bgColor : "group-hover:bg-gray-100"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      isActive ? item.color : "text-gray-600"
                    )} />
                  </div>
                  {!isCollapsed && (
                    <span className="flex-1">{item.title}</span>
                  )}
                  {!isCollapsed && isActive && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              {!isCollapsed ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.name?.[0] || user.email?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || user.email}
                      </p>
                      {user.role && (
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="https://amanahbestcredit.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Site
                    </a>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
