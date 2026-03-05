/**
 * Notification Settings Component
 * Phase 13: Settings Module
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, Mail, MessageCircle, Bell } from 'lucide-react'
import type { NotificationSettings as NotificationSettingsType } from '../types/settings.types'

interface NotificationSettingsProps {
  settings: NotificationSettingsType | undefined
  isLoading: boolean
  onSave: (data: NotificationSettingsType) => void
  isSaving: boolean
}

export function NotificationSettingsComponent({
  settings,
  isLoading,
  onSave,
  isSaving,
}: NotificationSettingsProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<NotificationSettingsType | null>(null)

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const updateEmail = (key: keyof NotificationSettingsType['email'], value: boolean) => {
    setFormData(prev => prev ? { ...prev, email: { ...prev.email, [key]: value } } : prev)
  }

  const updateWhatsApp = (key: keyof NotificationSettingsType['whatsapp'], value: boolean) => {
    setFormData(prev => prev ? { ...prev, whatsapp: { ...prev.whatsapp, [key]: value } } : prev)
  }

  const updateSystem = (key: keyof NotificationSettingsType['system'], value: boolean) => {
    setFormData(prev => prev ? { ...prev, system: { ...prev.system, [key]: value } } : prev)
  }

  const handleSave = () => {
    if (formData) onSave(formData)
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4" />
                {t('settings.emailNotifications')}
              </CardTitle>
              <CardDescription>{t('settings.emailNotificationsDesc')}</CardDescription>
            </div>
            <Switch
              checked={formData.email.enabled}
              onCheckedChange={(v) => updateEmail('enabled', v)}
            />
          </div>
        </CardHeader>
        {formData.email.enabled && (
          <CardContent className="space-y-4">
            <NotificationToggle
              label={t('settings.invoiceCreated')}
              description={t('settings.invoiceCreatedDesc')}
              checked={formData.email.invoiceCreated}
              onChange={(v) => updateEmail('invoiceCreated', v)}
            />
            <NotificationToggle
              label={t('settings.paymentReceived')}
              description={t('settings.paymentReceivedDesc')}
              checked={formData.email.paymentReceived}
              onChange={(v) => updateEmail('paymentReceived', v)}
            />
            <NotificationToggle
              label={t('settings.jobAssigned')}
              description={t('settings.jobAssignedDesc')}
              checked={formData.email.jobAssigned}
              onChange={(v) => updateEmail('jobAssigned', v)}
            />
            <NotificationToggle
              label={t('settings.jobCompleted')}
              description={t('settings.jobCompletedDesc')}
              checked={formData.email.jobCompleted}
              onChange={(v) => updateEmail('jobCompleted', v)}
            />
            <NotificationToggle
              label={t('settings.lowStockAlert')}
              description={t('settings.lowStockAlertDesc')}
              checked={formData.email.lowStock}
              onChange={(v) => updateEmail('lowStock', v)}
            />
            <NotificationToggle
              label={t('settings.leaveRequest')}
              description={t('settings.leaveRequestDesc')}
              checked={formData.email.leaveRequest}
              onChange={(v) => updateEmail('leaveRequest', v)}
            />
            <NotificationToggle
              label={t('settings.dailySummary')}
              description={t('settings.dailySummaryDesc')}
              checked={formData.email.dailySummary}
              onChange={(v) => updateEmail('dailySummary', v)}
            />
          </CardContent>
        )}
      </Card>

      {/* WhatsApp Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="h-4 w-4 text-green-600" />
                {t('settings.whatsappNotifications')}
                <Badge variant="secondary" className="text-xs">{t('settings.businessAPI')}</Badge>
              </CardTitle>
              <CardDescription>{t('settings.whatsappNotificationsDesc')}</CardDescription>
            </div>
            <Switch
              checked={formData.whatsapp.enabled}
              onCheckedChange={(v) => updateWhatsApp('enabled', v)}
            />
          </div>
        </CardHeader>
        {formData.whatsapp.enabled && (
          <CardContent className="space-y-4">
            <NotificationToggle
              label={t('settings.jobAssignment')}
              description={t('settings.jobAssignmentDesc')}
              checked={formData.whatsapp.jobAssignment}
              onChange={(v) => updateWhatsApp('jobAssignment', v)}
            />
            <NotificationToggle
              label={t('settings.jobReminder')}
              description={t('settings.jobReminderDesc')}
              checked={formData.whatsapp.jobReminder}
              onChange={(v) => updateWhatsApp('jobReminder', v)}
            />
            <NotificationToggle
              label={t('settings.paymentReminder')}
              description={t('settings.paymentReminderDesc')}
              checked={formData.whatsapp.paymentReminder}
              onChange={(v) => updateWhatsApp('paymentReminder', v)}
            />
            <NotificationToggle
              label={t('settings.customerFollowUp')}
              description={t('settings.customerFollowUpDesc')}
              checked={formData.whatsapp.customerFollowUp}
              onChange={(v) => updateWhatsApp('customerFollowUp', v)}
            />
          </CardContent>
        )}
      </Card>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                {t('settings.inAppNotifications')}
              </CardTitle>
              <CardDescription>{t('settings.inAppNotificationsDesc')}</CardDescription>
            </div>
            <Switch
              checked={formData.system.enabled}
              onCheckedChange={(v) => updateSystem('enabled', v)}
            />
          </div>
        </CardHeader>
        {formData.system.enabled && (
          <CardContent className="space-y-4">
            <NotificationToggle
              label={t('settings.desktopNotifications')}
              description={t('settings.desktopNotificationsDesc')}
              checked={formData.system.showDesktop}
              onChange={(v) => updateSystem('showDesktop', v)}
            />
            <NotificationToggle
              label={t('settings.soundAlerts')}
              description={t('settings.soundAlertsDesc')}
              checked={formData.system.playSound}
              onChange={(v) => updateSystem('playSound', v)}
            />
          </CardContent>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 me-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 me-2" />
          )}
          {t('settings.saveNotificationSettings')}
        </Button>
      </div>
    </div>
  )
}

function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
