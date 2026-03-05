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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShieldCheck,
  Smartphone,
  MessageSquare,
  KeyRound,
  Info,
  Users,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TwoFactorSettings {
  enabled: boolean;
  enforceForAdmins: boolean;
  authenticatorApp: boolean;
  sms: boolean;
}

const defaultSettings: TwoFactorSettings = {
  enabled: true,
  enforceForAdmins: true,
  authenticatorApp: true,
  sms: false,
};

const mockBackupCodes = [
  'A4K9-M2X7',
  'B8L3-N5Y1',
  'C2P6-Q9Z4',
  'D7R1-S3W8',
  'E5T4-U6V2',
  'F1X8-G3H9',
  'J6K2-L4M7',
  'N9P5-Q1R3',
];

export function TwoFactorAuth() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<TwoFactorSettings>(defaultSettings);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateSetting = <K extends keyof TwoFactorSettings>(
    key: K,
    value: TwoFactorSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success(t('settings.twoFactorSettingsUpdated'));
  };

  const handleGenerateBackupCodes = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    setShowBackupCodes(true);
    toast.success(t('settings.backupCodesGenerated'));
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(mockBackupCodes.join('\n'));
    toast.success(t('settings.backupCodesCopied'));
  };

  return (
    <div className="space-y-6">
      {/* Main 2FA Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle>{t('settings.twoFactorAuthentication')}</CardTitle>
          </div>
          <CardDescription>
            {t('settings.twoFactorDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between rounded-lg border-2 border-primary/10 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  settings.enabled ? 'bg-green-100' : 'bg-slate-100'
                )}
              >
                <ShieldCheck
                  className={cn(
                    'h-5 w-5',
                    settings.enabled ? 'text-green-600' : 'text-slate-400'
                  )}
                />
              </div>
              <div>
                <Label className="text-base font-semibold">
                  {t('settings.enableTwoFactor')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {settings.enabled
                    ? t('settings.twoFactorActive')
                    : t('settings.twoFactorDisabled')}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Enforce for Admins */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="font-medium">{t('settings.enforceForAdmins')}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t('settings.enforceForAdminsDescription')}
                  </p>
                </div>
                <Switch
                  checked={settings.enforceForAdmins}
                  onCheckedChange={(checked) =>
                    updateSetting('enforceForAdmins', checked)
                  }
                />
              </div>

              <Separator />

              {/* Supported Methods */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700">
                  {t('settings.supportedMethods')}
                </h4>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Smartphone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <Label className="font-medium">{t('settings.authenticatorApp')}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t('settings.authenticatorAppDescription')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {t('settings.recommended')}
                    </Badge>
                    <Switch
                      checked={settings.authenticatorApp}
                      onCheckedChange={(checked) =>
                        updateSetting('authenticatorApp', checked)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <MessageSquare className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <Label className="font-medium">{t('settings.smsVerification')}</Label>
                      <p className="text-xs text-muted-foreground">
                        {t('settings.smsVerificationDescription')}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sms}
                    onCheckedChange={(checked) => updateSetting('sms', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* User Status */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium">{t('settings.enrollmentStatus')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.enrollmentStatusDescription')}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-2xl font-bold text-primary">3/8</p>
                  <p className="text-xs text-muted-foreground">{t('settings.usersEnrolled')}</p>
                </div>
              </div>

              <Separator />

              {/* Backup Codes */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  {t('settings.backupCodes')}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t('settings.backupCodesDescription')}
                </p>

                <Button
                  variant="outline"
                  onClick={handleGenerateBackupCodes}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  {isGenerating ? t('settings.generating') : t('settings.generateBackupCodes')}
                </Button>

                {showBackupCodes && (
                  <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">
                        {t('settings.yourBackupCodes')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyBackupCodes}
                        className="gap-1 h-7 text-xs"
                      >
                        <Copy className="h-3 w-3" />
                        {t('settings.copyAll')}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {mockBackupCodes.map((code) => (
                        <code
                          key={code}
                          className="rounded bg-white px-3 py-1.5 text-sm font-mono text-slate-700 border text-center"
                        >
                          {code}
                        </code>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600 font-medium">
                      {t('settings.backupCodesWarning')}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-blue-900">
                {t('settings.whyEnableTwoFactor')}
              </h4>
              <ul className="text-xs text-blue-800 space-y-1 list-disc ps-4">
                <li>
                  {t('settings.twoFactorBenefit1')}
                </li>
                <li>
                  {t('settings.twoFactorBenefit2')}
                </li>
                <li>
                  {t('settings.twoFactorBenefit3')}
                </li>
                <li>
                  {t('settings.twoFactorBenefit4')}
                </li>
                <li>
                  {t('settings.twoFactorBenefit5')}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
