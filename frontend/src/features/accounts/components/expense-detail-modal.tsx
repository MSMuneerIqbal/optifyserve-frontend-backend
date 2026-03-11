/**
 * Expense Detail Modal Component
 * Read-only view of expense details
 */

import { useTranslation } from 'react-i18next'
import { Receipt, FileEdit, Calendar, User, CreditCard, Building2, FolderOpen, FileCheck, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { EXPENSE_CATEGORY_KEYS, EXPENSE_STATUS_CONFIG } from '../types/expense.types'
import type { Expense } from '../types/expense.types'

interface ExpenseDetailModalProps {
  expense: Expense | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (expense: Expense) => void
}

export function ExpenseDetailModal({ expense, isOpen, onClose, onEdit }: ExpenseDetailModalProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  if (!expense) return null

  const canEdit = ['draft', 'pending-approval', 'rejected'].includes(expense.status)

  const paymentMethodLabel = expense.paymentMethod.replace(/-/g, ' ')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            {expense.expenseNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status + Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-sm">{t(EXPENSE_CATEGORY_KEYS[expense.category])}</Badge>
            <StatusBadge variant={EXPENSE_STATUS_CONFIG[expense.status]?.variant || 'neutral'}>
              {t(EXPENSE_STATUS_CONFIG[expense.status]?.key)}
            </StatusBadge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{expense.description}</p>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">{t('common.date')}</p>
                <p className="font-medium">{formatDate(expense.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">{t('accounts.paidTo')}</p>
                <p className="font-medium">{expense.paidTo}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">{t('common.paymentMethod')}</p>
                <p className="font-medium capitalize">{paymentMethodLabel}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-foreground">{t('accounts.accountCode')}</p>
                <p className="font-medium">{expense.accountCode} - {expense.accountName}</p>
              </div>
            </div>
            {expense.department && (
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground">{t('common.department')}</p>
                  <p className="font-medium">{expense.department}</p>
                </div>
              </div>
            )}
            {expense.referenceNumber && (
              <div className="flex items-start gap-2">
                <FileCheck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground">{t('common.reference')}</p>
                  <p className="font-medium">{expense.referenceNumber}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Amount Breakdown */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('common.amount')}</span>
              <span>{formatAmount(expense.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('common.vat')} ({expense.vatStatus})</span>
              <span>{formatAmount(expense.vatAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>{t('common.total')}</span>
              <span className="text-primary">{formatAmount(expense.totalAmount)}</span>
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2">
            {expense.isTaxDeductible && (
              <Badge variant="secondary" className="text-xs">{t('accounts.taxDeductible')}</Badge>
            )}
            {expense.isRecurring && (
              <Badge variant="secondary" className="text-xs">
                {t('accounts.recurring')} - {expense.recurringFrequency}
              </Badge>
            )}
          </div>

          {/* Submitted By */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {t('common.submittedBy')}: <span className="font-medium text-foreground">{expense.submittedBy.name}</span>
          </div>

          {/* Approval History */}
          {expense.approvalHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('common.approvalHistory')}</p>
              <div className="space-y-2">
                {expense.approvalHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2 text-sm rounded-lg border p-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.performedBy.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">{entry.action}</Badge>
                      </div>
                      {entry.comments && <p className="text-muted-foreground mt-1">{entry.comments}</p>}
                    </div>
                    <span className="text-muted-foreground text-xs shrink-0">{formatDate(entry.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div>
              <p className="text-sm font-medium mb-1">{t('common.notes')}</p>
              <p className="text-sm text-muted-foreground">{expense.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>{t('common.close')}</Button>
          {canEdit && onEdit && (
            <Button onClick={() => { onClose(); onEdit(expense) }}>
              <FileEdit className="h-4 w-4 me-2" /> {t('common.edit')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseDetailModal
