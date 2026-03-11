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
  NotificationSettings as NotificationSettingsType,
  TaxConfiguration,
  BackupSettings,
} from '../types/settings.types'
import {
  sampleCompanyProfile,
  sampleNotificationSettings,
  sampleIntegrations,
  sampleTaxConfiguration,
  sampleBackupSettings,
} from '@/data/settings.data'

// Personal
import { PersonalProfile } from './personal/personal-profile'
import { ChangePassword } from './personal/change-password'
import { Preferences } from './personal/preferences'

// Company
import { CompanyProfileForm } from './company-profile-form'

// Notifications
import { NotificationSettingsComponent } from './notification-settings'

// Integrations
import { IntegrationsPanel } from './integrations-panel'

// System
import { SystemSettings } from './system-settings'

// Appearance
import { AppearanceSettings } from './appearance-settings'

// Lazy-loaded components (from sub-folders created by agents)
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
}

export function SettingsContent({ activeCategory }: SettingsContentProps) {
  const { t } = useTranslation()
  // Static data from sample data file
  const companyProfile = sampleCompanyProfile
  const notificationSettings = sampleNotificationSettings
  const integrations = sampleIntegrations
  const taxConfig = sampleTaxConfiguration
  const backupSettingsData = sampleBackupSettings

  // All loading/submitting flags are false (static data)
  const isLoadingProfile = false
  const isUpdatingProfile = false
  const isLoadingNotifications = false
  const isUpdatingNotifications = false
  const isLoadingIntegrations = false
  const isTogglingIntegration = false
  const isLoadingTax = false
  const isUpdatingTax = false
  const isLoadingBackup = false
  const isUpdatingBackup = false
  const isBackingUp = false

  // No-op handlers that show toast notifications
  const updateProfile = (_data: CompanyProfileFormData) => { toast.success(t('settings.companyProfileUpdated')) }
  const updateNotifications = (_data: NotificationSettingsType) => { toast.success(t('settings.notificationsUpdated')) }
  const toggleIntegration = (_id: string, _connect: boolean) => { toast.success(t('settings.integrationStatusUpdated')) }
  const updateTax = (_data: Partial<TaxConfiguration>) => { toast.success(t('settings.taxConfigUpdated')) }
  const updateBackup = (_data: Partial<BackupSettings>) => { toast.success(t('settings.backupSettingsUpdated')) }
  const triggerBackup = () => { toast.success(t('settings.backupTriggered')) }

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
