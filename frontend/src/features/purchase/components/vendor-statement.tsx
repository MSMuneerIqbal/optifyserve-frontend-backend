/**
 * Vendor Statement Component
 * Phase 8: Purchase Module
 *
 * Display vendor account statement with transactions
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleVendors } from '@/data/vendors.data'
import { sampleVendorPayments } from '@/data/purchase-orders.data'

export function VendorStatement() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const vendors = sampleVendors
  const paymentList = sampleVendorPayments

  const isLoading = false

  const [selectedVendorId, setSelectedVendorId] = useState('')
  const [periodFrom, setPeriodFrom] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).toISOString().split('T')[0]
  )
  const [periodTo, setPeriodTo] = useState(new Date().toISOString().split('T')[0])

  const statement = useMemo(() => {
    if (!selectedVendorId) return null
    const vendorName = vendors.find((v) => v.id === selectedVendorId)?.name || ''
    const vendorPayments = paymentList.filter((p) => p.vendorId === selectedVendorId)
    const entries = vendorPayments.map((p, idx) => {
      const amount = p.amount || 0
      return {
        id: p.id || String(idx),
        date: p.paymentDate || '',
        type: p.paymentMethod || 'payment',
        referenceNumber: p.paymentNumber || p.referenceNumber || '',
        description: p.notes || 'Payment',
        debit: 0,
        credit: amount,
        balance: 0,
      }
    })
    let runningBalance = 0
    entries.forEach((e) => { runningBalance += e.credit - e.debit; e.balance = runningBalance })
    const totalCredits = entries.reduce((s, e) => s + e.credit, 0)
    const totalDebits = entries.reduce((s, e) => s + e.debit, 0)
    return {
      vendorName,
      periodFrom,
      periodTo,
      openingBalance: 0,
      totalDebits,
      totalCredits,
      closingBalance: totalCredits - totalDebits,
      entries,
    }
  }, [selectedVendorId, paymentList, vendors, periodFrom, periodTo])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>{t('purchase.vendor')}</Label>
              <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                <SelectTrigger><SelectValue placeholder={t('purchase.selectVendor')} /></SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('common.from')}</Label>
              <Input type="date" value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} />
            </div>
            <div>
              <Label>{t('common.to')}</Label>
              <Input type="date" value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedVendorId ? (
        <div className="text-center py-12 text-muted-foreground">
          {t('purchase.selectVendorToViewStatement')}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          {t('common.loading')}
        </div>
      ) : statement ? (
        <>
          {/* Statement Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">{statement.vendorName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('purchase.statementPeriod')}: {formatDate(statement.periodFrom)} - {formatDate(statement.periodTo)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 me-2" /> {t('common.print')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('purchase.openingBalance')}</p>
                  <p className="text-xl font-bold">{formatAmount(statement.openingBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('purchase.totalDebits')}</p>
                  <p className="text-xl font-bold text-red-600">{formatAmount(statement.totalDebits)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('purchase.totalCredits')}</p>
                  <p className="text-xl font-bold text-green-600">{formatAmount(statement.totalCredits)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('purchase.closingBalance')}</p>
                  <p className="text-xl font-bold">{formatAmount(statement.closingBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('purchase.transactions')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>{t('common.date')}</TableHead>
                      <TableHead>{t('common.type')}</TableHead>
                      <TableHead>{t('purchase.reference')}</TableHead>
                      <TableHead>{t('common.description')}</TableHead>
                      <TableHead className="text-end">{t('purchase.debit')}</TableHead>
                      <TableHead className="text-end">{t('purchase.credit')}</TableHead>
                      <TableHead className="text-end">{t('purchase.balance')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statement.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell className="capitalize">{entry.type.replace(/-/g, ' ')}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.referenceNumber}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="text-end text-red-600">
                          {entry.debit > 0 ? formatAmount(entry.debit) : '-'}
                        </TableCell>
                        <TableCell className="text-end text-green-600">
                          {entry.credit > 0 ? formatAmount(entry.credit) : '-'}
                        </TableCell>
                        <TableCell className="text-end font-medium">
                          {formatAmount(entry.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="md:hidden space-y-3">
                {statement.entries.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="pt-3 pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{entry.description}</p>
                          <p className="text-xs text-muted-foreground">{entry.referenceNumber}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t">
                        {entry.debit > 0 ? (
                          <span className="text-red-600">{t('purchase.debit')}: {formatAmount(entry.debit)}</span>
                        ) : (
                          <span className="text-green-600">{t('purchase.credit')}: {formatAmount(entry.credit)}</span>
                        )}
                        <span className="font-medium">{t('purchase.bal')}: {formatAmount(entry.balance)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}

export default VendorStatement
