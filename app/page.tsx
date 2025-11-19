"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
// Removed server actions import - using direct cookie setting instead
import { Loader2, Shield } from "lucide-react"

interface LoginResponse {
  access_token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const isEnglish = true // Default to English for admin panel

  // ✅ SECURITY FIX: Removed client-side localStorage check
  // Authentication is now handled by middleware.ts using httpOnly cookies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    let isMounted = true

    try {
      const response = await api.auth.login(email, password) as any
      console.log('Login response:', response)

      if (!isMounted) return

      // Backend returns { success: true, data: { access_token, user } }
      const data = response.data || response
      console.log('Extracted data:', data)

      if (data.access_token) {
        console.log('✅ Login successful! Token received.')
        console.log('User:', data.user)

        // Store auth token in cookie (client-side)
        const maxAge = 60 * 60 * 24 // 24 hours
        document.cookie = `authToken=${data.access_token}; path=/; max-age=${maxAge}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`

        // Store user info in cookie for UI display
        if (data.user) {
          document.cookie = `userData=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${maxAge}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        }

        console.log('✅ Cookies set successfully')
        console.log('Redirecting to dashboard...')

        // Small delay to ensure cookies are set before redirect
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } else {
        console.error('No access_token in response. Full response:', response)
        // Show detailed error on page
        setError('Debug: No access_token. Response: ' + JSON.stringify(data).substring(0, 200))
        return
      }
    } catch (err: unknown) {
      if (!isMounted) return

      const error = err as { response?: { data?: { message?: string } }; message?: string }
      console.error('Login error:', error)

      // Show detailed error including response data
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          JSON.stringify(error.response?.data || error).substring(0, 200)

      setError(errorMessage || (isEnglish ? 'Login failed. Please check your credentials.' : 'Log masuk gagal. Sila semak kelayakan anda.'))
    } finally {
      if (isMounted) {
        setIsLoading(false)
      }
    }

    return () => {
      isMounted = false
    }
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Cleanup function
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isEnglish ? 'Admin Login' : 'Log Masuk Admin'}
          </CardTitle>
          <CardDescription>
            {isEnglish
              ? 'Enter your credentials to access the admin dashboard'
              : 'Masukkan kelayakan anda untuk mengakses papan pemuka admin'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-label={isEnglish ? "Admin login form" : "Borang log masuk admin"}>
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                {isEnglish ? 'Email Address' : 'Alamat Emel'}
              </Label>
              <Input
                id="email"
                type="email"
                required
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lioncredit.com"
                disabled={isLoading}
                aria-invalid={!!error}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isEnglish ? 'Password' : 'Kata Laluan'}
              </Label>
              <Input
                id="password"
                type="password"
                required
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={!!error}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  {isEnglish ? 'Signing in...' : 'Sedang log masuk...'}
                </>
              ) : (
                isEnglish ? 'Sign In' : 'Log Masuk'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {isEnglish
                ? 'Admin access only. Unauthorized access is prohibited.'
                : 'Akses admin sahaja. Akses tanpa kebenaran adalah dilarang.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
