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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HardDrive,
  CloudUpload,
  Clock,
  Download,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Save,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BackupSettings {
  autoBackupEnabled: boolean;
  frequency: string;
  retentionDays: string;
}

interface BackupEntry {
  id: string;
  date: string;
  size: string;
  status: 'completed' | 'failed' | 'in-progress';
  type: 'auto' | 'manual';
}

const defaultSettings: BackupSettings = {
  autoBackupEnabled: true,
  frequency: 'daily',
  retentionDays: '30',
};

const mockBackupHistory: BackupEntry[] = [
  {
    id: '1',
    date: '2025-02-20 02:00 AM',
    size: '2.4 GB',
    status: 'completed',
    type: 'auto',
  },
  {
    id: '2',
    date: '2025-02-19 02:00 AM',
    size: '2.3 GB',
    status: 'completed',
    type: 'auto',
  },
  {
    id: '3',
    date: '2025-02-18 04:15 PM',
    size: '2.3 GB',
    status: 'completed',
    type: 'manual',
  },
  {
    id: '4',
    date: '2025-02-18 02:00 AM',
    size: '0 B',
    status: 'failed',
    type: 'auto',
  },
  {
    id: '5',
    date: '2025-02-17 02:00 AM',
    size: '2.2 GB',
    status: 'completed',
    type: 'auto',
  },
];

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; badgeClass: string }
> = {
  completed: {
    icon: CheckCircle2,
    color: 'text-green-600',
    badgeClass: 'bg-green-100 text-green-700',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    badgeClass: 'bg-red-100 text-red-700',
  },
  'in-progress': {
    icon: Loader2,
    color: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
};

export function DataBackup() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<BackupSettings>(defaultSettings);
  const [backups, setBackups] = useState<BackupEntry[]>(mockBackupHistory);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const updateSetting = <K extends keyof BackupSettings>(
    key: K,
    value: BackupSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success(t('settings.backupSettingsSaved'));
  };

  const handleBackupNow = async () => {
    setIsBackingUp(true);

    const newBackup: BackupEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      size: '0 B',
      status: 'in-progress',
      type: 'manual',
    };

    setBackups((prev) => [newBackup, ...prev]);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setBackups((prev) =>
      prev.map((b) =>
        b.id === newBackup.id
          ? { ...b, size: '2.4 GB', status: 'completed' as const }
          : b
      )
    );

    setIsBackingUp(false);
    toast.success(t('settings.manualBackupCompleted'));
  };

  const handleRestore = async (backupId: string) => {
    setRestoringId(backupId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRestoringId(null);
    toast.success(t('settings.backupRestoredSuccess'));
  };

  const lastSuccessfulBackup = backups.find((b) => b.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Auto-Backup Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <CardTitle>{t('settings.backupAndRestore')}</CardTitle>
          </div>
          <CardDescription>
            {t('settings.backupAndRestoreDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-Backup Toggle */}
          <div className="flex items-center justify-between rounded-lg border-2 border-primary/10 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  settings.autoBackupEnabled ? 'bg-green-100' : 'bg-slate-100'
                )}
              >
                <CloudUpload
                  className={cn(
                    'h-5 w-5',
                    settings.autoBackupEnabled
                      ? 'text-green-600'
                      : 'text-slate-400'
                  )}
                />
              </div>
              <div>
                <Label className="text-base font-semibold">
                  {t('settings.automaticBackups')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {settings.autoBackupEnabled
                    ? t('settings.autoBackupsEnabled')
                    : t('settings.autoBackupsDisabled')}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.autoBackupEnabled}
              onCheckedChange={(checked) =>
                updateSetting('autoBackupEnabled', checked)
              }
            />
          </div>

          {settings.autoBackupEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frequency */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {t('settings.backupFrequency')}
                </Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value) => updateSetting('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.selectFrequency')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('settings.frequencyDaily')}</SelectItem>
                    <SelectItem value="weekly">{t('settings.frequencyWeekly')}</SelectItem>
                    <SelectItem value="monthly">{t('settings.frequencyMonthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Retention */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {t('settings.retentionPeriod')}
                </Label>
                <Select
                  value={settings.retentionDays}
                  onValueChange={(value) =>
                    updateSetting('retentionDays', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('settings.selectRetention')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">{t('settings.retentionDays7')}</SelectItem>
                    <SelectItem value="14">{t('settings.retentionDays14')}</SelectItem>
                    <SelectItem value="30">{t('settings.retentionDays30')}</SelectItem>
                    <SelectItem value="60">{t('settings.retentionDays60')}</SelectItem>
                    <SelectItem value="90">{t('settings.retentionDays90')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={cn('gap-2', isSaving && 'opacity-70')}
            >
              <Save className="h-4 w-4" />
              {isSaving ? t('settings.saving') : t('settings.saveSettings')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Backup Info */}
      {lastSuccessfulBackup && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    {t('settings.lastSuccessfulBackup')}
                  </p>
                  <p className="text-xs text-green-700">
                    {lastSuccessfulBackup.date} - {lastSuccessfulBackup.size}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleBackupNow}
                disabled={isBackingUp}
                className="gap-2"
              >
                {isBackingUp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('settings.backingUp')}
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4" />
                    {t('settings.backupNow')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{t('settings.backupHistory')}</CardTitle>
          </div>
          <CardDescription>
            {t('settings.backupHistoryDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => {
              const config = statusConfig[backup.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={backup.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full bg-slate-100'
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          'h-4 w-4',
                          config.color,
                          backup.status === 'in-progress' && 'animate-spin'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{backup.date}</p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {backup.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('settings.size')}: {backup.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs capitalize', config.badgeClass)}>
                      {backup.status === 'in-progress'
                        ? t('settings.inProgress')
                        : backup.status}
                    </Badge>
                    {backup.status === 'completed' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8"
                          onClick={() => handleRestore(backup.id)}
                          disabled={restoringId === backup.id}
                        >
                          <RotateCcw
                            className={cn(
                              'h-3.5 w-3.5',
                              restoringId === backup.id && 'animate-spin'
                            )}
                          />
                          {restoringId === backup.id ? t('settings.restoring') : t('settings.restore')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 h-8"
                          onClick={() =>
                            toast.info(t('settings.downloadStartedBackup'))
                          }
                        >
                          <Download className="h-3.5 w-3.5" />
                          {t('settings.download')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Restore Warning */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-amber-900">
                {t('settings.restoreWarningTitle')}
              </h4>
              <ul className="text-xs text-amber-800 space-y-1 list-disc ps-4">
                <li>
                  {t('settings.restoreWarning1')}
                </li>
                <li>
                  {t('settings.restoreWarning2')}
                </li>
                <li>
                  {t('settings.restoreWarning3')}
                </li>
                <li>
                  {t('settings.restoreWarning4')}
                </li>
                <li>
                  {t('settings.restoreWarning5')}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
