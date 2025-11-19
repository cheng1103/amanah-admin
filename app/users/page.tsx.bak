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
  ArrowLeft, Plus, Search, Edit2, Trash2, UserCheck, UserX, Shield,
  Eye, ChevronLeft, ChevronRight, Loader2, X
} from "lucide-react"
import { Toast } from "@/components/ui/toast"
import { api } from "@/lib/api-client"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Viewer"
  status: "Active" | "Inactive" | "Suspended"
  lastLogin: string | null
  createdAt: string
}

export default function AdminUsersPage({ params }: { params: { lang: string } }) {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [showModal, setShowModal] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null)
  const [toast, setToast] = React.useState<{show: boolean, title: string, description: string, variant: "success" | "error"}>({
    show: false,
    title: "",
    description: "",
    variant: "success"
  })

  const isEnglish = params.lang === 'en'
  const itemsPerPage = 10

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    role: "Admin" as AdminUser["role"],
    status: "Active" as AdminUser["status"]
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

        // Check if user has permission (only Super Admin and Admin can manage users)
        if (parsedUser.role === 'Viewer') {
          router.push(`/${params.lang}/admin/dashboard`)
          return
        }
      } catch (e) {
        router.push(`/${params.lang}/admin`)
      }
    }
  }, [params.lang, router])

  // Fetch admin users from API
  React.useEffect(() => {
    if (!user) return

    const fetchUsers = async () => {
      try {
        setLoading(true)
        // ✅ REAL API CALL: Fetch users from backend
        const response = await api.adminUsers.getAll({
          search: searchTerm || undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        })

        setUsers(response)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        showToast(
          isEnglish ? "Error" : "Ralat",
          isEnglish ? "Failed to load users" : "Gagal memuatkan pengguna",
          "error"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, searchTerm, roleFilter, statusFilter, isEnglish])

  const showToast = (title: string, description: string, variant: "success" | "error") => {
    setToast({ show: true, title, description, variant })
    setTimeout(() => setToast({ show: false, title: "", description: "", variant: "success" }), 3000)
  }

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesStatus = statusFilter === "all" || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleAddUser = () => {
    setSelectedUser(null)
    setFormData({
      name: "",
      email: "",
      role: "Admin",
      status: "Active"
    })
    setShowModal(true)
  }

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setShowModal(true)
  }

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    try {
      // ✅ REAL API CALL: Delete user from backend
      await api.adminUsers.delete(selectedUser.id)

      // Remove from local state
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteConfirm(false)
      setSelectedUser(null)

      showToast(
        isEnglish ? "Success" : "Berjaya",
        isEnglish ? `User ${selectedUser.name} has been deleted` : `Pengguna ${selectedUser.name} telah dipadam`,
        "success"
      )
    } catch (error) {
      console.error('Failed to delete user:', error)
      showToast(
        isEnglish ? "Error" : "Ralat",
        isEnglish ? "Failed to delete user" : "Gagal memadam pengguna",
        "error"
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      showToast(
        isEnglish ? "Error" : "Ralat",
        isEnglish ? "Please fill in all required fields" : "Sila isi semua medan yang diperlukan",
        "error"
      )
      return
    }

    try {
      if (selectedUser) {
        // ✅ REAL API CALL: Update existing user
        const updatedUser = await api.adminUsers.update(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        })

        // Update local state
        setUsers(users.map(u =>
          u.id === selectedUser.id ? updatedUser : u
        ))

        showToast(
          isEnglish ? "Success" : "Berjaya",
          isEnglish ? "User updated successfully" : "Pengguna dikemaskini dengan berjaya",
          "success"
        )
      } else {
        // ✅ REAL API CALL: Create new user
        const newUser = await api.adminUsers.create({
          name: formData.name,
          email: formData.email,
          password: 'TempPassword123!', // Backend will require password change on first login
          role: formData.role,
          status: formData.status,
        })

        // Add to local state
        setUsers([newUser, ...users])

        showToast(
          isEnglish ? "Success" : "Berjaya",
          isEnglish ? "User created successfully" : "Pengguna dicipta dengan berjaya",
          "success"
        )
      }

      setShowModal(false)
      setSelectedUser(null)
    } catch (error: any) {
      console.error('Failed to save user:', error)
      const errorMsg = error.response?.data?.message || (
        selectedUser
          ? (isEnglish ? "Failed to update user" : "Gagal mengemas kini pengguna")
          : (isEnglish ? "Failed to create user" : "Gagal mencipta pengguna")
      )
      showToast(
        isEnglish ? "Error" : "Ralat",
        errorMsg,
        "error"
      )
    }
  }

  const getRoleBadge = (role: AdminUser["role"]) => {
    const colors = {
      "Super Admin": "bg-purple-100 text-purple-800",
      "Admin": "bg-blue-100 text-blue-800",
      "Viewer": "bg-gray-100 text-gray-800"
    }
    return <Badge className={colors[role]}>{role}</Badge>
  }

  const getStatusBadge = (status: AdminUser["status"]) => {
    const colors = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-gray-100 text-gray-800",
      "Suspended": "bg-red-100 text-red-800"
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return isEnglish ? "Never" : "Tidak Pernah"
    const date = new Date(dateString)
    return date.toLocaleDateString(isEnglish ? 'en-US' : 'ms-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return null
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
                  {isEnglish ? 'Admin Users Management' : 'Pengurusan Pengguna Admin'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEnglish ? 'Manage admin users, roles, and permissions' : 'Urus pengguna admin, peranan, dan kebenaran'}
                </p>
              </div>
            </div>
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              {isEnglish ? 'Add User' : 'Tambah Pengguna'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>{isEnglish ? 'Admin Users' : 'Pengguna Admin'}</CardTitle>
                <CardDescription>
                  {isEnglish ? `${filteredUsers.length} total users` : `${filteredUsers.length} jumlah pengguna`}
                </CardDescription>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={isEnglish ? "Search users..." : "Cari pengguna..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={isEnglish ? "Role" : "Peranan"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Roles" : "Semua Peranan"}</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={isEnglish ? "Status" : "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isEnglish ? "All Status" : "Semua Status"}</SelectItem>
                    <SelectItem value="Active">{isEnglish ? "Active" : "Aktif"}</SelectItem>
                    <SelectItem value="Inactive">{isEnglish ? "Inactive" : "Tidak Aktif"}</SelectItem>
                    <SelectItem value="Suspended">{isEnglish ? "Suspended" : "Digantung"}</SelectItem>
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
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {isEnglish ? 'No users found' : 'Tiada pengguna dijumpai'}
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
                          {isEnglish ? 'Name' : 'Nama'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Email' : 'E-mel'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Role' : 'Peranan'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Status' : 'Status'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Last Login' : 'Log Masuk Terakhir'}
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                          {isEnglish ? 'Actions' : 'Tindakan'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((adminUser) => (
                        <tr key={adminUser.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{adminUser.name}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{adminUser.email}</td>
                          <td className="py-3 px-4">{getRoleBadge(adminUser.role)}</td>
                          <td className="py-3 px-4">{getStatusBadge(adminUser.status)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(adminUser.lastLogin)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(adminUser)}
                                title={isEnglish ? "Edit" : "Edit"}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(adminUser)}
                                disabled={adminUser.role === "Super Admin"}
                                title={isEnglish ? "Delete" : "Padam"}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {paginatedUsers.map((adminUser) => (
                    <Card key={adminUser.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900">{adminUser.name}</div>
                            <div className="text-sm text-gray-600">{adminUser.email}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(adminUser)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(adminUser)}
                              disabled={adminUser.role === "Super Admin"}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getRoleBadge(adminUser.role)}
                          {getStatusBadge(adminUser.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {isEnglish ? 'Last login:' : 'Log masuk terakhir:'} {formatDate(adminUser.lastLogin)}
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
                        ? `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filteredUsers.length)} of ${filteredUsers.length} users`
                        : `Menunjukkan ${startIndex + 1} hingga ${Math.min(startIndex + itemsPerPage, filteredUsers.length)} daripada ${filteredUsers.length} pengguna`
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

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedUser
                    ? (isEnglish ? 'Edit User' : 'Edit Pengguna')
                    : (isEnglish ? 'Add New User' : 'Tambah Pengguna Baru')
                  }
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Name' : 'Nama'} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isEnglish ? "Enter user name" : "Masukkan nama pengguna"}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Email' : 'E-mel'} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={isEnglish ? "Enter email address" : "Masukkan alamat e-mel"}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Role' : 'Peranan'}
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as AdminUser["role"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {isEnglish ? 'Status' : 'Status'}
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as AdminUser["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">{isEnglish ? 'Active' : 'Aktif'}</SelectItem>
                      <SelectItem value="Inactive">{isEnglish ? 'Inactive' : 'Tidak Aktif'}</SelectItem>
                      <SelectItem value="Suspended">{isEnglish ? 'Suspended' : 'Digantung'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    {isEnglish ? 'Cancel' : 'Batal'}
                  </Button>
                  <Button type="submit" className="flex-1">
                    {selectedUser
                      ? (isEnglish ? 'Update' : 'Kemaskini')
                      : (isEnglish ? 'Create' : 'Cipta')
                    }
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">
                {isEnglish ? 'Delete User' : 'Padam Pengguna'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {isEnglish
                  ? `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`
                  : `Adakah anda pasti mahu memadam ${selectedUser.name}? Tindakan ini tidak boleh dibatalkan.`
                }
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1"
                >
                  {isEnglish ? 'Cancel' : 'Batal'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  {isEnglish ? 'Delete' : 'Padam'}
                </Button>
              </div>
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
