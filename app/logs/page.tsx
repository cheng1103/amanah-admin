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
  ArrowLeft, Search, Download, RefreshCw, ChevronLeft, ChevronRight,
  Loader2, Shield, User, FileText, Eye, Edit, Trash2
} from "lucide-react"
import { api } from "@/lib/api-client"
import { AdminSidebar } from "@/components/admin-sidebar"

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

export default function AdminLogsPage() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [autoRefresh, setAutoRefresh] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null)
  const [exporting, setExporting] = React.useState(false)

  const itemsPerPage = 15

  const fetchLogs = React.useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError("")

      const params: any = {}
      if (dateRange.start) params.startDate = dateRange.start
      if (dateRange.end) params.endDate = dateRange.end
      if (actionFilter !== "all") params.action = actionFilter
      if (statusFilter !== "all") params.status = statusFilter

      const response = await api.auditLogs.getAll(params) as any
      // Handle different API response formats
      const logsData = Array.isArray(response) ? response : (response.data || [])
      setLogs(logsData)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      if (!silent) {
        setError(error.response?.data?.message || 'Failed to load audit logs')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [dateRange, actionFilter, statusFilter])

  React.useEffect(() => {
    async function fetchData() {
      try {
        const profileResponse = await api.auth.getProfile() as any
        const userData = profileResponse.data || profileResponse
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        if ((error as any)?.response?.status === 401) {
          router.push('/')
        }
      }
    }
    fetchData()
    fetchLogs()
  }, [fetchLogs, router])

  // Auto-refresh
  React.useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchLogs(true)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, fetchLogs])

  const handleRefresh = async () => {
    await fetchLogs()
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    try {
      const blob = await api.auditLogs.export(format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to export logs')
    } finally {
      setExporting(false)
    }
  }

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm)
    return matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: AuditLog["status"]) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      "Success": { variant: 'default' },
      "Failed": { variant: 'destructive' },
      "Warning": { variant: 'secondary' }
    }
    return <Badge variant={config[status]?.variant || 'outline'}>{status}</Badge>
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
    return date.toLocaleString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar user={user} />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-sm text-gray-600 mt-1">Monitor system activity and user actions</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh
              </Button>

              <Button variant="outline" onClick={handleRefresh} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Select onValueChange={(value) => handleExport(value as 'csv' | 'json')} disabled={exporting}>
                <SelectTrigger className="w-[140px]">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">Export CSV</SelectItem>
                  <SelectItem value="json">Export JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>{filteredLogs.length} total records</CardDescription>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
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
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Success">Success</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paginatedLogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No logs found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Timestamp
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          User
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Action
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Resource
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          IP Address
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          Status
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
                            <span className="text-gray-600">User:</span>
                            <span className="font-medium">{log.user}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Resource:</span>
                            <span>{log.resource}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IP:</span>
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedLog(null)}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Timestamp</div>
                  <div className="text-sm text-gray-900">{formatTimestamp(selectedLog.timestamp)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                  {getStatusBadge(selectedLog.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">User</div>
                  <div className="text-sm text-gray-900">{selectedLog.user}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">User ID</div>
                  <div className="text-sm text-gray-900">{selectedLog.userId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Action</div>
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedLog.action)}
                    <span className="text-sm text-gray-900">{selectedLog.action}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Resource</div>
                  <div className="text-sm text-gray-900">{selectedLog.resource}</div>
                </div>
              </div>

              {selectedLog.resourceId && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Resource ID</div>
                  <div className="text-sm text-gray-900 font-mono">{selectedLog.resourceId}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">IP Address</div>
                <div className="text-sm text-gray-900 font-mono">{selectedLog.ipAddress}</div>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">User Agent</div>
                  <div className="text-sm text-gray-900 break-all">{selectedLog.userAgent}</div>
                </div>
              )}

              {selectedLog.details && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Details</div>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {selectedLog.details}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      </main>
    </div>
  )
}
