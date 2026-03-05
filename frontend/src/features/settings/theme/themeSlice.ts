import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ThemeState, ThemeColors, ThemeColorKey, ThemePreset } from './themeTypes'
import { DEFAULT_THEME_COLORS } from './themeTypes'

const initialState: ThemeState = {
  colors: DEFAULT_THEME_COLORS,
  isCustomized: false,
  isLoading: false,
  isSaving: false,
  error: null,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Fetch theme from backend
    fetchThemeRequest(state) {
      state.isLoading = true
      state.error = null
    },
    fetchThemeSuccess(state, action: PayloadAction<ThemeColors>) {
      state.colors = action.payload
      state.isCustomized = true
      state.isLoading = false
    },
    fetchThemeFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },

    // Update full theme to backend
    updateThemeRequest(state, _action: PayloadAction<ThemeColors>) {
      state.isSaving = true
      state.error = null
    },
    updateThemeSuccess(state, action: PayloadAction<ThemeColors>) {
      state.colors = action.payload
      state.isCustomized = true
      state.isSaving = false
    },
    updateThemeFailure(state, action: PayloadAction<string>) {
      state.isSaving = false
      state.error = action.payload
    },

    // Reset theme to defaults
    resetThemeRequest(state) {
      state.isSaving = true
      state.error = null
    },
    resetThemeSuccess(state) {
      state.colors = DEFAULT_THEME_COLORS
      state.isCustomized = false
      state.isSaving = false
    },
    resetThemeFailure(state, action: PayloadAction<string>) {
      state.isSaving = false
      state.error = action.payload
    },

    // Live preview - update a single color locally (no API call)
    setColorPreview(state, action: PayloadAction<{ key: ThemeColorKey; value: string }>) {
      state.colors[action.payload.key] = action.payload.value
    },

    // Load from localStorage on init
    loadThemeFromStorage(state, action: PayloadAction<ThemeColors>) {
      state.colors = action.payload
      state.isCustomized = true
    },

    // Apply a theme preset (instant preview, all 8 colors at once)
    applyPreset(state, action: PayloadAction<ThemePreset>) {
      state.colors = { ...action.payload.colors }
    },
  },
})

export const {
  fetchThemeRequest,
  fetchThemeSuccess,
  fetchThemeFailure,
  updateThemeRequest,
  updateThemeSuccess,
  updateThemeFailure,
  resetThemeRequest,
  resetThemeSuccess,
  resetThemeFailure,
  setColorPreview,
  loadThemeFromStorage,
  applyPreset,
} = themeSlice.actions

export default themeSlice.reducer
