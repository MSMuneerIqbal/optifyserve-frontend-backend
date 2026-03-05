/**
 * Financial Dashboard Page
 * Phase 9: Accounts/Finance Module
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { FinancialDashboard } from '../components/financial-dashboard'

export function FinancialDashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.dashboardTitle')}
        description={t('accounts.dashboardDescription')}
      />
      <FinancialDashboard />
    </div>
  )
}

export default FinancialDashboardPage
