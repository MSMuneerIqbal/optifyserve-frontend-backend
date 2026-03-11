/**
 * Users Page
 * Standalone page for User Management module
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { toast } from 'sonner'
import { UserManagement } from '../components/user-list'
import { sampleUsers } from '@/data/users.data'
import type { UserFormData } from '../types/user.types'

export function UsersPage() {
  const { t } = useTranslation()

  const createUser = (_data: UserFormData) => { toast.success(t('settings.userCreated')) }
  const updateUser = (_id: string, _data: Partial<UserFormData>) => { toast.success(t('settings.userUpdated')) }
  const deleteUser = (_id: string) => { toast.success(t('settings.userDeleted')) }
  const toggleStatus = (_id: string, _status: string) => { toast.success(t('settings.userStatusUpdated')) }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.users')}
        description={t('settings.usersDescription')}
      />
      <UserManagement
        users={sampleUsers}
        isLoading={false}
        onCreateUser={createUser}
        isCreating={false}
        onUpdateUser={(id, data) => updateUser(id, data)}
        onDeleteUser={deleteUser}
        onToggleStatus={(id, status) => toggleStatus(id, status)}
      />
    </div>
  )
}

export default UsersPage
