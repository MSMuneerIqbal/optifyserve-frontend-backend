/**
 * Trial Balance Component
 * Phase 9: Accounts/Finance Module
 *
 * Debit/Credit trial balance with balance check
 */

import { useTranslation } from 'react-i18next'
import { Printer, CheckCircle, AlertTriangle } from 'lucide-react'
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
import type { TrialBalance as TrialBalanceType } from '../types/financial-report.types'

interface TrialBalanceProps {
  data: TrialBalanceType | undefined
  isLoading: boolean
}

export function TrialBalanceView({ data, isLoading }: TrialBalanceProps) {
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
              <CardTitle className="text-lg">{t('accounts.trialBalance')}</CardTitle>
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

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4 border-s-4 border-s-blue-500">
          <p className="text-sm text-muted-foreground">{t('accounts.totalDebits')}</p>
          <p className="text-2xl font-bold mt-1">{formatAmount(data.totalDebits)}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 border-s-4 border-s-green-500">
          <p className="text-sm text-muted-foreground">{t('accounts.totalCredits')}</p>
          <p className="text-2xl font-bold mt-1">{formatAmount(data.totalCredits)}</p>
        </div>
        <div className={cn('rounded-lg border bg-white p-4 border-s-4', data.isBalanced ? 'border-s-green-500' : 'border-s-red-500')}>
          <p className="text-sm text-muted-foreground">{t('common.difference')}</p>
          <p className={cn('text-2xl font-bold mt-1', data.isBalanced ? 'text-green-600' : 'text-red-600')}>
            {formatAmount(Math.abs(data.totalDebits - data.totalCredits))}
          </p>
        </div>
      </div>

      {/* Trial Balance Table */}
      <Card>
        <CardContent className="pt-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">{t('accounts.code')}</TableHead>
                  <TableHead>{t('accounts.accountName')}</TableHead>
                  <TableHead>{t('common.type')}</TableHead>
                  <TableHead className="text-end">{t('accounts.debitAED')}</TableHead>
                  <TableHead className="text-end">{t('accounts.creditAED')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.entries.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm">{entry.accountCode}</TableCell>
                    <TableCell className="font-medium">{entry.accountName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{entry.accountType}</TableCell>
                    <TableCell className="text-end">
                      {entry.debit > 0 ? formatAmount(entry.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-end">
                      {entry.credit > 0 ? formatAmount(entry.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals */}
                <TableRow className="bg-muted/50 font-bold text-lg">
                  <TableCell colSpan={3}>{t('common.totals')}</TableCell>
                  <TableCell className="text-end">{formatAmount(data.totalDebits)}</TableCell>
                  <TableCell className="text-end">{formatAmount(data.totalCredits)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {data.entries.map((entry, idx) => (
              <Card key={idx}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-mono text-sm text-primary">{entry.accountCode}</p>
                      <p className="font-medium">{entry.accountName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{entry.accountType}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('accounts.debit')}</p>
                      <p className="font-medium">{entry.debit > 0 ? formatAmount(entry.debit) : '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('accounts.credit')}</p>
                      <p className="font-medium">{entry.credit > 0 ? formatAmount(entry.credit) : '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Mobile Totals */}
            <Card className="border-primary">
              <CardContent className="pt-3 pb-3">
                <div className="grid grid-cols-2 gap-4 font-bold">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('accounts.totalDebits')}</p>
                    <p className="text-lg">{formatAmount(data.totalDebits)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('accounts.totalCredits')}</p>
                    <p className="text-lg">{formatAmount(data.totalCredits)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrialBalanceView
