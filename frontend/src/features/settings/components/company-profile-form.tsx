/**
 * Company Profile Settings Form
 * Phase 13: Settings Module
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, Save, MapPin, Landmark, Receipt } from 'lucide-react'
import { UAE_EMIRATES } from '@/lib/constants'
import type { CompanyProfile, CompanyProfileFormData } from '../types/settings.types'

interface CompanyProfileFormProps {
  profile: CompanyProfile | undefined
  isLoading: boolean
  onSave: (data: CompanyProfileFormData) => void
  isSaving: boolean
}

export function CompanyProfileForm({ profile, isLoading, onSave, isSaving }: CompanyProfileFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({})

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const updateField = (path: string, value: string | number) => {
    setFormData(prev => {
      const keys = path.split('.')
      const updated = { ...prev }
      let current: Record<string, unknown> = updated as Record<string, unknown>
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown> || {}) }
        current = current[keys[i]] as Record<string, unknown>
      }
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as CompanyProfileFormData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />
            {t('settings.companyInformation')}
          </CardTitle>
          <CardDescription>{t('settings.companyInformationDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.companyNameEn')} *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder={t('settings.companyNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">{t('settings.companyNameAr')}</Label>
              <Input
                id="nameAr"
                value={formData.nameAr || ''}
                onChange={(e) => updateField('nameAr', e.target.value)}
                placeholder={t('settings.placeholderCompanyNameAr')}
                dir="rtl"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('common.phone')} *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder={t('settings.placeholderPhone')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">{t('common.website')}</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder={t('settings.placeholderWebsite')}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trn">{t('settings.taxRegistrationNumber')} *</Label>
              <Input
                id="trn"
                value={formData.taxRegistrationNumber || ''}
                onChange={(e) => updateField('taxRegistrationNumber', e.target.value)}
                placeholder={t('settings.placeholderTRN')}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">{t('settings.commercialLicense')}</Label>
              <Input
                id="license"
                value={formData.commercialLicense || ''}
                onChange={(e) => updateField('commercialLicense', e.target.value)}
                placeholder={t('settings.placeholderCommercialLicense')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            {t('settings.businessAddress')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.streetAddress')} *</Label>
              <Input
                value={formData.address?.street || ''}
                onChange={(e) => updateField('address.street', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.area')}</Label>
              <Input
                value={formData.address?.area || ''}
                onChange={(e) => updateField('address.area', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('common.city')} *</Label>
              <Input
                value={formData.address?.city || ''}
                onChange={(e) => updateField('address.city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.emirate')} *</Label>
              <Select
                value={formData.address?.emirate || ''}
                onValueChange={(v) => updateField('address.emirate', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectEmirate')} />
                </SelectTrigger>
                <SelectContent>
                  {UAE_EMIRATES.map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.poBox')}</Label>
              <Input
                value={formData.address?.poBox || ''}
                onChange={(e) => updateField('address.poBox', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Landmark className="h-4 w-4" />
            {t('settings.bankDetails')}
          </CardTitle>
          <CardDescription>{t('settings.bankDetailsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.bankName')} *</Label>
              <Input
                value={formData.bankDetails?.bankName || ''}
                onChange={(e) => updateField('bankDetails.bankName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.accountName')} *</Label>
              <Input
                value={formData.bankDetails?.accountName || ''}
                onChange={(e) => updateField('bankDetails.accountName', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.accountNumber')} *</Label>
              <Input
                value={formData.bankDetails?.accountNumber || ''}
                onChange={(e) => updateField('bankDetails.accountNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.iban')} *</Label>
              <Input
                value={formData.bankDetails?.iban || ''}
                onChange={(e) => updateField('bankDetails.iban', e.target.value)}
                placeholder={t('settings.placeholderIBAN')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.swiftCode')}</Label>
              <Input
                value={formData.bankDetails?.swiftCode || ''}
                onChange={(e) => updateField('bankDetails.swiftCode', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Prefixes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-4 w-4" />
            {t('settings.documentSettings')}
          </CardTitle>
          <CardDescription>{t('settings.documentSettingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.invoicePrefix')}</Label>
              <Input
                value={formData.settings?.invoicePrefix || ''}
                onChange={(e) => updateField('settings.invoicePrefix', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">e.g., INV-2025-0001</p>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.quotationPrefix')}</Label>
              <Input
                value={formData.settings?.quotationPrefix || ''}
                onChange={(e) => updateField('settings.quotationPrefix', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">e.g., QTN-2025-0001</p>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.jobPrefix')}</Label>
              <Input
                value={formData.settings?.jobPrefix || ''}
                onChange={(e) => updateField('settings.jobPrefix', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">e.g., JOB-2025-0001</p>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.poPrefix')}</Label>
              <Input
                value={formData.settings?.poPrefix || ''}
                onChange={(e) => updateField('settings.poPrefix', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">e.g., PO-2025-0001</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.defaultCurrency')}</Label>
              <div className="flex items-center gap-2">
                <Input value={formData.settings?.defaultCurrency || 'AED'} disabled />
                <Badge variant="secondary">UAE</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.vatRate')}</Label>
              <Input
                type="number"
                value={formData.settings?.vatRate ?? 5}
                onChange={(e) => updateField('settings.vatRate', Number(e.target.value))}
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.fiscalYearStart')}</Label>
              <Select
                value={formData.settings?.fiscalYearStart || '01-01'}
                onValueChange={(v) => updateField('settings.fiscalYearStart', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01-01">{t('settings.january1st')}</SelectItem>
                  <SelectItem value="04-01">{t('settings.april1st')}</SelectItem>
                  <SelectItem value="07-01">{t('settings.july1st')}</SelectItem>
                  <SelectItem value="10-01">{t('settings.october1st')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 me-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t('common.saveChanges')}
        </Button>
      </div>
    </form>
  )
}
