/**
 * Bank Reconciliation Page
 * Phase 9: Accounts/Finance Module
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Landmark } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { BankReconciliationForm } from '../components/bank-reconciliation-form'
import { sampleReconciliation } from '@/data/accounts.data'
import type { Reconciliation, ReconciliationFormData } from '../types/bank-reconciliation.types'

export function BankReconciliationPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedReconciliationId, setSelectedReconciliationId] = useState<string | null>(null)

  const isLoading = false
  const reconciliations = { data: [sampleReconciliation] }

  const handleCreate = useCallback(() => {
    setIsFormOpen(true)
  }, [])

  const handleSelectReconciliation = useCallback((recon: Reconciliation) => {
    setSelectedReconciliationId(recon.id)
  }, [])

  const handleFormSubmit = (_data: ReconciliationFormData) => {
    setIsFormOpen(false)
    toast.success(t('accounts.reconciliationCreated'))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.reconciliationTitle')}
        description={t('accounts.reconciliationDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('accounts.newReconciliation')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Reconciliation List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('accounts.reconciliations')}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">{t('common.loading')}</div>
              ) : !reconciliations?.data?.length ? (
                <EmptyState icon="document" title={t('accounts.noReconciliations')} description={t('accounts.startFirstReconciliation')} />
              ) : (
                <div className="space-y-2">
                  {reconciliations.data.map((recon) => (
                    <button
                      key={recon.id}
                      onClick={() => handleSelectReconciliation(recon)}
                      className={`w-full text-start p-3 rounded-lg border transition-colors hover:border-primary/50 ${
                        selectedReconciliationId === recon.id ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{recon.reconciliationNumber}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {recon.bankAccountName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(recon.statementDate)}
                          </p>
                        </div>
                        <StatusBadge variant={recon.status === 'completed' ? 'success' : 'warning'}>
                          {recon.status === 'completed' ? t('status.completed') : t('accounts.inProgress')}
                        </StatusBadge>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span className="text-muted-foreground">{t('accounts.balance')}:</span>
                        <span className="font-medium">{formatAmount(recon.statementClosingBalance)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Selected Reconciliation Detail */}
        <div className="lg:col-span-2">
          {selectedReconciliationId ? (
            <BankReconciliationForm reconciliationId={selectedReconciliationId} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Landmark className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t('accounts.selectReconciliation')}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              {t('accounts.newReconciliation')}
            </SheetTitle>
          </SheetHeader>
          <NewReconciliationForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={false}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

/** Simple form to create a new reconciliation */
function NewReconciliationForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: ReconciliationFormData) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const { t } = useTranslation()
  const [bankAccountId, setBankAccountId] = useState('')
  const [statementDate, setStatementDate] = useState('')
  const [openingBalance, setOpeningBalance] = useState('')
  const [closingBalance, setClosingBalance] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      bankAccountId,
      statementDate,
      statementOpeningBalance: parseFloat(openingBalance) || 0,
      statementClosingBalance: parseFloat(closingBalance) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{t('accounts.bankAccountId')}</label>
        <input
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={bankAccountId}
          onChange={(e) => setBankAccountId(e.target.value)}
          placeholder={t('accounts.enterBankAccountId')}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">{t('accounts.statementDate')}</label>
        <input
          type="date"
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={statementDate}
          onChange={(e) => setStatementDate(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">{t('accounts.openingBalance')}</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">{t('accounts.closingBalance')}</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={closingBalance}
            onChange={(e) => setClosingBalance(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('accounts.creating') : t('accounts.startReconciliation')}
        </Button>
      </div>
    </form>
  )
}

export default BankReconciliationPage
