/**
 * Theme Preview
 * Shows live preview of theme colors with sample components
 */

import { useTranslation } from 'react-i18next'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { ThemeColors } from '../themeTypes'

interface ThemePreviewProps {
  colors: ThemeColors
}

export function ThemePreview({ colors }: ThemePreviewProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('settings.livePreview')}</h4>

      {/* Buttons Preview */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('settings.buttons')}</p>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
            style={{ backgroundColor: colors.primary }}
          >
            {t('settings.primaryButton')}
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
            style={{ backgroundColor: colors.secondary }}
          >
            {t('settings.secondary')}
          </button>
        </div>
      </div>

      {/* Sidebar Preview */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('settings.sidebar')}</p>
        <div
          className="rounded-lg p-3 space-y-1.5"
          style={{ backgroundColor: colors.sidebarBg }}
        >
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ backgroundColor: colors.primary }}>
            <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.sidebarText }} />
            <span className="text-xs font-medium" style={{ color: colors.sidebarText }}>{t('settings.activeItem')}</span>
          </div>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.sidebarText, opacity: 0.5 }} />
            <span className="text-xs" style={{ color: colors.sidebarText, opacity: 0.7 }}>{t('settings.menuItem')}</span>
          </div>
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.sidebarText, opacity: 0.5 }} />
            <span className="text-xs" style={{ color: colors.sidebarText, opacity: 0.7 }}>{t('settings.anotherItem')}</span>
          </div>
        </div>
      </div>

      {/* Status Badges Preview */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('settings.statusBadges')}</p>
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: colors.success }}
          >
            <CheckCircle className="h-3 w-3" /> {t('settings.success')}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: colors.warning }}
          >
            <AlertTriangle className="h-3 w-3" /> {t('settings.warning')}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: colors.error }}
          >
            <XCircle className="h-3 w-3" /> {t('settings.error')}
          </span>
        </div>
      </div>

      {/* Background Preview */}
      <div className="rounded-lg border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('settings.background')}</p>
        <div
          className="rounded-lg border p-4"
          style={{ backgroundColor: colors.background }}
        >
          <p className="text-sm text-gray-700">{t('settings.contentAreaDescription')}</p>
        </div>
      </div>
    </div>
  )
}
