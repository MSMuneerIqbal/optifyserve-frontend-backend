/**
 * Cash Flow Statement Component
 * Phase 9: Accounts/Finance Module
 *
 * Operating, Investing, Financing activities
 */

import { useTranslation } from 'react-i18next'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { EmptyState } from '@/components/shared/empty-state'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate, cn } from '@/lib/utils'
import type { CashFlowStatement as CashFlowType, ReportLineItem } from '../types/financial-report.types'

interface CashFlowStatementProps {
  data: CashFlowType | undefined
  isLoading: boolean
}

export function CashFlowStatementView({ data, isLoading }: CashFlowStatementProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
  }

  if (!data) {
    return <EmptyState icon="document" title={t('common.noData')} description={t('common.selectPeriodToGenerate')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">{t('accounts.cashFlowStatement')}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t('common.period')}: {formatDate(data.period.from)} {t('common.to')} {formatDate(data.period.to)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 me-2" /> {t('common.print')}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <CashFlowCard label={t('accounts.operating')} value={data.netCashFromOperating} />
        <CashFlowCard label={t('accounts.investing')} value={data.netCashFromInvesting} />
        <CashFlowCard label={t('accounts.financing')} value={data.netCashFromFinancing} />
        <CashFlowCard label={t('accounts.netChange')} value={data.netChangeInCash} isPrimary />
      </div>

      {/* Cash Flow Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[65%]">{t('common.description')}</TableHead>
                  <TableHead className="text-end">{t('accounts.amountAED')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Operating Activities */}
                <SectionRow label={t('accounts.cashFlowsFromOperating')} bgColor="bg-blue-50/50" textColor="text-blue-700" />
                {data.operatingActivities.map((item, idx) => (
                  <ItemRow key={`op-${idx}`} item={item} />
                ))}
                <TotalRow label={t('accounts.netCashFromOperating')} amount={data.netCashFromOperating} />

                {/* Investing Activities */}
                <SectionRow label={t('accounts.cashFlowsFromInvesting')} bgColor="bg-green-50/50" textColor="text-green-700" />
                {data.investingActivities.map((item, idx) => (
                  <ItemRow key={`inv-${idx}`} item={item} />
                ))}
                <TotalRow label={t('accounts.netCashFromInvesting')} amount={data.netCashFromInvesting} />

                {/* Financing Activities */}
                <SectionRow label={t('accounts.cashFlowsFromFinancing')} bgColor="bg-purple-50/50" textColor="text-purple-700" />
                {data.financingActivities.map((item, idx) => (
                  <ItemRow key={`fin-${idx}`} item={item} />
                ))}
                <TotalRow label={t('accounts.netCashFromFinancing')} amount={data.netCashFromFinancing} />

                {/* Net Change */}
                <TableRow className="bg-primary/5 font-bold">
                  <TableCell className="text-primary">{t('accounts.netChangeInCash')}</TableCell>
                  <TableCell className={cn('text-end text-lg', data.netChangeInCash >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatAmount(data.netChangeInCash)}
                  </TableCell>
                </TableRow>

                {/* Cash Balances */}
                <TableRow>
                  <TableCell className="ps-8">{t('accounts.beginningCashBalance')}</TableCell>
                  <TableCell className="text-end">{formatAmount(data.beginningCashBalance)}</TableCell>
                </TableRow>
                <TableRow className="font-bold bg-muted/30">
                  <TableCell>{t('accounts.endingCashBalance')}</TableCell>
                  <TableCell className="text-end text-lg">{formatAmount(data.endingCashBalance)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SectionRow({ label, bgColor, textColor }: { label: string; bgColor: string; textColor: string }) {
  return (
    <TableRow className={bgColor}>
      <TableCell colSpan={2} className={`font-bold ${textColor}`}>{label}</TableCell>
    </TableRow>
  )
}

function ItemRow({ item }: { item: ReportLineItem }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow>
      <TableCell className="ps-8">{item.accountName}</TableCell>
      <TableCell className={cn('text-end', item.amount < 0 ? 'text-red-600' : '')}>
        {formatAmount(item.amount)}
      </TableCell>
    </TableRow>
  )
}

function TotalRow({ label, amount }: { label: string; amount: number }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow className="bg-muted/20 font-semibold">
      <TableCell>{label}</TableCell>
      <TableCell className={cn('text-end', amount < 0 ? 'text-red-600' : 'text-green-600')}>
        {formatAmount(amount)}
      </TableCell>
    </TableRow>
  )
}

function CashFlowCard({ label, value, isPrimary }: { label: string; value: number; isPrimary?: boolean }) {
  const { formatAmount } = useCurrency()
  return (
    <div className={cn('rounded-lg border bg-white p-4', isPrimary && 'border-primary')}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('text-xl sm:text-2xl font-bold mt-1', value >= 0 ? 'text-green-600' : 'text-red-600')}>
        {formatAmount(value)}
      </p>
    </div>
  )
}

export default CashFlowStatementView
