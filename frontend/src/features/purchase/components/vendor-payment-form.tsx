/**
 * Vendor Payment Form Component
 * Phase 8: Purchase Module
 *
 * Record vendor payments
 */

import { useMemo } from 'react'
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
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { sampleVendors } from '@/data/vendors.data'
import { samplePurchaseOrders } from '@/data/purchase-orders.data'
import { VENDOR_PAYMENT_METHOD_KEYS } from '../types/payment.types'
import type { VendorPaymentFormData, VendorPaymentMethod } from '../types/payment.types'

function createPaymentSchema(t: (key: string) => string) {
  return z.object({
    vendorId: z.string().min(1, t('validation.vendorRequired')),
    purchaseOrderId: z.string().optional(),
    paymentDate: z.string().min(1, t('validation.paymentDateRequired')),
    amount: z.number().min(0.01, t('validation.amountGreaterZero')),
    paymentMethod: z.string().min(1, t('validation.paymentMethodRequired')),
    referenceNumber: z.string().optional(),
    chequeNumber: z.string().optional(),
    chequeDate: z.string().optional(),
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    notes: z.string().optional(),
  })
}

interface VendorPaymentFormProps {
  onSubmit: (data: VendorPaymentFormData) => void
  onCancel: () => void
  isLoading?: boolean
  defaultVendorId?: string
  defaultPOId?: string
}

export function VendorPaymentForm({
  onSubmit,
  onCancel,
  isLoading,
  defaultVendorId,
  defaultPOId,
}: VendorPaymentFormProps) {
  const { t } = useTranslation()
  const paymentSchema = useMemo(() => createPaymentSchema(t), [t])
  const vendors = sampleVendors as unknown as Array<{ id: string; name: string }>
  const purchaseOrders = samplePurchaseOrders as unknown as Array<{ id: string; poNumber: string; vendor: { id: string } }>

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      vendorId: defaultVendorId || '',
      purchaseOrderId: defaultPOId || '',
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      paymentMethod: 'bank-transfer',
      referenceNumber: '',
      chequeNumber: '',
      chequeDate: '',
      bankName: '',
      accountNumber: '',
      notes: '',
    },
  })

  const vendorId = watch('vendorId')
  const paymentMethod = watch('paymentMethod')
  const purchaseOrderId = watch('purchaseOrderId')

  const vendorPOs = purchaseOrders.filter((po) => po.vendor.id === vendorId)

  const handleFormSubmit = (formData: z.infer<typeof paymentSchema>) => {
    const paymentData: VendorPaymentFormData = {
      vendorId: formData.vendorId,
      purchaseOrderId: formData.purchaseOrderId || undefined,
      paymentDate: formData.paymentDate,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod as VendorPaymentMethod,
      referenceNumber: formData.referenceNumber || undefined,
      chequeNumber: formData.chequeNumber || undefined,
      chequeDate: formData.chequeDate || undefined,
      bankName: formData.bankName || undefined,
      accountNumber: formData.accountNumber || undefined,
      notes: formData.notes || undefined,
    }
    onSubmit(paymentData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Payment Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.paymentDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('purchase.vendor')} *</Label>
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
              <Label>{t('purchase.againstPurchaseOrder')}</Label>
              <Select value={purchaseOrderId || 'none'} onValueChange={(val) => setValue('purchaseOrderId', val === 'none' ? '' : val)}>
                <SelectTrigger><SelectValue placeholder={t('purchase.selectPOOptional')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('purchase.noSpecificPO')}</SelectItem>
                  {vendorPOs.map((po) => (
                    <SelectItem key={po.id} value={po.id}>{po.poNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('purchase.paymentDate')} *</Label>
              <Input type="date" {...register('paymentDate')} />
              {errors.paymentDate && <p className="text-sm text-destructive mt-1">{errors.paymentDate.message}</p>}
            </div>
            <div>
              <Label>{t('purchase.amountAED')} *</Label>
              <Input
                type="number" min="0.01" step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
            </div>
          </div>

          <div>
            <Label>{t('purchase.paymentMethod')} *</Label>
            <Select value={paymentMethod} onValueChange={(val) => setValue('paymentMethod', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(VENDOR_PAYMENT_METHOD_KEYS).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bank/Cheque Details */}
      {(paymentMethod === 'bank-transfer' || paymentMethod === 'cheque') && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">
              {paymentMethod === 'cheque' ? t('purchase.chequeDetails') : t('purchase.bankTransferDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('purchase.referenceNumber')}</Label>
                <Input {...register('referenceNumber')} placeholder={t('purchase.transactionReference')} />
              </div>
              <div>
                <Label>{t('purchase.bankName')}</Label>
                <Input {...register('bankName')} placeholder={t('purchase.bankNamePlaceholder')} />
              </div>
            </div>
            {paymentMethod === 'cheque' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>{t('purchase.chequeNumber')}</Label>
                  <Input {...register('chequeNumber')} placeholder={t('purchase.chequeNumber')} />
                </div>
                <div>
                  <Label>{t('purchase.chequeDate')}</Label>
                  <Input type="date" {...register('chequeDate')} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('common.notes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register('notes')} placeholder={t('purchase.paymentNotesPlaceholder')} rows={3} />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {t('purchase.recordPayment')}
        </Button>
      </div>
    </form>
  )
}

export default VendorPaymentForm
