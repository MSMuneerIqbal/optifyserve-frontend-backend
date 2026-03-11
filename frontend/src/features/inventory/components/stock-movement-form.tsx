/**
 * Stock Movement Form Component
 * Phase 7: Inventory Module
 *
 * Form for recording stock movements (in, out, transfer, adjustment)
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { ArrowDown, ArrowUp, ArrowRight, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { sampleItems } from '@/data/items.data'
import { sampleWarehouses } from '@/data/warehouses.data'
import type { AdjustmentReason } from '../types/stock.types'

type MovementType = 'in' | 'out' | 'transfer' | 'adjustment'

interface MovementFormValues {
  type: MovementType
  itemId: string
  warehouseId: string
  fromWarehouseId: string
  toWarehouseId: string
  quantity: number
  referenceNumber: string
  notes: string
  reason: AdjustmentReason
}

interface StockMovementFormProps {
  onSuccess?: () => void
  onCancel: () => void
  defaultType?: MovementType
}

export function StockMovementForm({ onSuccess, onCancel, defaultType = 'in' }: StockMovementFormProps) {
  const { t } = useTranslation()
  const [movementType, setMovementType] = useState<MovementType>(defaultType)

  const items = sampleItems
  const warehouses = sampleWarehouses
  const isLoading = false

  const form = useForm<MovementFormValues>({
    defaultValues: {
      type: movementType,
      itemId: '',
      warehouseId: '',
      fromWarehouseId: '',
      toWarehouseId: '',
      quantity: 1,
      referenceNumber: '',
      notes: '',
      reason: 'correction',
    }
  })

  const handleSubmit = (_values: MovementFormValues) => {
    const typeLabels: Record<MovementType, string> = {
      in: t('inventory.stockIn'),
      out: t('inventory.stockOut'),
      transfer: t('inventory.transfer'),
      adjustment: t('inventory.adjustment'),
    }
    toast.success(t('inventory.movementRecordedSuccess', { type: typeLabels[movementType] }))
    onSuccess?.()
  }

  const itemOptions = items?.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.sku})`,
  })) || []

  const warehouseOptions = warehouses?.map((wh) => ({
    value: wh.id,
    label: wh.name,
  })) || []

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.recordStockMovement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Movement Type Selection */}
            <div className="space-y-3">
              <Label>{t('inventory.movementType')}</Label>
              <RadioGroup value={movementType} onValueChange={(v) => setMovementType(v as MovementType)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="in" id="in" />
                  <Label htmlFor="in" className="flex items-center gap-2 cursor-pointer flex-1">
                    <ArrowDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{t('inventory.stockIn')}</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="out" id="out" />
                  <Label htmlFor="out" className="flex items-center gap-2 cursor-pointer flex-1">
                    <ArrowUp className="h-4 w-4 text-red-600" />
                    <span className="text-sm">{t('inventory.stockOut')}</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{t('inventory.transfer')}</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="adjustment" id="adjustment" />
                  <Label htmlFor="adjustment" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Wrench className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">{t('inventory.adjust')}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemId">{t('inventory.item')} *</Label>
                <Select
                  value={form.watch('itemId')}
                  onValueChange={(value) => form.setValue('itemId', value)}
                >
                  <SelectTrigger id="itemId">
                    <SelectValue placeholder={t('inventory.selectItem')} />
                  </SelectTrigger>
                  <SelectContent>
                    {itemOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t('inventory.quantity')} *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={movementType === 'adjustment' ? undefined : 1}
                  step="1"
                  {...form.register('quantity', { valueAsNumber: true })}
                  placeholder={t('inventory.placeholderQuantity')}
                />
                {movementType === 'adjustment' && (
                  <p className="text-xs text-muted-foreground">
                    {t('inventory.useNegativeValues')}
                  </p>
                )}
              </div>
            </div>

            {/* Warehouse Fields */}
            {movementType === 'transfer' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromWarehouseId">{t('inventory.fromWarehouse')} *</Label>
                  <Select
                    value={form.watch('fromWarehouseId')}
                    onValueChange={(value) => form.setValue('fromWarehouseId', value)}
                  >
                    <SelectTrigger id="fromWarehouseId">
                      <SelectValue placeholder={t('inventory.selectSource')} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseOptions.map((wh) => (
                        <SelectItem key={wh.value} value={wh.value}>
                          {wh.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toWarehouseId">{t('inventory.toWarehouse')} *</Label>
                  <Select
                    value={form.watch('toWarehouseId')}
                    onValueChange={(value) => form.setValue('toWarehouseId', value)}
                  >
                    <SelectTrigger id="toWarehouseId">
                      <SelectValue placeholder={t('inventory.selectDestination')} />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseOptions.map((wh) => (
                        <SelectItem key={wh.value} value={wh.value}>
                          {wh.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="warehouseId">{t('inventory.warehouse')} *</Label>
                <Select
                  value={form.watch('warehouseId')}
                  onValueChange={(value) => form.setValue('warehouseId', value)}
                >
                  <SelectTrigger id="warehouseId">
                    <SelectValue placeholder={t('inventory.selectWarehouse')} />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseOptions.map((wh) => (
                      <SelectItem key={wh.value} value={wh.value}>
                        {wh.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Adjustment Reason */}
            {movementType === 'adjustment' && (
              <div className="space-y-2">
                <Label>{t('inventory.adjustmentReason')} *</Label>
                <Select
                  value={form.watch('reason')}
                  onValueChange={(value) => form.setValue('reason', value as AdjustmentReason)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('inventory.selectReason')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damage">{t('inventory.damaged')}</SelectItem>
                    <SelectItem value="expired">{t('inventory.expired')}</SelectItem>
                    <SelectItem value="lost">{t('inventory.lost')}</SelectItem>
                    <SelectItem value="return">{t('inventory.customerReturn')}</SelectItem>
                    <SelectItem value="correction">{t('inventory.stockCorrection')}</SelectItem>
                    <SelectItem value="production">{t('inventory.production')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Reference and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">{t('inventory.referenceOptional')}</Label>
                <Input
                  id="referenceNumber"
                  placeholder={t('inventory.placeholderReference')}
                  {...form.register('referenceNumber')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('inventory.notesOptional')}</Label>
              <Textarea
                id="notes"
                placeholder={t('inventory.additionalNotesPlaceholder')}
                {...form.register('notes')}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.recording') : t('inventory.recordMovement')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockMovementForm
