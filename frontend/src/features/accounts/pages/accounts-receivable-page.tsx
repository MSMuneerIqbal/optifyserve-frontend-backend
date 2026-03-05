/**
 * Accounts Receivable Page
 * Phase 9: Accounts/Finance Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { useCurrency } from '@/contexts/currency-context'
import { ARAgingReport } from '../components/ar-aging-report'
import { CustomerStatement } from '../components/customer-statement'
import { sampleARAgingReport } from '@/data/accounts.data'

export function AccountsReceivablePage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [activeTab, setActiveTab] = useState('aging')

  const agingReport = sampleARAgingReport

  // Derive summary from aging report
  const summary = {
    totalOutstanding: agingReport.totalOutstanding,
    totalOverdue: agingReport.days31to60Total + agingReport.days61to90Total + agingReport.days90plusTotal,
    currentAmount: agingReport.currentTotal,
    totalCustomers: agingReport.customers.length,
    averageDaysSales: 35,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.receivableTitle')}
        description={t('accounts.receivableDescription')}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard label={t('accounts.totalOutstanding')} value={formatAmount(summary.totalOutstanding)} color="border-s-blue-500" />
        <SummaryCard label={t('status.overdue')} value={formatAmount(summary.totalOverdue)} color="border-s-red-500" />
        <SummaryCard label={t('accounts.current030')} value={formatAmount(summary.currentAmount)} color="border-s-green-500" />
        <SummaryCard label={t('common.customers')} value={summary.totalCustomers} color="border-s-amber-500" />
        <SummaryCard label={t('accounts.avgDaysSales')} value={`${summary.averageDaysSales} ${t('common.days')}`} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="aging">{t('accounts.agingReport')}</TabsTrigger>
          <TabsTrigger value="statement">{t('accounts.customerStatement')}</TabsTrigger>
        </TabsList>
        <TabsContent value="aging" className="mt-6">
          <ARAgingReport />
        </TabsContent>
        <TabsContent value="statement" className="mt-6">
          <CustomerStatement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className={`rounded-lg border bg-white p-4 ${color ? `border-s-4 ${color}` : ''}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
    </div>
  )
}

export default AccountsReceivablePage
