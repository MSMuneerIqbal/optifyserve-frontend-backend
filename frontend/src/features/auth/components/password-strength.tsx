/**
 * Password Strength Indicator
 * Shows a strength bar and label based on password complexity.
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
}

type StrengthLevel = 0 | 1 | 2 | 3 | 4

function getStrength(password: string): StrengthLevel {
  if (!password) return 0

  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  return score as StrengthLevel
}

const strengthConfig: Record<
  StrengthLevel,
  { key: string; colorClass: string; barColor: string }
> = {
  0: { key: '', colorClass: '', barColor: '' },
  1: {
    key: 'auth.passwordStrengthWeak',
    colorClass: 'text-red-500',
    barColor: 'bg-red-500',
  },
  2: {
    key: 'auth.passwordStrengthFair',
    colorClass: 'text-orange-500',
    barColor: 'bg-orange-500',
  },
  3: {
    key: 'auth.passwordStrengthStrong',
    colorClass: 'text-yellow-500',
    barColor: 'bg-yellow-500',
  },
  4: {
    key: 'auth.passwordStrengthVeryStrong',
    colorClass: 'text-green-500',
    barColor: 'bg-green-500',
  },
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation()

  const strength = useMemo(() => getStrength(password), [password])

  if (!password) return null

  const config = strengthConfig[strength]

  return (
    <div className="mt-2 space-y-1.5">
      {/* Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              level <= strength ? config.barColor : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Label */}
      {config.key && (
        <p className={cn('text-xs font-medium', config.colorClass)}>
          {t(config.key)}
        </p>
      )}
    </div>
  )
}
