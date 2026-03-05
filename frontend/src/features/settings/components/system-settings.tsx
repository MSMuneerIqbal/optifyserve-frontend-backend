/**
 * System Settings Component
 * Phase 13: Settings Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Loader2, Save, Calculator, Database, HardDrive, Shield, Clock,
} from 'lucide-react'
import type { TaxConfiguration, BackupSettings } from '../types/settings.types'

interface SystemSettingsProps {
  taxConfig: TaxConfiguration | undefined
  backupSettings: BackupSettings | undefined
  isLoading: boolean
  onUpdateTax: (data: Partial<TaxConfiguration>) => void
  isUpdatingTax: boolean
  onUpdateBackup: (data: Partial<BackupSettings>) => void
  isUpdatingBackup: boolean
  onTriggerBackup: () => void
  isBackingUp: boolean
}

export function SystemSettings({
  taxConfig,
  backupSettings,
  isLoading,
  onUpdateTax,
  isUpdatingTax,
  onUpdateBackup,
  isUpdatingBackup,
  onTriggerBackup,
  isBackingUp,
}: SystemSettingsProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleDateString('en-AE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Tax Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4" />
            {t('settings.vatTaxConfiguration')}
            <Badge variant="secondary" className="text-xs">{t('settings.uaeFTA')}</Badge>
          </CardTitle>
          <CardDescription>
            {t('settings.vatTaxConfigurationDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.vatRate')}</Label>
              <Input
                type="number"
                value={taxConfig?.vatRate ?? 5}
                onChange={(e) => onUpdateTax({ vatRate: Number(e.target.value) })}
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.taxRegistrationNumber')}</Label>
              <Input
                value={taxConfig?.trn || ''}
                onChange={(e) => onUpdateTax({ trn: e.target.value })}
                placeholder={t('settings.placeholderTRN')}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.filingFrequency')}</Label>
              <Select
                value={taxConfig?.filingFrequency || 'quarterly'}
                onValueChange={(v) => onUpdateTax({ filingFrequency: v as 'monthly' | 'quarterly' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t('settings.monthly')}</SelectItem>
                  <SelectItem value="quarterly">{t('settings.quarterly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.nextFilingDate')}</Label>
              <Input
                type="date"
                value={taxConfig?.nextFilingDate || ''}
                onChange={(e) => onUpdateTax({ nextFilingDate: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label className="text-sm font-medium">{t('settings.autoCalculateVAT')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.autoCalculateVATDesc')}</p>
              </div>
              <Switch
                checked={taxConfig?.autoCalculateVAT ?? true}
                onCheckedChange={(v) => onUpdateTax({ autoCalculateVAT: v })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label className="text-sm font-medium">{t('settings.vatRegistered')}</Label>
              <p className="text-xs text-muted-foreground">{t('settings.vatRegisteredDesc')}</p>
            </div>
            <Switch
              checked={taxConfig?.vatRegistered ?? true}
              onCheckedChange={(v) => onUpdateTax({ vatRegistered: v })}
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => onUpdateTax(taxConfig || {})} disabled={isUpdatingTax}>
              {isUpdatingTax ? <Loader2 className="h-4 w-4 me-1 animate-spin" /> : <Save className="h-4 w-4 me-1" />}
              {t('settings.saveTaxSettings')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-4 w-4" />
            {t('settings.backupRecovery')}
          </CardTitle>
          <CardDescription>
            {t('settings.backupRecoveryDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label className="text-sm font-medium">{t('settings.automaticBackups')}</Label>
              <p className="text-xs text-muted-foreground">{t('settings.automaticBackupsDesc')}</p>
            </div>
            <Switch
              checked={backupSettings?.autoBackup ?? true}
              onCheckedChange={(v) => onUpdateBackup({ autoBackup: v })}
            />
          </div>
          {backupSettings?.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('settings.backupFrequency')}</Label>
                <Select
                  value={backupSettings?.frequency || 'daily'}
                  onValueChange={(v) => onUpdateBackup({ frequency: v as 'daily' | 'weekly' | 'monthly' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('settings.daily')}</SelectItem>
                    <SelectItem value="weekly">{t('settings.weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('settings.monthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.retentionPeriod')}</Label>
                <Input
                  type="number"
                  value={backupSettings?.retentionDays ?? 30}
                  onChange={(e) => onUpdateBackup({ retentionDays: Number(e.target.value) })}
                  min={7}
                  max={365}
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Backup Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t('settings.lastBackup')}:</span>
                <span className="text-muted-foreground">{formatDate(backupSettings?.lastBackupAt)}</span>
              </div>
              {backupSettings?.lastBackupSize && (
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('common.size')}:</span>
                  <span className="text-muted-foreground">{backupSettings.lastBackupSize}</span>
                </div>
              )}
            </div>
            <Button onClick={onTriggerBackup} disabled={isBackingUp}>
              {isBackingUp ? (
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 me-2" />
              )}
              {isBackingUp ? t('settings.backingUp') : t('settings.backupNow')}
            </Button>
          </div>

          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => onUpdateBackup(backupSettings || {})} disabled={isUpdatingBackup}>
              {isUpdatingBackup && <Loader2 className="h-4 w-4 me-1 animate-spin" />}
              {t('settings.saveBackupSettings')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            {t('settings.securitySettings')}
          </CardTitle>
          <CardDescription>{t('settings.securitySettingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.sessionTimeout')}</Label>
              <Input type="number" defaultValue={30} min={5} max={480} />
              <p className="text-xs text-muted-foreground">{t('settings.sessionTimeoutDesc')}</p>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.maxLoginAttempts')}</Label>
              <Input type="number" defaultValue={5} min={3} max={10} />
              <p className="text-xs text-muted-foreground">{t('settings.maxLoginAttemptsDesc')}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label className="text-sm font-medium">{t('settings.twoFactorAuth')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.twoFactorAuthDesc')}</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label className="text-sm font-medium">{t('settings.passwordPolicy')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.passwordPolicyDesc')}</p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
