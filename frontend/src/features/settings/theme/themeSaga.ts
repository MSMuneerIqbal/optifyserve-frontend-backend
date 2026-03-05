import { put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'sonner'
import type { ThemeColors } from './themeTypes'
import {
  fetchThemeRequest,
  fetchThemeSuccess,
  fetchThemeFailure,
  updateThemeRequest,
  updateThemeSuccess,
  resetThemeRequest,
  resetThemeSuccess,
} from './themeSlice'

const STORAGE_KEY = 'erp_theme_colors'

function saveToLocalStorage(colors: ThemeColors) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors))
  } catch {
    // Silently fail for localStorage
  }
}

function loadFromLocalStorage(): ThemeColors | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const colors = JSON.parse(stored) as ThemeColors
      if (typeof colors.primary === 'string' && typeof colors.sidebarBg === 'string') {
        return colors
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

function* handleFetchTheme() {
  try {
    const colors = loadFromLocalStorage()
    if (colors) {
      yield put(fetchThemeSuccess(colors))
    } else {
      yield put(fetchThemeFailure('No saved theme found'))
    }
  } catch {
    yield put(fetchThemeFailure('Failed to load theme'))
  }
}

function* handleUpdateTheme(action: PayloadAction<ThemeColors>) {
  saveToLocalStorage(action.payload)
  yield put(updateThemeSuccess(action.payload))
  toast.success('Theme saved', { description: 'Your color customizations have been saved.' })
}

function* handleResetTheme() {
  localStorage.removeItem(STORAGE_KEY)
  yield put(resetThemeSuccess())
  toast.success('Theme reset', { description: 'Colors restored to defaults.' })
}

export function* themeSaga() {
  yield takeLatest(fetchThemeRequest.type, handleFetchTheme)
  yield takeLatest(updateThemeRequest.type, handleUpdateTheme)
  yield takeLatest(resetThemeRequest.type, handleResetTheme)
}
