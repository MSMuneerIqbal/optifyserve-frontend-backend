/**
 * Balance Sheet Component
 * Phase 9: Accounts/Finance Module
 *
 * Assets = Liabilities + Equity display
 * Fully responsive with dual-view pattern
 */

import { useTranslation } from 'react-i18next'
import { Printer, CheckCircle, AlertTriangle } from 'lucide-react'
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
import type { BalanceSheet as BalanceSheetType, ReportLineItem } from '../types/financial-report.types'

interface BalanceSheetProps {
  data: BalanceSheetType | undefined
  isLoading: boolean
}

export function BalanceSheetView({ data, isLoading }: BalanceSheetProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
  }

  if (!data) {
    return <EmptyState icon="document" title={t('common.noData')} description={t('common.selectDateToGenerate')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">{t('accounts.balanceSheet')}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{t('common.asOf')} {formatDate(data.asOfDate)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
                data.isBalanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              )}>
                {data.isBalanced ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {data.isBalanced ? t('common.balanced') : t('common.unbalanced')}
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 me-2" /> {t('common.print')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4 border-s-4 border-s-blue-500">
          <p className="text-sm text-muted-foreground">{t('accounts.totalAssets')}</p>
          <p className="text-2xl font-bold mt-1">{formatAmount(data.totalAssets)}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 border-s-4 border-s-amber-500">
          <p className="text-sm text-muted-foreground">{t('accounts.totalLiabilities')}</p>
          <p className="text-2xl font-bold mt-1">{formatAmount(data.totalLiabilities)}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 border-s-4 border-s-green-500">
          <p className="text-sm text-muted-foreground">{t('common.totalEquity')}</p>
          <p className="text-2xl font-bold mt-1">{formatAmount(data.totalEquity)}</p>
        </div>
      </div>

      {/* Balance Sheet Table - Desktop */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[60%]">{t('accounts.account')}</TableHead>
                    <TableHead className="text-end">{t('accounts.amountAED')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Assets */}
                  <SectionHeader label={t('common.assets')} color="text-blue-700" bgColor="bg-blue-50/50" />
                  <SubSectionHeader label={t('common.currentAssets')} />
                  {data.currentAssets.map((item, idx) => (
                    <LineItemRow key={`ca-${idx}`} item={item} />
                  ))}
                  <SubTotalRow label={t('common.totalCurrentAssets')} amount={data.totalCurrentAssets} />
                  <SubSectionHeader label={t('common.fixedAssets')} />
                  {data.fixedAssets.map((item, idx) => (
                    <LineItemRow key={`fa-${idx}`} item={item} />
                  ))}
                  <SubTotalRow label={t('common.totalFixedAssets')} amount={data.totalFixedAssets} />
                  <TotalRow label={t('common.totalAssets')} amount={data.totalAssets} color="text-blue-700" />

                  {/* Liabilities */}
                  <SectionHeader label={t('common.liabilities')} color="text-amber-700" bgColor="bg-amber-50/50" />
                  <SubSectionHeader label={t('common.currentLiabilities')} />
                  {data.currentLiabilities.map((item, idx) => (
                    <LineItemRow key={`cl-${idx}`} item={item} />
                  ))}
                  <SubTotalRow label={t('common.totalCurrentLiabilities')} amount={data.totalCurrentLiabilities} />
                  {data.longTermLiabilities.length > 0 && (
                    <>
                      <SubSectionHeader label={t('common.longTermLiabilities')} />
                      {data.longTermLiabilities.map((item, idx) => (
                        <LineItemRow key={`lt-${idx}`} item={item} />
                      ))}
                      <SubTotalRow label={t('common.totalLongTermLiabilities')} amount={data.totalLongTermLiabilities} />
                    </>
                  )}
                  <TotalRow label={t('common.totalLiabilities')} amount={data.totalLiabilities} color="text-amber-700" />

                  {/* Equity */}
                  <SectionHeader label={t('common.equity')} color="text-green-700" bgColor="bg-green-50/50" />
                  {data.equity.map((item, idx) => (
                    <LineItemRow key={`eq-${idx}`} item={item} />
                  ))}
                  <TotalRow label={t('common.totalEquity')} amount={data.totalEquity} color="text-green-700" />

                  {/* Final Check */}
                  <TableRow className="bg-primary/5 font-bold text-lg">
                    <TableCell className="text-primary">{t('common.totalLiabilitiesAndEquity')}</TableCell>
                    <TableCell className="text-end text-primary">{formatAmount(data.totalLiabilitiesAndEquity)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Sheet Cards - Mobile */}
      <div className="md:hidden space-y-4">
        <Card className="border-s-4 border-s-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-blue-700">{t('common.assets')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('common.currentAssets')}</p>
            {data.currentAssets.map((item, idx) => (
              <MobileLineItem key={`ca-${idx}`} item={item} />
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>{t('common.totalCurrentAssets')}</span>
              <span>{formatAmount(data.totalCurrentAssets)}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">{t('common.fixedAssets')}</p>
            {data.fixedAssets.map((item, idx) => (
              <MobileLineItem key={`fa-${idx}`} item={item} />
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>{t('common.totalFixedAssets')}</span>
              <span>{formatAmount(data.totalFixedAssets)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-blue-700 text-lg">
              <span>{t('accounts.totalAssets')}</span>
              <span>{formatAmount(data.totalAssets)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-s-4 border-s-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-700">{t('common.liabilities')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('common.currentLiabilities')}</p>
            {data.currentLiabilities.map((item, idx) => (
              <MobileLineItem key={`cl-${idx}`} item={item} />
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>{t('common.totalCurrentLiabilities')}</span>
              <span>{formatAmount(data.totalCurrentLiabilities)}</span>
            </div>
            {data.longTermLiabilities.length > 0 && (
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">{t('common.longTermLiabilities')}</p>
                {data.longTermLiabilities.map((item, idx) => (
                  <MobileLineItem key={`lt-${idx}`} item={item} />
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t('common.totalLongTermLiabilities')}</span>
                  <span>{formatAmount(data.totalLongTermLiabilities)}</span>
                </div>
              </>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-amber-700 text-lg">
              <span>{t('accounts.totalLiabilities')}</span>
              <span>{formatAmount(data.totalLiabilities)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-s-4 border-s-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-700">{t('common.equity')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.equity.map((item, idx) => (
              <MobileLineItem key={`eq-${idx}`} item={item} />
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-green-700 text-lg">
              <span>{t('common.totalEquity')}</span>
              <span>{formatAmount(data.totalEquity)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardContent className="py-4">
            <div className="flex justify-between items-center text-primary font-bold text-lg">
              <span>{t('common.totalLiabilitiesAndEquity')}</span>
              <span>{formatAmount(data.totalLiabilitiesAndEquity)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* Desktop sub-components */

function SectionHeader({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return (
    <TableRow className={bgColor}>
      <TableCell colSpan={2} className={`font-bold ${color}`}>{label}</TableCell>
    </TableRow>
  )
}

function SubSectionHeader({ label }: { label: string }) {
  return (
    <TableRow className="bg-muted/20">
      <TableCell colSpan={2} className="font-semibold text-sm text-muted-foreground ps-8">{label}</TableCell>
    </TableRow>
  )
}

function LineItemRow({ item }: { item: ReportLineItem }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow>
      <TableCell style={{ paddingInlineStart: `${((item.indent || 0) + 2) * 16}px` }}>
        <span className="font-mono text-xs text-muted-foreground me-2">{item.accountCode}</span>
        {item.accountName}
      </TableCell>
      <TableCell className="text-end">{formatAmount(item.amount)}</TableCell>
    </TableRow>
  )
}

function SubTotalRow({ label, amount }: { label: string; amount: number }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow className="bg-muted/10 font-semibold">
      <TableCell className="ps-8">{label}</TableCell>
      <TableCell className="text-end">{formatAmount(amount)}</TableCell>
    </TableRow>
  )
}

function TotalRow({ label, amount, color }: { label: string; amount: number; color: string }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow className="bg-muted/30 font-bold">
      <TableCell className={color}>{label}</TableCell>
      <TableCell className={cn('text-end text-lg', color)}>{formatAmount(amount)}</TableCell>
    </TableRow>
  )
}

/* Mobile sub-component */

function MobileLineItem({ item }: { item: ReportLineItem }) {
  const { formatAmount } = useCurrency()
  return (
    <div className="flex justify-between items-center">
      <div className="min-w-0 flex-1 me-3">
        {item.accountCode && <span className="font-mono text-xs text-muted-foreground me-1">{item.accountCode}</span>}
        <span className="text-sm">{item.accountName}</span>
      </div>
      <span className={cn('text-sm font-medium whitespace-nowrap', item.amount < 0 ? 'text-red-600' : '')}>{formatAmount(item.amount)}</span>
    </div>
  )
}

export default BalanceSheetView
