/**
 * Settings Content Router
 * Phase 13: Settings Module
 *
 * Routes the active category to the correct settings sub-component.
 * Uses static sample data instead of Redux for all settings state.
 * AppearanceSettings still reads from Redux (s.theme).
 */

import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type {
  SettingsCategory,
  CompanyProfileFormData,
  UserFormData,
  Role,
  NotificationSettings as NotificationSettingsType,
  TaxConfiguration,
  BackupSettings,
} from '../types/settings.types'
import {
  sampleCompanyProfile,
  sampleUsers,
  sampleRoles,
  sampleNotificationSettings,
  sampleIntegrations,
  sampleAuditLog,
  sampleTaxConfiguration,
  sampleBackupSettings,
} from '@/data/settings.data'

// Personal
import { PersonalProfile } from './personal/personal-profile'
import { ChangePassword } from './personal/change-password'
import { Preferences } from './personal/preferences'

// Company
import { CompanyProfileForm } from './company-profile-form'

// Users & Roles (existing components)
import { UserManagement } from './user-management'
import { RolesPermissions } from './roles-permissions'

// Notifications
import { NotificationSettingsComponent } from './notification-settings'

// Integrations
import { IntegrationsPanel } from './integrations-panel'

// Audit
import { AuditLogComponent } from './audit-log'

// System
import { SystemSettings } from './system-settings'

// Appearance
import { AppearanceSettings } from './appearance-settings'

// Lazy-loaded components (from sub-folders created by agents)
const TenantManagement = lazy(() => import('./super-admin/tenant-management').then(m => ({ default: m.TenantManagement })))
const SubscriptionPlans = lazy(() => import('./super-admin/subscription-plans').then(m => ({ default: m.SubscriptionPlans })))
const PlatformAnalytics = lazy(() => import('./super-admin/platform-analytics').then(m => ({ default: m.PlatformAnalytics })))
const BranchManagement = lazy(() => import('./company/branch-management').then(m => ({ default: m.BranchManagement })))
const SubscriptionView = lazy(() => import('./company/subscription-view').then(m => ({ default: m.SubscriptionView })))
const PasswordPolicy = lazy(() => import('./security/password-policy').then(m => ({ default: m.PasswordPolicy })))
const TwoFactorAuth = lazy(() => import('./security/two-factor-auth').then(m => ({ default: m.TwoFactorAuth })))
const SessionManagement = lazy(() => import('./security/session-management').then(m => ({ default: m.SessionManagement })))
const DataExport = lazy(() => import('./data/data-export').then(m => ({ default: m.DataExport })))
const DataBackup = lazy(() => import('./data/data-backup').then(m => ({ default: m.DataBackup })))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

interface SettingsContentProps {
  activeCategory: SettingsCategory
  userRole: string
}

