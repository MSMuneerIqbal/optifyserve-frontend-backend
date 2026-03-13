/**
 * Leave Application Form Component
 * Phase 10: HR Module
 *
 * Dialog form for employees to apply for leave.
 * Shows available balance for the selected leave type and
 * calculates total days based on selected dates and duration.
 */

import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
// Badge available for balance display
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2, CalendarDays, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LeaveBalance, LeaveApplicationFormData, LeaveDuration } from '../types/leave.types'

// ---------------------------------------------------------------------------
// Zod Schema
// ---------------------------------------------------------------------------

function createLeaveApplicationSchema(t: (key: string) => string) {
  return z
    .object({
      leaveTypeId: z.string().min(1, t('validation.leaveTypeRequired')),
      startDate: z.string().min(1, t('validation.startDateRequired')),
      endDate: z.string().min(1, t('validation.endDateRequired')),
      duration: z.enum(['full-day', 'half-day-morning', 'half-day-afternoon']),
      reason: z.string().min(10, t('validation.reasonMin10')),
      attachmentUrl: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true
        return new Date(data.endDate) >= new Date(data.startDate)
      },
      {
        message: t('validation.endDateAfterStart'),
        path: ['endDate'],
      }
    )
}

type LeaveApplicationFormValues = z.infer<ReturnType<typeof createLeaveApplicationSchema>>

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calcTotalDays(
  startDate: string,
  endDate: string,
  duration: LeaveDuration
): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (end < start) return 0

  // Count business days between start and end (inclusive)
  let days = 0
  const current = new Date(start)
  while (current <= end) {
    const dow = current.getDay()
    if (dow !== 0 && dow !== 6) days++
    current.setDate(current.getDate() + 1)
  }

  // Half-day cases: only subtract 0.5 if single day
  if (duration !== 'full-day' && days === 1) return 0.5
  return days
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LeaveApplicationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LeaveApplicationFormData) => void
  isLoading: boolean
  leaveBalances: LeaveBalance[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeaveApplicationForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  leaveBalances,
}: LeaveApplicationFormProps) {
  const { t } = useTranslation()
  const leaveApplicationSchema = useMemo(() => createLeaveApplicationSchema(t), [t])
  const today = new Date().toISOString().split('T')[0]

  const form = useForm<LeaveApplicationFormValues>({
    resolver: zodResolver(leaveApplicationSchema) as unknown as import('react-hook-form').Resolver<LeaveApplicationFormValues>,
    defaultValues: {
      leaveTypeId: '',
      startDate: today,
      endDate: today,
      duration: 'full-day',
      reason: '',
      attachmentUrl: '',
    },
  })

  // Reset when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        leaveTypeId: '',
        startDate: today,
        endDate: today,
        duration: 'full-day',
        reason: '',
        attachmentUrl: '',
      })
    }
  }, [isOpen, form, today])

  const watchedLeaveTypeId = form.watch('leaveTypeId')
  const watchedStartDate = form.watch('startDate')
  const watchedEndDate = form.watch('endDate')
  const watchedDuration = form.watch('duration')

  const selectedBalance = useMemo(
    () => leaveBalances.find((b) => b.leaveTypeId === watchedLeaveTypeId) ?? null,
    [leaveBalances, watchedLeaveTypeId]
  )

  const totalDays = useMemo(
    () => calcTotalDays(watchedStartDate, watchedEndDate, watchedDuration),
    [watchedStartDate, watchedEndDate, watchedDuration]
  )

  const handleSubmit = (values: LeaveApplicationFormValues) => {
    onSubmit({
      leaveTypeId: values.leaveTypeId as LeaveApplicationFormData['leaveTypeId'],
      startDate: values.startDate,
      endDate: values.endDate,
      duration: values.duration as LeaveDuration,
      reason: values.reason,
      attachmentUrl: values.attachmentUrl || undefined,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            {t('hr.applyForLeave')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Leave Type */}
            <FormField
              control={form.control}
              name="leaveTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('hr.leaveType')} *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('hr.selectLeaveType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveBalances.map((b) => (
                        <SelectItem key={b.leaveTypeId} value={b.leaveTypeId}>
                          {b.leaveTypeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Balance Info */}
            {selectedBalance && (
              <div
                className={cn(
                  'flex items-start gap-2 p-3 rounded-md text-sm border',
                  selectedBalance.balance > 0
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                )}
              >
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{selectedBalance.leaveTypeName} {t('hr.balance')}</p>
                  <p className="text-xs mt-0.5">
                    {t('hr.entitled')}: <strong>{selectedBalance.entitled}</strong> {t('hr.days')} &nbsp;|&nbsp;
                    {t('hr.taken')}: <strong>{selectedBalance.taken}</strong> {t('hr.days')} &nbsp;|&nbsp;
                    {t('hr.balance')}:{' '}
                    <strong
                      className={
                        selectedBalance.balance > 0 ? 'text-green-700' : 'text-red-700'
                      }
                    >
                      {selectedBalance.balance} {t('hr.days')}
                    </strong>
                  </p>
                  {selectedBalance.pending > 0 && (
                    <p className="text-xs mt-0.5 text-amber-700">
                      {selectedBalance.pending} {t('hr.daysPendingApproval')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('hr.startDate')} *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} min={today} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('hr.endDate')} *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} min={watchedStartDate || today} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('hr.duration')} *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4 mt-1"
                    >
                      {(
                        [
                          { value: 'full-day', label: t('hr.fullDay') },
                          { value: 'half-day-morning', label: t('hr.halfDayMorning') },
                          { value: 'half-day-afternoon', label: t('hr.halfDayAfternoon') },
                        ] as { value: LeaveDuration; label: string }[]
                      ).map((opt) => (
                        <div key={opt.value} className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <Label htmlFor={opt.value} className="cursor-pointer font-normal">
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Days Display */}
            {totalDays > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary">
                  {t('hr.totalLeaveDays')}:{' '}
                  <strong>{totalDays} {totalDays === 1 ? t('hr.day') : t('hr.days')}</strong>
                  {selectedBalance && totalDays > selectedBalance.balance && (
                    <span className="ms-2 text-red-600 font-medium">
                      ({t('hr.exceedsBalance')})
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('hr.reason')} *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('hr.leaveReasonPlaceholder')}
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span
                      className={cn(
                        'text-xs text-muted-foreground ms-auto',
                        field.value.length < 10 && 'text-red-500'
                      )}
                    >
                      {field.value.length} / 10 min
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {t('hr.submitApplication')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveApplicationForm
