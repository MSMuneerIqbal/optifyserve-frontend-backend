/**
 * Bank Reconciliation Form Component
 * Phase 9: Accounts/Finance Module
 *
 * Match bank transactions with accounting records
 * Fully responsive
 */

import { useTranslation } from 'react-i18next'
import { Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate, cn } from '@/lib/utils'
import { sampleReconciliation } from '@/data/accounts.data'
import { MATCH_STATUS_CONFIG } from '../types/bank-reconciliation.types'
import type { BankTransaction } from '../types/bank-reconciliation.types'

interface BankReconciliationFormProps {
  reconciliationId: string | null
}

export function BankReconciliationForm({ reconciliationId }: BankReconciliationFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const isLoading = false
  const isMatching = false
  const isCompleting = false

  // Use static sample data when a reconciliation is selected
  const reconciliation = reconciliationId ? sampleReconciliation : null

  const matchTransaction = (_params: { reconciliationId: string; transactionId: string; journalEntryId: string }) => {
    toast.success(t('accounts.transactionMatched'))
  }
  const completeReconciliation = (_id: string) => {
    toast.success(t('accounts.reconciliationCompleted'))
  }
  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><p className="text-muted-foreground">{t('common.loading')}</p></div>
  }

  if (!reconciliation) {
    return <EmptyState icon="document" title={t('accounts.noReconciliationSelected')} description={t('accounts.selectReconciliationToView')} />
  }

  const unmatchedTransactions = reconciliation.transactions.filter((txn) => txn.matchStatus === 'unmatched')
  const matchedTransactions = reconciliation.transactions.filter((txn) => txn.matchStatus === 'matched')

  const handleMatch = (transactionId: string) => {
    matchTransaction({
      reconciliationId: reconciliation.id,
      transactionId,
      journalEntryId: 'auto-match',
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">{reconciliation.reconciliationNumber}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {reconciliation.bankAccountName} ({reconciliation.bankAccountCode})
              </p>
              <p className="text-sm text-muted-foreground">{t('accounts.statementDate')}: {formatDate(reconciliation.statementDate)}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={reconciliation.status === 'completed' ? 'default' : 'secondary'}>
                {reconciliation.status === 'completed' ? t('common.completed') : t('common.inProgress')}
              </Badge>
              {reconciliation.status === 'in-progress' && unmatchedTransactions.length === 0 && (
                <Button size="sm" onClick={() => completeReconciliation(reconciliation.id)} disabled={isCompleting}>
                  {isCompleting ? t('common.completing') : t('accounts.completeReconciliation')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('accounts.statementBalance')}</p>
              <p className="text-xl font-bold">{formatAmount(reconciliation.statementClosingBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('accounts.bookBalance')}</p>
              <p className="text-xl font-bold">{formatAmount(reconciliation.bookClosingBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('common.matched')}</p>
              <p className="text-xl font-bold text-green-600">{matchedTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('common.unmatched')}</p>
              <p className="text-xl font-bold text-amber-600">{unmatchedTransactions.length}</p>
            </div>
          </div>

          {reconciliation.reconciliationDifference !== 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-amber-700 text-sm">
              {t('accounts.reconciliationDifference')}: {formatAmount(Math.abs(reconciliation.reconciliationDifference))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unmatched Transactions */}
      {unmatchedTransactions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.unmatchedTransactions')} ({unmatchedTransactions.length})</CardTitle>
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
                    <TableHead className="text-end">{t('common.amount')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className="w-24">{t('common.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unmatchedTransactions.map((txn) => (
                    <TransactionRow
                      key={txn.id}
                      transaction={txn}
                      onMatch={() => handleMatch(txn.id)}
                      isMatching={isMatching}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {unmatchedTransactions.map((txn) => (
                <TransactionCard
                  key={txn.id}
                  transaction={txn}
                  onMatch={() => handleMatch(txn.id)}
                  isMatching={isMatching}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matched Transactions */}
      {matchedTransactions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('accounts.matchedTransactions')} ({matchedTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.description')}</TableHead>
                    <TableHead>{t('common.reference')}</TableHead>
                    <TableHead className="text-end">{t('common.amount')}</TableHead>
                    <TableHead>{t('accounts.matchedTo')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchedTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>{formatDate(txn.date)}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell className="font-mono text-sm">{txn.reference || '-'}</TableCell>
                      <TableCell className={cn('text-end font-medium', txn.type === 'credit' ? 'text-green-600' : 'text-red-600')}>
                        {txn.type === 'credit' ? '+' : '-'}{formatAmount(txn.amount)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{txn.matchedEntryNumber || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge variant="success">{t('common.matched')}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-3">
              {matchedTransactions.map((txn) => (
                <Card key={txn.id}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(txn.date)}</p>
                      </div>
                      <StatusBadge variant="success">{t('common.matched')}</StatusBadge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className={cn('font-medium', txn.type === 'credit' ? 'text-green-600' : 'text-red-600')}>
                        {txn.type === 'credit' ? '+' : '-'}{formatAmount(txn.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <Link className="h-3 w-3 inline me-1" />{txn.matchedEntryNumber}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TransactionRow({ transaction: txn, onMatch, isMatching }: { transaction: BankTransaction; onMatch: () => void; isMatching: boolean }) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  return (
    <TableRow>
      <TableCell>{formatDate(txn.date)}</TableCell>
      <TableCell>{txn.description}</TableCell>
      <TableCell className="font-mono text-sm">{txn.reference || '-'}</TableCell>
      <TableCell className={cn('text-end font-medium', txn.type === 'credit' ? 'text-green-600' : 'text-red-600')}>
        {txn.type === 'credit' ? '+' : '-'}{formatAmount(txn.amount)}
      </TableCell>
      <TableCell>
        <StatusBadge variant={MATCH_STATUS_CONFIG[txn.matchStatus].variant}>
          {t(MATCH_STATUS_CONFIG[txn.matchStatus].key)}
        </StatusBadge>
      </TableCell>
      <TableCell>
        <Button size="sm" variant="outline" onClick={onMatch} disabled={isMatching}>
          <Link className="h-3 w-3 me-1" /> {t('accounts.match')}
        </Button>
      </TableCell>
    </TableRow>
  )
}

function TransactionCard({ transaction: txn, onMatch, isMatching }: { transaction: BankTransaction; onMatch: () => void; isMatching: boolean }) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-3 pb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium text-sm">{txn.description}</p>
            <p className="text-xs text-muted-foreground">{formatDate(txn.date)} {txn.reference && `| ${txn.reference}`}</p>
          </div>
          <StatusBadge variant={MATCH_STATUS_CONFIG[txn.matchStatus].variant}>
            {t(MATCH_STATUS_CONFIG[txn.matchStatus].key)}
          </StatusBadge>
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <span className={cn('font-medium', txn.type === 'credit' ? 'text-green-600' : 'text-red-600')}>
            {txn.type === 'credit' ? '+' : '-'}{formatAmount(txn.amount)}
          </span>
          <Button size="sm" variant="outline" onClick={onMatch} disabled={isMatching}>
            <Link className="h-3 w-3 me-1" /> {t('accounts.match')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BankReconciliationForm
