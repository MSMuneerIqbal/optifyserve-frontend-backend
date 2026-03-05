/**
 * Lead Form Component
 * Phase 5: CRM Module - Lead Management
 *
 * Create/Edit lead form with validation
 */

import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Using custom buttons instead of RadioGroup to prevent scroll issues
import { Separator } from '@/components/ui/separator'
// Removed ScrollArea - using native overflow
import { Slider } from '@/components/ui/slider'
import {
  Loader2,
  Globe,
  Users,
  PhoneCall,
  Presentation,
  MessageCircle,
  Share2,
  Mail,
  AlertCircle,
  AlertTriangle,
  Gauge,
  Zap,
} from 'lucide-react'
import { UAE_EMIRATES } from '@/lib/constants'
import type { Lead, LeadFormData, LeadSource, LeadPriority } from '../types/lead.types'

type LeadFormValues = z.infer<ReturnType<typeof createLeadSchema>>

function createLeadSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .min(3, t('validation.nameMin'))
      .max(100, t('validation.nameMax')),
    company: z.string().optional(),
    email: z.string().email(t('validation.validEmail')),
    phone: z
      .string()
      .regex(
        /^(\+971|00971|0)?[0-9]{9}$/,
        t('validation.validPhone')
      ),
    alternatePhone: z
      .string()
      .regex(/^(\+971|00971|0)?[0-9]{9}$/, t('validation.validPhone'))
      .optional()
      .or(z.literal('')),
    source: z.enum([
      'website',
      'referral',
      'cold-call',
      'exhibition',
      'whatsapp',
      'social-media',
      'email-campaign',
    ]),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    estimatedValueMin: z.coerce.number().min(0, t('validation.positiveAmount')),
    estimatedValueMax: z.coerce.number().min(0, t('validation.positiveAmount')),
    expectedCloseDate: z.string().optional(),
    probability: z.number().min(0).max(100).optional(),
    notes: z.string().max(1000, t('validation.notesMax1000')).optional(),
    addressStreet: z.string().optional(),
    addressCity: z.string().optional(),
    addressEmirate: z.string().optional(),
  })
}

interface LeadFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LeadFormData) => void
  lead?: Lead | null
  isLoading?: boolean
}

// Source options with icons (labels resolved via t() in component)
const sourceOptionsDef: { value: LeadSource; labelKey: string; icon: typeof Globe }[] = [
  { value: 'website', labelKey: 'status.website', icon: Globe },
  { value: 'referral', labelKey: 'status.referral', icon: Users },
  { value: 'cold-call', labelKey: 'status.coldCall', icon: PhoneCall },
  { value: 'exhibition', labelKey: 'status.exhibition', icon: Presentation },
  { value: 'whatsapp', labelKey: 'status.whatsapp', icon: MessageCircle },
  { value: 'social-media', labelKey: 'status.socialMedia', icon: Share2 },
  { value: 'email-campaign', labelKey: 'status.emailCampaign', icon: Mail },
]

// Priority options with icons (labels resolved via t() in component)
const priorityOptionsDef: { value: LeadPriority; labelKey: string; icon: typeof AlertCircle; color: string }[] = [
  { value: 'low', labelKey: 'status.low', icon: Gauge, color: 'text-gray-600' },
  { value: 'medium', labelKey: 'status.medium', icon: AlertCircle, color: 'text-blue-600' },
  { value: 'high', labelKey: 'status.high', icon: AlertTriangle, color: 'text-amber-600' },
  { value: 'urgent', labelKey: 'status.urgent', icon: Zap, color: 'text-red-600' },
]

