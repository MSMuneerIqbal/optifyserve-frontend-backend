/**
 * User Preferences Component
 * Phase 13: Settings Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, Sun, Moon, Monitor, Save, Globe, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

export function Preferences() {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [language, setLanguage] = useState('en')
  const [compactMode, setCompactMode] = useState(false)
  const [pageSize, setPageSize] = useState('25')

  const handleSave = () => {
    toast.success(t('settings.preferencesSaved'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('settings.preferences')}</h3>
        <p className="text-sm text-muted-foreground">{t('settings.customizeExperience')}</p>
      </div>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t('settings.appearance')}
          </CardTitle>
          <CardDescription>{t('settings.choosePreferredTheme')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light' as const, label: t('settings.themeLight'), icon: Sun },
              { value: 'dark' as const, label: t('settings.themeDark'), icon: Moon },
              { value: 'system' as const, label: t('settings.themeSystem'), icon: Monitor },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  theme === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <opt.icon className={cn(
                  'h-6 w-6',
                  theme === opt.value ? 'text-primary' : 'text-gray-400'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  theme === opt.value ? 'text-primary' : 'text-gray-600'
                )}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t('settings.languageAndRegion')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.language')}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('settings.english')}</SelectItem>
                  <SelectItem value="ar">{t('settings.arabic')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.timezone')}</Label>
              <Select defaultValue="asia-dubai">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-dubai">{t('settings.timezoneDubai')}</SelectItem>
                  <SelectItem value="asia-riyadh">{t('settings.timezoneRiyadh')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            {t('settings.displaySettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.compactMode')}</Label>
              <p className="text-xs text-muted-foreground">{t('settings.compactModeDescription')}</p>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.defaultPageSize')}</Label>
              <p className="text-xs text-muted-foreground">{t('settings.defaultPageSizeDescription')}</p>
            </div>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 me-2" />
          {t('settings.savePreferences')}
        </Button>
      </div>
    </div>
  )
}
