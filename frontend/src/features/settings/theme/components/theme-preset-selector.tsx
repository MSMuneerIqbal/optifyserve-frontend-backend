/**
 * Theme Preset Selector
 * Clickable cards for quickly applying theme presets
 */

import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { applyPreset } from '../themeSlice'
import { THEME_PRESETS } from '../themeTypes'
import type { ThemePreset, ThemeColors, ThemeColorKey } from '../themeTypes'

const SWATCH_KEYS: ThemeColorKey[] = ['primary', 'secondary', 'sidebarBg', 'success', 'warning', 'error']

function isPresetActive(preset: ThemePreset, currentColors: ThemeColors): boolean {
  return (Object.keys(preset.colors) as ThemeColorKey[]).every(
    (key) => preset.colors[key].toUpperCase() === currentColors[key].toUpperCase()
  )
}

export function ThemePresetSelector() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { colors } = useAppSelector((s) => s.theme)

  const handleSelect = (preset: ThemePreset) => {
    dispatch(applyPreset(preset))
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {t('settings.presets')}
      </h4>
      <div className="grid gap-2">
        {THEME_PRESETS.map((preset) => {
          const active = isPresetActive(preset, colors)
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset)}
              className={`relative w-full text-start rounded-lg border p-3 transition-all duration-150 active:scale-[0.98] ${
                active
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{t(`settings.presetName.${preset.id}`)}</span>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{t(`settings.presetDescription.${preset.id}`)}</p>
              <div className="flex gap-1.5">
                {SWATCH_KEYS.map((key) => (
                  <div
                    key={key}
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.colors[key] }}
                    title={key}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
