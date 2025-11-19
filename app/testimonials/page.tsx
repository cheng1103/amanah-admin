"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api-client"
import { Loader2, ArrowLeft, Star, CheckCircle, XCircle, Eye, RefreshCw, Trash2 } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  loanType?: string
  status: string
  featured: boolean
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

export default function AdminTestimonialsPage() {
  const [pending, setPending] = React.useState<Testimonial[]>([])
  const [approved, setApproved] = React.useState<Testimonial[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [actioningId, setActioningId] = React.useState<string | null>(null)

  const fetchTestimonials = React.useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const [pendingData, approvedData] = await Promise.all([
        api.testimonials.getPending(),
        api.testimonials.getApproved()
      ])
      // Handle different API response formats
      setPending(Array.isArray(pendingData) ? pendingData : (pendingData.data || []))
      setApproved(Array.isArray(approvedData) ? approvedData : (approvedData.data || []))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const handleApprove = async (id: string) => {
    setActioningId(id)
    try {
      await api.testimonials.approve(id, 'Admin')
      setPending(prev => prev.filter(t => t.id !== id))
      await fetchTestimonials()
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to approve testimonial')
    } finally {
      setActioningId(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this testimonial?')) return

    setActioningId(id)
    try {
      await api.testimonials.reject(id, 'Admin')
      setPending(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to reject testimonial')
    } finally {
      setActioningId(null)
    }
  }

  const handleToggleFeatured = async (id: string) => {
    setActioningId(id)
    try {
      await api.testimonials.toggleFeatured(id)
      setApproved(prev => prev.map(t =>
        t.id === id ? { ...t, featured: !t.featured } : t
      ))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to toggle featured status')
    } finally {
      setActioningId(null)
    }
  }

  const handleDelete = async (id: string, isPending: boolean) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      await api.testimonials.delete(id)
      if (isPending) {
        setPending(prev => prev.filter(t => t.id !== id))
      } else {
        setApproved(prev => prev.filter(t => t.id !== id))
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(error.response?.data?.message || 'Failed to delete testimonial')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
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

  const TestimonialCard = ({ testimonial, isPending }: { testimonial: Testimonial, isPending: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{testimonial.name}</CardTitle>
            <CardDescription className="mt-1">{testimonial.email}</CardDescription>
            <div className="flex items-center gap-3 mt-2">
              {renderStars(testimonial.rating)}
              {testimonial.loanType && (
                <Badge variant="outline">{testimonial.loanType}</Badge>
              )}
              {testimonial.featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>
          </div>
          <Badge variant={isPending ? 'secondary' : 'default'}>
            {isPending ? 'Pending' : 'Approved'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{testimonial.comment}</p>

        <div className="text-xs text-gray-500 mb-4">
          Submitted: {formatDate(testimonial.createdAt)}
          {testimonial.reviewedAt && (
            <span className="ml-4">Reviewed: {formatDate(testimonial.reviewedAt)} by {testimonial.reviewedBy}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isPending ? (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(testimonial.id)}
                disabled={actioningId === testimonial.id}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(testimonial.id)}
                disabled={actioningId === testimonial.id}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleToggleFeatured(testimonial.id)}
                disabled={actioningId === testimonial.id}
              >
                <Star className="h-4 w-4 mr-2" />
                {testimonial.featured ? 'Unfeature' : 'Feature'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(testimonial.id, false)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          {actioningId === testimonial.id && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Testimonial Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {pending.length} pending, {approved.length} approved
                </p>
              </div>
            </div>
            <Button onClick={fetchTestimonials} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approved.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg">No pending testimonials</p>
                    <p className="text-sm mt-2">Testimonials awaiting review will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pending.map(testimonial => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} isPending={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approved.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg">No approved testimonials</p>
                    <p className="text-sm mt-2">Approved testimonials will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approved.map(testimonial => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} isPending={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
