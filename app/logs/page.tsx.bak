"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft, Search, Download, RefreshCw, Filter, ChevronLeft, ChevronRight,
  Loader2, Shield, User, FileText, Settings, Trash2, Eye, Edit, AlertTriangle
} from "lucide-react"
import { Toast } from "@/components/ui/toast"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent?: string
  status: "Success" | "Failed" | "Warning"
  details?: string
}

export default function AdminLogsPage({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [autoRefresh, setAutoRefresh] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [userFilter, setUserFilter] = React.useState<string>("all")
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null)
  const [toast, setToast] = React.useState<{show: boolean, title: string, description: string, variant: "success" | "error"}>({
    show: false,
    title: "",
    description: "",
    variant: "success"
  })

  const isEnglish = params.lang === 'en'
  const itemsPerPage = 15

  // Check authentication
  React.useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')

    if (!token) {
      router.push(`/${params.lang}/admin`)
      return
    }

    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr)
        setUser(parsedUser)

        // Only Super Admin and Admin can view logs
        if (parsedUser.role === 'Viewer') {
          router.push(`/${params.lang}/admin/dashboard`)
          return
        }
      } catch (e) {
        router.push(`/${params.lang}/admin`)
      }
    }
  }, [params.lang, router])

  // Fetch logs
  React.useEffect(() => {
    if (!user) return
    fetchLogs()
  }, [user, dateRange])

  // Auto-refresh
  React.useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchLogs(true)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const fetchLogs = async (silent = false) => {
    try {
      if (!silent) setLoading(true)

      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, silent ? 300 : 800))

      const mockLogs: AuditLog[] = [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          user: "Admin User",
          userId: "1",
          action: "Login",
          resource: "Authentication",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          status: "Success",
          details: "Successful admin login"
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          user: "John Manager",
          userId: "2",
          action: "Update",
          resource: "Lead",
          resourceId: "LEAD-2024-001",
          ipAddress: "192.168.1.101",
          status: "Success",
          details: "Updated lead status to 'Won'"
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          user: "Admin User",
          userId: "1",
          action: "Delete",
          resource: "Testimonial",
          resourceId: "TEST-123",
          ipAddress: "192.168.1.100",
          status: "Success",
          details: "Deleted spam testimonial"
        },
        {
          id: "4",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          user: "Sarah Viewer",
          userId: "3",
          action: "View",
          resource: "Settings",
          ipAddress: "192.168.1.102",
          status: "Failed",
          details: "Access denied - insufficient permissions"
        },
        {
          id: "5",
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          user: "John Manager",
          userId: "2",
          action: "Create",
          resource: "Admin User",
          resourceId: "USER-NEW-001",
          ipAddress: "192.168.1.101",
          status: "Success",
          details: "Created new admin user"
        },
        {
          id: "6",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          user: "Admin User",
          userId: "1",
          action: "Update",
          resource: "Settings",
          ipAddress: "192.168.1.100",
          status: "Success",
          details: "Updated email SMTP configuration"
        },
        {
          id: "7",
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          user: "Mike Support",
          userId: "4",
          action: "Login",
          resource: "Authentication",
          ipAddress: "192.168.1.103",
          status: "Failed",
          details: "Invalid password attempt"
        },
        {
          id: "8",
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          user: "John Manager",
          userId: "2",
          action: "Approve",
          resource: "Testimonial",
          resourceId: "TEST-456",
          ipAddress: "192.168.1.101",
          status: "Success",
          details: "Approved testimonial for display"
        },
        {
          id: "9",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: "Admin User",
          userId: "1",
          action: "Export",
          resource: "Leads",
          ipAddress: "192.168.1.100",
          status: "Success",
          details: "Exported leads to CSV"
        },
        {
          id: "10",
          timestamp: new Date(Date.now() - 4200000).toISOString(),
          user: "Sarah Viewer",
          userId: "3",
          action: "View",
          resource: "Reports",
          ipAddress: "192.168.1.102",
          status: "Success",
          details: "Viewed analytics dashboard"
        }
      ]

      setLogs(mockLogs)
    } catch (error) {
      if (!silent) {
        showToast(
          isEnglish ? "Error" : "Ralat",
          isEnglish ? "Failed to load audit logs" : "Gagal memuatkan log audit",
          "error"
        )
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const showToast = (title: string, description: string, variant: "success" | "error") => {
    setToast({ show: true, title, description, variant })
    setTimeout(() => setToast({ show: false, title: "", description: "", variant: "success" }), 3000)
  }

  const handleRefresh = async () => {
    await fetchLogs()
    showToast(
      isEnglish ? "Success" : "Berjaya",
      isEnglish ? "Logs refreshed" : "Log dikemaskini",
      "success"
    )
  }

  const handleExport = () => {
    showToast(
      isEnglish ? "Success" : "Berjaya",
      isEnglish ? "Logs export started" : "Eksport log dimulakan",
      "success"
    )
  }

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm)
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    const matchesUser = userFilter === "all" || log.userId === userFilter
    return matchesSearch && matchesAction && matchesStatus && matchesUser
  })

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: AuditLog["status"]) => {
    const colors = {
      "Success": "bg-green-100 text-green-800",
      "Failed": "bg-red-100 text-red-800",
      "Warning": "bg-yellow-100 text-yellow-800"
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <User className="h-4 w-4" />
      case 'view':
        return <Eye className="h-4 w-4" />
      case 'create':
        return <FileText className="h-4 w-4" />
      case 'update':
      case 'approve':
        return <Edit className="h-4 w-4" />
      case 'delete':
        return <Trash2 className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString(isEnglish ? 'en-US' : 'ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const uniqueUsers = Array.from(new Set(logs.map(log => ({ id: log.userId, name: log.user }))))
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href={`/${params.lang}/admin/dashboard`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEnglish ? 'Audit Logs' : 'Log Audit'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEnglish ? 'Monitor system activity and user actions' : 'Pantau aktiviti sistem dan tindakan pengguna'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={autoRefresh ? "success" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {isEnglish ? 'Auto-refresh' : 'Auto-muat semula'}
              </Button>

              <Button variant="outline" onClick={handleRefresh} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                {isEnglish ? 'Refresh' : 'Muat Semula'}
              </Button>

              <Button variant="outline" onClick={handleExport} size="sm">
                <Download className="h-4 w-4 mr-2" />
                {isEnglish ? 'Export' : 'Eksport'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle>{isEnglish ? 'Activity Logs' : 'Log Aktiviti'}</CardTitle>
                <CardDescription>
                  {isEnglish ? `${filteredLogs.length} total records` : `${filteredLogs.length} jumlah rekod`}
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={isEnglish ? "Search logs..." : "Cari log..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />

                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />

                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={isEnglish ? "Action" : "Tindakan"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Actions" : "Semua Tindakan"}</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={isEnglish ? "Status" : "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Status" : "Semua Status"}</SelectItem>
                    <SelectItem value="Success">{isEnglish ? "Success" : "Berjaya"}</SelectItem>
                    <SelectItem value="Failed">{isEnglish ? "Failed" : "Gagal"}</SelectItem>
                    <SelectItem value="Warning">{isEnglish ? "Warning" : "Amaran"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : paginatedLogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {isEnglish ? 'No logs found' : 'Tiada log dijumpai'}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Timestamp' : 'Masa'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'User' : 'Pengguna'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Action' : 'Tindakan'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Resource' : 'Sumber'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'IP Address' : 'Alamat IP'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Status' : 'Status'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedLog(log)}
                        >
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{log.user}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getActionIcon(log.action)}
                              <span className="text-sm">{log.action}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-900">{log.resource}</div>
                            {log.resourceId && (
                              <div className="text-xs text-gray-500">{log.resourceId}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-gray-600">
                            {log.ipAddress}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(log.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedLogs.map((log) => (
                    <Card key={log.id} className="cursor-pointer" onClick={() => setSelectedLog(log)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span className="font-medium text-gray-900">{log.action}</span>
                          </div>
                          {getStatusBadge(log.status)}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isEnglish ? 'User:' : 'Pengguna:'}</span>
                            <span className="font-medium">{log.user}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isEnglish ? 'Resource:' : 'Sumber:'}</span>
                            <span>{log.resource}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{isEnglish ? 'IP:' : 'IP:'}</span>
                            <span className="font-mono">{log.ipAddress}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            {formatTimestamp(log.timestamp)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      {isEnglish
                        ? `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filteredLogs.length)} of ${filteredLogs.length} logs`
                        : `Menunjukkan ${startIndex + 1} hingga ${Math.min(startIndex + itemsPerPage, filteredLogs.length)} daripada ${filteredLogs.length} log`
                      }
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center px-3 text-sm font-medium">
                        {currentPage} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{isEnglish ? 'Log Details' : 'Butiran Log'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedLog(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'Timestamp' : 'Masa'}
                  </div>
                  <div className="text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'Status' : 'Status'}
                  </div>
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'User' : 'Pengguna'}
                  </div>
                  <div className="text-sm text-gray-900">{selectedLog.user}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'User ID' : 'ID Pengguna'}
                  </div>
                  <div className="text-sm text-gray-900">{selectedLog.userId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'Action' : 'Tindakan'}
                  </div>
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedLog.action)}
                    <span className="text-sm text-gray-900">{selectedLog.action}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'Resource' : 'Sumber'}
                  </div>
                  <div className="text-sm text-gray-900">{selectedLog.resource}</div>
                </div>
              </div>

              {selectedLog.resourceId && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'Resource ID' : 'ID Sumber'}
                  </div>
                  <div className="text-sm text-gray-900 font-mono">{selectedLog.resourceId}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {isEnglish ? 'IP Address' : 'Alamat IP'}
                </div>
                <div className="text-sm text-gray-900 font-mono">{selectedLog.ipAddress}</div>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'User Agent' : 'Agen Pengguna'}
                  </div>
                  <div className="text-sm text-gray-900 break-all">{selectedLog.userAgent}</div>
                </div>
              )}

              {selectedLog.details && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {isEnglish ? 'Details' : 'Butiran'}
                  </div>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {selectedLog.details}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  )
}
