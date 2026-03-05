/**
 * Customer Statement Component
 * Phase 9: Accounts/Finance Module
 *
 * Display customer account statement with transactions
 */

import { useState } from 'react'
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
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { sampleARInvoices, sampleCustomerStatement } from '@/data/accounts.data'

export function CustomerStatement() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  // Build unique customers from AR invoices
  const customers = [...new Map(sampleARInvoices.map((inv) => [inv.customerId, { id: inv.customerId, name: inv.customerName }])).values()]

  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [periodFrom, setPeriodFrom] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).toISOString().split('T')[0]
  )
  const [periodTo, setPeriodTo] = useState(new Date().toISOString().split('T')[0])

  const statement = selectedCustomerId ? sampleCustomerStatement : null

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>{t('common.customer')}</Label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger><SelectValue placeholder={t('common.selectCustomer')} /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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

      {!selectedCustomerId ? (
        <div className="text-center py-12 text-muted-foreground">
          {t('common.selectCustomerPrompt')}
        </div>
      ) : statement ? (
        <>
          {/* Statement Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">{statement.customerName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('common.statementPeriod')}: {formatDate(statement.fromDate)} - {formatDate(statement.toDate)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 me-2" /> {t('common.print')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('accounts.openingBalance')}</p>
                  <p className="text-xl font-bold">{formatAmount(statement.openingBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('common.totalDebits')}</p>
                  <p className="text-xl font-bold text-red-600">{formatAmount(statement.totalDebits)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('common.totalCredits')}</p>
                  <p className="text-xl font-bold text-green-600">{formatAmount(statement.totalCredits)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('accounts.closingBalance')}</p>
                  <p className="text-xl font-bold">{formatAmount(statement.closingBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('common.transactions')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>{t('common.date')}</TableHead>
                      <TableHead>{t('common.description')}</TableHead>
                      <TableHead>{t('common.reference')}</TableHead>
                      <TableHead className="text-end">{t('accounts.debit')}</TableHead>
                      <TableHead className="text-end">{t('accounts.credit')}</TableHead>
                      <TableHead className="text-end">{t('accounts.balance')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statement.entries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
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
                {statement.entries.map((entry, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-3 pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{entry.description}</p>
                          <p className="text-xs text-muted-foreground">{entry.reference}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t">
                        {entry.debit > 0 ? (
                          <span className="text-red-600">{t('accounts.debit')}: {formatAmount(entry.debit)}</span>
                        ) : (
                          <span className="text-green-600">{t('accounts.credit')}: {formatAmount(entry.credit)}</span>
                        )}
                        <span className="font-medium">{t('common.bal')}: {formatAmount(entry.balance)}</span>
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

export default CustomerStatement
