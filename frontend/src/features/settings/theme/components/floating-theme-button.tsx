/**
 * Floating Theme Button
 * Fixed position button (bottom-right) that opens the color customizer drawer.
 * Only visible for admin/super_admin roles.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Palette } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/auth-context'
import { ColorCustomizer } from './color-customizer'

export function FloatingThemeButton() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  // Only show for admin or super_admin
  const canCustomize = user?.role === 'admin' || user?.role === 'super_admin'
  if (!canCustomize) return null

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-8 end-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 animate-bounce-gentle no-print"
              aria-label={t('settings.customizeColors')}
            >
              <Palette className="h-6 w-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{t('settings.customizeColors')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ColorCustomizer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
