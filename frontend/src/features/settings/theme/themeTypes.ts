/**
 * Theme Customization Types
 */

export interface ThemeColors {
  primary: string       // hex e.g. "#4F46E5"
  secondary: string     // hex e.g. "#06B6D4"
  sidebarBg: string     // hex e.g. "#1E293B"
  sidebarText: string   // hex e.g. "#F8FAFC"
  success: string       // hex e.g. "#10B981"
  warning: string       // hex e.g. "#F59E0B"
  error: string         // hex e.g. "#EF4444"
  background: string    // hex e.g. "#FFFFFF"
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#1D4ED8',
  secondary: '#0284C7',
  sidebarBg: '#111827',
  sidebarText: '#D1D5DB',
  success: '#059669',
  warning: '#B45309',
  error: '#B91C1C',
  background: '#F9FAFB',
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  colors: ThemeColors
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'corporate-navy',
    name: 'Corporate Navy',
    description: 'Professional blue tones for enterprise',
    colors: {
      primary: '#1E3A5F',
      secondary: '#0EA5E9',
      sidebarBg: '#0F172A',
      sidebarText: '#CBD5E1',
      success: '#16A34A',
      warning: '#D97706',
      error: '#DC2626',
      background: '#F8FAFC',
    },
  },
  {
    id: 'modern-teal',
    name: 'Modern Teal',
    description: 'Fresh teal palette with vibrant accents',
    colors: {
      primary: '#0D9488',
      secondary: '#6366F1',
      sidebarBg: '#134E4A',
      sidebarText: '#CCFBF1',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      background: '#F0FDFA',
    },
  },
  {
    id: 'uae-premium',
    name: 'UAE Premium',
    description: 'Elegant blue designed for UAE business',
    colors: {
      primary: '#1D4ED8',
      secondary: '#0284C7',
      sidebarBg: '#111827',
      sidebarText: '#D1D5DB',
      success: '#059669',
      warning: '#B45309',
      error: '#B91C1C',
      background: '#F9FAFB',
    },
  },
  {
    id: 'optifyserve',
    name: 'OptifyServe',
    description: 'Blue-to-emerald gradient inspired by the brand',
    colors: {
      primary: '#1565C0',
      secondary: '#00ACC1',
      sidebarBg: '#0B1929',
      sidebarText: '#B2EBF2',
      success: '#00B377',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#F0F7FF',
    },
  },
]

export interface ThemeState {
  colors: ThemeColors
  isCustomized: boolean
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

export type ThemeColorKey = keyof ThemeColors

export interface ThemeColorConfig {
  key: ThemeColorKey
  labelKey: string
  descriptionKey: string
}

export const THEME_COLOR_CONFIGS: ThemeColorConfig[] = [
  { key: 'primary', labelKey: 'settings.colorLabel.primary', descriptionKey: 'settings.colorDescription.primary' },
  { key: 'secondary', labelKey: 'settings.colorLabel.secondary', descriptionKey: 'settings.colorDescription.secondary' },
  { key: 'sidebarBg', labelKey: 'settings.colorLabel.sidebarBg', descriptionKey: 'settings.colorDescription.sidebarBg' },
  { key: 'sidebarText', labelKey: 'settings.colorLabel.sidebarText', descriptionKey: 'settings.colorDescription.sidebarText' },
  { key: 'success', labelKey: 'settings.colorLabel.success', descriptionKey: 'settings.colorDescription.success' },
  { key: 'warning', labelKey: 'settings.colorLabel.warning', descriptionKey: 'settings.colorDescription.warning' },
  { key: 'error', labelKey: 'settings.colorLabel.error', descriptionKey: 'settings.colorDescription.error' },
  { key: 'background', labelKey: 'settings.colorLabel.background', descriptionKey: 'settings.colorDescription.background' },
]
