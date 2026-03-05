/**
 * Account Form Component
 * Phase 9: Accounts/Finance Module
 *
 * Create/Edit account in chart of accounts
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
import {
  ACCOUNT_TYPE_CONFIG,
  ACCOUNT_TYPE_CATEGORIES,
  ACCOUNT_CATEGORY_KEYS,
} from '../types/chart-of-accounts.types'
import type {
  Account,
  AccountFormData,
  AccountType,
  AccountCategory,
  AccountStatus,
} from '../types/chart-of-accounts.types'

function createAccountSchema(t: (key: string) => string) {
  return z.object({
    code: z.string().min(4, t('validation.accountCodeMin')).max(10, t('validation.accountCodeMax')),
    name: z.string().min(3, t('validation.nameMin')),
    type: z.string().min(1, t('validation.accountTypeRequired')),
    category: z.string().min(1, t('validation.categoryRequired')),
    parentId: z.string().nullable(),
    description: z.string().optional(),
    status: z.string().min(1, t('validation.statusRequired')),
  })
}

type AccountSchemaType = z.infer<ReturnType<typeof createAccountSchema>>

interface AccountFormProps {
  account?: Account
  parentAccount?: Account | null
  onSubmit: (data: AccountFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AccountForm({ account, parentAccount, onSubmit, onCancel, isLoading }: AccountFormProps) {
  const { t } = useTranslation()
  const accountSchema = useMemo(() => createAccountSchema(t), [t])
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: account?.code || '',
      name: account?.name || '',
      type: account?.type || parentAccount?.type || '',
      category: account?.category || '',
      parentId: account?.parentId || parentAccount?.id || null,
      description: account?.description || '',
      status: account?.status || 'active',
    },
  })

  const selectedType = watch('type') as AccountType
  const selectedCategory = watch('category')
  const status = watch('status')

  const availableCategories = selectedType ? ACCOUNT_TYPE_CATEGORIES[selectedType] || [] : []

  const handleFormSubmit = (data: AccountSchemaType) => {
    const formData: AccountFormData = {
      code: data.code,
      name: data.name,
      type: data.type as AccountType,
      category: data.category as AccountCategory,
      parentId: data.parentId || null,
      description: data.description,
      status: data.status as AccountStatus,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{t('accounts.accountName')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parentAccount && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{t('common.parentAccount')}</p>
              <p className="font-medium">{parentAccount.code} - {parentAccount.name}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">{t('accounts.accountCode')} *</Label>
              <Input id="code" {...register('code')} placeholder={t('accounts.placeholderAccountCode')} />
              {errors.code && <p className="text-sm text-destructive mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <Label htmlFor="name">{t('accounts.accountName')} *</Label>
              <Input id="name" {...register('name')} placeholder={t('accounts.placeholderAccountName')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('accounts.accountType')} *</Label>
              <Select
                value={selectedType || ''}
                onValueChange={(val) => {
                  setValue('type', val)
                  setValue('category', '')
                }}
                disabled={!!parentAccount}
              >
                <SelectTrigger><SelectValue placeholder={t('accounts.selectType')} /></SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_TYPE_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>
                      {t(cfg.key)} ({cfg.range})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <Label>{t('accounts.selectCategory')} *</Label>
              <Select
                value={selectedCategory || ''}
                onValueChange={(val) => setValue('category', val)}
                disabled={!selectedType}
              >
                <SelectTrigger><SelectValue placeholder={t('accounts.selectCategory')} /></SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(ACCOUNT_CATEGORY_KEYS[cat])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t('common.status')} *</Label>
              <Select value={status || 'active'} onValueChange={(val) => setValue('status', val)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t('accounts.accountDescription')}</Label>
            <Textarea id="description" {...register('description')} placeholder={t('common.optionalDescription')} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="me-2" />}
          {account ? t('accounts.updateAccount') : t('accounts.createAccount')}
        </Button>
      </div>
    </form>
  )
}

export default AccountForm
