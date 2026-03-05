/**
 * Warehouse Form Component
 * Phase 7: Inventory Module
 *
 * Form for creating/editing warehouses
 */

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Warehouse, WarehouseFormData } from '../types/warehouse.types'
import { WAREHOUSE_TYPE_KEYS } from '../types/warehouse.types'
import { UAE_EMIRATES } from '@/lib/constants'

type WarehouseFormValues = z.infer<ReturnType<typeof createWarehouseFormSchema>>

function createWarehouseFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t('validation.nameMin')),
    code: z.string().min(1, t('validation.codeRequired')),
    type: z.enum(['main', 'branch', 'store', 'warehouse', 'van']),
    status: z.enum(['active', 'inactive', 'blocked']),
    branchId: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      emirate: z.string().optional(),
      country: z.string().optional(),
    }),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    managerId: z.string().optional(),
    notes: z.string().optional(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
  })
}

interface WarehouseFormProps {
  warehouse?: Warehouse
  onSubmit: (data: WarehouseFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function WarehouseForm({
  warehouse,
  onSubmit,
  onCancel,
  isLoading = false,
}: WarehouseFormProps) {
  const { t } = useTranslation()
  const warehouseFormSchema = useMemo(() => createWarehouseFormSchema(t), [t])
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: warehouse ? {
      name: warehouse.name,
      code: warehouse.code,
      type: warehouse.type,
      status: warehouse.status,
      branchId: warehouse.branchId,
      address: {
        street: warehouse.address?.street,
        city: warehouse.address?.city,
        emirate: warehouse.address?.emirate,
        country: warehouse.address?.country,
      },
      phone: warehouse.phone,
      email: warehouse.email,
      isActive: warehouse.isActive,
      isDefault: warehouse.isDefault ?? false,
    } : {
      type: 'warehouse',
      status: 'active' as const,
      address: {
        country: 'United Arab Emirates',
      },
      isActive: true,
      isDefault: false,
    }
  })

  const handleSubmit = (values: WarehouseFormValues) => {
    onSubmit(values as WarehouseFormData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{warehouse ? t('inventory.editWarehouse') : t('inventory.createNewWarehouse')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('inventory.basicInfo')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('inventory.warehouseName')} *</Label>
                  <Input
                    id="name"
                    placeholder={t('inventory.placeholderWarehouseName')}
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">{t('inventory.warehouseCode')} *</Label>
                  <Input
                    id="code"
                    placeholder={t('inventory.placeholderWarehouseCode')}
                    {...form.register('code')}
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">{t('inventory.warehouseType')} *</Label>
                  <Select
                    value={form.watch('type')}
                    onValueChange={(value) => form.setValue('type', value as any)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder={t('inventory.selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(WAREHOUSE_TYPE_KEYS).map(([value, val]) => (
                        <SelectItem key={value} value={value}>
                          {t(val)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branchId">{t('inventory.branchOptional')}</Label>
                  <Input
                    id="branchId"
                    placeholder={t('inventory.placeholderBranchId')}
                    {...form.register('branchId')}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('common.address')}</h3>

              <div className="space-y-2">
                <Label htmlFor="address.street">{t('common.streetAddress')}</Label>
                <Textarea
                  id="address.street"
                  placeholder={t('inventory.placeholderStreetAddress')}
                  {...form.register('address.street')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.city">{t('common.city')}</Label>
                  <Input
                    id="address.city"
                    placeholder={t('inventory.placeholderCity')}
                    {...form.register('address.city')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.emirate">{t('common.emirate')}</Label>
                  <Select
                    value={form.watch('address.emirate')}
                    onValueChange={(value) => form.setValue('address.emirate', value)}
                  >
                    <SelectTrigger id="address.emirate">
                      <SelectValue placeholder={t('common.selectEmirate')} />
                    </SelectTrigger>
                    <SelectContent>
                      {UAE_EMIRATES.map((emirate) => (
                        <SelectItem key={emirate} value={emirate}>
                          {emirate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.country">{t('common.country')}</Label>
                  <Input
                    id="address.country"
                    placeholder={t('inventory.placeholderCountry')}
                    {...form.register('address.country')}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('common.contactInformation')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('common.phone')}</Label>
                  <Input
                    id="phone"
                    placeholder={t('inventory.placeholderPhone')}
                    {...form.register('phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('inventory.placeholderEmail')}
                    {...form.register('email')}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('common.settings')}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="cursor-pointer">{t('inventory.activeWarehouse')}</Label>
                    <p className="text-sm text-muted-foreground">{t('inventory.enableWarehouseForOperations')}</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isDefault" className="cursor-pointer">{t('inventory.defaultWarehouse')}</Label>
                    <p className="text-sm text-muted-foreground">{t('inventory.setAsDefaultForBranch')}</p>
                  </div>
                  <Switch
                    id="isDefault"
                    checked={form.watch('isDefault')}
                    onCheckedChange={(checked) => form.setValue('isDefault', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.saving') : warehouse ? t('inventory.updateWarehouse') : t('inventory.createWarehouse')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default WarehouseForm
