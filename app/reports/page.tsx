"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Download, Printer, RefreshCw, TrendingUp, TrendingDown,
  Users, DollarSign, FileText, CheckCircle, Calendar, Loader2
} from "lucide-react"
import { Toast } from "@/components/ui/toast"

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

export default function AdminReportsPage({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [toast, setToast] = React.useState<{show: boolean, title: string, description: string, variant: "success" | "error"}>({
    show: false,
    title: "",
    description: "",
    variant: "success"
  })

  const isEnglish = params.lang === 'en'

  // Mock data
  const [metrics, setMetrics] = React.useState<MetricCard[]>([])
  const [leadSources, setLeadSources] = React.useState<ChartData[]>([])
  const [loanTypes, setLoanTypes] = React.useState<ChartData[]>([])
  const [monthlyTrends, setMonthlyTrends] = React.useState<ChartData[]>([])
  const [topProducts, setTopProducts] = React.useState<any[]>([])

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
        setUser(JSON.parse(userStr))
      } catch (e) {
        router.push(`/${params.lang}/admin`)
      }
    }
  }, [params.lang, router])

  // Fetch data
  React.useEffect(() => {
    if (!user) return
    fetchReportData()
  }, [user, dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMetrics([
        {
          title: isEnglish ? 'Total Leads' : 'Jumlah Lead',
          value: '1,247',
          change: '+12.5%',
          trend: 'up',
          icon: Users,
          color: 'bg-blue-500'
        },
        {
          title: isEnglish ? 'Conversion Rate' : 'Kadar Penukaran',
          value: '32.8%',
          change: '+5.2%',
          trend: 'up',
          icon: TrendingUp,
          color: 'bg-green-500'
        },
        {
          title: isEnglish ? 'Total Revenue' : 'Jumlah Hasil',
          value: 'RM 2.4M',
          change: '+18.3%',
          trend: 'up',
          icon: DollarSign,
          color: 'bg-yellow-500'
        },
        {
          title: isEnglish ? 'Active Loans' : 'Pinjaman Aktif',
          value: '342',
          change: '-2.1%',
          trend: 'down',
          icon: FileText,
          color: 'bg-purple-500'
        }
      ])

      setLeadSources([
        { label: isEnglish ? 'Website' : 'Laman Web', value: 45, color: '#3b82f6' },
        { label: isEnglish ? 'Facebook' : 'Facebook', value: 25, color: '#10b981' },
        { label: isEnglish ? 'Google Ads' : 'Iklan Google', value: 20, color: '#f59e0b' },
        { label: isEnglish ? 'Referral' : 'Rujukan', value: 10, color: '#8b5cf6' }
      ])

      setLoanTypes([
        { label: isEnglish ? 'Personal Loan' : 'Pinjaman Peribadi', value: 40, color: '#3b82f6' },
        { label: isEnglish ? 'Business Loan' : 'Pinjaman Perniagaan', value: 30, color: '#10b981' },
        { label: isEnglish ? 'Housing Loan' : 'Pinjaman Perumahan', value: 20, color: '#f59e0b' },
        { label: isEnglish ? 'Vehicle Loan' : 'Pinjaman Kenderaan', value: 10, color: '#8b5cf6' }
      ])

      setMonthlyTrends([
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 75 },
        { label: 'Mar', value: 85 },
        { label: 'Apr', value: 78 },
        { label: 'May', value: 90 },
        { label: 'Jun', value: 95 }
      ])

      setTopProducts([
        { name: isEnglish ? 'Personal Loan - Fast Track' : 'Pinjaman Peribadi - Laluan Pantas', leads: 342, conversion: '35.2%', revenue: 'RM 850K' },
        { name: isEnglish ? 'Business Expansion Loan' : 'Pinjaman Pengembangan Perniagaan', leads: 287, conversion: '28.5%', revenue: 'RM 720K' },
        { name: isEnglish ? 'Home Renovation Loan' : 'Pinjaman Pengubahsuaian Rumah', leads: 198, conversion: '32.1%', revenue: 'RM 490K' },
        { name: isEnglish ? 'Education Loan' : 'Pinjaman Pendidikan', leads: 156, conversion: '42.3%', revenue: 'RM 380K' }
      ])

    } catch (error) {
      showToast(
        isEnglish ? "Error" : "Ralat",
        isEnglish ? "Failed to load report data" : "Gagal memuatkan data laporan",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  const showToast = (title: string, description: string, variant: "success" | "error") => {
    setToast({ show: true, title, description, variant })
    setTimeout(() => setToast({ show: false, title: "", description: "", variant: "success" }), 3000)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReportData()
    setRefreshing(false)
    showToast(
      isEnglish ? "Success" : "Berjaya",
      isEnglish ? "Report data refreshed" : "Data laporan dikemaskini",
      "success"
    )
  }

  const handleExportCSV = () => {
    showToast(
      isEnglish ? "Success" : "Berjaya",
      isEnglish ? "CSV export started" : "Eksport CSV dimulakan",
      "success"
    )
  }

  const handleExportPDF = () => {
    showToast(
      isEnglish ? "Success" : "Berjaya",
      isEnglish ? "PDF export started" : "Eksport PDF dimulakan",
      "success"
    )
  }

  const handlePrint = () => {
    window.print()
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b print:hidden">
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
                  {isEnglish ? 'Reports & Analytics' : 'Laporan & Analitik'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEnglish ? 'View performance metrics and analytics' : 'Lihat metrik prestasi dan analitik'}
                </p>
              </div>
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

              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {isEnglish ? 'Refresh' : 'Muat Semula'}
              </Button>

              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>

              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>

              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                {isEnglish ? 'Print' : 'Cetak'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
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
                            <span className="text-sm text-gray-500 ml-1">
                              {isEnglish ? 'vs last period' : 'berbanding tempoh lepas'}
                            </span>
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
                  <CardTitle>{isEnglish ? 'Lead Source Breakdown' : 'Pecahan Sumber Lead'}</CardTitle>
                  <CardDescription>
                    {isEnglish ? 'Distribution of leads by source' : 'Taburan lead mengikut sumber'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                                backgroundColor: source.color
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
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-xs text-gray-600">{source.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Loan Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>{isEnglish ? 'Loan Type Distribution' : 'Taburan Jenis Pinjaman'}</CardTitle>
                  <CardDescription>
                    {isEnglish ? 'Breakdown by loan type' : 'Pecahan mengikut jenis pinjaman'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                                backgroundColor: type.color
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
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-xs text-gray-600">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{isEnglish ? 'Monthly Trends' : 'Trend Bulanan'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Lead volume over the past 6 months' : 'Jumlah lead sepanjang 6 bulan lepas'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-64 gap-4">
                  {monthlyTrends.map((trend, index) => {
                    const maxValue = Math.max(...monthlyTrends.map(t => t.value))
                    const heightPercentage = (trend.value / maxValue) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-sm font-semibold text-gray-900">{trend.value}</div>
                        <div
                          className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                          style={{ height: `${heightPercentage}%`, minHeight: '20px' }}
                          title={`${trend.label}: ${trend.value}`}
                        />
                        <div className="text-xs font-medium text-gray-600">{trend.label}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Products */}
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'Top Performing Products' : 'Produk Berprestasi Terbaik'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Best performing loan products by leads and revenue' : 'Produk pinjaman terbaik mengikut lead dan hasil'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Product Name' : 'Nama Produk'}
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Leads' : 'Lead'}
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Conversion' : 'Penukaran'}
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Revenue' : 'Hasil'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">{product.leads}</td>
                          <td className="py-3 px-4 text-right">
                            <Badge className="bg-green-100 text-green-800">{product.conversion}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">{product.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

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
