/**
 * GRN Form Component
 * Phase 8: Purchase Module
 *
 * Create Goods Receipt Note against a Purchase Order
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
import { samplePurchaseOrders } from '@/data/purchase-orders.data'
import type { Attachment } from '@/types/common.types'
import type { GRNFormData } from '../types/grn.types'

function createGRNSchema(t: (key: string) => string) {
  return z.object({
    purchaseOrderId: z.string().min(1, t('validation.purchaseOrderRequired')),
    receiptDate: z.string().min(1, t('validation.receiptDateRequired')),
    deliveryNoteNumber: z.string().optional(),
    warehouseId: z.string().min(1, t('validation.warehouseRequired')),
    notes: z.string().optional(),
  })
}

interface GRNLineItemInput {
  poLineItemId: string
  itemName: string
  orderedQty: number
  previouslyReceived: number
  pendingQty: number
  receivedQty: number
  acceptedQty: number
  rejectedQty: number
  unit: string
  rejectionReason?: string
}

interface GRNFormProps {
  onSubmit: (data: GRNFormData) => void
  onCancel: () => void
  isLoading?: boolean
  defaultPOId?: string
}

export function GRNForm({ onSubmit, onCancel, isLoading, defaultPOId }: GRNFormProps) {
  const { t } = useTranslation()
  const grnSchema = useMemo(() => createGRNSchema(t), [t])
  const allPOs = samplePurchaseOrders as unknown as Array<{
    id: string; poNumber: string; status: string;
    vendor: { id: string; name: string };
    items: Array<{
      id: string; itemId?: string; itemName: string; quantity: number;
      unit: string; unitPrice: number; receivedQuantity?: number; pendingQuantity?: number;
    }>;
  }>
  const receivablePOs = allPOs.filter(
    (po) => ['sent', 'partially-received'].includes(po.status)
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(grnSchema),
    defaultValues: {
      purchaseOrderId: defaultPOId || '',
      receiptDate: new Date().toISOString().split('T')[0],
      deliveryNoteNumber: '',
      warehouseId: '',
      notes: '',
    },
  })

  const selectedPOId = watch('purchaseOrderId')

  const [lineItems, setLineItems] = useState<GRNLineItemInput[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])

  // When PO is selected, populate line items
  const handlePOChange = (poId: string) => {
    setValue('purchaseOrderId', poId)
    const po = receivablePOs.find((p) => p.id === poId)
    if (po) {
      setLineItems(
        po.items.map((item) => ({
          poLineItemId: item.id,
          itemName: item.itemName,
          orderedQty: item.quantity,
          previouslyReceived: item.receivedQuantity || 0,
          pendingQty: item.pendingQuantity || item.quantity - (item.receivedQuantity || 0),
          receivedQty: 0,
          acceptedQty: 0,
          rejectedQty: 0,
          unit: item.unit,
        }))
      )
    }
  }

  const handleLineItemChange = (index: number, field: keyof GRNLineItemInput, value: number | string) => {
    setLineItems((prev) => {
      const updated = [...prev]
      const item = { ...updated[index], [field]: value }

      // Auto-calculate: accepted = received - rejected
      if (field === 'receivedQty') {
        const received = Number(value)
        item.receivedQty = Math.min(received, item.pendingQty)
        item.acceptedQty = item.receivedQty
        item.rejectedQty = 0
      }
      if (field === 'rejectedQty') {
        const rejected = Number(value)
        item.rejectedQty = Math.min(rejected, item.receivedQty)
        item.acceptedQty = item.receivedQty - item.rejectedQty
      }

      updated[index] = item
      return updated
    })
  }

  const handleFormSubmit = (formData: z.infer<typeof grnSchema>) => {
    const po = receivablePOs.find((p) => p.id === formData.purchaseOrderId)
    const grnData: GRNFormData = {
      purchaseOrderId: formData.purchaseOrderId,
      receiptDate: formData.receiptDate,
      deliveryNoteNumber: formData.deliveryNoteNumber,
      warehouseId: formData.warehouseId,
      notes: formData.notes,
      attachments,
      items: lineItems
        .filter((item) => item.receivedQty > 0)
        .map((item) => {
          const poItem = po?.items.find((pi) => pi.id === item.poLineItemId)
          return {
            poLineItemId: item.poLineItemId,
            itemId: poItem?.itemId,
            itemName: item.itemName,
            orderedQuantity: item.orderedQty,
            previouslyReceived: item.previouslyReceived,
            receivedQuantity: item.receivedQty,
            acceptedQuantity: item.acceptedQty,
            rejectedQuantity: item.rejectedQty,
            unit: item.unit,
            unitCost: poItem?.unitPrice || 0,
            rejectionReason: item.rejectionReason,
          }
        }),
    }
    onSubmit(grnData)
  }

  const totalReceived = lineItems.reduce((sum, i) => sum + i.receivedQty, 0)
  const totalAccepted = lineItems.reduce((sum, i) => sum + i.acceptedQty, 0)
  const totalRejected = lineItems.reduce((sum, i) => sum + i.rejectedQty, 0)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* PO Selection & Date */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.receiptDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('purchase.purchaseOrder')} *</Label>
              <Select value={selectedPOId} onValueChange={handlePOChange}>
                <SelectTrigger><SelectValue placeholder={t('purchase.selectPO')} /></SelectTrigger>
                <SelectContent>
                  {receivablePOs.map((po) => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.poNumber} - {po.vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.purchaseOrderId && <p className="text-sm text-destructive mt-1">{errors.purchaseOrderId.message}</p>}
            </div>
            <div>
              <Label>{t('purchase.receiptDate')} *</Label>
              <Input type="date" {...register('receiptDate')} />
              {errors.receiptDate && <p className="text-sm text-destructive mt-1">{errors.receiptDate.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('purchase.deliveryNoteNumber')}</Label>
              <Input {...register('deliveryNoteNumber')} placeholder={t('purchase.deliveryNotePlaceholder')} />
            </div>
            <div>
              <Label>{t('purchase.warehouse')} *</Label>
              <Select value={watch('warehouseId')} onValueChange={(val) => setValue('warehouseId', val)}>
                <SelectTrigger><SelectValue placeholder={t('purchase.selectWarehouse')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wh-main">{t('purchase.mainWarehouse')}</SelectItem>
                  <SelectItem value="wh-dubai">{t('purchase.dubaiWarehouse')}</SelectItem>
                  <SelectItem value="wh-abudhabi">{t('purchase.abuDhabiWarehouse')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.warehouseId && <p className="text-sm text-destructive mt-1">{errors.warehouseId.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      {lineItems.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{t('purchase.itemsReceived')}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t('purchase.item')}</TableHead>
                    <TableHead className="text-center w-20">{t('purchase.ordered')}</TableHead>
                    <TableHead className="text-center w-20">{t('purchase.prevReceived')}</TableHead>
                    <TableHead className="text-center w-20">{t('purchase.pending')}</TableHead>
                    <TableHead className="text-center w-24">{t('purchase.received')}</TableHead>
                    <TableHead className="text-center w-24">{t('purchase.accepted')}</TableHead>
                    <TableHead className="text-center w-24">{t('purchase.rejected')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={item.poLineItemId}>
                      <TableCell>
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-xs text-muted-foreground">{item.unit}</p>
                      </TableCell>
                      <TableCell className="text-center">{item.orderedQty}</TableCell>
                      <TableCell className="text-center">{item.previouslyReceived}</TableCell>
                      <TableCell className="text-center font-medium">{item.pendingQty}</TableCell>
                      <TableCell>
                        <Input
                          type="number" min="0" max={item.pendingQty}
                          value={item.receivedQty}
                          onChange={(e) => handleLineItemChange(index, 'receivedQty', Number(e.target.value) || 0)}
                          className="h-9 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-medium">
                        {item.acceptedQty}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number" min="0" max={item.receivedQty}
                          value={item.rejectedQty}
                          onChange={(e) => handleLineItemChange(index, 'rejectedQty', Number(e.target.value) || 0)}
                          className="h-9 text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {lineItems.map((item, index) => (
                <Card key={item.poLineItemId}>
                  <CardContent className="pt-4 space-y-3">
                    <p className="font-medium">{item.itemName}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm text-center">
                      <div>
                        <p className="text-muted-foreground">{t('purchase.ordered')}</p>
                        <p className="font-medium">{item.orderedQty}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('purchase.prev')}</p>
                        <p className="font-medium">{item.previouslyReceived}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('purchase.pending')}</p>
                        <p className="font-medium">{item.pendingQty}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">{t('purchase.receivedQty')}</Label>
                        <Input
                          type="number" min="0" max={item.pendingQty}
                          value={item.receivedQty}
                          onChange={(e) => handleLineItemChange(index, 'receivedQty', Number(e.target.value) || 0)}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{t('purchase.rejectedQty')}</Label>
                        <Input
                          type="number" min="0" max={item.receivedQty}
                          value={item.rejectedQty}
                          onChange={(e) => handleLineItemChange(index, 'rejectedQty', Number(e.target.value) || 0)}
                          className="h-10"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-green-600">{t('purchase.accepted')}: {item.acceptedQty}</span>
                      <span className="text-red-600">{t('purchase.rejected')}: {item.rejectedQty}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('purchase.totalReceived')}:</span>
                <span className="font-medium">{totalReceived}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('purchase.accepted')}:</span>
                <span className="font-medium text-green-600">{totalAccepted}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('purchase.rejected')}:</span>
                <span className="font-medium text-red-600">{totalRejected}</span>
              </div>
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
          <Textarea {...register('notes')} placeholder={t('purchase.inspectionNotesPlaceholder')} rows={3} />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading || totalReceived === 0}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {t('purchase.createGRN')}
        </Button>
      </div>
    </form>
  )
}

export default GRNForm
