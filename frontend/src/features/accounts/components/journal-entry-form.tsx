/**
 * Journal Entry Form Component
 * Phase 9: Accounts/Finance Module
 *
 * Create/Edit journal entries with debit/credit lines
 * Double-entry bookkeeping validation
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useCurrency } from '@/contexts/currency-context'
import { cn } from '@/lib/utils'
import { sampleChartOfAccounts } from '@/data/accounts.data'
import { JOURNAL_TYPE_KEYS } from '../types/journal-entry.types'
import type {
  JournalEntry,
  JournalEntryFormData,
  JournalEntryType,
  JournalLineFormData,
} from '../types/journal-entry.types'

function createJournalSchema(t: (key: string) => string) {
  return z.object({
    date: z.string().min(1, t('validation.dateRequired')),
    type: z.string().min(1, t('validation.entryTypeRequired')),
    narration: z.string().min(3, t('validation.narrationMin3')),
    referenceNumber: z.string().optional(),
    isRecurring: z.boolean(),
    recurringFrequency: z.string().optional(),
  })
}

type JournalSchemaType = z.infer<ReturnType<typeof createJournalSchema>>

interface JournalEntryFormProps {
  entry?: JournalEntry
  onSubmit: (data: JournalEntryFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function JournalEntryForm({ entry, onSubmit, onCancel, isLoading }: JournalEntryFormProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const journalSchema = useMemo(() => createJournalSchema(t), [t])
  const accounts = sampleChartOfAccounts.filter((a) => a.status === 'active' && !a.children?.length)

  const [lines, setLines] = useState<JournalLineFormData[]>(
    entry?.lines.map((l) => ({
      accountId: l.accountId,
      accountCode: l.accountCode,
      accountName: l.accountName,
      description: l.description || '',
      debit: l.debit,
      credit: l.credit,
    })) || [
      { accountId: '', accountCode: '', accountName: '', description: '', debit: 0, credit: 0 },
      { accountId: '', accountCode: '', accountName: '', description: '', debit: 0, credit: 0 },
    ]
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalSchemaType>({
    resolver: zodResolver(journalSchema) as unknown as import('react-hook-form').Resolver<JournalSchemaType>,
    defaultValues: {
      date: entry?.date || new Date().toISOString().split('T')[0],
      type: entry?.type || 'manual',
      narration: entry?.narration || '',
      referenceNumber: entry?.referenceNumber || '',
      isRecurring: entry?.isRecurring ?? false,
      recurringFrequency: entry?.recurringFrequency || '',
    },
  })

  const entryType = watch('type')
  const isRecurring = watch('isRecurring')

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0)
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01
  const difference = totalDebit - totalCredit

  const addLine = () => {
    setLines((prev) => [...prev, { accountId: '', accountCode: '', accountName: '', description: '', debit: 0, credit: 0 }])
  }

  const removeLine = (index: number) => {
    if (lines.length <= 2) return
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  const updateLine = (index: number, field: keyof JournalLineFormData, value: string | number) => {
    setLines((prev) => {
      const updated = [...prev]
      if (field === 'accountId') {
        const account = accounts.find((a) => a.id === value)
        if (account) {
          updated[index] = { ...updated[index], accountId: account.id, accountCode: account.code, accountName: account.name }
        }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      // If setting debit, clear credit and vice versa
      if (field === 'debit' && Number(value) > 0) {
        updated[index] = { ...updated[index], credit: 0 }
      } else if (field === 'credit' && Number(value) > 0) {
        updated[index] = { ...updated[index], debit: 0 }
      }
      return updated
    })
  }

  const handleFormSubmit = (data: JournalSchemaType) => {
    if (!isBalanced) return

    const formData: JournalEntryFormData = {
      date: data.date,
      type: data.type as JournalEntryType,
      narration: data.narration,
      lines: lines.filter((l) => l.accountId),
      referenceNumber: data.referenceNumber,
      isRecurring: data.isRecurring,
      recurringFrequency: data.isRecurring ? data.recurringFrequency as 'monthly' | 'quarterly' | 'annually' : undefined,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.entryDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">{t('common.date')} *</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label>{t('accounts.entryType')} *</Label>
              <Select value={entryType || ''} onValueChange={(v) => setValue('type', v)}>
                <SelectTrigger><SelectValue placeholder={t('common.selectType')} /></SelectTrigger>
                <SelectContent>
                  {Object.entries(JOURNAL_TYPE_KEYS).map(([k, val]) => (
                    <SelectItem key={k} value={k}>{t(val)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <Label htmlFor="referenceNumber">{t('common.reference')}</Label>
              <Input id="referenceNumber" {...register('referenceNumber')} placeholder={t('common.optionalReference')} />
            </div>
          </div>
          <div>
            <Label htmlFor="narration">{t('accounts.narration')} *</Label>
            <Textarea id="narration" {...register('narration')} placeholder={t('accounts.narrationPlaceholder')} rows={2} />
            {errors.narration && <p className="text-sm text-destructive mt-1">{errors.narration.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Journal Lines */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('accounts.journalLines')}</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4 me-1" /> {t('accounts.addLine')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px]">{t('accounts.account')}</TableHead>
                  <TableHead>{t('common.description')}</TableHead>
                  <TableHead className="w-[140px] text-end">{t('accounts.debitAED')}</TableHead>
                  <TableHead className="w-[140px] text-end">{t('accounts.creditAED')}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Select value={line.accountId} onValueChange={(v) => updateLine(idx, 'accountId', v)}>
                        <SelectTrigger className="w-full"><SelectValue placeholder={t('accounts.selectAccount')} /></SelectTrigger>
                        <SelectContent>
                          {accounts.map((a) => (
                            <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={line.description || ''}
                        onChange={(e) => updateLine(idx, 'description', e.target.value)}
                        placeholder={t('accounts.lineDescription')}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.debit || ''}
                        onChange={(e) => updateLine(idx, 'debit', parseFloat(e.target.value) || 0)}
                        className="text-end"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.credit || ''}
                        onChange={(e) => updateLine(idx, 'credit', parseFloat(e.target.value) || 0)}
                        className="text-end"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeLine(idx)}
                        disabled={lines.length <= 2}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={2} className="text-end">{t('accounts.totals')}</TableCell>
                  <TableCell className="text-end">{formatAmount(totalDebit)}</TableCell>
                  <TableCell className="text-end">{formatAmount(totalCredit)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Lines */}
          <div className="md:hidden space-y-4">
            {lines.map((line, idx) => (
              <Card key={idx}>
                <CardContent className="pt-3 pb-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t('accounts.line')} {idx + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeLine(idx)} disabled={lines.length <= 2}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select value={line.accountId} onValueChange={(v) => updateLine(idx, 'accountId', v)}>
                    <SelectTrigger><SelectValue placeholder={t('accounts.selectAccount')} /></SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={line.description || ''}
                    onChange={(e) => updateLine(idx, 'description', e.target.value)}
                    placeholder={t('common.description')}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">{t('accounts.debit')}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.debit || ''}
                        onChange={(e) => updateLine(idx, 'debit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t('accounts.credit')}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.credit || ''}
                        onChange={(e) => updateLine(idx, 'credit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Balance Check */}
          <div className={cn(
            'mt-4 p-4 rounded-lg flex items-center gap-3',
            isBalanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          )}>
            {isBalanced ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{t('accounts.entryBalanced')}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">
                  {t('accounts.entryUnbalanced')}. {t('common.difference')}: {formatAmount(Math.abs(difference))}
                  {difference > 0 ? ` (${t('accounts.debitExceedsCredit')})` : ` (${t('accounts.creditExceedsDebit')})`}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('accounts.recurringEntry')}</Label>
              <p className="text-sm text-muted-foreground">{t('accounts.entryRepeats')}</p>
            </div>
            <Switch checked={isRecurring} onCheckedChange={(v) => setValue('isRecurring', v)} />
          </div>
          {isRecurring && (
            <Select value={watch('recurringFrequency') || ''} onValueChange={(v) => setValue('recurringFrequency', v)}>
              <SelectTrigger><SelectValue placeholder={t('accounts.selectFrequency')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t('accounts.monthly')}</SelectItem>
                <SelectItem value="quarterly">{t('accounts.quarterly')}</SelectItem>
                <SelectItem value="annually">{t('accounts.annually')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={isLoading || !isBalanced}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {entry ? t('accounts.updateEntry') : t('accounts.createEntry')}
        </Button>
      </div>
    </form>
  )
}

export default JournalEntryForm
