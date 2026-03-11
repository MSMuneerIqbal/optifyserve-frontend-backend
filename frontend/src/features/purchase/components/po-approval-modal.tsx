/**
 * PO Approval Modal Component
 * Phase 8: Purchase Module
 *
 * Modal for reviewing and approving/rejecting purchase orders
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
import { formatDate } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import type { PurchaseOrder } from '../types/purchase-order.types'

interface POApprovalModalProps {
  purchaseOrder: PurchaseOrder | null
  isOpen: boolean
  onClose: () => void
  onApprove: (id: string, comments?: string) => void
  onReject: (id: string, reason: string) => void
  isApproving?: boolean
  isRejecting?: boolean
}

export function POApprovalModal({
  purchaseOrder: po,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: POApprovalModalProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [mode, setMode] = useState<'review' | 'reject'>('review')
  const [comments, setComments] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  if (!po) return null

  const handleApprove = () => {
    onApprove(po.id, comments || undefined)
    setComments('')
    setMode('review')
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    onReject(po.id, rejectReason)
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
            {t('purchase.approvalRequired')}
          </DialogTitle>
          <DialogDescription>
            {t('purchase.reviewPODescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* PO Summary */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{po.poNumber}</p>
                  <p className="text-sm text-muted-foreground">{po.vendor.name}</p>
                </div>
                <Badge variant={po.approvalLevel === 'level-2' ? 'default' : 'destructive'}>
                  {t(`purchase.approvalLevelLabel.${po.approvalLevel}`)}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('purchase.poDate')}</p>
                  <p className="font-medium">{formatDate(po.date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('purchase.deliveryDate')}</p>
                  <p className="font-medium">{formatDate(po.expectedDeliveryDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('purchase.items')}</p>
                  <p className="font-medium">{po.items.length} {t('purchase.itemsSuffix')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('purchase.paymentTerms')}</p>
                  <p className="font-medium capitalize">{po.paymentTerms.replace(/-/g, ' ')}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('purchase.totalAmount')}</span>
                <span className="text-xl font-bold">{formatAmount(po.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Approve/Reject Forms */}
          {mode === 'review' ? (
            <div className="space-y-3">
              <div>
                <Label>{t('purchase.commentsOptional')}</Label>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={t('purchase.approvalCommentsPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label>{t('purchase.rejectionReason')} *</Label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t('purchase.rejectionReasonPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {mode === 'review' ? (
            <>
              <Button variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
              <Button
                variant="destructive"
                onClick={() => setMode('reject')}
              >
                <XCircle className="h-4 w-4 me-2" />{t('purchase.reject')}
              </Button>
              <Button onClick={handleApprove} disabled={isApproving}>
                {isApproving && <LoadingSpinner size="sm" className="me-2" />}
                <CheckCircle className="h-4 w-4 me-2" />{t('purchase.approve')}
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
                {t('purchase.confirmRejection')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default POApprovalModal
