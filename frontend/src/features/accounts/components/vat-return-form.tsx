/**
 * VAT Return Form Component
 * Phase 9: Accounts/Finance Module
 *
 * Create VAT return period for UAE FTA filing
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
import type { VATReturnFormData, VATReturnPeriod } from '../types/vat-return.types'

function createVATReturnSchema(t: (key: string) => string) {
  return z.object({
    periodType: z.string().min(1, t('validation.periodTypeRequired')),
    periodFrom: z.string().min(1, t('validation.periodStartRequired')),
    periodTo: z.string().min(1, t('validation.periodEndRequired')),
    adjustments: z.number(),
    adjustmentNotes: z.string().optional(),
    notes: z.string().optional(),
  })
}

type VATReturnSchemaType = z.infer<ReturnType<typeof createVATReturnSchema>>

interface VATReturnFormProps {
  onSubmit: (data: VATReturnFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function VATReturnForm({ onSubmit, onCancel, isLoading }: VATReturnFormProps) {
  const { t } = useTranslation()
  const vatReturnSchema = useMemo(() => createVATReturnSchema(t), [t])
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VATReturnSchemaType>({
    resolver: zodResolver(vatReturnSchema),
    defaultValues: {
      periodType: 'quarterly',
      periodFrom: '',
      periodTo: '',
      adjustments: 0,
      adjustmentNotes: '',
      notes: '',
    },
  })

  const periodType = watch('periodType')

  const handleFormSubmit = (data: VATReturnSchemaType) => {
    const formData: VATReturnFormData = {
      periodType: data.periodType as VATReturnPeriod,
      periodFrom: data.periodFrom,
      periodTo: data.periodTo,
      adjustments: data.adjustments,
      adjustmentNotes: data.adjustmentNotes,
      notes: data.notes,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.vatReturnPeriod')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('accounts.periodType')} *</Label>
            <Select value={periodType} onValueChange={(v) => setValue('periodType', v)}>
              <SelectTrigger><SelectValue placeholder={t('accounts.selectPeriodType')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t('accounts.monthly')}</SelectItem>
                <SelectItem value="quarterly">{t('accounts.quarterly')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.periodType && <p className="text-sm text-destructive mt-1">{errors.periodType.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodFrom">{t('accounts.periodFrom')} *</Label>
              <Input id="periodFrom" type="date" {...register('periodFrom')} />
              {errors.periodFrom && <p className="text-sm text-destructive mt-1">{errors.periodFrom.message}</p>}
            </div>
            <div>
              <Label htmlFor="periodTo">{t('accounts.periodTo')} *</Label>
              <Input id="periodTo" type="date" {...register('periodTo')} />
              {errors.periodTo && <p className="text-sm text-destructive mt-1">{errors.periodTo.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.adjustments')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adjustments">{t('accounts.adjustmentAmountAED')}</Label>
            <Input
              id="adjustments"
              type="number"
              step="0.01"
              {...register('adjustments', { valueAsNumber: true })}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('accounts.adjustmentHint')}
            </p>
          </div>
          <div>
            <Label htmlFor="adjustmentNotes">{t('accounts.adjustmentNotes')}</Label>
            <Textarea id="adjustmentNotes" {...register('adjustmentNotes')} placeholder={t('accounts.adjustmentNotesPlaceholder')} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <Label htmlFor="notes">{t('accounts.additionalNotes')}</Label>
          <Textarea id="notes" {...register('notes')} placeholder={t('accounts.vatReturnNotesPlaceholder')} rows={3} />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {t('accounts.createVATReturn')}
        </Button>
      </div>
    </form>
  )
}

export default VATReturnForm
