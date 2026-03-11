/**
 * Stock Adjustment Form Component
 * Phase 7: Inventory Module
 *
 * Form for correcting stock levels (damage, expiry, loss, etc.)
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Wrench, AlertTriangle, Info, Package } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { sampleItems } from '@/data/items.data'
import { sampleWarehouses } from '@/data/warehouses.data'

const ADJUSTMENT_REASON_KEYS = [
  { value: 'damage', labelKey: 'inventory.reasonDamaged', icon: '🔨', color: 'text-red-600' },
  { value: 'expired', labelKey: 'inventory.reasonExpired', icon: '📅', color: 'text-orange-600' },
  { value: 'lost', labelKey: 'inventory.reasonLostMissing', icon: '❓', color: 'text-amber-600' },
  { value: 'return', labelKey: 'inventory.reasonCustomerReturn', icon: '🔄', color: 'text-blue-600' },
  { value: 'correction', labelKey: 'inventory.reasonStockCorrection', icon: '✏️', color: 'text-purple-600' },
  { value: 'production', labelKey: 'inventory.reasonProductionOutput', icon: '🏭', color: 'text-green-600' },
] as const

type StockAdjustmentFormValues = z.infer<ReturnType<typeof createStockAdjustmentSchema>>

function createStockAdjustmentSchema(t: (key: string) => string) {
  return z.object({
    itemId: z.string().min(1, t('validation.itemRequired')),
    warehouseId: z.string().min(1, t('validation.warehouseRequired')),
    quantity: z.number().refine((val) => val !== 0, {
      message: t('validation.quantityNotZero'),
    }),
    reason: z.enum(['damage', 'expired', 'lost', 'return', 'correction', 'production']),
    notes: z.string().min(10, t('validation.detailsMin10')),
  })
}

interface StockAdjustmentFormProps {
  onSuccess?: () => void
  onCancel: () => void
  defaultItemId?: string
  defaultWarehouseId?: string
}

export function StockAdjustmentForm({
  onSuccess,
  onCancel,
  defaultItemId,
  defaultWarehouseId,
}: StockAdjustmentFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const stockAdjustmentSchema = useMemo(() => createStockAdjustmentSchema(t), [t])

  const ADJUSTMENT_REASONS = ADJUSTMENT_REASON_KEYS.map((r) => ({
    ...r,
    label: t(r.labelKey),
  }))

  const items = sampleItems
  const warehouses = sampleWarehouses
  const isAdjusting = false

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      itemId: defaultItemId || '',
      warehouseId: defaultWarehouseId || '',
      quantity: 0,
      reason: 'correction',
      notes: '',
    }
  })

  const selectedItemId = form.watch('itemId')
  const selectedItem = items?.find((i) => i.id === selectedItemId)
  const quantity = form.watch('quantity') || 0
  const reason = form.watch('reason')

  const isNegativeAdjustment = quantity < 0
  const adjustmentValue = selectedItem ? Math.abs(quantity) * selectedItem.costPrice : 0

  const handleSubmit = (_values: StockAdjustmentFormValues) => {
    toast.success(t('inventory.stockAdjustmentRecordedSuccess'))
    onSuccess?.()
  }

  const itemOptions = items?.filter((i) => i.stockTracked).map((item) => ({
    value: item.id,
    label: `${item.name} (${item.sku})`,
  })) || []

  const warehouseOptions = warehouses?.map((wh) => ({
    value: wh.id,
    label: wh.name,
  })) || []

  const selectedReason = ADJUSTMENT_REASONS.find((r) => r.value === reason)

  return (
    <div className="max-w-2xl mx-auto">
      <Card className={cn('border-2', isNegativeAdjustment && 'border-amber-500')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            {t('inventory.stockAdjustment')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('inventory.stockAdjustmentDescription')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Item and Warehouse */}
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
                {form.formState.errors.itemId && (
                  <p className="text-sm text-destructive">{form.formState.errors.itemId.message}</p>
                )}
              </div>

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
                {form.formState.errors.warehouseId && (
                  <p className="text-sm text-destructive">{form.formState.errors.warehouseId.message}</p>
                )}
              </div>
            </div>

            {/* Quantity Adjustment */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                {t('inventory.quantityAdjustment')} *
                <span className="text-muted-foreground font-normal ms-2">
                  {t('inventory.useNegativeToDecrease')}
                </span>
              </Label>
              <Input
                id="quantity"
                type="number"
                step="1"
                {...form.register('quantity', { valueAsNumber: true })}
                placeholder={t('inventory.placeholderQuantityAdjustment')}
                className={cn(
                  'text-lg font-medium',
                  isNegativeAdjustment && 'border-amber-500 text-amber-600'
                )}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
              )}

              {quantity !== 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={isNegativeAdjustment ? 'destructive' : 'secondary'}
                    className="text-sm"
                  >
                    {isNegativeAdjustment ? t('inventory.decreasing') : t('inventory.increasing')} {t('inventory.stock')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {t('inventory.byUnits', { count: Math.abs(quantity) })}
                  </span>
                </div>
              )}
            </div>

            {/* Reason Selection */}
            <div className="space-y-3">
              <Label>{t('inventory.adjustmentReason')} *</Label>
              <RadioGroup
                value={form.watch('reason')}
                onValueChange={(value) => form.setValue('reason', value as StockAdjustmentFormValues['reason'])}
                className="grid grid-cols-2 md:grid-cols-3 gap-3"
              >
                {ADJUSTMENT_REASONS.map((r) => (
                  <div
                    key={r.value}
                    className={cn(
                      'flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
                      form.watch('reason') === r.value && 'border-primary bg-primary/5'
                    )}
                  >
                    <RadioGroupItem value={r.value} id={r.value} className="sr-only" />
                    <Label htmlFor={r.value} className="flex-1 cursor-pointer">
                      <div className="text-center">
                        <span className="text-xl">{r.icon}</span>
                        <p className="text-xs mt-1 font-medium">{r.label}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Adjustment Summary */}
          {selectedItem && quantity !== 0 && (
            <Card className={cn(
              'bg-muted/50',
              isNegativeAdjustment && 'bg-amber-50 dark:bg-amber-950/20'
            )}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedItem.name}</span>
                  <Badge variant="secondary" className="text-xs">{selectedItem.sku}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('inventory.unitCost')}</p>
                    <p className="font-medium">{formatAmount(selectedItem.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('inventory.adjustment')}</p>
                    <p className={cn('font-medium', isNegativeAdjustment ? 'text-amber-600' : 'text-green-600')}>
                      {quantity > 0 ? '+' : ''}{quantity} {t('inventory.unitsSuffix')}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t('inventory.valueImpact')}</span>
                    <span className={cn('text-lg font-bold', isNegativeAdjustment ? 'text-amber-600' : 'text-green-600')}>
                      {isNegativeAdjustment ? '-' : '+'}{formatAmount(adjustmentValue)}
                    </span>
                  </div>
                </div>

                {selectedReason && (
                  <div className="flex items-center gap-2 pt-2 border-t text-sm">
                    <span>{t('inventory.reasonLabel')}:</span>
                    <Badge variant="outline" className={selectedReason.color}>
                      {selectedReason.icon} {selectedReason.label}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

            {/* Notes (Required) */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                {t('common.notes')} *
                <span className="text-muted-foreground font-normal ms-2">
                  {t('inventory.explainAdjustment')}
                </span>
              </Label>
              <Textarea
                id="notes"
                placeholder={t('inventory.adjustmentNotesPlaceholder')}
                rows={4}
                {...form.register('notes')}
              />
              {form.formState.errors.notes && (
                <p className="text-sm text-destructive">{form.formState.errors.notes.message}</p>
              )}
            </div>

            {/* Warning for Negative Adjustments */}
            {isNegativeAdjustment && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-sm text-amber-900 dark:text-amber-100">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  <strong>{t('common.warning')}:</strong> {t('inventory.writeOffWarning', { amount: formatAmount(adjustmentValue) })}
                </p>
              </div>
            )}

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm text-blue-900 dark:text-blue-100">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                {t('inventory.adjustmentAuditNote')}
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isAdjusting}
                variant={isNegativeAdjustment ? 'destructive' : 'default'}
              >
                {isAdjusting ? t('common.recording') : isNegativeAdjustment ? t('inventory.confirmWriteOff') : t('inventory.confirmAdjustment')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockAdjustmentForm
