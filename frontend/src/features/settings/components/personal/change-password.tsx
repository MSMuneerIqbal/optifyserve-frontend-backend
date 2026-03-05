/**
 * Change Password Component
 * Phase 13: Settings Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, Save, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function ChangePassword() {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const requirements = [
    { label: t('settings.reqMinChars'), met: newPassword.length >= 8 },
    { label: t('settings.reqUppercase'), met: /[A-Z]/.test(newPassword) },
    { label: t('settings.reqLowercase'), met: /[a-z]/.test(newPassword) },
    { label: t('settings.reqNumber'), met: /\d/.test(newPassword) },
    { label: t('settings.reqSpecialChar'), met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ]

  const allMet = requirements.every(r => r.met)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!allMet || !passwordsMatch || !currentPassword) return
    toast.success(t('settings.passwordChangedSuccess'))
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  // Password strength
  const metCount = requirements.filter(r => r.met).length
  const strengthLabel = metCount <= 1 ? t('settings.strengthWeak') : metCount <= 3 ? t('settings.strengthFair') : metCount <= 4 ? t('settings.strengthGood') : t('settings.strengthStrong')
  const strengthColor = metCount <= 1 ? 'bg-red-500' : metCount <= 3 ? 'bg-amber-500' : metCount <= 4 ? 'bg-blue-500' : 'bg-green-500'

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('settings.changePassword')}</h3>
        <p className="text-sm text-muted-foreground">{t('settings.changePasswordSubtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('settings.updatePassword')}
          </CardTitle>
          <CardDescription>{t('settings.updatePasswordDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            {/* Current Password */}
            <div className="space-y-2">
              <Label>{t('settings.currentPassword')} *</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t('settings.enterCurrentPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label>{t('settings.newPassword')} *</Label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('settings.enterNewPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength Meter */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', strengthColor)}
                        style={{ width: `${(metCount / requirements.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{strengthLabel}</span>
                  </div>
                  <div className="space-y-1">
                    {requirements.map(req => (
                      <div key={req.label} className="flex items-center gap-1.5 text-xs">
                        {req.met ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-300" />
                        )}
                        <span className={cn(req.met ? 'text-green-700' : 'text-muted-foreground')}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label>{t('settings.confirmNewPassword')} *</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('settings.reenterNewPassword')}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-600">{t('settings.passwordsDoNotMatch')}</p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t('settings.passwordsMatch')}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!allMet || !passwordsMatch || !currentPassword}
            >
              <Save className="h-4 w-4 me-2" />
              {t('settings.updatePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
