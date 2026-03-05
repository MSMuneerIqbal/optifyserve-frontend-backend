/**
 * Theme Applicator Hook
 * Applies theme colors to CSS variables on the document root.
 * Also loads theme from localStorage on mount.
 */

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { loadThemeFromStorage } from './themeSlice'
import type { ThemeColors } from './themeTypes'

/**
 * Convert hex color (#RRGGBB) to HSL string "H S% L%" for CSS variables
 */
function hexToHSL(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0 0% 0%'

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function applyThemeToDOM(colors: ThemeColors) {
  const root = document.documentElement

  // Primary color
  root.style.setProperty('--primary', hexToHSL(colors.primary))
  root.style.setProperty('--ring', hexToHSL(colors.primary))
  root.style.setProperty('--sidebar-primary', hexToHSL(colors.primary))
  root.style.setProperty('--sidebar-ring', hexToHSL(colors.primary))
  root.style.setProperty('--chart-1', hexToHSL(colors.primary))

  // Sidebar colors
  root.style.setProperty('--sidebar', hexToHSL(colors.sidebarBg))
  root.style.setProperty('--sidebar-foreground', hexToHSL(colors.sidebarText))
  root.style.setProperty('--sidebar-primary-foreground', hexToHSL(colors.sidebarText))
  root.style.setProperty('--sidebar-accent-foreground', hexToHSL(colors.sidebarText))

  // Destructive / error
  root.style.setProperty('--destructive', hexToHSL(colors.error))

  // Background
  root.style.setProperty('--background', hexToHSL(colors.background))

  // Store for sidebar.tsx inline color usage
  root.style.setProperty('--theme-primary', colors.primary)
  root.style.setProperty('--theme-sidebar-bg', colors.sidebarBg)
  root.style.setProperty('--theme-sidebar-text', colors.sidebarText)
  root.style.setProperty('--theme-success', colors.success)
  root.style.setProperty('--theme-warning', colors.warning)
  root.style.setProperty('--theme-error', colors.error)
}

const STORAGE_KEY = 'erp_theme_colors'

export function useThemeApplicator() {
  const dispatch = useAppDispatch()
  const { colors } = useAppSelector((s) => s.theme)

  // Load theme from localStorage on mount (with validation)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed.primary === 'string' && typeof parsed.sidebarBg === 'string') {
          dispatch(loadThemeFromStorage(parsed as ThemeColors))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [dispatch])

  // Apply theme colors to CSS variables whenever they change
  useEffect(() => {
    applyThemeToDOM(colors)
  }, [colors])
}
