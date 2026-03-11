/**
 * Settings Drawer - Right-Side Slide-In Panel
 * Phase 13: Settings Module
 *
 * Professional two-panel layout:
 * - Left: Categories sidebar (240px)
 * - Right: Settings content (flex-1)
 */

import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SettingsSidebar } from './settings-sidebar'
import { SettingsContent } from './settings-content'
import type { SettingsCategory } from '../types/settings.types'

interface SettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeCategory: SettingsCategory
  onCategoryChange: (category: SettingsCategory) => void
  userRole: string
}

export function SettingsDrawer({
  isOpen,
  onClose,
  activeCategory,
  onCategoryChange,
  userRole,
}: SettingsDrawerProps) {
  const { t } = useTranslation()

  // Close on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 end-0 z-50 h-full bg-background shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
          'w-full sm:w-[90vw] lg:w-[80vw] xl:max-w-[1400px]',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 border-b bg-white shrink-0">
          <h2 className="text-lg font-semibold">{t('settings.title')}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Two-Panel Layout */}
        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Categories Sidebar */}
          <SettingsSidebar
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            userRole={userRole}
          />

          {/* Right Panel - Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="p-4 sm:p-6 max-w-4xl">
              <SettingsContent
                activeCategory={activeCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
