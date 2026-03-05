/**
 * Roles & Permissions Component
 * Phase 13: Settings Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  Shield, Plus, Users, Lock, Loader2, Edit2, Trash2, Check,
} from 'lucide-react'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { MODULE_PERMISSIONS } from '../types/settings.types'
import type { Role } from '../types/settings.types'

interface RolesPermissionsProps {
  roles: Role[]
  isLoading: boolean
  onCreateRole: (data: Omit<Role, 'id' | 'createdAt' | 'userCount'>) => void
  isCreating: boolean
  onUpdateRole: (id: string, data: Partial<Role>) => void
  onDeleteRole: (id: string) => void
}

export function RolesPermissions({
  roles,
  isLoading,
  onCreateRole,
  isCreating,
  onUpdateRole,
  onDeleteRole,
}: RolesPermissionsProps) {
  const { t } = useTranslation()
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(roles[0]?.id || null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<string[]>([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([])

  const selectedRole = roles.find(r => r.id === selectedRoleId) || null

  const handleStartEdit = () => {
    if (selectedRole) {
      setEditingPermissions([...selectedRole.permissions])
      setIsEditMode(true)
    }
  }

  const handleSavePermissions = () => {
    if (selectedRole) {
      onUpdateRole(selectedRole.id, { permissions: editingPermissions })
      setIsEditMode(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditingPermissions([])
  }

  const togglePermission = (permId: string, list: string[], setter: (perms: string[]) => void) => {
    if (list.includes(permId)) {
      setter(list.filter(p => p !== permId))
    } else {
      setter([...list, permId])
    }
  }

  const toggleModuleAll = (module: string, list: string[], setter: (perms: string[]) => void) => {
    const group = MODULE_PERMISSIONS.find(g => g.module === module)
    if (!group) return
    const modulePermIds = group.permissions.map(p => p.id)
    const allSelected = modulePermIds.every(p => list.includes(p))
    if (allSelected) {
      setter(list.filter(p => !modulePermIds.includes(p)))
    } else {
      setter([...new Set([...list, ...modulePermIds])])
    }
  }

  const handleCreateRole = () => {
    onCreateRole({
      name: newRoleName,
      description: newRoleDescription,
      permissions: newRolePermissions,
      isSystem: false,
    })
    setShowAddDialog(false)
    setNewRoleName('')
    setNewRoleDescription('')
    setNewRolePermissions([])
  }

  const currentPermissions = isEditMode ? editingPermissions : (selectedRole?.permissions || [])
  const isWildcard = currentPermissions.includes('*')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Roles List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('settings.roles')}
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-3 w-3 me-1" />
              {t('common.add')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => { setSelectedRoleId(role.id); setIsEditMode(false) }}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors',
                  selectedRoleId === role.id && 'bg-primary/5 border-s-2 border-primary'
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{role.name}</p>
                    {role.isSystem && (
                      <Badge variant="secondary" className="text-xs">{t('settings.system')}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {role.userCount}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Panel */}
      <Card className="lg:col-span-2">
        {selectedRole ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {selectedRole.name} {t('settings.permissions')}
                  </CardTitle>
                  <CardDescription className="mt-1">{selectedRole.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>{t('common.cancel')}</Button>
                      <Button size="sm" onClick={handleSavePermissions}>
                        <Check className="h-3 w-3 me-1" />
                        {t('common.save')}
                      </Button>
                    </>
                  ) : (
                    <>
                      {!selectedRole.isSystem && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => setDeletingRole(selectedRole)}
                        >
                          <Trash2 className="h-3 w-3 me-1" />
                          {t('common.delete')}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={handleStartEdit}>
                        <Edit2 className="h-3 w-3 me-1" />
                        {t('common.edit')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isWildcard && !isEditMode ? (
                <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">{t('settings.fullAccess')}</p>
                    <p className="text-xs text-purple-700">{t('settings.fullAccessDesc')}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {MODULE_PERMISSIONS.map(group => {
                    const modulePermIds = group.permissions.map(p => p.id)
                    const selectedCount = modulePermIds.filter(p => currentPermissions.includes(p) || isWildcard).length
                    const allSelected = selectedCount === modulePermIds.length

                    return (
                      <div key={group.module} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isEditMode && (
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={() => toggleModuleAll(group.module, editingPermissions, setEditingPermissions)}
                              />
                            )}
                            <h4 className="text-sm font-semibold">{group.label}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {selectedCount}/{modulePermIds.length}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.permissions.map(perm => {
                            const isChecked = currentPermissions.includes(perm.id) || isWildcard
                            return (
                              <div key={perm.id} className="flex items-start gap-2">
                                <Checkbox
                                  checked={isChecked}
                                  disabled={!isEditMode}
                                  onCheckedChange={() => {
                                    if (isEditMode) {
                                      togglePermission(perm.id, editingPermissions, setEditingPermissions)
                                    }
                                  }}
                                  className="mt-0.5"
                                />
                                <div>
                                  <p className="text-sm">{perm.label}</p>
                                  <p className="text-xs text-muted-foreground">{perm.description}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
            {t('settings.selectRoleToView')}
          </div>
        )}
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('settings.createNewRole')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-y-auto py-2">
            <div className="space-y-2">
              <Label>{t('settings.roleName')} *</Label>
              <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder={t('settings.roleNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.description')}</Label>
              <Textarea
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder={t('settings.roleDescriptionPlaceholder')}
                rows={2}
              />
            </div>
            <Separator />
            <h4 className="text-sm font-semibold">{t('settings.permissions')}</h4>
            <div className="space-y-3">
              {MODULE_PERMISSIONS.map(group => {
                const modulePermIds = group.permissions.map(p => p.id)
                const allSelected = modulePermIds.every(p => newRolePermissions.includes(p))

                return (
                  <div key={group.module} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => toggleModuleAll(group.module, newRolePermissions, setNewRolePermissions)}
                      />
                      <h5 className="text-sm font-medium">{group.label}</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ms-6">
                      {group.permissions.map(perm => (
                        <div key={perm.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={newRolePermissions.includes(perm.id)}
                            onCheckedChange={() => togglePermission(perm.id, newRolePermissions, setNewRolePermissions)}
                          />
                          <span className="text-sm">{perm.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCreateRole} disabled={isCreating || !newRoleName}>
              {isCreating && <Loader2 className="h-4 w-4 me-1 animate-spin" />}
              {t('settings.createRole')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={() => { if (deletingRole) { onDeleteRole(deletingRole.id); setDeletingRole(null) } }}
        title={t('settings.deleteRole')}
        description={t('settings.deleteRoleConfirm', { name: deletingRole?.name })}
        variant="destructive"
      />
    </div>
  )
}
