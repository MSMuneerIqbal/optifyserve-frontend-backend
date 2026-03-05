/**
 * Job Form Component
 * Phase 11: Jobs/Service Management Module
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader2, MapPin } from 'lucide-react'
import { SERVICE_TYPE_CONFIG, EMIRATE_KEYS } from '../types/job.types'
import type { JobFormData, Emirate } from '../types/job.types'

function createJobSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(3, t('validation.titleMin3')),
    description: z.string().min(5, t('validation.descriptionMin5')),
    customerId: z.string().min(1, t('validation.customerRequired')),
    serviceType: z.string().min(1, t('validation.serviceTypeRequired')),
    priority: z.string().min(1, t('validation.priorityRequired')),
    scheduledDate: z.string().min(1, t('validation.dateRequired')),
    scheduledTime: z.string().min(1, t('validation.timeRequired')),
    estimatedDuration: z.coerce.number().min(15, t('validation.durationMin15')),
    branchId: z.string().min(1, t('validation.branchRequired')),
    building: z.string().min(1, t('validation.buildingRequired')),
    street: z.string().min(1, t('validation.streetRequired')),
    area: z.string().min(1, t('validation.areaRequired')),
    emirate: z.string().min(1, t('validation.emirateRequired')),
    poBox: z.string().optional(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    isRecurring: z.boolean(),
    recurringFrequency: z.string().optional(),
    internalNotes: z.string().optional(),
    customerNotes: z.string().optional(),
  })
}

type JobFormValues = z.infer<ReturnType<typeof createJobSchema>>

interface JobFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JobFormData) => void
  isLoading: boolean
  job?: Partial<JobFormData>
  customers?: { id: string; name: string }[]
  branches?: { id: string; name: string }[]
}

export function JobForm({ isOpen, onClose, onSubmit, isLoading, job, customers = [], branches = [] }: JobFormProps) {
  const { t } = useTranslation()
  const jobSchema = useMemo(() => createJobSchema(t), [t])
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema) as unknown as import('react-hook-form').Resolver<JobFormValues>,
    defaultValues: {
      title: job?.title || '',
      description: job?.description || '',
      customerId: job?.customerId || '',
      serviceType: job?.serviceType || '',
      priority: job?.priority || 'medium',
      scheduledDate: job?.scheduledDate || '',
      scheduledTime: job?.scheduledTime || '09:00',
      estimatedDuration: job?.estimatedDuration || 60,
      branchId: job?.branchId || '',
      building: job?.serviceAddress?.building || '',
      street: job?.serviceAddress?.street || '',
      area: job?.serviceAddress?.area || '',
      emirate: job?.serviceAddress?.emirate || 'dubai',
      poBox: job?.serviceAddress?.poBox || '',
      latitude: job?.serviceAddress?.latitude || 25.2048,
      longitude: job?.serviceAddress?.longitude || 55.2708,
      isRecurring: job?.isRecurring || false,
      recurringFrequency: job?.recurringFrequency || '',
      internalNotes: job?.internalNotes || '',
      customerNotes: job?.customerNotes || '',
    },
  })

  const isRecurring = form.watch('isRecurring')

  const handleFormSubmit = (data: JobFormValues) => {
    onSubmit({
      title: data.title,
      description: data.description,
      customerId: data.customerId,
      serviceType: data.serviceType as JobFormData['serviceType'],
      priority: data.priority as JobFormData['priority'],
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      estimatedDuration: data.estimatedDuration,
      branchId: data.branchId,
      serviceAddress: {
        building: data.building,
        street: data.street,
        area: data.area,
        emirate: data.emirate as Emirate,
        poBox: data.poBox,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      isRecurring: data.isRecurring,
      recurringFrequency: data.recurringFrequency as JobFormData['recurringFrequency'],
      internalNotes: data.internalNotes,
      customerNotes: data.customerNotes,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>{job ? t('jobs.editJob') : t('jobs.createNewJob')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-6 pb-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.jobTitle')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.jobTitlePlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.description')} *</FormLabel>
                      <FormControl><Textarea {...field} rows={2} placeholder={t('jobs.describeIssue')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="customerId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.customer')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('jobs.selectCustomer')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="serviceType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.serviceType')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('jobs.selectType')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.entries(SERVICE_TYPE_CONFIG).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{t(val.key)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.priority')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="low">{t('common.low')}</SelectItem>
                          <SelectItem value="medium">{t('common.medium')}</SelectItem>
                          <SelectItem value="high">{t('common.high')}</SelectItem>
                          <SelectItem value="urgent">{t('common.urgent')}</SelectItem>
                          <SelectItem value="emergency">{t('common.emergency')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="branchId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.branch')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('jobs.selectBranch')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Scheduling */}
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground">{t('jobs.schedule')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="scheduledDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.date')} *</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="scheduledTime" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.time')} *</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="estimatedDuration" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.durationMin')} *</FormLabel>
                      <FormControl><Input type="number" {...field} min={15} step={15} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Address */}
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {t('jobs.serviceAddress')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="building" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.buildingVilla')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.buildingPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="street" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.street')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.streetPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="area" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.area')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.areaPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="emirate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.emirate')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.entries(EMIRATE_KEYS).map(([key, labelKey]) => (
                            <SelectItem key={key} value={key}>{t(labelKey)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="latitude" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.latitude')}</FormLabel>
                      <FormControl><Input type="number" step="0.0001" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="longitude" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.longitude')}</FormLabel>
                      <FormControl><Input type="number" step="0.0001" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Recurring */}
                <Separator />
                <div className="flex items-center justify-between">
                  <FormField control={form.control} name="isRecurring" render={({ field }) => (
                    <FormItem className="flex items-center gap-3">
                      <FormLabel>{t('jobs.recurringJob')}</FormLabel>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                </div>
                {isRecurring && (
                  <FormField control={form.control} name="recurringFrequency" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.frequency')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('common.select')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">{t('jobs.weekly')}</SelectItem>
                          <SelectItem value="biweekly">{t('jobs.biWeekly')}</SelectItem>
                          <SelectItem value="monthly">{t('jobs.monthly')}</SelectItem>
                          <SelectItem value="quarterly">{t('jobs.quarterly')}</SelectItem>
                          <SelectItem value="semi_annual">{t('jobs.semiAnnual')}</SelectItem>
                          <SelectItem value="annual">{t('jobs.annual')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                )}

                {/* Notes */}
                <Separator />
                <div className="grid grid-cols-1 gap-4">
                  <FormField control={form.control} name="internalNotes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.internalNotes')}</FormLabel>
                      <FormControl><Textarea {...field} rows={2} placeholder={t('jobs.internalNotesPlaceholder')} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="customerNotes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.customerNotes')}</FormLabel>
                      <FormControl><Textarea {...field} rows={2} placeholder={t('jobs.customerNotesPlaceholder')} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
                {job ? t('jobs.updateJob') : t('jobs.createJob')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default JobForm
