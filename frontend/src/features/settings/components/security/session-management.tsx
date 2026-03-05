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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  LogOut,
  Shield,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { cn, formatDateTime, formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';
import { sampleActiveSessions } from '@/data/settings.data';
import type { ActiveSession } from '@/features/settings/types';

interface SessionSettings {
  sessionTimeout: string;
  maxConcurrentSessions: string;
  forceLogoutOnPasswordChange: boolean;
}

function getDeviceType(device: string): 'desktop' | 'mobile' | 'tablet' {
  const lower = device.toLowerCase();
  if (lower.includes('iphone') || lower.includes('mobile')) return 'mobile';
  if (lower.includes('ipad') || lower.includes('tablet')) return 'tablet';
  return 'desktop';
}

const defaultSettings: SessionSettings = {
  sessionTimeout: '60',
  maxConcurrentSessions: '3',
  forceLogoutOnPasswordChange: true,
};

const deviceIcons: Record<string, React.ElementType> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export function SessionManagement() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SessionSettings>(defaultSettings);
  const [sessions, setSessions] = useState<ActiveSession[]>(sampleActiveSessions);
  const [isSaving, setIsSaving] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const updateSetting = <K extends keyof SessionSettings>(
    key: K,
    value: SessionSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success(t('settings.sessionSettingsUpdated'));
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setRevokingId(null);
    toast.success(t('settings.sessionRevoked'));
  };

  const handleRevokeAll = async () => {
    setIsRevokingAll(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setIsRevokingAll(false);
    toast.success(t('settings.allSessionsRevoked'));
  };

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className="space-y-6">
      {/* Session Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>{t('settings.sessionSettings')}</CardTitle>
          </div>
          <CardDescription>
            {t('settings.sessionSettingsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Session Timeout */}
            <div className="space-y-2">
              <Label>{t('settings.sessionTimeout')}</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) => updateSetting('sessionTimeout', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectTimeout')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">{t('settings.fifteenMinutes')}</SelectItem>
                  <SelectItem value="30">{t('settings.thirtyMinutes')}</SelectItem>
                  <SelectItem value="60">{t('settings.oneHour')}</SelectItem>
                  <SelectItem value="240">{t('settings.fourHours')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.sessionTimeoutDescription')}
              </p>
            </div>

            {/* Max Concurrent Sessions */}
            <div className="space-y-2">
              <Label>{t('settings.maxConcurrentSessions')}</Label>
              <Select
                value={settings.maxConcurrentSessions}
                onValueChange={(value) =>
                  updateSetting('maxConcurrentSessions', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectLimit')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t('settings.oneSessionOnly')}</SelectItem>
                  <SelectItem value="3">{t('settings.threeSessions')}</SelectItem>
                  <SelectItem value="unlimited">{t('settings.unlimited')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.maxConcurrentSessionsDescription')}
              </p>
            </div>
          </div>

          {/* Force Logout */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="font-medium">{t('settings.forceLogoutOnPasswordChange')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.forceLogoutDescription')}
              </p>
            </div>
            <Switch
              checked={settings.forceLogoutOnPasswordChange}
              onCheckedChange={(checked) =>
                updateSetting('forceLogoutOnPasswordChange', checked)
              }
            />
          </div>

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

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>{t('settings.activeSessions')}</CardTitle>
                <CardDescription>
                  {t('settings.activeSessionsDescription')}
                </CardDescription>
              </div>
            </div>
            {otherSessionsCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRevokeAll}
                disabled={isRevokingAll}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {isRevokingAll
                  ? t('settings.revoking')
                  : t('settings.revokeAllOtherSessions', { count: otherSessionsCount })}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => {
              const DeviceIcon = deviceIcons[getDeviceType(session.device)] || Globe;
              return (
                <div
                  key={session.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-4',
                    session.isCurrent && 'border-primary/20 bg-primary/5'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        session.isCurrent ? 'bg-primary/10' : 'bg-slate-100'
                      )}
                    >
                      <DeviceIcon
                        className={cn(
                          'h-5 w-5',
                          session.isCurrent ? 'text-primary' : 'text-slate-500'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.browser}</p>
                        {session.isCurrent && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                            {t('settings.current')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.ipAddress}
                        </span>
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{t('settings.loggedIn')}: {formatDateTime(session.loginAt)}</span>
                        <span className="text-slate-400">|</span>
                        <span>{t('settings.lastActive')}: {formatRelativeTime(session.lastActiveAt)}</span>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {revokingId === session.id ? t('settings.revoking') : t('settings.revoke')}
                    </Button>
                  )}
                </div>
              );
            })}

            {sessions.length === 1 && sessions[0].isCurrent && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700">
                  {t('settings.noOtherActiveSessions')}
                </p>
              </div>
            )}
          </div>

          {otherSessionsCount > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  {t('settings.unfamiliarSessionsWarning')}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
