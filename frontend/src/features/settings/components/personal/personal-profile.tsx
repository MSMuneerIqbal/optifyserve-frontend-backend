/**
 * Personal Profile Settings
 * Phase 13: Settings Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Camera, Save } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function PersonalProfile() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('settings.myProfile')}</h3>
        <p className="text-sm text-muted-foreground">{t('settings.managePersonalInfo')}</p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl">
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
              </div>
              <button className="absolute bottom-0 end-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-lg font-semibold">{user?.name || t('settings.user')}</p>
              <Badge className="bg-primary/10 text-primary text-xs">{user?.role || t('settings.staff')}</Badge>
              <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('settings.personalInformation')}
          </CardTitle>
          <CardDescription>{t('settings.updateNameEmailContact')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.fullName')}</Label>
              <Input defaultValue={user?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.email')}</Label>
              <Input type="email" defaultValue={user?.email || ''} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.phone')}</Label>
              <Input defaultValue={user?.phone || ''} placeholder={t('settings.phonePlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.department')}</Label>
              <Input defaultValue={user?.department || ''} disabled className="bg-muted" />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.employeeId')}</Label>
              <Input value={user?.id || ''} disabled className="bg-muted font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.company')}</Label>
              <Input value={user?.companyName || ''} disabled className="bg-muted" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>
              <Save className="h-4 w-4 me-2" />
              {t('settings.saveChanges')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
