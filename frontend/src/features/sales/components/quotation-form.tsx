/**
 * Quotation Form Component
 * Phase 6: Sales Module
 *
 * Form for creating and editing quotations
 * Fully responsive with UAE VAT compliance
 */

import { useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { CalendarIcon, Save, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn } from '@/lib/utils'
import { LineItemsTable, type LineItem } from './line-items-table'
import { VatCalculationCard } from './vat-calculation-card'
import { useVatCalculator, type VATLineItem } from '../hooks/use-vat-calculator'
import { sampleCustomers } from '@/data/customers.data'
import { PAYMENT_TERMS_KEYS, type PaymentTerms } from '../types/quotation.types'
import type { Quotation, QuotationFormData } from '../types/quotation.types'

type QuotationFormValues = z.infer<ReturnType<typeof createQuotationFormSchema>>

function createQuotationFormSchema(t: (key: string) => string) {
  return z.object({
    customerId: z.string().min(1, t('validation.customerRequired')),
    date: z.date({ message: t('validation.dateRequired') }),
    validityDays: z.number().min(1).max(365),
    paymentTerms: z.enum(['net-15', 'net-30', 'net-60', 'due-on-receipt', 'advance']),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
    internalNotes: z.string().optional(),
  })
}

interface QuotationFormProps {
  quotation?: Quotation
  onSubmit: (data: QuotationFormData) => Promise<void>
  onSend?: (data: QuotationFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function QuotationForm({
  quotation,
  onSubmit,
  onSend,
  onCancel,
  isLoading = false,
}: QuotationFormProps) {
  const { t } = useTranslation()
  const isEdit = !!quotation

  // Line items state
  const [items, setItems] = useState<LineItem[]>(() => {
    if (quotation?.items) {
      return quotation.items.map((item) => ({
        id: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discount: item.discount,
        vatStatus: 'standard' as const,
        discountAmount: item.discountAmount,
        vatAmount: item.vatAmount,
        lineTotal: item.total,
        lineTotalWithVat: item.totalWithVat,
      }))
    }
    return []
  })

  // Get customers for selection from static data
  const customers = sampleCustomers
  const loadingCustomers = false

  // Form setup
  const quotationFormSchema = useMemo(() => createQuotationFormSchema(t), [t])
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      customerId: quotation?.customerId ?? '',
      date: quotation?.date ? new Date(quotation.date) : new Date(),
      validityDays: quotation?.validityDays ?? 30,
      paymentTerms: (quotation?.paymentTerms as PaymentTerms) ?? 'net-30',
      notes: quotation?.notes ?? '',
      termsAndConditions: quotation?.termsAndConditions ?? t('validation.defaultTermsQuotation'),
      internalNotes: quotation?.internalNotes ?? '',
    },
  })

  const { watch, control } = form
  const validityDays = watch('validityDays')
  const date = watch('date')

  // Calculate expiry date
  const expiryDate = useMemo(() => {
    if (!date) return null
    return addDays(date, validityDays)
  }, [date, validityDays])

  // Convert line items to VAT items for calculation
  const vatItems: VATLineItem[] = useMemo(() => {
    return items.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      vatStatus: item.vatStatus,
    }))
  }, [items])

  // VAT calculation
  const vatCalculation = useVatCalculator(vatItems)

  // Handle form submission
  const handleSubmit = async (values: QuotationFormValues, sendAfterSave = false) => {
    if (items.length === 0) {
      return
    }

    const formData: QuotationFormData = {
      customerId: values.customerId,
      date: format(values.date, 'yyyy-MM-dd'),
      expiryDate: format(addDays(values.date, values.validityDays), 'yyyy-MM-dd'),
      validityDays: values.validityDays,
      items: items.map((item) => ({
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discount: item.discount,
        vatRate: item.vatStatus === 'standard' ? 5 : 0,
      })),
      paymentTerms: values.paymentTerms,
      notes: values.notes,
      termsAndConditions: values.termsAndConditions,
      internalNotes: values.internalNotes,
    }

    if (sendAfterSave && onSend) {
      await onSend(formData)
    } else {
      await onSubmit(formData)
    }
  }

  return (
    <form onSubmit={form.handleSubmit((values) => handleSubmit(values, false))}>
      <div className="space-y-6">
        {/* Customer & Date Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t('sales.quotationDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Customer Selection */}
              <div className="sm:col-span-2">
                <Label htmlFor="customerId">{t('common.customer')} *</Label>
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loadingCustomers}
                      >
                        <SelectTrigger className={cn('h-10 mt-1.5', fieldState.error && 'border-destructive')}>
                          <SelectValue placeholder={t('sales.selectCustomer')} />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                              {customer.company && ` (${customer.company})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Date */}
              <div>
                <Label>{t('common.date')} *</Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full h-10 mt-1.5 justify-start text-start font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="me-2 h-4 w-4" />
                          {field.value ? format(field.value, 'dd/MM/yyyy') : t('common.selectDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              {/* Validity Days */}
              <div>
                <Label htmlFor="validityDays">{t('sales.validForDays')}</Label>
                <Controller
                  name="validityDays"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="h-10 mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">{t('sales.days7')}</SelectItem>
                        <SelectItem value="15">{t('sales.days15')}</SelectItem>
                        <SelectItem value="30">{t('sales.days30')}</SelectItem>
                        <SelectItem value="60">{t('sales.days60')}</SelectItem>
                        <SelectItem value="90">{t('sales.days90')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {expiryDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('sales.expires')}: {format(expiryDate, 'dd/MM/yyyy')}
                  </p>
                )}
              </div>

              {/* Payment Terms */}
              <div className="sm:col-span-2">
                <Label>{t('common.paymentTerms')}</Label>
                <Controller
                  name="paymentTerms"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-10 mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAYMENT_TERMS_KEYS).map(([value, val]) => (
                          <SelectItem key={value} value={value}>
                            {t(val)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t('sales.lineItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <LineItemsTable
              items={items}
              onChange={setItems}
              showVatColumn
            />

            {items.length === 0 && (
              <p className="text-sm text-destructive mt-2">
                {t('sales.addLineItemHint')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary & Notes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('sales.notesTerms')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">{t('sales.notesToCustomer')}</Label>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder={t('sales.notesToCustomerPlaceholder')}
                        className="mt-1.5 min-h-[80px]"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="termsAndConditions">{t('sales.termsConditions')}</Label>
                  <Controller
                    name="termsAndConditions"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder={t('sales.termsPlaceholder')}
                        className="mt-1.5 min-h-[80px]"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="internalNotes">{t('sales.internalNotes')}</Label>
                  <Controller
                    name="internalNotes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder={t('sales.internalNotesPlaceholder')}
                        className="mt-1.5 min-h-[80px]"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('sales.internalNotesHint')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* VAT Summary */}
          <div>
            <VatCalculationCard calculation={vatCalculation} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="h-11"
          >
            <X className="h-4 w-4 me-2" />
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || items.length === 0}
            className="h-11"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="me-2" />
            ) : (
              <Save className="h-4 w-4 me-2" />
            )}
            {isEdit ? t('sales.updateQuotation') : t('sales.saveAsDraft')}
          </Button>
          {onSend && !isEdit && (
            <Button
              type="button"
              variant="default"
              onClick={() => form.handleSubmit((values) => handleSubmit(values, true))()}
              disabled={isLoading || items.length === 0}
              className="h-11 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="me-2" />
              ) : (
                <Send className="h-4 w-4 me-2" />
              )}
              {t('sales.saveSend')}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

export default QuotationForm
