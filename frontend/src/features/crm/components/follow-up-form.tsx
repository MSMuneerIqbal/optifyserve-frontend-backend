/**
 * Follow-up Form Component
 * Phase 5: CRM Module - Lead Management
 *
 * Form for scheduling follow-ups
 */

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2, Phone, Mail, Video, MessageCircle, MapPin } from 'lucide-react'
import type { FollowUpFormData, FollowUpType } from '../types/lead.types'

type FollowUpFormValues = z.infer<ReturnType<typeof createFollowUpSchema>>

function createFollowUpSchema(t: (key: string) => string) {
  return z.object({
    date: z.string().min(1, t('validation.dateRequired')),
    time: z.string().optional(),
    type: z.enum(['call', 'email', 'meeting', 'whatsapp', 'site-visit']),
    notes: z.string().min(1, t('validation.notesRequired')).max(500, t('validation.notesMax500')),
    reminder: z.boolean().default(false),
    reminderDate: z.string().optional(),
  })
}

interface FollowUpFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FollowUpFormData) => void
  isLoading?: boolean
}

// Follow-up type options
const followUpTypes: { value: FollowUpType; label: string; icon: typeof Phone }[] = [
  { value: 'call', label: 'call', icon: Phone },
  { value: 'email', label: 'email', icon: Mail },
  { value: 'meeting', label: 'meeting', icon: Video },
  { value: 'whatsapp', label: 'whatsapp', icon: MessageCircle },
  { value: 'site-visit', label: 'siteVisit', icon: MapPin },
]

export function FollowUpForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: FollowUpFormProps) {
  const { t } = useTranslation()
  const followUpSchema = useMemo(() => createFollowUpSchema(t), [t])

  const form = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema) as Resolver<FollowUpFormValues>,
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'call',
      notes: '',
      reminder: false,
      reminderDate: '',
    },
  })

  const hasReminder = form.watch('reminder')

  const handleSubmit = (values: FollowUpFormValues) => {
    const formData: FollowUpFormData = {
      date: values.date,
      time: values.time || undefined,
      type: values.type,
      notes: values.notes,
      reminder: values.reminder,
      reminderDate: values.reminderDate || undefined,
    }
    onSubmit(formData)
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('crm.scheduleFollowUp')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Follow-up Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crm.type')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-5 gap-2"
                    >
                      {followUpTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <div key={type.value}>
                            <RadioGroupItem
                              value={type.value}
                              id={type.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={type.value}
                              className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Icon className="h-4 w-4 mb-1" />
                              <span className="text-[10px]">{t(`crm.${type.label}`)}</span>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('crm.date')} *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('crm.time')}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crm.notes')} *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('crm.followUpNotesPlaceholder')}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reminder Toggle */}
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>{t('crm.setReminder')}</FormLabel>
                    <FormDescription className="text-xs">
                      {t('crm.reminderDescription')}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Reminder Date */}
            {hasReminder && (
              <FormField
                control={form.control}
                name="reminderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('crm.reminderDate')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {t('crm.schedule')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FollowUpForm
