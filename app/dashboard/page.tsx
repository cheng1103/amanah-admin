"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users, FileText, MessageSquare, LogOut, TrendingUp, Loader2,
  Settings, BarChart3, ShieldCheck, Eye, Clock, CheckCircle,
  AlertTriangle, Activity, UserPlus, FilePlus, Plus, ArrowRight
} from "lucide-react"
import { api } from "@/lib/api-client"

export default function AdminDashboardPage({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [leadStats, setLeadStats] = React.useState<any>(null)
  const [testimonialStats, setTestimonialStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const isEnglish = params.lang === 'en'

  // Check authentication and fetch statistics
  React.useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')

    if (!token) {
      router.push(`/${params.lang}/admin`)
      return
    }

    let isMounted = true
    let currentUser: any = null

    if (userStr) {
      try {
        currentUser = JSON.parse(userStr)
        if (isMounted) {
          setUser(currentUser)
        }
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }

    // Fetch statistics immediately after user is loaded
    async function fetchStats() {
      if (!currentUser) return

      try {
        setLoading(true)
        const [leadData, testimonialData] = await Promise.all([
          api.leads.getStats(),
          api.testimonials.getStats()
        ])

        if (isMounted) {
          setLeadStats(leadData)
          setTestimonialStats(testimonialData)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [params.lang, router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push(`/${params.lang}/admin`)
  }

  if (!user) {
    return null
  }

  const menuItems = [
    {
      title: isEnglish ? 'Lead Management' : 'Pengurusan Lead',
      description: isEnglish ? 'View and manage loan applications' : 'Lihat dan urus permohonan pinjaman',
      icon: Users,
      href: `/${params.lang}/admin/leads`,
      color: 'bg-green-500'
    },
    {
      title: isEnglish ? 'Testimonial Management' : 'Pengurusan Testimoni',
      description: isEnglish ? 'Review and approve customer testimonials' : 'Semak dan luluskan testimoni pelanggan',
      icon: MessageSquare,
      href: `/${params.lang}/admin/testimonials`,
      color: 'bg-gradient-to-r from-logo-gold to-logo-darkGold'
    },
    {
      title: isEnglish ? 'Reports & Analytics' : 'Laporan & Analitik',
      description: isEnglish ? 'View analytics and reports' : 'Lihat analitik dan laporan',
      icon: BarChart3,
      href: `/${params.lang}/admin/reports`,
      color: 'bg-purple-500'
    },
    {
      title: isEnglish ? 'Admin Users' : 'Pengguna Admin',
      description: isEnglish ? 'Manage admin users and roles' : 'Urus pengguna admin dan peranan',
      icon: ShieldCheck,
      href: `/${params.lang}/admin/users`,
      color: 'bg-blue-500',
      adminOnly: true
    },
    {
      title: isEnglish ? 'System Settings' : 'Tetapan Sistem',
      description: isEnglish ? 'Configure system preferences' : 'Konfigurasi keutamaan sistem',
      icon: Settings,
      href: `/${params.lang}/admin/settings`,
      color: 'bg-gray-600',
      adminOnly: true
    },
    {
      title: isEnglish ? 'Audit Logs' : 'Log Audit',
      description: isEnglish ? 'Monitor system activity' : 'Pantau aktiviti sistem',
      icon: Activity,
      href: `/${params.lang}/admin/logs`,
      color: 'bg-orange-500',
      adminOnly: true
    }
  ]

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user.role === 'Super Admin' || user.role === 'Admin'
    }
    return true
  })

  const quickActions = [
    {
      title: isEnglish ? 'Add New Lead' : 'Tambah Lead Baru',
      description: isEnglish ? 'Create a new lead manually' : 'Cipta lead baru secara manual',
      icon: UserPlus,
      href: `/${params.lang}/admin/leads?action=new`,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: isEnglish ? 'View Reports' : 'Lihat Laporan',
      description: isEnglish ? 'Access analytics dashboard' : 'Akses papan pemuka analitik',
      icon: BarChart3,
      href: `/${params.lang}/admin/reports`,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: isEnglish ? 'Review Testimonials' : 'Semak Testimoni',
      description: isEnglish ? 'Approve pending testimonials' : 'Luluskan testimoni tertunda',
      icon: MessageSquare,
      href: `/${params.lang}/admin/testimonials?filter=pending`,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      title: isEnglish ? 'System Settings' : 'Tetapan Sistem',
      description: isEnglish ? 'Configure system' : 'Konfigurasi sistem',
      icon: Settings,
      href: `/${params.lang}/admin/settings`,
      color: 'text-blue-600 bg-blue-50',
      adminOnly: true
    }
  ]

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      action: isEnglish ? 'New lead submitted' : 'Lead baru dihantar',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'lead',
      icon: Users,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 2,
      action: isEnglish ? 'Testimonial approved' : 'Testimoni diluluskan',
      user: user.name || user.email,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      type: 'testimonial',
      icon: CheckCircle,
      color: 'text-logo-darkGold bg-yellow-50'
    },
    {
      id: 3,
      action: isEnglish ? 'Lead status updated to Won' : 'Status lead dikemaskini kepada Menang',
      user: user.name || user.email,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'lead',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 4,
      action: isEnglish ? 'New testimonial submitted' : 'Testimoni baru dihantar',
      user: 'Sarah Lee',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'testimonial',
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50'
    }
  ]

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now()
    const diff = now - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return isEnglish ? 'Just now' : 'Baru sahaja'
    if (minutes < 60) return isEnglish ? `${minutes}m ago` : `${minutes}m yang lalu`
    if (hours < 24) return isEnglish ? `${hours}h ago` : `${hours}j yang lalu`
    return isEnglish ? `${days}d ago` : `${days}h yang lalu`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEnglish ? 'Admin Dashboard' : 'Papan Pemuka Admin'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isEnglish ? 'Welcome back,' : 'Selamat kembali,'} {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user.role && (
                <Badge className="bg-primary-100 text-primary-800">
                  {user.role}
                </Badge>
              )}
              <Link href={`/${params.lang}`}>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  {isEnglish ? 'View Site' : 'Lihat Laman'}
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {isEnglish ? 'Logout' : 'Log Keluar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Total Leads' : 'Jumlah Lead'}
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (leadStats?.total || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              {leadStats && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {leadStats.active} {isEnglish ? 'active' : 'aktif'}, {leadStats.won} {isEnglish ? 'won' : 'menang'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Pending Reviews' : 'Menunggu Semakan'}
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (testimonialStats?.pending || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Approved' : 'Diluluskan'}
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (testimonialStats?.approved || 0)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-logo-darkGold" />
                </div>
              </div>
              {testimonialStats && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {testimonialStats.featured} {isEnglish ? 'featured' : 'pilihan'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'Conversion Rate' : 'Kadar Penukaran'}
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${leadStats?.conversionRate || '0.00'}%`}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isEnglish ? 'System Status' : 'Status Sistem'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {isEnglish ? 'Online' : 'Dalam Talian'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                {isEnglish ? 'All systems operational' : 'Semua sistem beroperasi'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isEnglish ? 'Quick Actions' : 'Tindakan Pantas'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions
              .filter(action => !action.adminOnly || user.role === 'Super Admin' || user.role === 'Admin')
              .map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.title} href={action.href}>
                    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">{action.title}</div>
                            <div className="text-xs text-gray-600 mt-0.5">{action.description}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {isEnglish ? 'Recent Activity' : 'Aktiviti Terkini'}
                  </CardTitle>
                  <CardDescription>
                    {isEnglish ? 'Latest actions in the system' : 'Tindakan terkini dalam sistem'}
                  </CardDescription>
                </div>
                <Link href={`/${params.lang}/admin/logs`}>
                  <Button variant="ghost" size="sm">
                    {isEnglish ? 'View All' : 'Lihat Semua'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`h-10 w-10 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{activity.user}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isEnglish ? 'System Health' : 'Kesihatan Sistem'}
              </CardTitle>
              <CardDescription>
                {isEnglish ? 'Current system status' : 'Status sistem semasa'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">{isEnglish ? 'Server Status' : 'Status Pelayan'}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{isEnglish ? 'Online' : 'Dalam Talian'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">{isEnglish ? 'Database' : 'Pangkalan Data'}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{isEnglish ? 'Connected' : 'Bersambung'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">{isEnglish ? 'Email Service' : 'Perkhidmatan E-mel'}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{isEnglish ? 'Active' : 'Aktif'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-700">{isEnglish ? 'Storage' : 'Storan'}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">65% {isEnglish ? 'Used' : 'Digunakan'}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-700">{isEnglish ? 'API Rate Limit' : 'Had Kadar API'}</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">85% {isEnglish ? 'Used' : 'Digunakan'}</Badge>
                </div>

                <div className="pt-4 border-t">
                  <Link href={`/${params.lang}/admin/settings`}>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      {isEnglish ? 'System Settings' : 'Tetapan Sistem'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isEnglish ? 'Management Modules' : 'Modul Pengurusan'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {item.description}
                          </CardDescription>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
