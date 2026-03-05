/**
 * Expenses Page
 * Phase 9: Accounts/Finance Module
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PageHeader } from '@/components/layout/page-header'
import { useCurrency } from '@/contexts/currency-context'
import { ExpenseList } from '../components/expense-list'
import { ExpenseForm } from '../components/expense-form'
import { ExpenseApprovalModal } from '../components/expense-approval-modal'
import { sampleExpenses } from '@/data/accounts.data'
import type { Expense, ExpenseFormData } from '../types/expense.types'

export function ExpensesPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [approvalExpense, setApprovalExpense] = useState<Expense | null>(null)

  const isLoading = false
  const list = sampleExpenses

  // Derive summary from list
  const summary = list.length > 0 ? {
    totalExpenses: list.length,
    totalAmount: list.reduce((sum, e) => sum + (e.amount || 0), 0),
    pendingAmount: list.filter((e) => e.status === 'pending-approval').reduce((sum, e) => sum + (e.amount || 0), 0),
    approvedAmount: list.filter((e) => e.status === 'approved').reduce((sum, e) => sum + (e.amount || 0), 0),
    rejectedAmount: list.filter((e) => e.status === 'rejected').reduce((sum, e) => sum + (e.amount || 0), 0),
  } : null

  const handleCreate = useCallback(() => {
    setSelectedExpense(null)
    setFormMode('create')
    setIsFormOpen(true)
  }, [])

  const handleEdit = useCallback((expense: Expense) => {
    setSelectedExpense(expense)
    setFormMode('edit')
    setIsFormOpen(true)
  }, [])

  const handleView = useCallback((expense: Expense) => {
    setSelectedExpense(expense)
  }, [])

  const handleApprove = useCallback((expense: Expense) => {
    setApprovalExpense(expense)
  }, [])

  const handleFormSubmit = (_data: ExpenseFormData) => {
    setIsFormOpen(false)
    setSelectedExpense(null)
    toast.success(formMode === 'edit' ? t('accounts.expenseUpdated') : t('accounts.expenseRecorded'))
  }

  const handleApproveExpense = (_id: string, _comments?: string) => {
    setApprovalExpense(null)
    toast.success(t('accounts.expenseApproved'))
  }

  const handleRejectExpense = (_id: string, _reason: string) => {
    setApprovalExpense(null)
    toast.success(t('accounts.expenseRejected'))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('accounts.expensesTitle')}
        description={t('accounts.expensesDescription')}
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('accounts.recordExpense')}</span>
            <span className="sm:hidden">{t('common.add')}</span>
          </Button>
        }
      />

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <SummaryCard label={t('accounts.totalExpenses')} value={summary.totalExpenses} color="border-s-blue-500" />
          <SummaryCard label={t('accounts.totalAmount')} value={formatAmount(summary.totalAmount)} color="border-s-primary" />
          <SummaryCard label={t('accounts.pendingApproval')} value={formatAmount(summary.pendingAmount)} color="border-s-amber-500" />
          <SummaryCard label={t('status.approved')} value={formatAmount(summary.approvedAmount)} color="border-s-green-500" />
          <SummaryCard label={t('status.rejected')} value={formatAmount(summary.rejectedAmount)} color="border-s-red-500" />
        </div>
      )}

      <ExpenseList onView={handleView} onEdit={handleEdit} onApprove={handleApprove} />

      {/* Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {formMode === 'edit' ? t('accounts.editExpense') : t('accounts.recordExpense')}
            </SheetTitle>
          </SheetHeader>
          <ExpenseForm
            expense={formMode === 'edit' ? selectedExpense ?? undefined : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </SheetContent>
      </Sheet>

      {/* Approval Modal */}
      <ExpenseApprovalModal
        expense={approvalExpense}
        isOpen={!!approvalExpense}
        onClose={() => setApprovalExpense(null)}
        onApprove={handleApproveExpense}
        onReject={handleRejectExpense}
        isApproving={false}
        isRejecting={false}
      />
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

export default ExpensesPage
