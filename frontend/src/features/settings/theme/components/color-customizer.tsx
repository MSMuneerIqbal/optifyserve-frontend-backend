/**
 * Color Customizer Drawer
 * Right-side drawer with all color pickers and live preview
 */

import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { X, RotateCcw, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setColorPreview,
  updateThemeRequest,
  resetThemeRequest,
} from '../themeSlice'
import { DEFAULT_THEME_COLORS } from '../themeTypes'
import { THEME_COLOR_CONFIGS } from '../themeTypes'
import type { ThemeColorKey } from '../themeTypes'
import { ColorPickerField } from './color-picker-field'
import { ThemePreview } from './theme-preview'
import { ThemePresetSelector } from './theme-preset-selector'

interface ColorCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

export function ColorCustomizer({ isOpen, onClose }: ColorCustomizerProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { colors, isSaving } = useAppSelector((s) => s.theme)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleColorChange = useCallback(
    (key: ThemeColorKey, value: string) => {
      dispatch(setColorPreview({ key, value }))
    },
    [dispatch]
  )

  const handleSave = () => {
    dispatch(updateThemeRequest(colors))
  }

  const handleReset = () => {
    dispatch(resetThemeRequest())
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose()
  }

  const hasChanges = Object.keys(DEFAULT_THEME_COLORS).some(
    (key) => colors[key as ThemeColorKey] !== DEFAULT_THEME_COLORS[key as ThemeColorKey]
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 end-0 z-50 w-full sm:w-[420px] bg-background shadow-2xl border-s flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">{t('settings.customizeThemeColors')}</h2>
            <p className="text-xs text-muted-foreground">{t('settings.changesApplyInstantly')}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-6">
          {/* Theme Presets */}
          <ThemePresetSelector />

          {/* Color Pickers */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('settings.colors')}</h4>
            <div className="space-y-2">
              {THEME_COLOR_CONFIGS.map((config) => (
                <ColorPickerField
                  key={config.key}
                  label={t(`settings.colorLabel.${config.key}`)}
                  description={t(`settings.colorDescription.${config.key}`)}
                  value={colors[config.key]}
                  onChange={(val) => handleColorChange(config.key, val)}
                />
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <ThemePreview colors={colors} />
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving || !hasChanges}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 me-2" />
            {t('settings.resetToDefault')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 me-2" />
            )}
            {t('settings.saveChanges')}
          </Button>
        </div>
      </div>
    </>
  )
}
