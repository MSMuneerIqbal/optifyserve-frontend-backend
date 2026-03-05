/**
 * Technician Form Component
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { SERVICE_TYPE_CONFIG } from '../types/job.types'
import type { TechnicianFormData } from '../types/technician.types'

function createTechnicianSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(3, t('validation.nameMin')),
    employeeId: z.string().min(1, t('validation.employeeIdRequired')),
    phone: z.string().min(9, t('validation.validPhone')),
    email: z.string().email(t('validation.validEmail')),
    branchId: z.string().min(1, t('validation.branchRequired')),
    primarySkill: z.string().min(1, t('validation.primarySkillRequired')),
    startTime: z.string().min(1, t('validation.startTimeRequired')),
    endTime: z.string().min(1, t('validation.endTimeRequired')),
    vehiclePlateNumber: z.string().optional(),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
  })
}

type TechnicianFormValues = z.infer<ReturnType<typeof createTechnicianSchema>>

interface TechnicianFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TechnicianFormData) => void
  isLoading: boolean
  technician?: Partial<TechnicianFormData>
}

export function TechnicianForm({ isOpen, onClose, onSubmit, isLoading, technician }: TechnicianFormProps) {
  const { t } = useTranslation()
  const technicianSchema = useMemo(() => createTechnicianSchema(t), [t])
  const form = useForm<TechnicianFormValues>({
    resolver: zodResolver(technicianSchema) as unknown as import('react-hook-form').Resolver<TechnicianFormValues>,
    defaultValues: {
      name: technician?.name || '',
      employeeId: technician?.employeeId || '',
      phone: technician?.phone || '',
      email: technician?.email || '',
      branchId: technician?.branchId || '',
      primarySkill: technician?.primarySkill || '',
      startTime: technician?.startTime || '08:00',
      endTime: technician?.endTime || '18:00',
      vehiclePlateNumber: technician?.vehiclePlateNumber || '',
      vehicleMake: technician?.vehicleMake || '',
      vehicleModel: technician?.vehicleModel || '',
    },
  })

  const handleFormSubmit = (data: TechnicianFormValues) => {
    onSubmit({
      name: data.name,
      employeeId: data.employeeId,
      phone: data.phone,
      email: data.email,
      branchId: data.branchId,
      skills: [],
      primarySkill: data.primarySkill as TechnicianFormData['primarySkill'],
      workingDays: [0, 1, 2, 3, 4, 5],
      startTime: data.startTime,
      endTime: data.endTime,
      vehiclePlateNumber: data.vehiclePlateNumber,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>{technician ? t('jobs.editTechnician') : t('jobs.addTechnician')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-6 pb-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.fullName')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.fullNamePlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="employeeId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.employeeId')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.employeeIdPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.phone')} *</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.phonePlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.email')} *</FormLabel>
                      <FormControl><Input type="email" {...field} placeholder={t('jobs.emailPlaceholder')} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Professional */}
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground">{t('jobs.professionalDetails')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="branchId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.branch')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('jobs.selectBranch')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="br_001">{t('jobs.dubaiMainBranch')}</SelectItem>
                          <SelectItem value="br_002">{t('jobs.abuDhabiBranch')}</SelectItem>
                          <SelectItem value="br_003">{t('jobs.sharjahBranch')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="primarySkill" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.primarySkill')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('common.select')} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {Object.entries(SERVICE_TYPE_CONFIG).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{t(val.key)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Working Hours */}
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground">{t('jobs.workingHours')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="startTime" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.startTime')} *</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="endTime" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.endTime')} *</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Vehicle */}
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground">{t('jobs.vehicleInfo')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.vehicleMake')}</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.vehicleMakePlaceholder')} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.vehicleModel')}</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.vehicleModelPlaceholder')} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="vehiclePlateNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('jobs.plateNumber')}</FormLabel>
                      <FormControl><Input {...field} placeholder={t('jobs.plateNumberPlaceholder')} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>
            </div>
            <DialogFooter className="px-6 py-4 border-t shrink-0">
              <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
                {technician ? t('common.update') : t('jobs.addTechnician')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default TechnicianForm
