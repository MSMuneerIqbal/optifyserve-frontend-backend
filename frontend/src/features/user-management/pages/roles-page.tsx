/**
 * Roles & Permissions Page
 * Standalone page for User Management module
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { toast } from 'sonner'
import { RolesPermissions } from '../components/roles-permissions'
import { sampleRoles } from '@/data/users.data'
import type { Role } from '../types/user.types'

export function RolesPage() {
  const { t } = useTranslation()

  const createRole = (_data: Omit<Role, 'id' | 'createdAt' | 'userCount'>) => { toast.success(t('settings.roleCreated')) }
  const updateRole = (_id: string, _data: Partial<Role>) => { toast.success(t('settings.roleUpdated')) }
  const deleteRole = (_id: string) => { toast.success(t('settings.roleDeleted')) }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.rolesPermissions')}
        description={t('settings.rolesPermissionsDescription')}
      />
      <RolesPermissions
        roles={sampleRoles}
        isLoading={false}
        onCreateRole={createRole}
        isCreating={false}
        onUpdateRole={(id, data) => updateRole(id, data)}
        onDeleteRole={deleteRole}
      />
    </div>
  )
}

export default RolesPage
