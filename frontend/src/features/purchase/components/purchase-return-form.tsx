/**
 * Purchase Return Form Component
 * Phase 8: Purchase Module
 *
 * Create purchase return against a GRN
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { FileUpload } from '@/components/shared/file-upload'
import { useCurrency } from '@/contexts/currency-context'
import type { Attachment } from '@/types/common.types'
import { RETURN_REASON_KEYS, RETURN_TYPE_KEYS } from '../types/purchase-return.types'
import type { PurchaseReturnFormData, ReturnReason, ReturnType } from '../types/purchase-return.types'

function createReturnSchema(t: (key: string) => string) {
  return z.object({
    grnId: z.string().min(1, t('validation.grnRequired')),
    purchaseOrderId: z.string().min(1, t('validation.poRequired')),
    vendorId: z.string().min(1, t('validation.vendorRequired')),
    returnDate: z.string().min(1, t('validation.returnDateRequired')),
    returnType: z.string().min(1, t('validation.returnTypeRequired')),
    notes: z.string().optional(),
  })
}

interface ReturnLineItemInput {
  grnLineItemId: string
  itemName: string
  availableQty: number
  returnQuantity: number
  unit: string
  unitCost: number
  reason: ReturnReason
  notes?: string
}

interface PurchaseReturnFormProps {
  onSubmit: (data: PurchaseReturnFormData) => void
  onCancel: () => void
  isLoading?: boolean
  defaultGRNId?: string
  defaultPOId?: string
  defaultVendorId?: string
  grnItems?: Array<{
    id: string
    itemName: string
    acceptedQty: number
    unit: string
    unitCost: number
  }>
}

export function PurchaseReturnForm({
  onSubmit,
  onCancel,
  isLoading,
  defaultGRNId,
  defaultPOId,
  defaultVendorId,
  grnItems,
}: PurchaseReturnFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const returnSchema = useMemo(() => createReturnSchema(t), [t])
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      grnId: defaultGRNId || '',
      purchaseOrderId: defaultPOId || '',
      vendorId: defaultVendorId || '',
      returnDate: new Date().toISOString().split('T')[0],
      returnType: 'replace',
      notes: '',
    },
  })

  const returnType = watch('returnType')

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [lineItems, setLineItems] = useState<ReturnLineItemInput[]>(
    grnItems?.map((item) => ({
      grnLineItemId: item.id,
      itemName: item.itemName,
      availableQty: item.acceptedQty,
      returnQuantity: 0,
      unit: item.unit,
      unitCost: item.unitCost,
      reason: 'damaged' as ReturnReason,
    })) || []
  )

  const handleLineItemChange = (index: number, field: keyof ReturnLineItemInput, value: number | string) => {
    setLineItems((prev) => {
      const updated = [...prev]
      if (field === 'returnQuantity') {
        const qty = Math.min(Number(value), updated[index].availableQty)
        updated[index] = { ...updated[index], returnQuantity: Math.max(0, qty) }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return updated
    })
  }

  const handleFormSubmit = (formData: z.infer<typeof returnSchema>) => {
    const returnData: PurchaseReturnFormData = {
      grnId: formData.grnId,
      purchaseOrderId: formData.purchaseOrderId,
      vendorId: formData.vendorId,
      returnDate: formData.returnDate,
      returnType: formData.returnType as ReturnType,
      notes: formData.notes,
      attachments,
      items: lineItems
        .filter((item) => item.returnQuantity > 0)
        .map((item) => ({
          grnLineItemId: item.grnLineItemId,
          itemName: item.itemName,
          returnQuantity: item.returnQuantity,
          unit: item.unit,
          unitCost: item.unitCost,
          reason: item.reason,
          notes: item.notes,
        })),
    }
    onSubmit(returnData)
  }

  const totalReturnQty = lineItems.reduce((sum, i) => sum + i.returnQuantity, 0)
  const totalReturnAmount = lineItems.reduce((sum, i) => sum + i.returnQuantity * i.unitCost, 0)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Return Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.returnDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('purchase.returnDate')} *</Label>
              <Input type="date" {...register('returnDate')} />
              {errors.returnDate && <p className="text-sm text-destructive mt-1">{errors.returnDate.message}</p>}
            </div>
            <div>
              <Label>{t('purchase.returnType')} *</Label>
              <Select value={returnType} onValueChange={(val) => setValue('returnType', val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(RETURN_TYPE_KEYS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Hidden fields for GRN/PO/Vendor IDs */}
          <input type="hidden" {...register('grnId')} />
          <input type="hidden" {...register('purchaseOrderId')} />
          <input type="hidden" {...register('vendorId')} />
        </CardContent>
      </Card>

      {/* Return Items */}
      {lineItems.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t('purchase.itemsToReturn')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop */}
            <div className="hidden lg:block overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t('purchase.item')}</TableHead>
                    <TableHead className="text-center w-20">{t('purchase.available')}</TableHead>
                    <TableHead className="text-center w-24">{t('purchase.returnQty')}</TableHead>
                    <TableHead className="text-end w-24">{t('purchase.unitCost')}</TableHead>
                    <TableHead className="w-40">{t('purchase.reason')}</TableHead>
                    <TableHead className="text-end w-24">{t('common.total')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={item.grnLineItemId}>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-center">{item.availableQty} {item.unit}</TableCell>
                      <TableCell>
                        <Input
                          type="number" min="0" max={item.availableQty}
                          value={item.returnQuantity}
                          onChange={(e) => handleLineItemChange(index, 'returnQuantity', Number(e.target.value) || 0)}
                          className="h-9 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-end">{formatAmount(item.unitCost)}</TableCell>
                      <TableCell>
                        <Select
                          value={item.reason}
                          onValueChange={(val) => handleLineItemChange(index, 'reason', val)}
                        >
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(RETURN_REASON_KEYS).map(([key, val]) => (
                              <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-end font-medium">
                        {formatAmount(item.returnQuantity * item.unitCost)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-4">
              {lineItems.map((item, index) => (
                <Card key={item.grnLineItemId}>
                  <CardContent className="pt-4 space-y-3">
                    <p className="font-medium">{item.itemName}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">{t('purchase.available')}</Label>
                        <p className="font-medium">{item.availableQty} {item.unit}</p>
                      </div>
                      <div>
                        <Label className="text-xs">{t('purchase.returnQty')}</Label>
                        <Input
                          type="number" min="0" max={item.availableQty}
                          value={item.returnQuantity}
                          onChange={(e) => handleLineItemChange(index, 'returnQuantity', Number(e.target.value) || 0)}
                          className="h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">{t('purchase.reason')}</Label>
                      <Select value={item.reason} onValueChange={(val) => handleLineItemChange(index, 'reason', val)}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(RETURN_REASON_KEYS).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between pt-2 border-t text-sm">
                      <span className="text-muted-foreground">{t('purchase.lineTotal')}</span>
                      <span className="font-medium">{formatAmount(item.returnQuantity * item.unitCost)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{t('purchase.totalReturn')}: {totalReturnQty} {t('purchase.items')}</span>
              <span className="font-bold text-lg">{formatAmount(totalReturnAmount)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('common.attachments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            value={attachments}
            onChange={setAttachments}
            accept=".pdf,.jpg,.jpeg,.png"
            maxFiles={5}
            maxSizeMB={10}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('common.notes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register('notes')} placeholder={t('purchase.returnNotesPlaceholder')} rows={3} />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading || totalReturnQty === 0}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {t('purchase.createReturn')}
        </Button>
      </div>
    </form>
  )
}

export default PurchaseReturnForm
