"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { api } from "@/lib/api-client"
import { Loader2, ArrowLeft, UserPlus, Shield, Mail, Calendar, RefreshCw, Edit, Trash2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [actioningId, setActioningId] = React.useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    status: "ACTIVE"
  })

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await api.adminUsers.getAll() as any
      // Handle different API response formats
      const usersData = Array.isArray(response) ? response : (response.data || [])
      setUsers(usersData)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    async function fetchData() {
      try {
        const profileResponse = await api.auth.getProfile() as any
        const userData = profileResponse.data || profileResponse
        setCurrentUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        if ((error as any)?.response?.status === 401) {
          router.push('/')
        }
      }
    }
    fetchData()
    fetchUsers()
  }, [fetchUsers, router])

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setActioningId(userId)
    const originalUser = users.find(u => u.id === userId)
    const originalStatus = originalUser?.status

    try {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: newStatus } : u
      ))

      await api.adminUsers.updateStatus(userId, newStatus)
    } catch (err) {
      if (originalStatus) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, status: originalStatus } : u
        ))
      }
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setActioningId(null)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.adminUsers.create(newUser)
      setUsers(prev => [...prev, response.data || response])
      setIsCreateDialogOpen(false)
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
        status: "ACTIVE"
      })
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to create user')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this admin user?')) return

    try {
      await api.adminUsers.delete(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { variant: 'default' | 'secondary' | 'outline', label: string }> = {
      SUPER_ADMIN: { variant: 'default', label: 'Super Admin' },
      ADMIN: { variant: 'secondary', label: 'Admin' },
      VIEWER: { variant: 'outline', label: 'Viewer' }
    }
    const config = roleConfig[role] || roleConfig.ADMIN
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'ACTIVE' ? 'default' : 'destructive'}>
        {status}
      </Badge>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar user={currentUser} />

      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="px-4 sm:px-6 lg:px-8 py-8 pt-20 md:pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
              <p className="text-sm text-gray-600 mt-1">{users.length} total users</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchUsers} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Admin User</DialogTitle>
                    <DialogDescription>Add a new administrator to the system</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Create User</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">No admin users found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {user.name}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(user.createdAt)}</span>
                    </div>
                    {user.lastLogin && (
                      <div className="text-sm text-gray-600">
                        Last login: {formatDate(user.lastLogin)}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Select
                          value={user.status}
                          onValueChange={(value) => handleStatusChange(user.id, value)}
                          disabled={actioningId === user.id}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        {actioningId === user.id && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </div>

                      {user.role !== 'SUPER_ADMIN' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
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