export function SettingsContent({ activeCategory }: SettingsContentProps) {
  const { t } = useTranslation()
  // Static data from sample data file
  const companyProfile = sampleCompanyProfile
  const users = sampleUsers
  const roles = sampleRoles
  const notificationSettings = sampleNotificationSettings
  const integrations = sampleIntegrations
  const auditLog = sampleAuditLog
  const taxConfig = sampleTaxConfiguration
  const backupSettingsData = sampleBackupSettings

  // All loading/submitting flags are false (static data)
  const isLoadingProfile = false
  const isUpdatingProfile = false
  const isLoadingUsers = false
  const isCreatingUser = false
  const isLoadingRoles = false
  const isCreatingRole = false
  const isLoadingNotifications = false
  const isUpdatingNotifications = false
  const isLoadingIntegrations = false
  const isTogglingIntegration = false
  const isLoadingAudit = false
  const isLoadingTax = false
  const isUpdatingTax = false
  const isLoadingBackup = false
  const isUpdatingBackup = false
  const isBackingUp = false

  // No-op handlers that show toast notifications
  const updateProfile = (_data: CompanyProfileFormData) => { toast.success(t('settings.companyProfileUpdated')) }
  const createUser = (_data: UserFormData) => { toast.success(t('settings.userCreated')) }
  const updateUser = (_id: string, _data: Partial<UserFormData>) => { toast.success(t('settings.userUpdated')) }
  const deleteUser = (_id: string) => { toast.success(t('settings.userDeleted')) }
  const toggleStatus = (_id: string, _status: string) => { toast.success(t('settings.userStatusUpdated')) }
  const createRole = (_data: Omit<Role, 'id' | 'createdAt' | 'userCount'>) => { toast.success(t('settings.roleCreated')) }
  const updateRole = (_id: string, _data: Partial<Role>) => { toast.success(t('settings.roleUpdated')) }
  const deleteRole = (_id: string) => { toast.success(t('settings.roleDeleted')) }
  const updateNotifications = (_data: NotificationSettingsType) => { toast.success(t('settings.notificationsUpdated')) }
  const toggleIntegration = (_id: string, _connect: boolean) => { toast.success(t('settings.integrationStatusUpdated')) }
  const updateTax = (_data: Partial<TaxConfiguration>) => { toast.success(t('settings.taxConfigUpdated')) }
  const updateBackup = (_data: Partial<BackupSettings>) => { toast.success(t('settings.backupSettingsUpdated')) }
  const triggerBackup = () => { toast.success(t('settings.backupTriggered')) }

  // Aliases for data shapes expected by child components
  const usersData = { data: users }
  const rolesData = { data: roles }
  const auditData = { data: auditLog }

  const renderContent = () => {
    switch (activeCategory) {
      // Personal
      case 'personal-profile':
        return <PersonalProfile />
      case 'personal-password':
        return <ChangePassword />
      case 'personal-notifications':
        return (
          <NotificationSettingsComponent
            settings={notificationSettings ?? undefined}
            isLoading={isLoadingNotifications}
            onSave={updateNotifications}
            isSaving={isUpdatingNotifications}
          />
        )
      case 'personal-preferences':
        return <Preferences />

      // Company
      case 'company-profile':
        return (
          <CompanyProfileForm
            profile={companyProfile ?? undefined}
            isLoading={isLoadingProfile}
            onSave={updateProfile}
            isSaving={isUpdatingProfile}
          />
        )
      case 'company-branches':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <BranchManagement />
          </Suspense>
        )
      case 'company-departments':
        return <PlaceholderSection title={t('settings.departmentManagement')} description={t('settings.departmentManagementDesc')} />
      case 'company-customization':
        return <PlaceholderSection title={t('settings.customization')} description={t('settings.customizationDesc')} />

      // Users & Roles
      case 'users-list':
        return (
          <UserManagement
            users={usersData?.data ?? []}
            isLoading={isLoadingUsers}
            onCreateUser={createUser}
            isCreating={isCreatingUser}
            onUpdateUser={(id, data) => updateUser(id, data)}
            onDeleteUser={deleteUser}
            onToggleStatus={(id, status) => toggleStatus(id, status)}
          />
        )
      case 'users-roles':
        return (
          <RolesPermissions
            roles={rolesData?.data ?? []}
            isLoading={isLoadingRoles}
            onCreateRole={createRole}
            isCreating={isCreatingRole}
            onUpdateRole={(id, data) => updateRole(id, data)}
            onDeleteRole={deleteRole}
          />
        )
      case 'users-invitations':
        return <PlaceholderSection title={t('settings.userInvitations')} description={t('settings.userInvitationsDesc')} />

      // Subscription
      case 'subscription-plan':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SubscriptionView />
          </Suspense>
        )
      case 'subscription-billing':
        return <PlaceholderSection title={t('settings.billingHistory')} description={t('settings.billingHistoryDesc')} />

      // Integrations
      case 'integrations-whatsapp':
      case 'integrations-email':
      case 'integrations-maps':
      case 'integrations-payment':
      case 'integrations-api':
        return (
          <IntegrationsPanel
            integrations={integrations ?? []}
            isLoading={isLoadingIntegrations}
            onToggle={(id, connect) => toggleIntegration(id, connect)}
            isToggling={isTogglingIntegration}
          />
        )

      // Security
      case 'security-password':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PasswordPolicy />
          </Suspense>
        )
      case 'security-2fa':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TwoFactorAuth />
          </Suspense>
        )
      case 'security-sessions':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SessionManagement />
          </Suspense>
        )

      // Notifications
      case 'notifications-channels':
        return (
          <NotificationSettingsComponent
            settings={notificationSettings ?? undefined}
            isLoading={isLoadingNotifications}
            onSave={updateNotifications}
            isSaving={isUpdatingNotifications}
          />
        )
      case 'notifications-templates':
        return <PlaceholderSection title={t('settings.notificationTemplates')} description={t('settings.notificationTemplatesDesc')} />

      // Data Management
      case 'data-export':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DataExport />
          </Suspense>
        )
      case 'data-import':
        return <PlaceholderSection title={t('settings.importData')} description={t('settings.importDataDesc')} />
      case 'data-backup':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DataBackup />
          </Suspense>
        )

      // Appearance
      case 'appearance-theme':
        return <AppearanceSettings />

      // Tax & Audit
      case 'tax-configuration':
        return (
          <SystemSettings
            taxConfig={taxConfig ?? undefined}
            backupSettings={backupSettingsData ?? undefined}
            isLoading={isLoadingTax || isLoadingBackup}
            onUpdateTax={updateTax}
            isUpdatingTax={isUpdatingTax}
            onUpdateBackup={updateBackup}
            isUpdatingBackup={isUpdatingBackup}
            onTriggerBackup={triggerBackup}
            isBackingUp={isBackingUp}
          />
        )
      case 'audit-logs':
        return (
          <AuditLogComponent
            entries={auditData?.data ?? []}
            isLoading={isLoadingAudit}
            filters={{}}
            onFiltersChange={() => {}}
          />
        )

      // Super Admin
      case 'super-admin-tenants':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TenantManagement />
          </Suspense>
        )
      case 'super-admin-plans':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SubscriptionPlans />
          </Suspense>
        )
      case 'super-admin-modules':
        return <PlaceholderSection title={t('settings.moduleAssignment')} description={t('settings.moduleAssignmentDesc')} />
      case 'super-admin-analytics':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PlatformAnalytics />
          </Suspense>
        )

      default:
        return <PlaceholderSection title={t('settings.title')} description={t('settings.selectCategory')} />
    }
  }

  return renderContent()
}

function PlaceholderSection({ title, description }: { title: string; description: string }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50">
        <p className="text-sm text-muted-foreground">{t('settings.comingSoon')}</p>
      </div>
    </div>
  )
}
