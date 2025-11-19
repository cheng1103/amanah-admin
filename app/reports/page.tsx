"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Download, Printer, RefreshCw, TrendingUp, TrendingDown,
  Users, DollarSign, FileText, CheckCircle, Loader2
} from "lucide-react"
import { api } from "@/lib/api-client"
import { AdminSidebar } from "@/components/admin-sidebar"

interface MetricCard {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: any
  color: string
}

interface ChartData {
  label: string
  value: number
  color?: string
}

interface TopProduct {
  name: string
  leads: number
  conversion: string
  revenue: string
}

export default function AdminReportsPage() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [refreshing, setRefreshing] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const [metrics, setMetrics] = React.useState<MetricCard[]>([])
  const [leadSources, setLeadSources] = React.useState<ChartData[]>([])
  const [loanTypes, setLoanTypes] = React.useState<ChartData[]>([])
  const [monthlyTrends, setMonthlyTrends] = React.useState<ChartData[]>([])
  const [topProducts, setTopProducts] = React.useState<TopProduct[]>([])

  const fetchReportData = React.useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError("")

      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end
      }

      const [metricsData, sourcesData, typesData, trendsData, productsData] = await Promise.all([
        api.reports.getMetrics(params),
        api.reports.getLeadSources(params),
        api.reports.getLoanTypes(params),
        api.reports.getMonthlyTrends({ months: 6 }),
        api.reports.getTopProducts({ limit: 5 })
      ])

      // Process metrics data
      if (metricsData.data || metricsData) {
        const data = metricsData.data || metricsData
        setMetrics([
          {
            title: 'Total Leads',
            value: data.totalLeads?.toString() || '0',
            change: data.leadsChange || '+0%',
            trend: data.leadsChange?.startsWith('+') ? 'up' : 'down',
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'Conversion Rate',
            value: data.conversionRate || '0%',
            change: data.conversionChange || '+0%',
            trend: data.conversionChange?.startsWith('+') ? 'up' : 'down',
            icon: TrendingUp,
            color: 'bg-green-500'
          },
          {
            title: 'Total Revenue',
            value: data.totalRevenue || 'RM 0',
            change: data.revenueChange || '+0%',
            trend: data.revenueChange?.startsWith('+') ? 'up' : 'down',
            icon: DollarSign,
            color: 'bg-yellow-500'
          },
          {
            title: 'Active Loans',
            value: data.activeLoans?.toString() || '0',
            change: data.loansChange || '+0%',
            trend: data.loansChange?.startsWith('+') ? 'up' : 'down',
            icon: FileText,
            color: 'bg-purple-500'
          }
        ])
      }

      // Set chart data
      setLeadSources((sourcesData.data || sourcesData) as ChartData[])
      setLoanTypes((typesData.data || typesData) as ChartData[])
      setMonthlyTrends((trendsData.data || trendsData) as ChartData[])
      setTopProducts((productsData.data || productsData) as TopProduct[])
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      if (!silent) {
        setError(error.response?.data?.message || 'Failed to load report data')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [dateRange])

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
    fetchReportData()
  }, [fetchReportData, router])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReportData()
    setRefreshing(false)
  }

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(true)
    try {
      const params = {
        startDate: dateRange.start,
        endDate: dateRange.end
      }

      const blob = await api.reports.export(format, params)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reports-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading && metrics.length === 0) {
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
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">View performance metrics and analytics</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-40"
                />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-40"
                />
              </div>

              <Button variant="outline" onClick={handleRefresh} disabled={refreshing} size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button variant="outline" onClick={() => handleExport('csv')} disabled={exporting} size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>

              <Button variant="outline" onClick={() => handleExport('pdf')} disabled={exporting} size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>

              <Button variant="outline" onClick={handlePrint} size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                          <div className="flex items-center gap-1">
                            {metric.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                              {metric.change}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last period</span>
                          </div>
                        </div>
                        <div className={`h-12 w-12 rounded-lg ${metric.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Lead Source Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Lead Source Breakdown</CardTitle>
                  <CardDescription>Distribution of leads by source</CardDescription>
                </CardHeader>
                <CardContent>
                  {leadSources.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No data available</div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {leadSources.map((source, index) => {
                          const percentage = source.value
                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{source.label}</span>
                                <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: source.color || '#3b82f6'
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {leadSources.map((source, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: source.color || '#3b82f6' }}
                            />
                            <span className="text-xs text-gray-600">{source.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Loan Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Loan Type Distribution</CardTitle>
                  <CardDescription>Breakdown by loan type</CardDescription>
                </CardHeader>
                <CardContent>
                  {loanTypes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No data available</div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {loanTypes.map((type, index) => {
                          const percentage = type.value
                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{type.label}</span>
                                <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: type.color || '#10b981'
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {loanTypes.map((type, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: type.color || '#10b981' }}
                            />
                            <span className="text-xs text-gray-600">{type.label}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Lead volume over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyTrends.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No data available</div>
                ) : (
                  <div className="flex items-end justify-between h-64 gap-4">
                    {monthlyTrends.map((trend, index) => {
                      const maxValue = Math.max(...monthlyTrends.map(t => t.value))
                      const heightPercentage = (trend.value / maxValue) * 100
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-sm font-semibold text-gray-900">{trend.value}</div>
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                            style={{ height: `${heightPercentage}%`, minHeight: '20px' }}
                            title={`${trend.label}: ${trend.value}`}
                          />
                          <div className="text-xs font-medium text-gray-600">{trend.label}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performing Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best performing loan products by leads and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No data available</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                            Product Name
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                            Leads
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                            Conversion
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-gray-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-gray-900">{product.leads}</td>
                            <td className="py-3 px-4 text-right">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {product.conversion}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">{product.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
        </div>
      </main>
    </div>
  )
}
