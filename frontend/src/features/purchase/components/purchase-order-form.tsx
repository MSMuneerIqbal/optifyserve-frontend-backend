/**
 * Purchase Order Form Component
 * Phase 8: Purchase Module
 *
 * Create/Edit purchase order form with line items
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useCurrency } from '@/contexts/currency-context'
import { sampleVendors } from '@/data/vendors.data'
import { calculatePOTotals } from '../utils/po-calculator'
import { getApprovalLevel, getApprovalLevelInfo } from '../utils/approval-workflow'
import { POLineItemsTable } from './po-line-items-table'
import type { POLineItemData } from './po-line-items-table'
import type { PurchaseOrder, POFormData } from '../types/purchase-order.types'

function createPOSchema(t: (key: string) => string) {
  return z.object({
    vendorId: z.string().min(1, t('validation.vendorRequired')),
    date: z.string().min(1, t('validation.dateRequired')),
    expectedDeliveryDate: z.string().min(1, t('validation.expectedDeliveryDateRequired')),
    paymentTerms: z.string().min(1, t('validation.paymentTermsRequired')),
    deliveryWarehouseId: z.string().min(1, t('validation.warehouseRequired')),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
  })
}

interface PurchaseOrderFormProps {
  purchaseOrder?: PurchaseOrder
  onSubmit: (data: POFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function PurchaseOrderForm({ purchaseOrder, onSubmit, onCancel, isLoading }: PurchaseOrderFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const poSchema = useMemo(() => createPOSchema(t), [t])
  const vendors = sampleVendors as unknown as Array<{ id: string; name: string }>

  const [lineItems, setLineItems] = useState<POLineItemData[]>(
    purchaseOrder?.items.map((item) => ({
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
    })) || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(poSchema),
    defaultValues: {
      vendorId: purchaseOrder?.vendor.id || '',
      date: purchaseOrder?.date || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: purchaseOrder?.expectedDeliveryDate || '',
      paymentTerms: purchaseOrder?.paymentTerms || 'net-30',
      deliveryWarehouseId: purchaseOrder?.deliveryWarehouseId || '',
      notes: purchaseOrder?.notes || '',
      termsAndConditions: purchaseOrder?.termsAndConditions || '',
    },
  })

  const vendorId = watch('vendorId')

  // Calculate totals from line items
  const totals = calculatePOTotals(
    lineItems.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitCost,
      discount: item.discount,
      vatRate: item.vatRate,
    }))
  )

  const approvalLevel = getApprovalLevel(totals.total)
  const approvalInfo = getApprovalLevelInfo(approvalLevel)

  const handleFormSubmit = (formData: z.infer<typeof poSchema>) => {
    const poData: POFormData = {
      vendorId: formData.vendorId,
      date: formData.date,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      paymentTerms: formData.paymentTerms as POFormData['paymentTerms'],
      deliveryWarehouseId: formData.deliveryWarehouseId,
      notes: formData.notes,
      termsAndConditions: formData.termsAndConditions,
      items: lineItems.map((item) => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitCost,
        discount: item.discount,
        vatRate: item.vatRate,
      })),
    }
    onSubmit(poData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Vendor & Dates */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.orderDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendorId">{t('purchase.vendor')} *</Label>
              <Select value={vendorId} onValueChange={(val) => setValue('vendorId', val)}>
                <SelectTrigger><SelectValue placeholder={t('purchase.selectVendor')} /></SelectTrigger>
                <SelectContent>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vendorId && <p className="text-sm text-destructive mt-1">{errors.vendorId.message}</p>}
            </div>
            <div>
              <Label htmlFor="paymentTerms">{t('purchase.paymentTerms')} *</Label>
              <Select value={watch('paymentTerms')} onValueChange={(val) => setValue('paymentTerms', val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">{t('purchase.cashOnDelivery')}</SelectItem>
                  <SelectItem value="advance">{t('purchase.advancePayment')}</SelectItem>
                  <SelectItem value="net-15">{t('purchase.net15Days')}</SelectItem>
                  <SelectItem value="net-30">{t('purchase.net30Days')}</SelectItem>
                  <SelectItem value="net-60">{t('purchase.net60Days')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">{t('purchase.poDate')} *</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label htmlFor="expectedDeliveryDate">{t('purchase.expectedDeliveryDate')} *</Label>
              <Input id="expectedDeliveryDate" type="date" {...register('expectedDeliveryDate')} />
              {errors.expectedDeliveryDate && <p className="text-sm text-destructive mt-1">{errors.expectedDeliveryDate.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryWarehouseId">{t('purchase.deliveryWarehouse')} *</Label>
            <Select value={watch('deliveryWarehouseId')} onValueChange={(val) => setValue('deliveryWarehouseId', val)}>
              <SelectTrigger><SelectValue placeholder={t('purchase.selectWarehouse')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wh-main">{t('purchase.mainWarehouse')}</SelectItem>
                <SelectItem value="wh-dubai">{t('purchase.dubaiWarehouse')}</SelectItem>
                <SelectItem value="wh-abudhabi">{t('purchase.abuDhabiWarehouse')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.deliveryWarehouseId && <p className="text-sm text-destructive mt-1">{errors.deliveryWarehouseId.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.lineItems')}</CardTitle>
        </CardHeader>
        <CardContent>
          <POLineItemsTable items={lineItems} onChange={setLineItems} />
        </CardContent>
      </Card>

      {/* Totals & Approval */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
            {/* Approval Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{t('purchase.approvalRequired')}</h4>
              <Badge variant={approvalLevel === 'auto' ? 'secondary' : approvalLevel === 'manager' ? 'default' : 'destructive'}>
                {t(approvalInfo.key)}
              </Badge>
              <p className="text-sm text-muted-foreground">{t(approvalInfo.descriptionKey)}</p>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm sm:min-w-[200px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('purchase.subtotal')}</span>
                <span className="font-medium">{formatAmount(totals.subtotal)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('purchase.discount')}</span>
                  <span>-{formatAmount(totals.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('purchase.vat5')}</span>
                <span className="font-medium">{formatAmount(totals.vatAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t('common.total')}</span>
                <span>{formatAmount(totals.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.notesAndTerms')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">{t('purchase.internalNotes')}</Label>
            <Textarea id="notes" {...register('notes')} placeholder={t('purchase.internalNotesPlaceholder')} rows={2} />
          </div>
          <div>
            <Label htmlFor="termsAndConditions">{t('purchase.termsAndConditions')}</Label>
            <Textarea id="termsAndConditions" {...register('termsAndConditions')} placeholder={t('purchase.termsPlaceholder')} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading || lineItems.length === 0}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {purchaseOrder ? t('purchase.updatePO') : t('purchase.createPO')}
        </Button>
      </div>
    </form>
  )
}

export default PurchaseOrderForm
