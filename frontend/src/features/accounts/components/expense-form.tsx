/**
 * Expense Form Component
 * Phase 9: Accounts/Finance Module
 *
 * Record/Edit expense with VAT handling
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
import { Switch } from '@/components/ui/switch'
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
import { useCurrency } from '@/contexts/currency-context'
import { EXPENSE_CATEGORY_KEYS } from '../types/expense.types'
import type { Expense, ExpenseFormData, ExpenseCategory, ExpensePaymentMethod } from '../types/expense.types'

function createExpenseSchema(t: (key: string) => string) {
  return z.object({
    date: z.string().min(1, t('validation.dateRequired')),
    category: z.string().min(1, t('validation.categoryRequired')),
    description: z.string().min(3, t('validation.descriptionMin3')),
    amount: z.number().min(0.01, t('validation.amountGreaterZero')),
    vatStatus: z.string().min(1, t('validation.vatStatusRequired')),
    paymentMethod: z.string().min(1, t('validation.paymentMethodRequired')),
    paidTo: z.string().min(1, t('validation.paidToRequired')),
    referenceNumber: z.string().optional(),
    accountCode: z.string().min(1, t('validation.accountCodeRequired')),
    department: z.string().optional(),
    project: z.string().optional(),
    isTaxDeductible: z.boolean(),
    isRecurring: z.boolean(),
    recurringFrequency: z.string().optional(),
    notes: z.string().optional(),
  })
}

type ExpenseSchemaType = z.infer<ReturnType<typeof createExpenseSchema>>

interface ExpenseFormProps {
  expense?: Expense
  onSubmit: (data: ExpenseFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ExpenseForm({ expense, onSubmit, onCancel, isLoading }: ExpenseFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const expenseSchema = useMemo(() => createExpenseSchema(t), [t])
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseSchemaType>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: expense?.date || new Date().toISOString().split('T')[0],
      category: expense?.category || '',
      description: expense?.description || '',
      amount: expense?.amount || 0,
      vatStatus: expense?.vatStatus || 'standard',
      paymentMethod: expense?.paymentMethod || 'bank-transfer',
      paidTo: expense?.paidTo || '',
      referenceNumber: expense?.referenceNumber || '',
      accountCode: expense?.accountCode || '5001',
      department: expense?.department || '',
      project: expense?.project || '',
      isTaxDeductible: expense?.isTaxDeductible ?? true,
      isRecurring: expense?.isRecurring ?? false,
      recurringFrequency: expense?.recurringFrequency || '',
      notes: expense?.notes || '',
    },
  })

  const amount = watch('amount')
  const vatStatus = watch('vatStatus')
  const isRecurring = watch('isRecurring')
  const isTaxDeductible = watch('isTaxDeductible')
  const category = watch('category')
  const paymentMethod = watch('paymentMethod')

  const vatRate = vatStatus === 'standard' ? 0.05 : 0
  const vatAmount = amount * vatRate
  const totalAmount = amount + vatAmount

  const handleFormSubmit = (data: ExpenseSchemaType) => {
    const formData: ExpenseFormData = {
      date: data.date,
      category: data.category as ExpenseCategory,
      description: data.description,
      amount: data.amount,
      vatStatus: data.vatStatus as 'standard' | 'zero-rated' | 'exempt',
      paymentMethod: data.paymentMethod as ExpensePaymentMethod,
      paidTo: data.paidTo,
      referenceNumber: data.referenceNumber,
      accountCode: data.accountCode,
      department: data.department,
      project: data.project,
      isTaxDeductible: data.isTaxDeductible,
      isRecurring: data.isRecurring,
      recurringFrequency: data.isRecurring ? data.recurringFrequency as 'monthly' | 'quarterly' | 'annually' : undefined,
      notes: data.notes,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.expenseDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">{t('common.date')} *</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label>{t('accounts.expenseCategory')} *</Label>
              <Select value={category || ''} onValueChange={(v) => setValue('category', v)}>
                <SelectTrigger><SelectValue placeholder={t('accounts.selectCategory')} /></SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPENSE_CATEGORY_KEYS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t('common.description')} *</Label>
            <Input id="description" {...register('description')} placeholder={t('accounts.whatExpenseFor')} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paidTo">{t('accounts.paidTo')} *</Label>
              <Input id="paidTo" {...register('paidTo')} placeholder={t('accounts.vendorOrPerson')} />
              {errors.paidTo && <p className="text-sm text-destructive mt-1">{errors.paidTo.message}</p>}
            </div>
            <div>
              <Label>{t('common.paymentMethod')} *</Label>
              <Select value={paymentMethod || ''} onValueChange={(v) => setValue('paymentMethod', v)}>
                <SelectTrigger><SelectValue placeholder={t('accounts.selectMethod')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t('common.cash')}</SelectItem>
                  <SelectItem value="card">{t('common.card')}</SelectItem>
                  <SelectItem value="bank-transfer">{t('common.bankTransfer')}</SelectItem>
                  <SelectItem value="petty-cash">{t('accounts.pettyCash')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && <p className="text-sm text-destructive mt-1">{errors.paymentMethod.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referenceNumber">{t('common.referenceNumber')}</Label>
              <Input id="referenceNumber" {...register('referenceNumber')} placeholder={t('accounts.invoiceReceiptNumber')} />
            </div>
            <div>
              <Label htmlFor="accountCode">{t('accounts.accountCode')} *</Label>
              <Input id="accountCode" {...register('accountCode')} placeholder={t('accounts.placeholderExpenseCode')} />
              {errors.accountCode && <p className="text-sm text-destructive mt-1">{errors.accountCode.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amount & VAT */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.amountVAT')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">{t('accounts.amountAED')} *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <Label>{t('common.vatStatus')} *</Label>
              <Select value={vatStatus || 'standard'} onValueChange={(v) => setValue('vatStatus', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">{t('common.standardRate')} (5%)</SelectItem>
                  <SelectItem value="zero-rated">{t('common.zeroRated')} (0%)</SelectItem>
                  <SelectItem value="exempt">{t('common.exempt')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* VAT Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('common.subtotal')}</span>
              <span>{formatAmount(amount || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('common.vat')} ({vatStatus === 'standard' ? '5%' : '0%'})</span>
              <span>{formatAmount(vatAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>{t('accounts.totalAmount')}</span>
              <span>{formatAmount(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.additionalOptions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">{t('accounts.department')}</Label>
              <Input id="department" {...register('department')} placeholder={t('common.optional')} />
            </div>
            <div>
              <Label htmlFor="project">{t('accounts.project')}</Label>
              <Input id="project" {...register('project')} placeholder={t('common.optional')} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{t('accounts.taxDeductible')}</Label>
              <p className="text-sm text-muted-foreground">{t('accounts.taxDeductibleDesc')}</p>
            </div>
            <Switch checked={isTaxDeductible} onCheckedChange={(v) => setValue('isTaxDeductible', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{t('accounts.recurringExpense')}</Label>
              <p className="text-sm text-muted-foreground">{t('accounts.recurringExpenseDesc')}</p>
            </div>
            <Switch checked={isRecurring} onCheckedChange={(v) => setValue('isRecurring', v)} />
          </div>

          {isRecurring && (
            <div>
              <Label>{t('accounts.frequency')}</Label>
              <Select value={watch('recurringFrequency') || ''} onValueChange={(v) => setValue('recurringFrequency', v)}>
                <SelectTrigger><SelectValue placeholder={t('accounts.selectFrequency')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t('accounts.monthly')}</SelectItem>
                  <SelectItem value="quarterly">{t('accounts.quarterly')}</SelectItem>
                  <SelectItem value="annually">{t('accounts.annually')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="notes">{t('accounts.additionalNotes')}</Label>
            <Textarea id="notes" {...register('notes')} placeholder={t('common.additionalNotesPlaceholder')} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {expense ? t('accounts.updateExpense') : t('accounts.recordExpense')}
        </Button>
      </div>
    </form>
  )
}

export default ExpenseForm