export function LeadForm({
  isOpen,
  onClose,
  onSubmit,
  lead,
  isLoading,
}: LeadFormProps) {
  const { t } = useTranslation()
  const isEditing = !!lead
  const leadSchema = useMemo(() => createLeadSchema(t), [t])

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema) as Resolver<LeadFormValues>,
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      alternatePhone: '',
      source: 'website',
      priority: 'medium',
      estimatedValueMin: 0,
      estimatedValueMax: 0,
      expectedCloseDate: '',
      probability: 20,
      notes: '',
      addressStreet: '',
      addressCity: '',
      addressEmirate: '',
    },
  })

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        company: lead.company || '',
        email: lead.email,
        phone: lead.phone,
        alternatePhone: lead.alternatePhone || '',
        source: lead.source,
        priority: lead.priority,
        estimatedValueMin: lead.estimatedValue.min,
        estimatedValueMax: lead.estimatedValue.max,
        expectedCloseDate: lead.expectedCloseDate || '',
        probability: lead.probability,
        notes: lead.notes || '',
        addressStreet: lead.address?.street || '',
        addressCity: lead.address?.city || '',
        addressEmirate: lead.address?.emirate || '',
      })
    } else {
      form.reset({
        name: '',
        company: '',
        email: '',
        phone: '',
        alternatePhone: '',
        source: 'website',
        priority: 'medium',
        estimatedValueMin: 0,
        estimatedValueMax: 0,
        expectedCloseDate: '',
        probability: 20,
        notes: '',
        addressStreet: '',
        addressCity: '',
        addressEmirate: '',
      })
    }
  }, [lead, form])

  const probability = form.watch('probability') ?? 20

  const handleSubmit = (values: LeadFormValues) => {
    const formData: LeadFormData = {
      name: values.name,
      company: values.company || undefined,
      email: values.email,
      phone: values.phone,
      alternatePhone: values.alternatePhone || undefined,
      source: values.source,
      priority: values.priority,
      estimatedValue: {
        min: values.estimatedValueMin,
        max: values.estimatedValueMax,
      },
      expectedCloseDate: values.expectedCloseDate || undefined,
      probability: values.probability,
      notes: values.notes || undefined,
      address:
        values.addressStreet || values.addressCity || values.addressEmirate
          ? {
              street: values.addressStreet || undefined,
              city: values.addressCity || undefined,
              emirate: values.addressEmirate || undefined,
            }
          : undefined,
    }
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl !block p-0 overflow-hidden" style={{ maxHeight: '85vh' }}>
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white sticky top-0 z-10">
          <DialogTitle>{isEditing ? t('crm.editLead') : t('crm.addNewLead')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)', minHeight: '400px' }}>
              <div className="space-y-6">
                {/* Source Selection */}
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('crm.leadSource')} *</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {sourceOptionsDef.map((option) => {
                            const Icon = option.icon
                            const isSelected = field.value === option.value
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => field.onChange(option.value)}
                                className={`flex flex-col items-center justify-center rounded-md border-2 p-2 cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground'
                                }`}
                              >
                                <Icon className="mb-1 h-4 w-4" />
                                <span className="text-[10px]">{t(option.labelKey)}</span>
                              </button>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('crm.contactInformation')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.contactName')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('crm.contactNamePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.company')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('crm.companyPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.email')} *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t('crm.emailPlaceholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.phone')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('crm.phonePlaceholder')} {...field} />
                          </FormControl>
                          <FormDescription>{t('crm.uaePhoneFormat')}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('crm.priority')} *</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {priorityOptionsDef.map((option) => {
                            const Icon = option.icon
                            const isSelected = field.value === option.value
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => field.onChange(option.value)}
                                className={`flex flex-col items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-muted bg-popover hover:bg-accent hover:text-accent-foreground'
                                }`}
                              >
                                <Icon className={`mb-1 h-4 w-4 ${option.color}`} />
                                <span className="text-xs">{t(option.labelKey)}</span>
                              </button>
                            )
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Opportunity Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('crm.opportunityDetails')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="estimatedValueMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.minValue')} *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={t('crm.minValuePlaceholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedValueMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.maxValue')} *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={t('crm.maxValuePlaceholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="expectedCloseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.expectedCloseDate')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="probability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.winProbability', { value: probability })}</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value ?? 20]}
                            onValueChange={(values) => field.onChange(values[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="py-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('crm.addressOptional')}
                  </h3>

                  <FormField
                    control={form.control}
                    name="addressStreet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.street')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('crm.streetPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="addressCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.city')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('crm.cityPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressEmirate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.emirate')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('crm.selectEmirate')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {UAE_EMIRATES.map((emirate) => (
                                <SelectItem key={emirate} value={emirate}>
                                  {emirate}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('crm.notes')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('crm.leadNotesPlaceholder')}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2 sticky bottom-0">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('crm.updateLead') : t('crm.createLead')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default LeadForm
