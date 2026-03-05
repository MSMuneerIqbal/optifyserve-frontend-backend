/**
 * Appearance Settings
 * Settings page section for theme customization (accessible from settings drawer)
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, RotateCcw, Save, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setColorPreview,
  updateThemeRequest,
  resetThemeRequest,
} from '../theme/themeSlice'
import { THEME_COLOR_CONFIGS, DEFAULT_THEME_COLORS } from '../theme/themeTypes'
import type { ThemeColorKey } from '../theme/themeTypes'
import { ColorPickerField } from '../theme/components/color-picker-field'
import { ThemePreview } from '../theme/components/theme-preview'
import { ThemePresetSelector } from '../theme/components/theme-preset-selector'

export function AppearanceSettings() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { colors, isSaving } = useAppSelector((s) => s.theme)

  const handleColorChange = (key: ThemeColorKey, value: string) => {
    dispatch(setColorPreview({ key, value }))
  }

  const handleSave = () => {
    dispatch(updateThemeRequest(colors))
  }

  const handleReset = () => {
    dispatch(resetThemeRequest())
  }

  const hasChanges = Object.keys(DEFAULT_THEME_COLORS).some(
    (key) => colors[key as ThemeColorKey] !== DEFAULT_THEME_COLORS[key as ThemeColorKey]
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t('settings.appearanceBranding')}</h3>
        <p className="text-sm text-muted-foreground">{t('settings.appearanceBrandingDesc')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            {t('settings.themeColors')}
          </CardTitle>
          <CardDescription>
            {t('settings.themeColorsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThemePresetSelector />

          <div className="space-y-4">
          {THEME_COLOR_CONFIGS.map((config) => (
            <ColorPickerField
              key={config.key}
              label={t(config.labelKey)}
              description={t(config.descriptionKey)}
              value={colors[config.key]}
              onChange={(val) => handleColorChange(config.key, val)}
            />
          ))}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving || !hasChanges}
            >
              <RotateCcw className="h-4 w-4 me-2" />
              {t('settings.resetToDefault')}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 me-2" />
              )}
              {t('common.saveChanges')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('settings.preview')}</CardTitle>
          <CardDescription>{t('settings.previewDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePreview colors={colors} />
        </CardContent>
      </Card>
    </div>
  )
}
