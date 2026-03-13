/**
 * Trial Banner Component
 * Shows a dismissible amber banner with trial days remaining.
 * Only visible when user has trialEndsAt in their profile.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useLocalStorage } from '@/hooks/use-local-storage'

const BANNER_DISMISSED_KEY = 'trial-banner-dismissed'

export function TrialBanner() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [dismissed, setDismissed] = useLocalStorage(BANNER_DISMISSED_KEY, false)

  const daysRemaining = useMemo(() => {
    if (!user?.trialEndsAt) return null
    const end = new Date(user.trialEndsAt)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }, [user?.trialEndsAt])

  if (!user?.trialEndsAt || daysRemaining === null || dismissed) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-2.5 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200 md:px-6">
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 shrink-0" />
        <span>{t('common.trialBanner', { days: daysRemaining })}</span>
        <Link
          to="/settings"
          className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100"
        >
          {t('common.upgradeNow')}
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-sm p-1 text-amber-600 transition-colors hover:bg-amber-100 hover:text-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/40"
        aria-label={t('common.dismissBanner')}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
