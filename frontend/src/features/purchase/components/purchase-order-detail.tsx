/**
 * Purchase Order Detail Component
 * Phase 8: Purchase Module
 *
 * Displays full PO details with approval workflow
 */

import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Printer,
  ClipboardCheck,
  Clock,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatDate } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { PO_STATUS_CONFIG } from '../types/purchase-order.types'
import { POLineItemsTable } from './po-line-items-table'
import type { PurchaseOrder } from '../types/purchase-order.types'

interface PurchaseOrderDetailProps {
  purchaseOrder: PurchaseOrder
  onBack: () => void
  onSubmitForApproval?: () => void
  onApprove?: () => void
  onReject?: () => void
  onSend?: () => void
  onCreateGRN?: () => void
}

export function PurchaseOrderDetail({
  purchaseOrder: po,
  onBack,
  onSubmitForApproval,
  onApprove,
  onReject,
  onSend,
  onCreateGRN,
}: PurchaseOrderDetailProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const statusConfig = PO_STATUS_CONFIG[po.status]

  const lineItemsForDisplay = po.items.map((item) => ({
    id: item.id,
    itemCode: item.itemCode,
    itemName: item.itemName,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unitCost: item.unitPrice,
    discount: item.discount,
    vatRate: item.vatRate,
    subtotal: item.total,
    discountAmount: item.discountAmount,
    vatAmount: item.vatAmount,
    total: item.totalWithVat,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{po.poNumber}</h1>
              <StatusBadge variant={statusConfig?.variant || 'neutral'}>
                {t(statusConfig?.key)}
              </StatusBadge>
            </div>
            <p className="text-muted-foreground">
              {t('purchase.createdOn')} {formatDate(po.createdAt)}
              {po.createdBy && ` ${t('purchase.byPerson')} ${po.createdBy.name}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 me-2" />{t('common.print')}
          </Button>
          {po.status === 'draft' && onSubmitForApproval && (
            <Button size="sm" onClick={onSubmitForApproval}>
              <ClipboardCheck className="h-4 w-4 me-2" />{t('purchase.submitForApproval')}
            </Button>
          )}
          {po.status === 'pending-approval' && onApprove && (
            <>
              <Button size="sm" variant="default" onClick={onApprove}>
                <CheckCircle className="h-4 w-4 me-2" />{t('purchase.approve')}
              </Button>
              <Button size="sm" variant="destructive" onClick={onReject}>
                <XCircle className="h-4 w-4 me-2" />{t('purchase.reject')}
              </Button>
            </>
          )}
          {po.status === 'approved' && onSend && (
            <Button size="sm" onClick={onSend}>
              <Send className="h-4 w-4 me-2" />{t('purchase.sendToVendor')}
            </Button>
          )}
          {['sent', 'partially-received'].includes(po.status) && onCreateGRN && (
            <Button size="sm" onClick={onCreateGRN}>
              <Package className="h-4 w-4 me-2" />{t('purchase.createGRN')}
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">{t('purchase.totalAmount')}</p>
            <p className="text-xl font-bold">{formatAmount(po.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">{t('purchase.items')}</p>
            <p className="text-xl font-bold">{po.items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">{t('purchase.approval')}</p>
            <Badge variant="outline" className="mt-1">{t(`purchase.approvalLevelLabel.${po.approvalLevel}`)}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-sm text-muted-foreground">{t('purchase.delivery')}</p>
            <p className="text-xl font-bold">{formatDate(po.expectedDeliveryDate)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('purchase.vendorDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('purchase.vendorName')}</p>
                  <p className="font-medium">{po.vendor.name}</p>
                </div>
                {po.vendor.email && (
                  <div>
                    <p className="text-muted-foreground">{t('common.email')}</p>
                    <p className="font-medium">{po.vendor.email}</p>
                  </div>
                )}
                {po.vendor.phone && (
                  <div>
                    <p className="text-muted-foreground">{t('common.phone')}</p>
                    <p className="font-medium">{po.vendor.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('purchase.lineItems')}</CardTitle>
            </CardHeader>
            <CardContent>
              <POLineItemsTable items={lineItemsForDisplay} onChange={() => {}} readOnly />
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <div className="space-y-2 text-sm min-w-[250px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('purchase.subtotal')}</span>
                    <span className="font-medium">{formatAmount(po.subtotal)}</span>
                  </div>
                  {po.totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('purchase.discount')}</span>
                      <span>-{formatAmount(po.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('purchase.vat5Percent')}</span>
                    <span className="font-medium">{formatAmount(po.vatAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('common.total')}</span>
                    <span>{formatAmount(po.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">{t('purchase.orderInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('purchase.poDate')}</span>
                <span className="font-medium">{formatDate(po.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('purchase.deliveryDate')}</span>
                <span className="font-medium">{formatDate(po.expectedDeliveryDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('purchase.paymentTerms')}</span>
                <span className="font-medium capitalize">{po.paymentTerms.replace(/-/g, ' ')}</span>
              </div>
              {po.deliveryWarehouseName && (
                <div>
                  <p className="text-muted-foreground mb-1">{t('purchase.deliveryWarehouse')}</p>
                  <p className="font-medium">{po.deliveryWarehouseName}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval History */}
          {po.approvals && po.approvals.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{t('purchase.approvalHistory')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {po.approvals.map((record, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          record.status === 'approved' ? 'bg-green-100 text-green-600' :
                          record.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {record.status === 'approved' ? <CheckCircle className="h-4 w-4" /> :
                           record.status === 'rejected' ? <XCircle className="h-4 w-4" /> :
                           <Clock className="h-4 w-4" />}
                        </div>
                        {index < po.approvals.length - 1 && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm capitalize">{t(`purchase.approvalStatus.${record.status}`)}</p>
                        <p className="text-xs text-muted-foreground">
                          {record.approverName} - {formatDate(record.date)}
                        </p>
                        {record.comments && (
                          <p className="text-sm mt-1">{record.comments}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {po.notes && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{t('common.notes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{po.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Terms */}
          {po.termsAndConditions && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{t('purchase.termsAndConditions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{po.termsAndConditions}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default PurchaseOrderDetail
