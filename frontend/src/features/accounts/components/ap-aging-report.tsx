/**
 * Accounts Payable Aging Report Component
 * Phase 9: Accounts/Finance Module
 *
 * Vendor aging report with 0-30, 31-60, 61-90, 90+ day buckets
 * Fully responsive with mobile card view
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
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/empty-state'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { sampleAPAgingReport } from '@/data/accounts.data'
import type { VendorAgingSummary } from '../types/accounts-payable.types'

export function APAgingReport() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const report = sampleAPAgingReport

  if (!report) {
    return <EmptyState icon="document" title={t('common.noData')} description={t('common.noDataDescription')} />
  }

  const getAgingPercentage = (amount: number) => {
    if (report.totalOutstanding === 0) return 0
    return (amount / report.totalOutstanding) * 100
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <AgingCard label={t('common.totalPayable')} value={report.totalOutstanding} color="border-s-blue-500" />
        <AgingCard label={t('common.days030')} value={report.currentTotal} color="border-s-green-500" />
        <AgingCard label={t('common.days3160')} value={report.days31to60Total} color="border-s-amber-500" />
        <AgingCard label={t('common.days6190')} value={report.days61to90Total} color="border-s-orange-500" />
        <AgingCard label={t('common.days90plus')} value={report.days90plusTotal} color="border-s-red-500" />
      </div>

      {/* Aging Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('common.agingDistribution')}</CardTitle>
            <span className="text-sm text-muted-foreground">{t('common.asOf')} {formatDate(report.asOfDate)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AgingBar label={t('common.days030')} amount={report.currentTotal} percentage={getAgingPercentage(report.currentTotal)} color="bg-green-500" />
            <AgingBar label={t('common.days3160')} amount={report.days31to60Total} percentage={getAgingPercentage(report.days31to60Total)} color="bg-amber-500" />
            <AgingBar label={t('common.days6190')} amount={report.days61to90Total} percentage={getAgingPercentage(report.days61to90Total)} color="bg-orange-500" />
            <AgingBar label={t('common.days90plus')} amount={report.days90plusTotal} percentage={getAgingPercentage(report.days90plusTotal)} color="bg-red-500" />
          </div>
        </CardContent>
      </Card>

      {/* Vendor Detail */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('common.vendorAgingDetail')}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 me-2" /> {t('common.print')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {report.vendors.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t('common.noOutstandingPayables')}</p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>{t('common.vendor')}</TableHead>
                      <TableHead className="text-end">{t('common.days030')}</TableHead>
                      <TableHead className="text-end">{t('common.days3160')}</TableHead>
                      <TableHead className="text-end">{t('common.days6190')}</TableHead>
                      <TableHead className="text-end">{t('common.days90plus')}</TableHead>
                      <TableHead className="text-end">{t('common.total')}</TableHead>
                      <TableHead className="text-center">{t('common.bills')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.vendors.map((vendor) => (
                      <VendorAgingRow key={vendor.vendorId} vendor={vendor} />
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>{t('common.total')}</TableCell>
                      <TableCell className="text-end">{formatAmount(report.currentTotal)}</TableCell>
                      <TableCell className="text-end">{formatAmount(report.days31to60Total)}</TableCell>
                      <TableCell className="text-end">{formatAmount(report.days61to90Total)}</TableCell>
                      <TableCell className="text-end">{formatAmount(report.days90plusTotal)}</TableCell>
                      <TableCell className="text-end">{formatAmount(report.totalOutstanding)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {report.vendors.map((vendor) => (
                  <Card key={vendor.vendorId}>
                    <CardContent className="pt-3 pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{vendor.vendorName}</p>
                          <p className="text-xs text-muted-foreground">{vendor.billCount} {t('common.bills')}</p>
                        </div>
                        <p className="font-bold text-lg">{formatAmount(vendor.totalOutstanding)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-600">0-30d:</span>
                          <span>{formatAmount(vendor.current)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-600">31-60d:</span>
                          <span>{formatAmount(vendor.days31to60)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-600">61-90d:</span>
                          <span>{formatAmount(vendor.days61to90)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">90+d:</span>
                          <span>{formatAmount(vendor.days90plus)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VendorAgingRow({ vendor }: { vendor: VendorAgingSummary }) {
  const { formatAmount } = useCurrency()
  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{vendor.vendorName}</p>
          <p className="text-xs text-muted-foreground">{formatDate(vendor.oldestBillDate)}</p>
        </div>
      </TableCell>
      <TableCell className="text-end text-green-600">
        {vendor.current > 0 ? formatAmount(vendor.current) : '-'}
      </TableCell>
      <TableCell className="text-end text-amber-600">
        {vendor.days31to60 > 0 ? formatAmount(vendor.days31to60) : '-'}
      </TableCell>
      <TableCell className="text-end text-orange-600">
        {vendor.days61to90 > 0 ? formatAmount(vendor.days61to90) : '-'}
      </TableCell>
      <TableCell className="text-end text-red-600">
        {vendor.days90plus > 0 ? formatAmount(vendor.days90plus) : '-'}
      </TableCell>
      <TableCell className="text-end font-medium">
        {formatAmount(vendor.totalOutstanding)}
      </TableCell>
      <TableCell className="text-center">{vendor.billCount}</TableCell>
    </TableRow>
  )
}

function AgingCard({ label, value, color }: { label: string; value: number; color: string }) {
  const { formatAmount } = useCurrency()
  return (
    <div className={`rounded-lg border bg-white p-4 border-s-4 ${color}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{formatAmount(value)}</p>
    </div>
  )
}

function AgingBar({ label, amount, percentage, color }: { label: string; amount: number; percentage: number; color: string }) {
  const { formatAmount } = useCurrency()
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm w-20 shrink-0">{label}</span>
      <div className="flex-1">
        <Progress value={percentage} className={`h-3 [&>[role=progressbar]]:${color}`} />
      </div>
      <span className="text-sm font-medium w-28 text-end">{formatAmount(amount)}</span>
      <span className="text-sm text-muted-foreground w-12 text-end">{percentage.toFixed(0)}%</span>
    </div>
  )
}

export default APAgingReport
