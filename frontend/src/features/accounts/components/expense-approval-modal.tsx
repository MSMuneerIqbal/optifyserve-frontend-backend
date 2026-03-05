/**
 * Expense Approval Modal Component
 * Phase 9: Accounts/Finance Module
 *
 * Modal for reviewing and approving/rejecting expenses
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useCurrency } from '@/contexts/currency-context'
import { formatDate } from '@/lib/utils'
import { EXPENSE_CATEGORY_KEYS } from '../types/expense.types'
import type { Expense } from '../types/expense.types'

interface ExpenseApprovalModalProps {
  expense: Expense | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string, comments?: string) => void
  onReject: (id: string, reason: string) => void
  isApproving?: boolean
  isRejecting?: boolean
}

export function ExpenseApprovalModal({
  expense,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ExpenseApprovalModalProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [mode, setMode] = useState<'review' | 'reject'>('review')
  const [comments, setComments] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  if (!expense) return null

  const handleApprove = () => {
    onApprove(expense.id, comments || undefined)
    setComments('')
    setMode('review')
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    onReject(expense.id, rejectReason)
    setRejectReason('')
    setMode('review')
  }

  const handleClose = () => {
    setMode('review')
    setComments('')
    setRejectReason('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {t('common.expenseApproval')}
          </DialogTitle>
          <DialogDescription>
            {t('common.reviewExpenseDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{expense.expenseNumber}</p>
                  <p className="text-sm text-muted-foreground">{expense.description}</p>
                </div>
                <Badge variant="outline">{t(EXPENSE_CATEGORY_KEYS[expense.category])}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('common.date')}</p>
                  <p className="font-medium">{formatDate(expense.date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('accounts.paidTo')}</p>
                  <p className="font-medium">{expense.paidTo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('common.paymentMethod')}</p>
                  <p className="font-medium capitalize">{expense.paymentMethod.replace(/-/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('common.submittedBy')}</p>
                  <p className="font-medium">{expense.submittedBy.name}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{t('common.amount')}</span>
                  <span>{formatAmount(expense.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('common.vat')}</span>
                  <span>{formatAmount(expense.vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{t('common.total')}</span>
                  <span className="text-xl">{formatAmount(expense.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {mode === 'review' ? (
            <div>
              <Label>{t('common.commentsOptional')}</Label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t('common.addApprovalComments')}
                rows={3}
              />
            </div>
          ) : (
            <div>
              <Label>{t('common.rejectionReason')} *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t('common.rejectionReasonPlaceholder')}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {mode === 'review' ? (
            <>
              <Button variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
              <Button variant="destructive" onClick={() => setMode('reject')}>
                <XCircle className="h-4 w-4 me-2" /> {t('common.reject')}
              </Button>
              <Button onClick={handleApprove} disabled={isApproving}>
                {isApproving && <LoadingSpinner size="sm" className="me-2" />}
                <CheckCircle className="h-4 w-4 me-2" /> {t('common.approve')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setMode('review')}>{t('common.back')}</Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim() || isRejecting}
              >
                {isRejecting && <LoadingSpinner size="sm" className="me-2" />}
                {t('common.confirmRejection')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseApprovalModal
