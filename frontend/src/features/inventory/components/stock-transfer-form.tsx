/**
 * Stock Transfer Form Component
 * Phase 7: Inventory Module
 *
 * Dedicated form for transferring stock between warehouses
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Package, MapPin, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useCurrency } from '@/contexts/currency-context'
import { sampleItems } from '@/data/items.data'
import { sampleWarehouses } from '@/data/warehouses.data'

type StockTransferFormValues = z.infer<ReturnType<typeof createStockTransferSchema>>

function createStockTransferSchema(t: (key: string) => string) {
  return z.object({
    itemId: z.string().min(1, t('validation.itemRequired')),
    fromWarehouseId: z.string().min(1, t('validation.sourceWarehouseRequired')),
    toWarehouseId: z.string().min(1, t('validation.destWarehouseRequired')),
    quantity: z.number().min(1, t('validation.quantityMinOne')),
    reference: z.string().optional(),
    notes: z.string().optional(),
  }).refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
    message: t('validation.warehousesMustDiffer'),
    path: ['toWarehouseId'],
  })
}

interface StockTransferFormProps {
  onSuccess?: () => void
  onCancel: () => void
  defaultItemId?: string
  defaultFromWarehouse?: string
}

export function StockTransferForm({
  onSuccess,
  onCancel,
  defaultItemId,
  defaultFromWarehouse,
}: StockTransferFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const stockTransferSchema = useMemo(() => createStockTransferSchema(t), [t])
  const items = sampleItems
  const warehouses = sampleWarehouses
  const isTransferring = false

  const form = useForm<StockTransferFormValues>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      itemId: defaultItemId || '',
      fromWarehouseId: defaultFromWarehouse || '',
      toWarehouseId: '',
      quantity: 1,
    }
  })

  const selectedItemId = form.watch('itemId')
  const selectedItem = items?.find((i) => i.id === selectedItemId)
  const quantity = form.watch('quantity') || 0

  // Calculate transfer value
  const transferValue = selectedItem ? quantity * selectedItem.costPrice : 0

  const handleSubmit = (_values: StockTransferFormValues) => {
    toast.success(t('inventory.stockTransferCompletedSuccess'))
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            {t('inventory.transferStockBetweenWarehouses')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Item Selection */}
            <div className="space-y-2">
              <Label htmlFor="itemId">{t('inventory.itemToTransfer')} *</Label>
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

            {/* Warehouse Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromWarehouseId" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('inventory.fromWarehouse')} *
                </Label>
                <Select
                  value={form.watch('fromWarehouseId')}
                  onValueChange={(value) => form.setValue('fromWarehouseId', value)}
                >
                  <SelectTrigger id="fromWarehouseId">
                    <SelectValue placeholder={t('inventory.sourceWarehouse')} />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseOptions.map((wh) => (
                      <SelectItem key={wh.value} value={wh.value}>
                        {wh.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.fromWarehouseId && (
                  <p className="text-sm text-destructive">{form.formState.errors.fromWarehouseId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toWarehouseId" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('inventory.toWarehouse')} *
                </Label>
                <Select
                  value={form.watch('toWarehouseId')}
                  onValueChange={(value) => form.setValue('toWarehouseId', value)}
                >
                  <SelectTrigger id="toWarehouseId">
                    <SelectValue placeholder={t('inventory.destinationWarehouse')} />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseOptions.map((wh) => (
                      <SelectItem key={wh.value} value={wh.value}>
                        {wh.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.toWarehouseId && (
                  <p className="text-sm text-destructive">{form.formState.errors.toWarehouseId.message}</p>
                )}
              </div>
            </div>

            {/* Visual Transfer Indicator */}
            {form.watch('fromWarehouseId') && form.watch('toWarehouseId') && (
              <div className="flex items-center justify-center gap-4 py-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t('inventory.from')}</p>
                  <Badge variant="secondary" className="mt-1">
                    {warehouses?.find((w) => w.id === form.watch('fromWarehouseId'))?.code || '-'}
                  </Badge>
                </div>
                <ArrowRight className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t('inventory.to')}</p>
                  <Badge variant="secondary" className="mt-1">
                    {warehouses?.find((w) => w.id === form.watch('toWarehouseId'))?.code || '-'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">{t('inventory.quantityToTransfer')} *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                {...form.register('quantity', { valueAsNumber: true })}
                placeholder={t('inventory.placeholderQuantity')}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-destructive">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            {/* Transfer Summary */}
            {selectedItem && quantity > 0 && (
              <Card className="bg-muted/50">
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
                      <p className="text-muted-foreground">{t('inventory.quantity')}</p>
                      <p className="font-medium">{quantity}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{t('inventory.transferValue')}</span>
                      <span className="text-lg font-bold text-primary">
                        {formatAmount(transferValue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reference and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">{t('inventory.referenceOptional')}</Label>
                <Input
                  id="reference"
                  placeholder={t('inventory.placeholderTransferReference')}
                  {...form.register('reference')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('inventory.notesOptional')}</Label>
              <Textarea
                id="notes"
                placeholder={t('inventory.transferReasonPlaceholder')}
                {...form.register('notes')}
              />
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm text-blue-900 dark:text-blue-100">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                {t('inventory.stockTransferInfoNote')}
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isTransferring}>
                {isTransferring ? t('inventory.transferring') : t('inventory.transferStock')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockTransferForm
