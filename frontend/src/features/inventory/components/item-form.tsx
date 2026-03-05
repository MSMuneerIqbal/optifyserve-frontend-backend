/**
 * Item Form Component
 * Phase 7: Inventory Module
 *
 * Multi-step form for creating/editing items
 * Step 1: Basic Info, Step 2: Pricing, Step 3: Stock Settings
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Item, ItemFormData } from '../types/item.types'
import { UNIT_OF_MEASURE_OPTIONS } from '../types/item.types'

type ItemFormValues = z.infer<ReturnType<typeof createItemFormSchema>>

function createItemFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(3, t('validation.nameMin')),
    nameAr: z.string().optional(),
    sku: z.string().min(1, t('validation.skuRequired')),
    barcode: z.string().optional(),
    serialNumber: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, t('validation.categoryRequired')),
    unitOfMeasure: z.enum(['pcs', 'box', 'carton', 'kg', 'grams', 'liters', 'ml', 'meters', 'm2', 'feet', 'hours', 'days', 'sets', 'services']),
    costPrice: z.number().min(0, t('validation.costPricePositive')),
    sellingPrice: z.number().min(0, t('validation.sellingPricePositive')),
    reorderPoint: z.number().min(0, t('validation.reorderPointPositive')),
    reorderQuantity: z.number().min(1, t('validation.reorderQuantityMin')),
    leadTimeDays: z.number().min(0, t('validation.leadTimePositive')),
    hasSerialNumbers: z.boolean().optional(),
    hasExpiry: z.boolean().optional(),
    expiryDays: z.number().optional(),
    status: z.enum(['active', 'inactive', 'discontinued']).optional(),
    stockTracked: z.boolean(),
    isActive: z.boolean(),
  })
}

interface ItemFormProps {
  item?: Item
  onSubmit: (data: ItemFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ItemForm({ item, onSubmit, onCancel, isLoading = false }: ItemFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const itemFormSchema = useMemo(() => createItemFormSchema(t), [t])

  // Mock categories - in real app, would fetch from item categories API
  const categories = [
    { id: 'cat_001', name: t('inventory.catAirConditioners') },
    { id: 'cat_002', name: t('inventory.catElectricalItems') },
    { id: 'cat_003', name: t('inventory.catPlumbingSupplies') },
    { id: 'cat_004', name: t('inventory.catSafetyEquipment') },
    { id: 'cat_005', name: t('inventory.catToolsHardware') },
    { id: 'cat_006', name: t('inventory.catServices') },
  ]

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: item ? {
      name: item.name,
      nameAr: item.nameAr,
      sku: item.sku,
      barcode: item.barcode,
      serialNumber: item.serialNumber,
      description: item.description,
      categoryId: item.categoryId,
      unitOfMeasure: item.unitOfMeasure,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      reorderPoint: item.reorderPoint,
      reorderQuantity: item.reorderQuantity,
      leadTimeDays: item.leadTimeDays,
      hasSerialNumbers: item.hasSerialNumbers,
      hasExpiry: item.hasExpiry,
      expiryDays: item.expiryDays,
      stockTracked: item.stockTracked,
      isActive: item.isActive,
    } : {
      name: '',
      sku: '',
      unitOfMeasure: 'pcs',
      costPrice: 0,
      sellingPrice: 0,
      reorderPoint: 10,
      reorderQuantity: 25,
      leadTimeDays: 7,
      stockTracked: true,
      isActive: true,
      hasSerialNumbers: false,
      hasExpiry: false,
    }
  })

  const watchHasExpiry = form.watch('hasExpiry')

  const handleSubmit = (values: ItemFormValues) => {
    onSubmit(values as ItemFormData)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })) || []

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm transition-colors',
                  currentStep > index + 1
                    ? 'bg-primary text-primary-foreground'
                    : currentStep === index + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > index + 1 ? '✓' : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    'w-full sm:w-24 h-1 mx-2 transition-colors',
                    currentStep > index + 1 ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className={currentStep === 1 ? 'font-medium' : 'text-muted-foreground'}>{t('inventory.basicInfo')}</span>
          <span className={currentStep === 2 ? 'font-medium' : 'text-muted-foreground'}>{t('inventory.pricing')}</span>
          <span className={currentStep === 3 ? 'font-medium' : 'text-muted-foreground'}>{t('inventory.stockSettings')}</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('inventory.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('inventory.itemName')} *</Label>
                  <Input
                    id="name"
                    placeholder={t('inventory.itemNamePlaceholder')}
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameAr">{t('inventory.arabicName')}</Label>
                  <Input
                    id="nameAr"
                    placeholder={t('inventory.placeholderArabicName')}
                    dir="rtl"
                    {...form.register('nameAr')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">{t('inventory.sku')} *</Label>
                  <Input
                    id="sku"
                    placeholder={t('inventory.skuPlaceholder')}
                    {...form.register('sku')}
                  />
                  {form.formState.errors.sku && (
                    <p className="text-sm text-destructive">{form.formState.errors.sku.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">{t('inventory.barcode')}</Label>
                  <Input
                    id="barcode"
                    placeholder={t('inventory.barcodePlaceholder')}
                    {...form.register('barcode')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">{t('inventory.serialNumber')}</Label>
                  <Input
                    id="serialNumber"
                    placeholder={t('inventory.serialNumberPlaceholder')}
                    {...form.register('serialNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">{t('common.category')} *</Label>
                  <Select
                    value={form.watch('categoryId')}
                    onValueChange={(value) => form.setValue('categoryId', value)}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder={t('inventory.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitOfMeasure">{t('inventory.unitOfMeasure')} *</Label>
                  <Select
                    value={form.watch('unitOfMeasure')}
                    onValueChange={(value) => form.setValue('unitOfMeasure', value as any)}
                  >
                    <SelectTrigger id="unitOfMeasure">
                      <SelectValue placeholder={t('inventory.selectUnit')} />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_OF_MEASURE_OPTIONS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {t(unit.key)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.unitOfMeasure && (
                    <p className="text-sm text-destructive">{form.formState.errors.unitOfMeasure.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('common.description')}</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('inventory.itemDescriptionPlaceholder')}
                  {...form.register('description')}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="isActive" className="cursor-pointer">{t('inventory.activeItem')}</Label>
                  <p className="text-sm text-muted-foreground">{t('inventory.enableItemForTransactions')}</p>
                </div>
                <Switch
                  id="isActive"
                  checked={form.watch('isActive')}
                  onCheckedChange={(checked) => form.setValue('isActive', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Pricing */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('inventory.pricingInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">{t('inventory.costPriceAED')} *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register('costPrice', { valueAsNumber: true })}
                  />
                  {form.formState.errors.costPrice && (
                    <p className="text-sm text-destructive">{form.formState.errors.costPrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">{t('inventory.sellingPriceAED')} *</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register('sellingPrice', { valueAsNumber: true })}
                  />
                  {form.formState.errors.sellingPrice && (
                    <p className="text-sm text-destructive">{form.formState.errors.sellingPrice.message}</p>
                  )}
                </div>
              </div>

              {/* Margin Calculation */}
              {form.watch('costPrice') > 0 && form.watch('sellingPrice') > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{t('inventory.profitMargin')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold">
                      {(((form.watch('sellingPrice') - form.watch('costPrice')) / form.watch('sellingPrice')) * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      (AED {(form.watch('sellingPrice') - form.watch('costPrice')).toFixed(2)} {t('inventory.perUnit')})
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="stockTracked" className="cursor-pointer">{t('inventory.trackStock')}</Label>
                  <p className="text-sm text-muted-foreground">{t('inventory.enableStockManagement')}</p>
                </div>
                <Switch
                  id="stockTracked"
                  checked={form.watch('stockTracked')}
                  onCheckedChange={(checked) => form.setValue('stockTracked', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Stock Settings */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('inventory.stockSettings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">{t('inventory.reorderPoint')} *</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    placeholder={t('inventory.placeholderReorderPoint')}
                    {...form.register('reorderPoint', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">{t('inventory.alertWhenStockFallsBelow')}</p>
                  {form.formState.errors.reorderPoint && (
                    <p className="text-sm text-destructive">{form.formState.errors.reorderPoint.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorderQuantity">{t('inventory.reorderQuantity')} *</Label>
                  <Input
                    id="reorderQuantity"
                    type="number"
                    placeholder={t('inventory.placeholderReorderQuantity')}
                    {...form.register('reorderQuantity', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">{t('inventory.quantityToReorder')}</p>
                  {form.formState.errors.reorderQuantity && (
                    <p className="text-sm text-destructive">{form.formState.errors.reorderQuantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadTimeDays">{t('inventory.leadTimeDays')} *</Label>
                  <Input
                    id="leadTimeDays"
                    type="number"
                    placeholder="7"
                    {...form.register('leadTimeDays', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">{t('inventory.daysToReceiveOrder')}</p>
                  {form.formState.errors.leadTimeDays && (
                    <p className="text-sm text-destructive">{form.formState.errors.leadTimeDays.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasSerialNumbers" className="cursor-pointer">{t('inventory.serialNumbers')}</Label>
                    <p className="text-sm text-muted-foreground">{t('inventory.trackSerialNumbers')}</p>
                  </div>
                  <Switch
                    id="hasSerialNumbers"
                    checked={form.watch('hasSerialNumbers')}
                    onCheckedChange={(checked) => form.setValue('hasSerialNumbers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hasExpiry" className="cursor-pointer">{t('inventory.expiryTracking')}</Label>
                    <p className="text-sm text-muted-foreground">{t('inventory.trackExpiryDates')}</p>
                  </div>
                  <Switch
                    id="hasExpiry"
                    checked={form.watch('hasExpiry')}
                    onCheckedChange={(checked) => form.setValue('hasExpiry', checked)}
                  />
                </div>
              </div>

              {watchHasExpiry && (
                <div className="space-y-2">
                  <Label htmlFor="expiryDays">{t('inventory.expiryDays')}</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    placeholder="365"
                    {...form.register('expiryDays', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">{t('inventory.daysBeforeExpiry')}</p>
                </div>
              )}

              {/* Stock Summary */}
              {form.watch('reorderPoint') > 0 && form.watch('leadTimeDays') > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{t('inventory.reorderRecommendation')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('inventory.reorderExplanationPart1')} <Badge variant="secondary">{form.watch('reorderPoint')}</Badge> {t('inventory.unitsSuffix')},
                    {t('inventory.reorderExplanationPart2')} <Badge variant="secondary">{form.watch('reorderQuantity')}</Badge> {t('inventory.unitsSuffix')} {t('inventory.reorderExplanationPart3')}
                    <Badge variant="secondary">{form.watch('leadTimeDays')} {t('common.days')}</Badge> {t('inventory.reorderExplanationPart4')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 mt-6">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                {t('common.previous')}
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          </div>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                {t('common.nextStep')}
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.saving') : item ? t('inventory.updateItem') : t('inventory.createItem')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default ItemForm
