/**
 * Financial Reports Page
 * Phase 9: Accounts/Finance Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { ProfitLossStatement } from '../components/profit-loss-statement'
import { BalanceSheetView } from '../components/balance-sheet'
import { CashFlowStatementView } from '../components/cash-flow-statement'
import { TrialBalanceView } from '../components/trial-balance'
import {
  sampleProfitLossStatement,
  sampleBalanceSheet,
  sampleCashFlowStatement,
  sampleTrialBalance,
} from '@/data/accounts.data'
import type {
  FinancialReportFilters,
  ProfitLossStatement as ProfitLossType,
  BalanceSheet as BalanceSheetType,
  CashFlowStatement as CashFlowType,
  TrialBalance as TrialBalanceType,
} from '../types/financial-report.types'

export function FinancialReportsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<FinancialReportFilters['reportType']>('profit-loss')

  const isLoading = false

  const plData: ProfitLossType | undefined = sampleProfitLossStatement
  const bsData: BalanceSheetType | undefined = sampleBalanceSheet
  const cfData: CashFlowType | undefined = sampleCashFlowStatement
  const tbData: TrialBalanceType | undefined = sampleTrialBalance
  const plLoading = isLoading
  const bsLoading = isLoading
  const cfLoading = isLoading
  const tbLoading = isLoading

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.reportsTitle')}
        description={t('accounts.reportsDescription')}
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FinancialReportFilters['reportType'])}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profit-loss">{t('accounts.profitLoss')}</TabsTrigger>
          <TabsTrigger value="balance-sheet">{t('accounts.balanceSheet')}</TabsTrigger>
          <TabsTrigger value="cash-flow">{t('accounts.cashFlow')}</TabsTrigger>
          <TabsTrigger value="trial-balance">{t('accounts.trialBalance')}</TabsTrigger>
        </TabsList>
        <TabsContent value="profit-loss" className="mt-6">
          <ProfitLossStatement data={plData} isLoading={plLoading} />
        </TabsContent>
        <TabsContent value="balance-sheet" className="mt-6">
          <BalanceSheetView data={bsData} isLoading={bsLoading} />
        </TabsContent>
        <TabsContent value="cash-flow" className="mt-6">
          <CashFlowStatementView data={cfData} isLoading={cfLoading} />
        </TabsContent>
        <TabsContent value="trial-balance" className="mt-6">
          <TrialBalanceView data={tbData} isLoading={tbLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FinancialReportsPage
