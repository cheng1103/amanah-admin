"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api-client"
import { Loader2, ArrowLeft, Star, Check, X, RefreshCw, Medal } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  location?: string
  rating: number
  comment: string
  loanType?: string
  loanAmount?: number
  status: string
  isFeatured: boolean
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export default function AdminTestimonialsPage({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [approved, setApproved] = React.useState<Testimonial[]>([])
  const [pending, setPending] = React.useState<Testimonial[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [actioningId, setActioningId] = React.useState<string | null>(null)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; email: string; name?: string } | null>(null)

  const isEnglish = params.lang === 'en'

  // Wrap fetchTestimonials in useCallback
  const fetchTestimonials = React.useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const [approvedRes, pendingRes] = await Promise.all([
        api.testimonials.getApproved(),
        api.testimonials.getPending()
      ])

      setApproved(approvedRes)
      setPending(pendingRes)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(
        error.response?.data?.message ||
        (isEnglish ? 'Failed to load testimonials' : 'Gagal memuatkan testimoni')
      )
    } finally {
      setLoading(false)
    }
  }, [isEnglish])

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
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }

    fetchTestimonials()
  }, [params.lang, router, fetchTestimonials])

  const handleApprove = async (id: string) => {
    if (!currentUser?.id) {
      alert(isEnglish ? 'User ID not found' : 'ID pengguna tidak dijumpai')
      return
    }

    setActioningId(id)

    try {
      const response = await api.testimonials.approve(id, currentUser.id)
      // Move from pending to approved
      const testimonial = pending.find(t => t.id === id)
      if (testimonial) {
        setPending(prev => prev.filter(t => t.id !== id))
        setApproved(prev => [{ ...testimonial, status: 'APPROVED' }, ...prev])
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(
        error.response?.data?.message ||
        (isEnglish ? 'Failed to approve testimonial' : 'Gagal meluluskan testimoni')
      )
    } finally {
      setActioningId(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!currentUser?.id) {
      alert(isEnglish ? 'User ID not found' : 'ID pengguna tidak dijumpai')
      return
    }

    if (!confirm(isEnglish ? 'Are you sure you want to reject this testimonial?' : 'Adakah anda pasti mahu menolak testimoni ini?')) {
      return
    }

    setActioningId(id)

    try {
      const response = await api.testimonials.reject(id, currentUser.id)
      // Remove from pending
      setPending(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      alert(
        error.response?.data?.message ||
        (isEnglish ? 'Failed to reject testimonial' : 'Gagal menolak testimoni')
      )
    } finally {
      setActioningId(null)
    }
  }

  const handleToggleFeatured = async (id: string) => {
    setActioningId(id)

    // Store original state for rollback
    const originalTestimonial = approved.find(t => t.id === id)
    const originalFeatured = originalTestimonial?.isFeatured

    try {
      // Optimistically update UI
      setApproved(prev => prev.map(t =>
        t.id === id ? { ...t, isFeatured: !t.isFeatured } : t
      ))

      // Make API call
      const response = await api.testimonials.toggleFeatured(id)

      // Update with actual server response if available
      if (response && typeof response.isFeatured !== 'undefined') {
        setApproved(prev => prev.map(t =>
          t.id === id ? { ...t, isFeatured: response.isFeatured } : t
        ))
      }
    } catch (err) {
      // Rollback to original state on error
      if (typeof originalFeatured !== 'undefined') {
        setApproved(prev => prev.map(t =>
          t.id === id ? { ...t, isFeatured: originalFeatured } : t
        ))
      }

      const error = err as { response?: { data?: { message?: string } } }
      alert(
        error.response?.data?.message ||
        (isEnglish ? 'Failed to update featured status' : 'Gagal mengemas kini status pilihan')
      )
    } finally {
      setActioningId(null)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLoanTypeDisplay = (loanType?: string) => {
    if (!loanType) return ''

    const typeMap: Record<string, { en: string, ms: string }> = {
      'PERSONAL': { en: 'Personal Loan', ms: 'Pinjaman Peribadi' },
      'BUSINESS': { en: 'Business Loan', ms: 'Pinjaman Perniagaan' },
      'HOUSING': { en: 'Housing Loan', ms: 'Pinjaman Perumahan' },
      'CAR': { en: 'Car Loan', ms: 'Pinjaman Kenderaan' },
      'RENOVATION': { en: 'Renovation Loan', ms: 'Pinjaman Ubah Suai Rumah' }
    }

    const type = typeMap[loanType.toUpperCase()]
    return type ? (isEnglish ? type.en : type.ms) : loanType
  }

  const TestimonialCard = ({ testimonial, showActions }: { testimonial: Testimonial, showActions: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{testimonial.name}</CardTitle>
              {testimonial.isFeatured && (
                <Medal className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            {renderStars(testimonial.rating)}
            <CardDescription className="mt-2">{formatDate(testimonial.createdAt)}</CardDescription>
          </div>
          {testimonial.loanType && (
            <Badge variant="outline">{getLoanTypeDisplay(testimonial.loanType)}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">&ldquo;{testimonial.comment}&rdquo;</p>

        {testimonial.location && (
          <p className="text-sm text-muted-foreground mb-4">📍 {testimonial.location}</p>
        )}

        {showActions && (
          <div className="flex items-center gap-3 pt-3 border-t">
            {testimonial.status === 'PENDING' ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(testimonial.id)}
                  disabled={actioningId === testimonial.id}
                >
                  {actioningId === testimonial.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {isEnglish ? 'Approve' : 'Luluskan'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(testimonial.id)}
                  disabled={actioningId === testimonial.id}
                >
                  <X className="h-4 w-4 mr-2" />
                  {isEnglish ? 'Reject' : 'Tolak'}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant={testimonial.isFeatured ? "default" : "outline"}
                onClick={() => handleToggleFeatured(testimonial.id)}
                disabled={actioningId === testimonial.id}
              >
                {actioningId === testimonial.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Medal className="h-4 w-4 mr-2" />
                )}
                {testimonial.isFeatured
                  ? (isEnglish ? 'Remove Featured' : 'Buang Pilihan')
                  : (isEnglish ? 'Mark as Featured' : 'Tandakan sebagai Pilihan')
                }
              </Button>
            )}
          </div>
        )}
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${params.lang}/admin/dashboard`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isEnglish ? 'Back' : 'Kembali'}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEnglish ? 'Testimonial Management' : 'Pengurusan Testimoni'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {approved.length} {isEnglish ? 'approved' : 'diluluskan'}, {pending.length} {isEnglish ? 'pending' : 'menunggu'}
                </p>
              </div>
            </div>
            <Button onClick={fetchTestimonials} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {isEnglish ? 'Refresh' : 'Muat Semula'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              {isEnglish ? 'Pending' : 'Menunggu'} ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              {isEnglish ? 'Approved' : 'Diluluskan'} ({approved.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pending.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg">
                      {isEnglish ? 'No pending testimonials' : 'Tiada testimoni menunggu'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pending.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approved.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg">
                      {isEnglish ? 'No approved testimonials yet' : 'Belum ada testimoni yang diluluskan'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approved.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
