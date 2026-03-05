/**
 * Chart of Accounts Page
 * Phase 9: Accounts/Finance Module
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, FolderTree } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { useCurrency } from '@/contexts/currency-context'
import { ChartOfAccountsTree } from '../components/chart-of-accounts-tree'
import { AccountForm } from '../components/account-form'
import { sampleChartOfAccounts } from '@/data/accounts.data'
import type { Account, AccountFormData } from '../types/chart-of-accounts.types'

export function ChartOfAccountsPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [parentAccount, setParentAccount] = useState<Account | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

  const isLoading = false
  const list = sampleChartOfAccounts

  // Derive summary from list
  const summary = list.length > 0 ? {
    totalAccounts: list.length,
    totalAssets: list.filter((a) => a.type === 'asset').reduce((sum, a) => sum + (a.balance || 0), 0),
    totalLiabilities: list.filter((a) => a.type === 'liability').reduce((sum, a) => sum + (a.balance || 0), 0),
    totalRevenue: list.filter((a) => a.type === 'revenue').reduce((sum, a) => sum + (a.balance || 0), 0),
    totalExpenses: list.filter((a) => a.type === 'expense').reduce((sum, a) => sum + (a.balance || 0), 0),
  } : null

  const handleCreate = useCallback(() => {
    setSelectedAccount(null)
    setParentAccount(null)
    setFormMode('create')
    setIsFormOpen(true)
  }, [])

  const handleEdit = useCallback((account: Account) => {
    setSelectedAccount(account)
    setParentAccount(null)
    setFormMode('edit')
    setIsFormOpen(true)
  }, [])

  const handleAddChild = useCallback((parent: Account) => {
    setSelectedAccount(null)
    setParentAccount(parent)
    setFormMode('create')
    setIsFormOpen(true)
  }, [])

  const handleFormSubmit = (_data: AccountFormData) => {
    setIsFormOpen(false)
    setSelectedAccount(null)
    setParentAccount(null)
    toast.success(formMode === 'edit' ? t('accounts.accountUpdated') : t('accounts.accountCreated'))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.chartOfAccountsTitle')}
        description={t('accounts.chartOfAccountsDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('accounts.addAccount')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </Button>
        }
      />

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <SummaryCard label={t('accounts.totalAccounts')} value={summary.totalAccounts} />
          <SummaryCard label={t('accounts.totalAssets')} value={formatAmount(summary.totalAssets)} color="border-s-blue-500" />
          <SummaryCard label={t('accounts.totalLiabilities')} value={formatAmount(summary.totalLiabilities)} color="border-s-amber-500" />
          <SummaryCard label={t('accounts.totalRevenue')} value={formatAmount(summary.totalRevenue)} color="border-s-green-500" />
          <SummaryCard label={t('accounts.totalExpenses')} value={formatAmount(summary.totalExpenses)} color="border-s-red-500" />
        </div>
      )}

      <ChartOfAccountsTree onEdit={handleEdit} onAddChild={handleAddChild} />

      {/* Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              {formMode === 'edit' ? t('accounts.editAccount') : parentAccount ? t('accounts.addSubAccount') : t('accounts.newAccount')}
            </SheetTitle>
          </SheetHeader>
          <AccountForm
            account={formMode === 'edit' ? selectedAccount ?? undefined : undefined}
            parentAccount={parentAccount}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className={`rounded-lg border bg-white p-4 ${color ? `border-s-4 ${color}` : ''}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 truncate">{value}</p>
    </div>
  )
}

export default ChartOfAccountsPage
