/**
 * Payment Form Component
 * Phase 6: Sales Module
 *
 * Form for recording payments against invoices
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { PAYMENT_METHOD_KEYS, type PaymentFormData, type Invoice } from '../types/invoice.types'

type PaymentFormValues = z.infer<ReturnType<typeof createPaymentFormSchema>>

function createPaymentFormSchema(t: (key: string) => string) {
  return z.object({
    amount: z.number().min(0.01, t('validation.amountGreaterZero')),
    paymentDate: z.date({ message: t('validation.paymentDateRequired') }),
    paymentMethod: z.enum(['cash', 'card', 'bank-transfer', 'cheque']),
    referenceNumber: z.string().optional(),
    chequeNumber: z.string().optional(),
    bankName: z.string().optional(),
    notes: z.string().optional(),
  }).refine(
    (data) => {
      if (data.paymentMethod === 'cheque' && !data.chequeNumber) {
        return false
      }
      return true
    },
    {
      message: t('validation.chequeNumberRequired'),
      path: ['chequeNumber'],
    }
  )
}

interface PaymentFormProps {
  invoice: Invoice
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PaymentFormData) => Promise<void>
  isLoading?: boolean
}

export function PaymentForm({
  invoice,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: PaymentFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const paymentFormSchema = useMemo(() => createPaymentFormSchema(t), [t])
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: invoice.balanceAmount,
      paymentDate: new Date(),
      paymentMethod: 'bank-transfer',
      referenceNumber: '',
      chequeNumber: '',
      bankName: '',
      notes: '',
    },
  })

  const { watch, control, setValue } = form
  const paymentMethod = watch('paymentMethod')
  const amount = watch('amount')

  // Calculate if payment exceeds balance
  const exceedsBalance = amount > invoice.balanceAmount

  // Handle form submission
  const handleSubmit = async (values: PaymentFormValues) => {
    const formData: PaymentFormData = {
      invoiceId: invoice.id,
      amount: values.amount,
      date: format(values.paymentDate, 'yyyy-MM-dd'),
      paymentMethod: values.paymentMethod,
      referenceNumber: values.referenceNumber,
      chequeNumber: values.chequeNumber,
      bankName: values.bankName,
      notes: values.notes,
    }

    await onSubmit(formData)
    form.reset()
    onClose()
  }

  // Set full amount
  const handlePayFullAmount = () => {
    setValue('amount', invoice.balanceAmount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('sales.recordPayment')}</DialogTitle>
          <DialogDescription>
            {t('sales.recordPaymentDescription', { invoiceNumber: invoice.invoiceNumber })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-4">
            {/* Invoice Summary */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.invoiceTotal')}</span>
                <span className="font-medium">{formatAmount(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('sales.alreadyPaid')}</span>
                <span className="font-medium text-green-600">{formatAmount(invoice.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span>{t('sales.balanceDue')}</span>
                <span className="text-primary">{formatAmount(invoice.balanceAmount)}</span>
              </div>
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="amount">{t('sales.amountRequired')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePayFullAmount}
                  className="h-auto py-1 px-2 text-xs"
                >
                  {t('sales.payFullAmount')}
                </Button>
              </div>
              <Controller
                name="amount"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <div className="relative">
                      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        AED
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={cn('pl-12 h-11', fieldState.error && 'border-destructive')}
                      />
                    </div>
                    {fieldState.error && (
                      <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
              {exceedsBalance && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    {t('sales.amountExceedsBalance', { balance: formatAmount(invoice.balanceAmount) })}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <Label>{t('sales.paymentDateRequired')}</Label>
              <Controller
                name="paymentDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full h-11 mt-1.5 justify-start text-start font-normal',
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

            {/* Payment Method */}
            <div>
              <Label>{t('sales.paymentMethodRequired')}</Label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAYMENT_METHOD_KEYS).map(([value, val]) => (
                        <SelectItem key={value} value={value}>
                          {t(val)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Reference Number */}
            <div>
              <Label htmlFor="referenceNumber">{t('sales.referenceNumber')}</Label>
              <Controller
                name="referenceNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t('sales.transactionReference')}
                    className="h-11 mt-1.5"
                  />
                )}
              />
            </div>

            {/* Cheque Details (shown only for cheque payments) */}
            {paymentMethod === 'cheque' && (
              <>
                <div>
                  <Label htmlFor="chequeNumber">{t('sales.chequeNumberRequired')}</Label>
                  <Controller
                    name="chequeNumber"
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          {...field}
                          placeholder={t('sales.enterChequeNumber')}
                          className={cn('h-11 mt-1.5', fieldState.error && 'border-destructive')}
                        />
                        {fieldState.error && (
                          <p className="text-sm text-destructive mt-1">{fieldState.error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="bankName">{t('sales.bankName')}</Label>
                  <Controller
                    name="bankName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={t('sales.enterBankName')}
                        className="h-11 mt-1.5"
                      />
                    )}
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">{t('sales.notes')}</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder={t('sales.paymentNotesPlaceholder')}
                    className="mt-1.5 min-h-[80px]"
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || exceedsBalance}
              className="gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              {t('sales.recordPayment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentForm
