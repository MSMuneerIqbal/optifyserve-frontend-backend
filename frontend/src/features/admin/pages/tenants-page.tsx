import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { TenantManagement } from '../components/tenant-management'

export function TenantsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.tenants')}
        description={t('settings.tenantManagementDescription')}
      />
      <TenantManagement />
    </div>
  )
}

export default TenantsPage
