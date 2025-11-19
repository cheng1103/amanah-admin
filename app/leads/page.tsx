"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api-client"
import { Loader2, ArrowLeft, Mail, Phone, DollarSign, Briefcase, RefreshCw, Trash2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  loanAmount: number
  loanPurpose: string
  employmentStatus: string
  monthlyIncome?: number
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  const fetchLeads = React.useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await api.leads.getAll() as any
      // Handle different API response formats
      const leadsData = Array.isArray(response) ? response : (response.data || [])
      setLeads(leadsData)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [])

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
    fetchLeads()
  }, [fetchLeads, router])

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId)
    const originalLead = leads.find(lead => lead.id === leadId)
    const originalStatus = originalLead?.status

    try {
      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ))

      const response = await api.leads.updateStatus(leadId, newStatus)

      if (response && response.status) {
        setLeads(prev => prev.map(lead =>
          lead.id === leadId ? { ...lead, status: response.status, updatedAt: response.updatedAt || lead.updatedAt } : lead
        ))
      }
    } catch (err) {
      if (originalStatus) {
        setLeads(prev => prev.map(lead =>
          lead.id === leadId ? { ...lead, status: originalStatus } : lead
        ))
      }
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      await api.leads.delete(leadId)
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to delete lead')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
      NEW: { variant: 'default', label: 'New' },
      CONTACTED: { variant: 'secondary', label: 'Contacted' },
      QUALIFIED: { variant: 'outline', label: 'Qualified' },
      PROPOSAL: { variant: 'outline', label: 'Proposal' },
      NEGOTIATION: { variant: 'outline', label: 'Negotiation' },
      CLOSED_WON: { variant: 'default', label: 'Won' },
      CLOSED_LOST: { variant: 'destructive', label: 'Lost' }
    }

    const config = statusConfig[status] || statusConfig.NEW
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return `RM${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-sm text-gray-600 mt-1">{leads.length} total leads</p>
            </div>
            <Button onClick={fetchLeads} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {leads.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">No leads found</p>
                <p className="text-sm mt-2">Leads will appear here when customers submit applications</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{lead.name}</CardTitle>
                      <CardDescription className="mt-1">{formatDate(lead.createdAt)}</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(lead.status)}
                      <Badge variant="outline">{lead.loanPurpose}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{formatCurrency(lead.loanAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.employmentStatus}</span>
                    </div>
                    {lead.monthlyIncome && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Monthly Income:</span>
                        <span className="font-semibold">{formatCurrency(lead.monthlyIncome)}</span>
                      </div>
                    )}
                  </div>

                  {lead.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Notes:</strong> {lead.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                        disabled={updatingId === lead.id}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="QUALIFIED">Qualified</SelectItem>
                          <SelectItem value="PROPOSAL">Proposal</SelectItem>
                          <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                          <SelectItem value="CLOSED_WON">Won</SelectItem>
                          <SelectItem value="CLOSED_LOST">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                      {updatingId === lead.id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  )
}
