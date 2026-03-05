/**
 * Customer Form Component
 * Phase 4: CRM Module - Customer Management
 *
 * Create/Edit customer form with validation
 */

import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, type Resolver } from 'react-hook-form'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Building2, User, Landmark } from 'lucide-react'
import { UAE_EMIRATES } from '@/lib/constants'
import type { Customer, CustomerFormData, CustomerType } from '../types/customer.types'

type CustomerFormValues = z.infer<ReturnType<typeof createCustomerSchema>>

function createCustomerSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .min(3, t('validation.nameMin'))
      .max(100, t('validation.nameMax')),
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
    company: z.string().optional(),
    customerType: z.enum(['individual', 'corporate', 'government']),
    taxRegistrationNumber: z
      .string()
      .length(15, t('validation.trnLength'))
      .regex(/^\d{15}$/, t('validation.trnDigits'))
      .optional()
      .or(z.literal('')),
    address: z.object({
      street: z.string().min(1, t('validation.streetRequired')),
      city: z.string().min(1, t('validation.cityRequired')),
      emirate: z.string().min(1, t('validation.emirateRequired')),
    }),
    creditLimit: z.coerce.number().min(0).optional(),
    paymentTerms: z.string().optional(),
    notes: z.string().max(500, t('validation.notesMax500')).optional(),
  })
}

interface CustomerFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CustomerFormData) => void
  customer?: Customer | null
  isLoading?: boolean
}

// Customer type options with icons
const customerTypeOptions: { value: CustomerType; label: string; icon: typeof Building2 }[] = [
  { value: 'individual', label: 'Individual', icon: User },
  { value: 'corporate', label: 'Corporate', icon: Building2 },
  { value: 'government', label: 'Government', icon: Landmark },
]

export function CustomerForm({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isLoading,
}: CustomerFormProps) {
  const { t } = useTranslation()
  const isEditing = !!customer
  const customerSchema = useMemo(() => createCustomerSchema(t), [t])

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as Resolver<CustomerFormValues>,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      alternatePhone: '',
      company: '',
      customerType: 'individual',
      taxRegistrationNumber: '',
      address: {
        street: '',
        city: '',
        emirate: '',
      },
      creditLimit: undefined,
      paymentTerms: '',
      notes: '',
    },
  })

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        alternatePhone: customer.alternatePhone || '',
        company: customer.company || '',
        customerType: customer.customerType,
        taxRegistrationNumber: customer.taxRegistrationNumber || '',
        address: {
          street: customer.address.street,
          city: customer.address.city,
          emirate: customer.address.emirate,
        },
        creditLimit: customer.creditLimit,
        paymentTerms: customer.paymentTerms || '',
        notes: customer.notes || '',
      })
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        alternatePhone: '',
        company: '',
        customerType: 'individual',
        taxRegistrationNumber: '',
        address: {
          street: '',
          city: '',
          emirate: '',
        },
        creditLimit: undefined,
        paymentTerms: '',
        notes: '',
      })
    }
  }, [customer, form])

  const customerType = form.watch('customerType')
  const showTRN = customerType === 'corporate' || customerType === 'government'

  const handleSubmit = (values: CustomerFormValues) => {
    const formData: CustomerFormData = {
      ...values,
      alternatePhone: values.alternatePhone || undefined,
      company: values.company || undefined,
      taxRegistrationNumber: values.taxRegistrationNumber || undefined,
      creditLimit: values.creditLimit || undefined,
      paymentTerms: values.paymentTerms || undefined,
      notes: values.notes || undefined,
    }
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>
            {isEditing ? t('crm.editCustomer') : t('crm.addNewCustomer')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
              <div className="space-y-6 pb-6">
                {/* Customer Type */}
                <FormField
                  control={form.control}
                  name="customerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('crm.customerType')} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          {customerTypeOptions.map((option) => {
                            const Icon = option.icon
                            return (
                              <div key={option.value}>
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={option.value}
                                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <Icon className="mb-2 h-6 w-6" />
                                  {t(`crm.${option.value}`)}
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

                <Separator />

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('crm.basicInformation')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {customerType === 'individual' ? t('crm.fullName') : t('crm.companyName')} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                customerType === 'individual'
                                  ? t('crm.fullNamePlaceholder')
                                  : t('crm.companyNamePlaceholder')
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {customerType !== 'individual' && (
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('crm.legalEntityName')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('crm.legalEntityPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.emailAddress')} *</FormLabel>
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
                          <FormLabel>{t('crm.phoneNumber')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('crm.phonePlaceholder')} {...field} />
                          </FormControl>
                          <FormDescription>{t('crm.uaePhoneFormat')}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.alternatePhone')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('crm.alternatePhonePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{t('crm.address')}</h3>

                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('crm.streetAddress')} *</FormLabel>
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
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.city')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('crm.cityPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.emirate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('crm.emirate')} *</FormLabel>
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

                {/* Business Details (for corporate/government) */}
                {showTRN && (
                  <>
                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {t('crm.businessDetails')}
                      </h3>

                      <FormField
                        control={form.control}
                        name="taxRegistrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('crm.trn')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('crm.trnPlaceholder')}
                                maxLength={15}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('crm.trnDescription')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="creditLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('crm.creditLimit')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={t('crm.creditLimitPlaceholder')}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value ? Number(e.target.value) : undefined
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentTerms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('crm.paymentTerms')}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('crm.selectTerms')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="due-on-receipt">
                                    {t('crm.dueOnReceipt')}
                                  </SelectItem>
                                  <SelectItem value="net-15">{t('crm.net15')}</SelectItem>
                                  <SelectItem value="net-30">{t('crm.net30')}</SelectItem>
                                  <SelectItem value="net-60">{t('crm.net60')}</SelectItem>
                                  <SelectItem value="advance">{t('crm.advancePayment')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

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
                          placeholder={t('crm.notesPlaceholder')}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="px-6 py-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {isEditing ? t('crm.updateCustomer') : t('crm.createCustomer')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerForm
