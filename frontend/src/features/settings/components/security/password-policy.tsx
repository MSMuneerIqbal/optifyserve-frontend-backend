import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Save, Lock, KeyRound, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PasswordPolicySettings {
  minLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  expiryDays: string;
  historyCount: string;
  maxLoginAttempts: string;
  lockoutDuration: string;
}

const defaultSettings: PasswordPolicySettings = {
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: false,
  expiryDays: '90',
  historyCount: '5',
  maxLoginAttempts: '5',
  lockoutDuration: '30',
};

export function PasswordPolicy() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PasswordPolicySettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof PasswordPolicySettings>(
    key: K,
    value: PasswordPolicySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success(t('settings.passwordPolicyUpdated'));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>{t('settings.passwordPolicy')}</CardTitle>
        </div>
        <CardDescription>
          {t('settings.passwordPolicyDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Complexity */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            {t('settings.passwordComplexity')}
          </h4>

          {/* Minimum Length */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('settings.minimumPasswordLength')}</Label>
              <span className="text-sm font-semibold text-primary">
                {t('settings.charactersCount', { count: settings.minLength })}
              </span>
            </div>
            <Slider
              value={[settings.minLength]}
              onValueChange={(value) => updateSetting('minLength', value[0])}
              min={8}
              max={16}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>8</span>
              <span>16</span>
            </div>
          </div>

          {/* Require Uppercase */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="font-medium">{t('settings.requireUppercase')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.requireUppercaseDescription')}
              </p>
            </div>
            <Switch
              checked={settings.requireUppercase}
              onCheckedChange={(checked) => updateSetting('requireUppercase', checked)}
            />
          </div>

          {/* Require Numbers */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="font-medium">{t('settings.requireNumbers')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.requireNumbersDescription')}
              </p>
            </div>
            <Switch
              checked={settings.requireNumbers}
              onCheckedChange={(checked) => updateSetting('requireNumbers', checked)}
            />
          </div>

          {/* Require Symbols */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="font-medium">{t('settings.requireSpecialCharacters')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.requireSpecialCharactersDescription')}
              </p>
            </div>
            <Switch
              checked={settings.requireSymbols}
              onCheckedChange={(checked) => updateSetting('requireSymbols', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Password Expiry & History */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('settings.expiryAndHistory')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password Expiry */}
            <div className="space-y-2">
              <Label>{t('settings.passwordExpiry')}</Label>
              <Select
                value={settings.expiryDays}
                onValueChange={(value) => updateSetting('expiryDays', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectExpiryPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">{t('settings.thirtyDays')}</SelectItem>
                  <SelectItem value="60">{t('settings.sixtyDays')}</SelectItem>
                  <SelectItem value="90">{t('settings.ninetyDays')}</SelectItem>
                  <SelectItem value="never">{t('settings.never')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.passwordExpiryDescription')}
              </p>
            </div>

            {/* Password History */}
            <div className="space-y-2">
              <Label>{t('settings.passwordHistoryCount')}</Label>
              <Select
                value={settings.historyCount}
                onValueChange={(value) => updateSetting('historyCount', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectHistoryCount')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">{t('settings.rememberLastPasswords', { count: 3 })}</SelectItem>
                  <SelectItem value="5">{t('settings.rememberLastPasswords', { count: 5 })}</SelectItem>
                  <SelectItem value="10">{t('settings.rememberLastPasswords', { count: 10 })}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.passwordHistoryDescription')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Lockout */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Ban className="h-4 w-4" />
            {t('settings.accountLockout')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Max Login Attempts */}
            <div className="space-y-2">
              <Label>{t('settings.maxLoginAttempts')}</Label>
              <Select
                value={settings.maxLoginAttempts}
                onValueChange={(value) => updateSetting('maxLoginAttempts', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectMaxAttempts')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">{t('settings.attempts', { count: 3 })}</SelectItem>
                  <SelectItem value="5">{t('settings.attempts', { count: 5 })}</SelectItem>
                  <SelectItem value="10">{t('settings.attempts', { count: 10 })}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.maxLoginAttemptsDescription')}
              </p>
            </div>

            {/* Lockout Duration */}
            <div className="space-y-2">
              <Label>{t('settings.lockoutDuration')}</Label>
              <Select
                value={settings.lockoutDuration}
                onValueChange={(value) => updateSetting('lockoutDuration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectLockoutDuration')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">{t('settings.fifteenMinutes')}</SelectItem>
                  <SelectItem value="30">{t('settings.thirtyMinutes')}</SelectItem>
                  <SelectItem value="60">{t('settings.oneHour')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.lockoutDurationDescription')}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="rounded-lg bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">{t('settings.currentPolicyPreview')}</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>{t('settings.previewMinChars', { count: settings.minLength })}</li>
            {settings.requireUppercase && <li>{t('settings.previewMustContainUppercase')}</li>}
            {settings.requireNumbers && <li>{t('settings.previewMustContainNumbers')}</li>}
            {settings.requireSymbols && <li>{t('settings.previewMustContainSpecial')}</li>}
            <li>
              {settings.expiryDays === 'never'
                ? t('settings.previewPasswordNeverExpires')
                : t('settings.previewPasswordExpires', { days: settings.expiryDays })}
            </li>
            <li>{t('settings.previewCannotReuse', { count: Number(settings.historyCount) })}</li>
            <li>
              {t('settings.previewAccountLocks', { attempts: settings.maxLoginAttempts, minutes: settings.lockoutDuration })}
            </li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={cn('gap-2', isSaving && 'opacity-70')}
          >
            <Save className="h-4 w-4" />
            {isSaving ? t('settings.saving') : t('settings.savePolicy')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
