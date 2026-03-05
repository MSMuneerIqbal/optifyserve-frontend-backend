/**
 * Profit & Loss Statement Component
 * Phase 9: Accounts/Finance Module
 *
 * P&L report with period comparison
 * Fully responsive with dual-view pattern
 */

import { useTranslation } from 'react-i18next'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
import type { ProfitLossStatement as ProfitLossType, ReportLineItem } from '../types/financial-report.types'

interface ProfitLossStatementProps {
  data: ProfitLossType | undefined
  isLoading: boolean
}

export function ProfitLossStatement({ data, isLoading }: ProfitLossStatementProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
  }

  if (!data) {
    return <EmptyState icon="document" title={t('common.noData')} description={t('common.selectPeriodToGenerate')} />
  }

  const hasComparison = !!data.comparisonPeriod

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">{t('accounts.profitLoss')}</CardTitle>
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

      {/* P&L Table - Desktop */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[50%]">{t('accounts.account')}</TableHead>
                    <TableHead className="text-end">{t('common.currentPeriod')}</TableHead>
                    {hasComparison && <TableHead className="text-end">{t('common.previousPeriod')}</TableHead>}
                    {hasComparison && <TableHead className="text-end">{t('common.changePercent')}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Revenue */}
                  <SectionHeader label={t('accounts.revenue')} />
                  {data.revenue.map((item, idx) => (
                    <LineItemRow key={idx} item={item} hasComparison={hasComparison} />
                  ))}
                  <TotalRow label={t('accounts.totalRevenue')} amount={data.totalRevenue} previousAmount={data.previousTotalRevenue} hasComparison={hasComparison} />

                  {/* COGS */}
                  <SectionHeader label={t('common.costOfGoodsSold')} />
                  {data.cogs.map((item, idx) => (
                    <LineItemRow key={idx} item={item} hasComparison={hasComparison} />
                  ))}
                  <TotalRow label={t('common.totalCOGS')} amount={data.totalCOGS} previousAmount={data.previousTotalCOGS} hasComparison={hasComparison} />

                  {/* Gross Profit */}
                  <HighlightRow
                    label={t('common.grossProfit')}
                    amount={data.grossProfit}
                    previousAmount={data.previousGrossProfit}
                    margin={data.grossProfitMargin}
                    hasComparison={hasComparison}
                  />

                  {/* Operating Expenses */}
                  <SectionHeader label={t('common.operatingExpenses')} />
                  {data.operatingExpenses.map((item, idx) => (
                    <LineItemRow key={idx} item={item} hasComparison={hasComparison} />
                  ))}
                  <TotalRow label={t('common.totalOperatingExpenses')} amount={data.totalOperatingExpenses} previousAmount={data.previousTotalOperatingExpenses} hasComparison={hasComparison} />

                  {/* Operating Profit */}
                  <HighlightRow
                    label={t('common.operatingProfit')}
                    amount={data.operatingProfit}
                    previousAmount={data.previousOperatingProfit}
                    margin={data.operatingProfitMargin}
                    hasComparison={hasComparison}
                  />

                  {/* Other Income */}
                  {data.otherIncome.length > 0 && (
                    <>
                      <SectionHeader label={t('common.otherIncome')} />
                      {data.otherIncome.map((item, idx) => (
                        <LineItemRow key={idx} item={item} hasComparison={hasComparison} />
                      ))}
                      <TotalRow label={t('common.totalOtherIncome')} amount={data.totalOtherIncome} hasComparison={false} />
                    </>
                  )}

                  {/* Other Expenses */}
                  {data.otherExpenses.length > 0 && (
                    <>
                      <SectionHeader label={t('common.otherExpenses')} />
                      {data.otherExpenses.map((item, idx) => (
                        <LineItemRow key={idx} item={item} hasComparison={hasComparison} />
                      ))}
                      <TotalRow label={t('common.totalOtherExpenses')} amount={data.totalOtherExpenses} hasComparison={false} />
                    </>
                  )}

                  {/* Net Profit */}
                  <HighlightRow
                    label={t('common.netProfit')}
                    amount={data.netProfit}
                    previousAmount={data.previousNetProfit}
                    margin={data.netProfitMargin}
                    hasComparison={hasComparison}
                    isPrimary
                  />
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L Cards - Mobile */}
      <div className="md:hidden space-y-4">
        <MobileSection title={t('accounts.revenue')} items={data.revenue} totalLabel={t('accounts.totalRevenue')} totalAmount={data.totalRevenue} />
        <MobileSection title={t('common.costOfGoodsSold')} items={data.cogs} totalLabel={t('common.totalCOGS')} totalAmount={data.totalCOGS} />
        <MobileHighlightCard label={t('common.grossProfit')} amount={data.grossProfit} margin={data.grossProfitMargin} />
        <MobileSection title={t('common.operatingExpenses')} items={data.operatingExpenses} totalLabel={t('common.totalOperatingExpenses')} totalAmount={data.totalOperatingExpenses} />
        <MobileHighlightCard label={t('common.operatingProfit')} amount={data.operatingProfit} margin={data.operatingProfitMargin} />
        {data.otherIncome.length > 0 && (
          <MobileSection title={t('common.otherIncome')} items={data.otherIncome} totalLabel={t('common.totalOtherIncome')} totalAmount={data.totalOtherIncome} />
        )}
        {data.otherExpenses.length > 0 && (
          <MobileSection title={t('common.otherExpenses')} items={data.otherExpenses} totalLabel={t('common.totalOtherExpenses')} totalAmount={data.totalOtherExpenses} />
        )}
        <MobileHighlightCard label={t('common.netProfit')} amount={data.netProfit} margin={data.netProfitMargin} isPrimary />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label={t('accounts.revenue')} value={data.totalRevenue} />
        <SummaryCard label={t('common.grossProfit')} value={data.grossProfit} subLabel={`${data.grossProfitMargin.toFixed(1)}% ${t('common.margin')}`} />
        <SummaryCard label={t('common.operatingProfit')} value={data.operatingProfit} subLabel={`${data.operatingProfitMargin.toFixed(1)}% ${t('common.margin')}`} />
        <SummaryCard label={t('common.netProfit')} value={data.netProfit} subLabel={`${data.netProfitMargin.toFixed(1)}% ${t('common.margin')}`} isPositiveGreen />
      </div>
    </div>
  )
}

