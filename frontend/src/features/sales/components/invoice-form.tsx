/**
 * Invoice Form Component
 * Phase 6: Sales Module
 *
 * Form for creating and editing invoices
 * UAE FTA-compliant with full VAT support
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn } from '@/lib/utils'
import { UAE_EMIRATES } from '@/lib/constants'
import { LineItemsTable, type LineItem } from './line-items-table'
import { VatCalculationCard } from './vat-calculation-card'
import { useVatCalculator, type VATLineItem } from '../hooks/use-vat-calculator'
import { sampleCustomers } from '@/data/customers.data'
import { PAYMENT_TERMS_KEYS, type PaymentTerms } from '../types/quotation.types'
import { INVOICE_TYPE_KEYS } from '../types/invoice.types'
import type { Invoice, InvoiceFormData, InvoiceType, VatEmirate } from '../types/invoice.types'

type InvoiceFormValues = z.infer<ReturnType<typeof createInvoiceFormSchema>>

function createInvoiceFormSchema(t: (key: string) => string) {
  return z.object({
    customerId: z.string().min(1, t('validation.customerRequired')),
    date: z.date({ message: t('validation.dateRequired') }),
    dueDate: z.date({ message: t('validation.dueDateRequired') }),
    vatEmirate: z.string().min(1, t('validation.vatEmirateRequired')),
    paymentTerms: z.enum(['net-15', 'net-30', 'net-60', 'due-on-receipt', 'advance']),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
    internalNotes: z.string().optional(),
  })
}

interface InvoiceFormProps {
  invoice?: Invoice
  quotationId?: string
  initialItems?: LineItem[]
  onSubmit: (data: InvoiceFormData) => Promise<void>
  onSend?: (data: InvoiceFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function InvoiceForm({
  invoice,
  quotationId,
  initialItems,
  onSubmit,
  onSend,
  onCancel,
  isLoading = false,
}: InvoiceFormProps) {
  const { t } = useTranslation()
  const isEdit = !!invoice

  // Invoice type state
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(invoice?.invoiceType || 'tax-invoice')

  // Line items state
  const [items, setItems] = useState<LineItem[]>(() => {
    if (invoice?.items) {
      return invoice.items.map((item) => ({
        id: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discount: item.discount,
        vatStatus: item.vatStatus,
        discountAmount: item.discountAmount,
        vatAmount: item.vatAmount,
        lineTotal: item.total,
        lineTotalWithVat: item.totalWithVat,
      }))
    }
    if (initialItems) {
      return initialItems
    }
    return []
  })

  // Get customers for selection from static data
  const customers = sampleCustomers
  const loadingCustomers = false

  // Get due date based on payment terms
  const getDueDateFromTerms = (date: Date, terms: PaymentTerms): Date => {
    switch (terms) {
      case 'net-15':
        return addDays(date, 15)
      case 'net-30':
        return addDays(date, 30)
      case 'net-60':
        return addDays(date, 60)
      case 'due-on-receipt':
        return date
      case 'advance':
        return date
      default:
        return addDays(date, 30)
    }
  }

  // Form setup
  const invoiceFormSchema = useMemo(() => createInvoiceFormSchema(t), [t])
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerId: invoice?.customerId ?? '',
      date: invoice?.date ? new Date(invoice.date) : new Date(),
      dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : addDays(new Date(), 30),
      vatEmirate: invoice?.vatEmirate ?? 'Dubai',
      paymentTerms: (invoice?.paymentTerms as PaymentTerms) ?? 'net-30',
      notes: invoice?.notes ?? '',
      termsAndConditions: invoice?.termsAndConditions ?? t('validation.defaultTermsInvoice'),
      internalNotes: invoice?.internalNotes ?? '',
    },
  })

  const { watch, control, setValue } = form
  const date = watch('date')

  // Update due date when payment terms change
  const handlePaymentTermsChange = (terms: PaymentTerms) => {
    setValue('paymentTerms', terms)
    if (date) {
      setValue('dueDate', getDueDateFromTerms(date, terms))
    }
  }

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

  // Get selected customer
  const selectedCustomer = useMemo(() => {
    const customerId = form.watch('customerId')
    return customers.find((c) => c.id === customerId)
  }, [customers, form.watch('customerId')])

  // Handle form submission
  const handleSubmit = async (values: InvoiceFormValues, sendAfterSave = false) => {
    if (items.length === 0) {
      return
    }

    const formData: InvoiceFormData = {
      customerId: values.customerId,
      invoiceType,
      quotationId,
      date: format(values.date, 'yyyy-MM-dd'),
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      vatEmirate: values.vatEmirate as VatEmirate,
      items: items.map((item) => ({
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        discount: item.discount,
        vatStatus: item.vatStatus,
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
        {/* From Quotation Notice */}
        {quotationId && (
          <Alert>
            <AlertDescription>
              {t('sales.fromQuotationHint')}
            </AlertDescription>
          </Alert>
        )}

        {/* Customer & Invoice Details */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t('sales.invoiceDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Invoice Type */}
              <div>
                <Label>{t('sales.invoiceType')}</Label>
                <Select value={invoiceType} onValueChange={(v) => setInvoiceType(v as InvoiceType)}>
                  <SelectTrigger className="h-10 mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INVOICE_TYPE_KEYS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{t(label)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                {selectedCustomer?.taxRegistrationNumber && (
                  <p className="text-xs text-muted-foreground mt-1">
                    TRN: {selectedCustomer.taxRegistrationNumber}
                  </p>
                )}
              </div>

              {/* VAT Emirate */}
              <div>
                <Label>{t('sales.vatEmirate')} *</Label>
                <Controller
                  name="vatEmirate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={cn('h-10 mt-1.5', fieldState.error && 'border-destructive')}>
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
                      {fieldState.error && (
                        <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Invoice Date */}
              <div>
                <Label>{t('sales.invoiceDate')} *</Label>
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

              {/* Payment Terms */}
              <div>
                <Label>{t('common.paymentTerms')}</Label>
                <Controller
                  name="paymentTerms"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => handlePaymentTermsChange(value as PaymentTerms)}
                    >
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

              {/* Due Date */}
              <div>
                <Label>{t('sales.dueDate')} *</Label>
                <Controller
                  name="dueDate"
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
                {t('sales.addLineItemInvoiceHint')}
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
                    {t('sales.invoiceInternalNotesHint')}
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
            {isEdit ? t('sales.updateInvoice') : t('sales.saveAsDraft')}
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

export default InvoiceForm
