"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft, Save, Settings, Mail, Shield, DollarSign, Bell, Server, Loader2, Check, AlertTriangle, X
} from "lucide-react"
import { Toast } from "@/components/ui/toast"

interface SettingsData {
  system: {
    siteName: string
    contactEmail: string
    contactPhone: string
    address: string
    operatingHours: string
  }
  email: {
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  recaptcha: {
    siteKey: string
    secretKey: string
    enabled: boolean
  }
  loan: {
    minAmount: string
    maxAmount: string
    defaultInterestRate: string
    tenureOptions: string[]
    processingFee: string
  }
  notifications: {
    emailOnNewLead: boolean
    emailOnTestimonial: boolean
    emailOnStatusChange: boolean
    dailyReport: boolean
  }
  security: {
    sessionTimeout: string
    passwordMinLength: string
    requireSpecialChar: boolean
    require2FA: boolean
  }
  maintenance: {
    enabled: boolean
    message: string
  }
}

export default function AdminSettingsPage({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [testingEmail, setTestingEmail] = React.useState(false)
  const [toast, setToast] = React.useState<{show: boolean, title: string, description: string, variant: "success" | "error"}>({
    show: false,
    title: "",
    description: "",
    variant: "success"
  })

  const isEnglish = params.lang === 'en'

  const [settings, setSettings] = React.useState<SettingsData>({
    system: {
      siteName: "Amanah Best Credit",
      contactEmail: "info@amanahbestcredit.com",
      contactPhone: "+60 12-345 6789",
      address: "123 Financial Street, Kuala Lumpur, Malaysia",
      operatingHours: "Mon-Fri: 9:00 AM - 6:00 PM"
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: "587",
      smtpUser: "noreply@amanahbestcredit.com",
      smtpPassword: "",
      fromEmail: "noreply@amanahbestcredit.com",
      fromName: "Amanah Best Credit"
    },
    recaptcha: {
      siteKey: "",
      secretKey: "",
      enabled: true
    },
    loan: {
      minAmount: "5000",
      maxAmount: "500000",
      defaultInterestRate: "3.5",
      tenureOptions: ["12", "24", "36", "48", "60"],
      processingFee: "1.5"
    },
    notifications: {
      emailOnNewLead: true,
      emailOnTestimonial: true,
      emailOnStatusChange: true,
      dailyReport: false
    },
    security: {
      sessionTimeout: "60",
      passwordMinLength: "8",
      requireSpecialChar: true,
      require2FA: false
    },
    maintenance: {
      enabled: false,
      message: "We are currently performing scheduled maintenance. Please check back soon."
    }
  })

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

        // Only Super Admin can access settings
        if (parsedUser.role !== 'Super Admin' && parsedUser.role !== 'Admin') {
          router.push(`/${params.lang}/admin/dashboard`)
          return
        }
      } catch (e) {
        router.push(`/${params.lang}/admin`)
      }
    }

