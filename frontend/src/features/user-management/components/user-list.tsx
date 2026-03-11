/**
 * User Management Component
 * User Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  Plus, Search, MoreHorizontal, UserPlus, Shield, Mail,
  Loader2, UserCheck, UserX, Trash2,
} from 'lucide-react'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import type { SystemUser, UserFormData, UserRole } from '../types/user.types'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  suspended: 'bg-red-100 text-red-700',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  staff: 'bg-primary/10 text-primary',
  technician: 'bg-amber-100 text-amber-700',
}

interface UserManagementProps {
  users: SystemUser[]
  isLoading: boolean
  onCreateUser: (data: UserFormData) => void
  isCreating: boolean
  onUpdateUser: (id: string, data: Partial<UserFormData>) => void
  onDeleteUser: (id: string) => void
  onToggleStatus: (id: string, status: 'active' | 'inactive' | 'suspended') => void
}

export function UserManagement({
  users,
  isLoading,
  onCreateUser,
  isCreating,
  onUpdateUser,
  onDeleteUser,
  onToggleStatus,
}: UserManagementProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    department: '',
    permissions: [],
    sendInvite: true,
  })

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', role: 'staff',
      department: '', permissions: [], sendInvite: true,
    })
  }

  const handleOpenAdd = () => {
    resetForm()
    setEditingUser(null)
    setShowAddDialog(true)
  }

  const handleOpenEdit = (user: SystemUser) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department || '',
      permissions: user.permissions,
      sendInvite: false,
    })
    setEditingUser(user)
    setShowAddDialog(true)
  }

  const handleSubmit = () => {
    if (editingUser) {
      onUpdateUser(editingUser.id, formData)
    } else {
      onCreateUser(formData)
    }
    setShowAddDialog(false)
    resetForm()
  }

  const handleDelete = () => {
    if (deletingUser) {
      onDeleteUser(deletingUser.id)
      setDeletingUser(null)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleDateString('en-AE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('settings.searchUsers')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('common.role')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('settings.allRoles')}</SelectItem>
              <SelectItem value="admin">{t('settings.admin')}</SelectItem>
              <SelectItem value="manager">{t('settings.manager')}</SelectItem>
              <SelectItem value="staff">{t('settings.staff')}</SelectItem>
              <SelectItem value="technician">{t('settings.technician')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('settings.allStatus')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
              <SelectItem value="suspended">{t('status.suspended')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 me-1.5" />
          {t('settings.addUser')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('settings.totalUsers')}</p>
          <p className="text-xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('status.active')}</p>
          <p className="text-xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('settings.admins')}</p>
          <p className="text-xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('settings.technicians')}</p>
          <p className="text-xl font-bold text-amber-600">{users.filter(u => u.role === 'technician').length}</p>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.users')} ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <Badge className={cn('text-xs', ROLE_COLORS[user.role])}>{user.role}</Badge>
                      <Badge className={cn('text-xs', STATUS_COLORS[user.status])}>{user.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{user.email}</span>
                      {user.department && (
                        <>
                          <span>·</span>
                          <span>{user.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground hidden md:block">
                    {t('settings.lastLogin')}: {formatDate(user.lastLoginAt)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                        <UserPlus className="h-4 w-4 me-2" />
                        {t('settings.editUser')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 me-2" />
                        {t('settings.changeRole')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 me-2" />
                        {t('settings.sendResetLink')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem onClick={() => onToggleStatus(user.id, 'inactive')}>
                          <UserX className="h-4 w-4 me-2" />
                          {t('settings.deactivate')}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onToggleStatus(user.id, 'active')}>
                          <UserCheck className="h-4 w-4 me-2" />
                          {t('settings.activate')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeletingUser(user)}
                      >
                        <Trash2 className="h-4 w-4 me-2" />
                        {t('settings.deleteUser')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                {t('settings.noUsersFound')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {editingUser ? t('settings.editUser') : t('settings.addNewUser')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('settings.fullName')} *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('settings.enterFullName')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.email')} *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('settings.emailPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.phone')}</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('settings.phonePlaceholder')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('common.role')} *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, role: v as UserRole }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('settings.admin')}</SelectItem>
                    <SelectItem value="manager">{t('settings.manager')}</SelectItem>
                    <SelectItem value="staff">{t('settings.staff')}</SelectItem>
                    <SelectItem value="technician">{t('settings.technician')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('common.department')}</Label>
                <Input
                  value={formData.department || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder={t('settings.departmentPlaceholder')}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} disabled={isCreating || !formData.name || !formData.email}>
              {isCreating && <Loader2 className="h-4 w-4 me-1 animate-spin" />}
              {editingUser ? t('common.update') : t('settings.createUser')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title={t('settings.deleteUser')}
        description={t('settings.deleteUserConfirm', { name: deletingUser?.name })}
        variant="destructive"
      />
    </div>
  )
}
