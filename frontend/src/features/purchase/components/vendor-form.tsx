/**
 * Vendor Form Component
 * Phase 8: Purchase Module
 *
 * Create/Edit vendor form with validation
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
import { UAE_EMIRATES } from '@/lib/constants'
import { VENDOR_CATEGORY_KEYS, VENDOR_PAYMENT_TERMS_KEYS } from '../types/vendor.types'
import type { Vendor, VendorFormData, VendorCategory, VendorPaymentTerms } from '../types/vendor.types'

function createVendorSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(3, t('validation.nameMin')),
    email: z.string().email(t('validation.validEmail')),
    phone: z.string().min(10, t('validation.validPhone')),
    contactPerson: z.string().min(1, t('validation.contactPersonRequired')),
    categories: z.array(z.string()).min(1, t('validation.categoryRequired')),
    paymentTerms: z.string().min(1, t('validation.paymentTermsRequired')),
    creditLimit: z.number().min(0, t('validation.creditLimitMin')),
    taxRegistrationNumber: z.string().optional().refine(
      (val) => !val || val.length === 15,
      t('validation.trnLength')
    ),
    address: z.object({
      street: z.string().min(1, t('validation.streetRequired')),
      city: z.string().min(1, t('validation.cityRequired')),
      emirate: z.string().min(1, t('validation.emirateRequired')),
      country: z.string().min(1, t('validation.countryRequired')),
    }),
    bankDetails: z.object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      iban: z.string().optional(),
      swiftCode: z.string().optional(),
    }).optional(),
    notes: z.string().optional(),
  })
}

type VendorSchemaType = z.infer<ReturnType<typeof createVendorSchema>>

interface VendorFormProps {
  vendor?: Vendor
  onSubmit: (data: VendorFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function VendorForm({ vendor, onSubmit, onCancel, isLoading }: VendorFormProps) {
  const { t } = useTranslation()
  const vendorSchema = useMemo(() => createVendorSchema(t), [t])
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VendorSchemaType>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: vendor?.name || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      contactPerson: vendor?.contactPerson || '',
      categories: vendor?.categories || [],
      paymentTerms: vendor?.paymentTerms || 'net-30',
      creditLimit: vendor?.creditLimit || 0,
      taxRegistrationNumber: vendor?.taxRegistrationNumber || '',
      address: {
        street: vendor?.address.street || '',
        city: vendor?.address.city || '',
        emirate: vendor?.address.emirate || '',
        country: vendor?.address.country || 'UAE',
      },
      bankDetails: {
        bankName: vendor?.bankDetails?.bankName || '',
        accountNumber: vendor?.bankDetails?.accountNumber || '',
        iban: vendor?.bankDetails?.iban || '',
        swiftCode: vendor?.bankDetails?.swiftCode || '',
      },
      notes: vendor?.notes || '',
    },
  })

  const selectedCategory = watch('categories')?.[0] || ''
  const paymentTerms = watch('paymentTerms')
  const emirate = watch('address.emirate')

  const handleFormSubmit = (data: VendorSchemaType) => {
    const formData: VendorFormData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      contactPerson: data.contactPerson,
      taxRegistrationNumber: data.taxRegistrationNumber,
      categories: data.categories as VendorCategory[],
      paymentTerms: data.paymentTerms as VendorPaymentTerms,
      creditLimit: data.creditLimit,
      address: data.address,
      contacts: vendor?.contacts?.map(({ id: _id, ...rest }) => rest) || [],
      bankDetails: data.bankDetails && (data.bankDetails.bankName || data.bankDetails.iban)
        ? {
            bankName: data.bankDetails.bankName || '',
            accountNumber: data.bankDetails.accountNumber || '',
            iban: data.bankDetails.iban || '',
            swiftCode: data.bankDetails.swiftCode,
          }
        : undefined,
      notes: data.notes,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.basicInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('purchase.vendorName')} *</Label>
              <Input id="name" {...register('name')} placeholder={t('purchase.enterVendorName')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">{t('purchase.category')} *</Label>
              <Select
                value={selectedCategory}
                onValueChange={(val) => setValue('categories', [val as VendorCategory])}
              >
                <SelectTrigger><SelectValue placeholder={t('purchase.selectCategory')} /></SelectTrigger>
                <SelectContent>
                  {Object.entries(VENDOR_CATEGORY_KEYS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categories && <p className="text-sm text-destructive mt-1">{errors.categories.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">{t('common.email')} *</Label>
              <Input id="email" type="email" {...register('email')} placeholder={t('purchase.placeholderVendorEmail')} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">{t('common.phone')} *</Label>
              <Input id="phone" {...register('phone')} placeholder={t('purchase.placeholderPhone')} />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">{t('purchase.contactPerson')} *</Label>
              <Input id="contactPerson" {...register('contactPerson')} placeholder={t('purchase.primaryContactName')} />
              {errors.contactPerson && <p className="text-sm text-destructive mt-1">{errors.contactPerson.message}</p>}
            </div>
            <div>
              <Label htmlFor="trn">{t('purchase.taxRegistrationNumber')}</Label>
              <Input id="trn" {...register('taxRegistrationNumber')} placeholder={t('purchase.placeholderTRN')} maxLength={15} />
              {errors.taxRegistrationNumber && <p className="text-sm text-destructive mt-1">{errors.taxRegistrationNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentTerms">{t('purchase.paymentTerms')} *</Label>
              <Select value={paymentTerms} onValueChange={(val) => setValue('paymentTerms', val as VendorPaymentTerms)}>
                <SelectTrigger><SelectValue placeholder={t('purchase.selectPaymentTerms')} /></SelectTrigger>
                <SelectContent>
                  {Object.entries(VENDOR_PAYMENT_TERMS_KEYS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{t(val)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="creditLimit">{t('purchase.creditLimitAED')} *</Label>
              <Input
                id="creditLimit"
                type="number"
                min="0"
                step="1000"
                {...register('creditLimit', { valueAsNumber: true })}
                placeholder={t('purchase.placeholderCreditLimit')}
              />
              {errors.creditLimit && <p className="text-sm text-destructive mt-1">{errors.creditLimit.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('common.address')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">{t('common.streetAddress')} *</Label>
            <Input id="street" {...register('address.street')} placeholder={t('purchase.placeholderStreetAddress')} />
            {errors.address?.street && <p className="text-sm text-destructive mt-1">{errors.address.street.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">{t('common.city')} *</Label>
              <Input id="city" {...register('address.city')} placeholder={t('purchase.placeholderCity')} />
              {errors.address?.city && <p className="text-sm text-destructive mt-1">{errors.address.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="emirate">{t('common.emirate')} *</Label>
              <Select value={emirate} onValueChange={(val) => setValue('address.emirate', val)}>
                <SelectTrigger><SelectValue placeholder={t('common.selectEmirate')} /></SelectTrigger>
                <SelectContent>
                  {UAE_EMIRATES.map((em) => (
                    <SelectItem key={em} value={em}>{em}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.address?.emirate && <p className="text-sm text-destructive mt-1">{errors.address.emirate.message}</p>}
            </div>
            <div>
              <Label htmlFor="country">{t('common.country')} *</Label>
              <Input id="country" {...register('address.country')} placeholder={t('purchase.placeholderCountry')} />
              {errors.address?.country && <p className="text-sm text-destructive mt-1">{errors.address.country.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('purchase.bankDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankName">{t('purchase.bankName')}</Label>
              <Input id="bankName" {...register('bankDetails.bankName')} placeholder={t('purchase.placeholderBankName')} />
            </div>
            <div>
              <Label htmlFor="accountNumber">{t('purchase.accountNumber')}</Label>
              <Input id="accountNumber" {...register('bankDetails.accountNumber')} placeholder={t('purchase.placeholderAccountNumber')} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="iban">{t('purchase.iban')}</Label>
              <Input id="iban" {...register('bankDetails.iban')} placeholder={t('purchase.placeholderIBAN')} />
            </div>
            <div>
              <Label htmlFor="swiftCode">{t('purchase.swiftCode')}</Label>
              <Input id="swiftCode" {...register('bankDetails.swiftCode')} placeholder={t('purchase.placeholderSwiftCode')} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('common.notes')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register('notes')} placeholder={t('purchase.placeholderNotes')} rows={3} />
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {vendor ? t('purchase.updateVendor') : t('purchase.createVendor')}
        </Button>
      </div>
    </form>
  )
}

export default VendorForm