/* Desktop sub-components */

function SectionHeader({ label }: { label: string }) {
  return (
    <TableRow className="bg-muted/30">
      <TableCell colSpan={4} className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{label}</TableCell>
    </TableRow>
  )
}

function LineItemRow({ item, hasComparison }: { item: ReportLineItem; hasComparison: boolean }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow>
      <TableCell style={{ paddingInlineStart: `${(item.indent || 0) * 24 + 16}px` }}>
        <span className="font-mono text-xs text-muted-foreground me-2">{item.accountCode}</span>
        {item.accountName}
      </TableCell>
      <TableCell className="text-end">{formatAmount(item.amount)}</TableCell>
      {hasComparison && <TableCell className="text-end">{item.previousAmount !== undefined ? formatAmount(item.previousAmount) : '-'}</TableCell>}
      {hasComparison && (
        <TableCell className={cn('text-end', item.changePercent && item.changePercent > 0 ? 'text-green-600' : item.changePercent && item.changePercent < 0 ? 'text-red-600' : '')}>
          {item.changePercent !== undefined ? `${item.changePercent > 0 ? '+' : ''}${item.changePercent.toFixed(1)}%` : '-'}
        </TableCell>
      )}
    </TableRow>
  )
}

function TotalRow({ label, amount, previousAmount, hasComparison }: { label: string; amount: number; previousAmount?: number; hasComparison: boolean }) {
  const { formatAmount } = useCurrency()
  const changePercent = previousAmount && previousAmount !== 0 ? ((amount - previousAmount) / Math.abs(previousAmount)) * 100 : undefined
  return (
    <TableRow className="bg-muted/20 font-semibold">
      <TableCell>{label}</TableCell>
      <TableCell className="text-end">{formatAmount(amount)}</TableCell>
      {hasComparison && <TableCell className="text-end">{previousAmount !== undefined ? formatAmount(previousAmount) : '-'}</TableCell>}
      {hasComparison && (
        <TableCell className={cn('text-end', changePercent && changePercent > 0 ? 'text-green-600' : changePercent && changePercent < 0 ? 'text-red-600' : '')}>
          {changePercent !== undefined ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%` : '-'}
        </TableCell>
      )}
    </TableRow>
  )
}

function HighlightRow({ label, amount, previousAmount, margin, hasComparison, isPrimary }: { label: string; amount: number; previousAmount?: number; margin: number; hasComparison: boolean; isPrimary?: boolean }) {
  const { formatAmount } = useCurrency()
  const changePercent = previousAmount && previousAmount !== 0 ? ((amount - previousAmount) / Math.abs(previousAmount)) * 100 : undefined
  return (
    <TableRow className={cn('font-bold', isPrimary ? 'bg-primary/5 text-primary' : 'bg-muted/50')}>
      <TableCell>
        {label}
        <span className="text-xs font-normal text-muted-foreground ms-2">({margin.toFixed(1)}% margin)</span>
      </TableCell>
      <TableCell className="text-end text-lg">{formatAmount(amount)}</TableCell>
      {hasComparison && <TableCell className="text-end">{previousAmount !== undefined ? formatAmount(previousAmount) : '-'}</TableCell>}
      {hasComparison && (
        <TableCell className={cn('text-end', changePercent && changePercent > 0 ? 'text-green-600' : 'text-red-600')}>
          {changePercent !== undefined ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%` : '-'}
        </TableCell>
      )}
    </TableRow>
  )
}

/* Mobile sub-components */

function MobileSection({ title, items, totalLabel, totalAmount }: { title: string; items: ReportLineItem[]; totalLabel: string; totalAmount: number }) {
  const { formatAmount } = useCurrency()
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="min-w-0 flex-1 me-3">
              <span className="font-mono text-xs text-muted-foreground me-1">{item.accountCode}</span>
              <span className="text-sm">{item.accountName}</span>
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{formatAmount(item.amount)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between items-center font-bold">
          <span>{totalLabel}</span>
          <span>{formatAmount(totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function MobileHighlightCard({ label, amount, margin, isPrimary }: { label: string; amount: number; margin: number; isPrimary?: boolean }) {
  const { formatAmount } = useCurrency()
  return (
    <Card className={isPrimary ? 'border-primary' : ''}>
      <CardContent className="py-4">
        <div className={cn('flex justify-between items-center', isPrimary ? 'text-primary' : '')}>
          <div>
            <p className="font-bold text-base">{label}</p>
            <p className="text-xs text-muted-foreground">{margin.toFixed(1)}% margin</p>
          </div>
          <p className={cn('text-xl font-bold', isPrimary ? 'text-primary' : '')}>{formatAmount(amount)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryCard({ label, value, subLabel, isPositiveGreen }: { label: string; value: number; subLabel?: string; isPositiveGreen?: boolean }) {
  const { formatAmount } = useCurrency()
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('text-xl sm:text-2xl font-bold mt-1', isPositiveGreen && value > 0 ? 'text-green-600' : isPositiveGreen && value < 0 ? 'text-red-600' : '')}>
        {formatAmount(value)}
      </p>
      {subLabel && <p className="text-xs text-muted-foreground mt-0.5">{subLabel}</p>}
    </div>
  )
}

export default ProfitLossStatement