    setLoading(false)
  }, [params.lang, router])

  const showToast = (title: string, description: string, variant: "success" | "error") => {
    setToast({ show: true, title, description, variant })
    setTimeout(() => setToast({ show: false, title: "", description: "", variant: "success" }), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      showToast(
        isEnglish ? "Success" : "Berjaya",
        isEnglish ? "Settings saved successfully" : "Tetapan disimpan dengan berjaya",
        "success"
      )
    } catch (error) {
      showToast(
        isEnglish ? "Error" : "Ralat",
        isEnglish ? "Failed to save settings" : "Gagal menyimpan tetapan",
        "error"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    setTestingEmail(true)
    try {
      // Mock email test - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      showToast(
        isEnglish ? "Success" : "Berjaya",
        isEnglish ? "Test email sent successfully" : "E-mel ujian dihantar dengan berjaya",
        "success"
      )
    } catch (error) {
      showToast(
        isEnglish ? "Error" : "Ralat",
        isEnglish ? "Failed to send test email" : "Gagal menghantar e-mel ujian",
        "error"
      )
    } finally {
      setTestingEmail(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
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
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEnglish ? 'System Settings' : 'Tetapan Sistem'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEnglish ? 'Configure system preferences and settings' : 'Konfigurasi keutamaan dan tetapan sistem'}
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEnglish ? 'Saving...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEnglish ? 'Save Changes' : 'Simpan Perubahan'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="system">
              <Server className="h-4 w-4 mr-2 hidden sm:inline" />
              {isEnglish ? 'System' : 'Sistem'}
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2 hidden sm:inline" />
              {isEnglish ? 'Email' : 'E-mel'}
            </TabsTrigger>
            <TabsTrigger value="recaptcha">
              <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
              reCAPTCHA
            </TabsTrigger>
            <TabsTrigger value="loan">
              <DollarSign className="h-4 w-4 mr-2 hidden sm:inline" />
              {isEnglish ? 'Loan' : 'Pinjaman'}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
              {isEnglish ? 'Alerts' : 'Makluman'}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
              {isEnglish ? 'Security' : 'Keselamatan'}
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              <Settings className="h-4 w-4 mr-2 hidden sm:inline" />
              {isEnglish ? 'Maintenance' : 'Penyelenggaraan'}
            </TabsTrigger>
          </TabsList>

          {/* System Settings */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'System Settings' : 'Tetapan Sistem'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Basic system configuration and contact information' : 'Konfigurasi sistem asas dan maklumat hubungan'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Site Name' : 'Nama Laman'}
                  </label>
                  <Input
                    value={settings.system.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, siteName: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Contact Email' : 'E-mel Hubungan'}
                  </label>
                  <Input
                    type="email"
                    value={settings.system.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, contactEmail: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Contact Phone' : 'Telefon Hubungan'}
                  </label>
                  <Input
                    value={settings.system.contactPhone}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, contactPhone: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Address' : 'Alamat'}
                  </label>
                  <Input
                    value={settings.system.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, address: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Operating Hours' : 'Waktu Operasi'}
                  </label>
                  <Input
                    value={settings.system.operatingHours}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, operatingHours: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{isEnglish ? 'Email Settings' : 'Tetapan E-mel'}</CardTitle>
                    <CardDescription>
                      {isEnglish ? 'Configure SMTP settings for sending emails' : 'Konfigurasi tetapan SMTP untuk menghantar e-mel'}
                    </CardDescription>
                  </div>
                  <Button onClick={handleTestEmail} disabled={testingEmail} variant="outline">
                    {testingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isEnglish ? 'Testing...' : 'Menguji...'}
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        {isEnglish ? 'Test Email' : 'Uji E-mel'}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'SMTP Host' : 'Hos SMTP'}
                    </label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpHost: e.target.value }
                      })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'SMTP Port' : 'Port SMTP'}
                    </label>
                    <Input
                      value={settings.email.smtpPort}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, smtpPort: e.target.value }
                      })}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'SMTP Username' : 'Nama Pengguna SMTP'}
                  </label>
                  <Input
                    value={settings.email.smtpUser}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUser: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'SMTP Password' : 'Kata Laluan SMTP'}
                  </label>
                  <Input
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPassword: e.target.value }
                    })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'From Email' : 'Daripada E-mel'}
                    </label>
                    <Input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromEmail: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'From Name' : 'Daripada Nama'}
                    </label>
                    <Input
                      value={settings.email.fromName}
                      onChange={(e) => setSettings({
                        ...settings,
                        email: { ...settings.email, fromName: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* reCAPTCHA Settings */}
          <TabsContent value="recaptcha">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'reCAPTCHA Settings' : 'Tetapan reCAPTCHA'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Configure Google reCAPTCHA for form protection' : 'Konfigurasi Google reCAPTCHA untuk perlindungan borang'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'Enable reCAPTCHA' : 'Aktifkan reCAPTCHA'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Protect forms from spam and abuse' : 'Lindungi borang daripada spam dan penyalahgunaan'}
                    </div>
                  </div>
                  <Button
                    variant={settings.recaptcha.enabled ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      recaptcha: { ...settings.recaptcha, enabled: !settings.recaptcha.enabled }
                    })}
                  >
                    {settings.recaptcha.enabled ? (isEnglish ? 'Enabled' : 'Diaktifkan') : (isEnglish ? 'Disabled' : 'Dilumpuhkan')}
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Site Key' : 'Kunci Laman'}
                  </label>
                  <Input
                    value={settings.recaptcha.siteKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      recaptcha: { ...settings.recaptcha, siteKey: e.target.value }
                    })}
                    placeholder="6Lc..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Secret Key' : 'Kunci Rahsia'}
                  </label>
                  <Input
                    type="password"
                    value={settings.recaptcha.secretKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      recaptcha: { ...settings.recaptcha, secretKey: e.target.value }
                    })}
                    placeholder="6Lc..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Settings */}
          <TabsContent value="loan">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'Loan Settings' : 'Tetapan Pinjaman'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Configure loan amounts, rates, and terms' : 'Konfigurasi jumlah pinjaman, kadar, dan syarat'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'Minimum Loan Amount (RM)' : 'Jumlah Pinjaman Minimum (RM)'}
                    </label>
                    <Input
                      type="number"
                      value={settings.loan.minAmount}
                      onChange={(e) => setSettings({
                        ...settings,
                        loan: { ...settings.loan, minAmount: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'Maximum Loan Amount (RM)' : 'Jumlah Pinjaman Maksimum (RM)'}
                    </label>
                    <Input
                      type="number"
                      value={settings.loan.maxAmount}
                      onChange={(e) => setSettings({
                        ...settings,
                        loan: { ...settings.loan, maxAmount: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'Default Interest Rate (%)' : 'Kadar Faedah Lalai (%)'}
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.loan.defaultInterestRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        loan: { ...settings.loan, defaultInterestRate: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'Processing Fee (%)' : 'Yuran Pemprosesan (%)'}
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.loan.processingFee}
                      onChange={(e) => setSettings({
                        ...settings,
                        loan: { ...settings.loan, processingFee: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {isEnglish ? 'Available Tenure Options (months)' : 'Pilihan Tempoh Tersedia (bulan)'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {settings.loan.tenureOptions.map((tenure) => (
                      <Badge key={tenure} className="bg-primary-100 text-primary-800">
                        {tenure} {isEnglish ? 'months' : 'bulan'}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'Notification Settings' : 'Tetapan Pemberitahuan'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Configure email notifications and alerts' : 'Konfigurasi pemberitahuan e-mel dan makluman'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'New Lead Notifications' : 'Pemberitahuan Lead Baru'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Receive email when a new lead is submitted' : 'Terima e-mel apabila lead baru dihantar'}
                    </div>
                  </div>
                  <Button
                    variant={settings.notifications.emailOnNewLead ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailOnNewLead: !settings.notifications.emailOnNewLead }
                    })}
                  >
                    {settings.notifications.emailOnNewLead ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'Testimonial Notifications' : 'Pemberitahuan Testimoni'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Receive email when a new testimonial is submitted' : 'Terima e-mel apabila testimoni baru dihantar'}
                    </div>
                  </div>
                  <Button
                    variant={settings.notifications.emailOnTestimonial ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailOnTestimonial: !settings.notifications.emailOnTestimonial }
                    })}
                  >
                    {settings.notifications.emailOnTestimonial ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'Status Change Notifications' : 'Pemberitahuan Perubahan Status'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Receive email when lead status changes' : 'Terima e-mel apabila status lead berubah'}
                    </div>
                  </div>
                  <Button
                    variant={settings.notifications.emailOnStatusChange ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailOnStatusChange: !settings.notifications.emailOnStatusChange }
                    })}
                  >
                    {settings.notifications.emailOnStatusChange ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'Daily Report' : 'Laporan Harian'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Receive daily summary report via email' : 'Terima laporan ringkasan harian melalui e-mel'}
                    </div>
                  </div>
                  <Button
                    variant={settings.notifications.dailyReport ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, dailyReport: !settings.notifications.dailyReport }
                    })}
                  >
                    {settings.notifications.dailyReport ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'Security Settings' : 'Tetapan Keselamatan'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Configure security policies and authentication' : 'Konfigurasi dasar keselamatan dan pengesahan'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'Session Timeout (minutes)' : 'Tamat Masa Sesi (minit)'}
                    </label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {isEnglish ? 'Minimum Password Length' : 'Panjang Kata Laluan Minimum'}
                    </label>
                    <Input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordMinLength: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'Require Special Characters' : 'Perlukan Aksara Khas'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Passwords must contain special characters' : 'Kata laluan mesti mengandungi aksara khas'}
                    </div>
                  </div>
                  <Button
                    variant={settings.security.requireSpecialChar ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      security: { ...settings.security, requireSpecialChar: !settings.security.requireSpecialChar }
                    })}
                  >
                    {settings.security.requireSpecialChar ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {isEnglish ? 'Two-Factor Authentication' : 'Pengesahan Dua Faktor'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isEnglish ? 'Require 2FA for all admin users' : 'Perlukan 2FA untuk semua pengguna admin'}
                    </div>
                  </div>
                  <Button
                    variant={settings.security.require2FA ? "success" : "outline"}
                    onClick={() => setSettings({
                      ...settings,
                      security: { ...settings.security, require2FA: !settings.security.require2FA }
                    })}
                  >
                    {settings.security.require2FA ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Mode */}
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? 'Maintenance Mode' : 'Mod Penyelenggaraan'}</CardTitle>
                <CardDescription>
                  {isEnglish ? 'Enable maintenance mode to prevent public access' : 'Aktifkan mod penyelenggaraan untuk menghalang akses awam'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {isEnglish ? 'Maintenance Mode' : 'Mod Penyelenggaraan'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {settings.maintenance.enabled
                          ? (isEnglish ? 'Site is currently in maintenance mode' : 'Laman sedang dalam mod penyelenggaraan')
                          : (isEnglish ? 'Site is accessible to the public' : 'Laman boleh diakses oleh orang awam')
                        }
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={settings.maintenance.enabled ? "destructive" : "success"}
                    onClick={() => setSettings({
                      ...settings,
                      maintenance: { ...settings.maintenance, enabled: !settings.maintenance.enabled }
                    })}
                  >
                    {settings.maintenance.enabled
                      ? (isEnglish ? 'Disable' : 'Lumpuhkan')
                      : (isEnglish ? 'Enable' : 'Aktifkan')
                    }
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Maintenance Message' : 'Mesej Penyelenggaraan'}
                  </label>
                  <Input
                    value={settings.maintenance.message}
                    onChange={(e) => setSettings({
                      ...settings,
                      maintenance: { ...settings.maintenance, message: e.target.value }
                    })}
                    placeholder={isEnglish ? "Enter maintenance message..." : "Masukkan mesej penyelenggaraan..."}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isEnglish ? 'This message will be displayed to visitors during maintenance' : 'Mesej ini akan dipaparkan kepada pelawat semasa penyelenggaraan'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
