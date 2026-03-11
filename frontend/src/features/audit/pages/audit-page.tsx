import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { AuditLogComponent } from '../components/audit-log'
import { sampleAuditLog } from '@/data/audit.data'
import type { AuditLogFilters } from '../types/audit.types'

export function AuditPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<AuditLogFilters>({})

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.auditLogs')}
        description={t('settings.auditLogDescription')}
      />
      <AuditLogComponent
        entries={sampleAuditLog}
        isLoading={false}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  )
}

export default AuditPage
