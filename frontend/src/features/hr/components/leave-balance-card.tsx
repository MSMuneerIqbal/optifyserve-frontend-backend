/**
 * Leave Balance Card Component
 * Phase 10: HR Module
 *
 * Displays a grid of cards showing entitlement, taken days,
 * and remaining balance for each leave type.
 * Color-coded by percentage remaining.
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CalendarDays, TrendingDown } from 'lucide-react'
import type { LeaveBalance } from '../types/leave.types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBalanceColor(balance: number, entitled: number): {
  bar: string
  text: string
  bg: string
  border: string
} {
  if (entitled === 0) {
    return {
      bar: 'bg-gray-300',
      text: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    }
  }

  const pct = (balance / entitled) * 100

  if (pct > 50) {
    return {
      bar: 'bg-green-500',
      text: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
    }
  }

  if (pct >= 25) {
    return {
      bar: 'bg-amber-500',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    }
  }

  return {
    bar: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LeaveBalanceCardProps {
  balances: LeaveBalance[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeaveBalanceCard({ balances }: LeaveBalanceCardProps) {
  const { t } = useTranslation()

  if (!balances || balances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
        <CalendarDays className="h-8 w-8 opacity-40" />
        <p className="text-sm">{t('hr.noLeaveBalancesAvailable')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {balances.map((balance) => {
        const takenPct =
          balance.entitled > 0
            ? Math.min(100, (balance.taken / balance.entitled) * 100)
            : 0

        const colors = getBalanceColor(balance.balance, balance.entitled)

        return (
          <Card
            key={balance.leaveTypeId}
            className={cn(
              'border transition-shadow hover:shadow-md',
              colors.border
            )}
          >
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-1">
                <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                  {balance.leaveTypeName}
                </p>
                <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>

              {/* Balance Number */}
              <div className="space-y-0.5">
                <p className={cn('text-2xl font-bold', colors.text)}>
                  {balance.balance}
                </p>
                <p className="text-xs text-muted-foreground">{t('hr.daysRemaining')}</p>
              </div>

              {/* Progress Bar (taken / entitled) */}
              <div className="space-y-1.5">
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', colors.bar)}
                    style={{ width: `${takenPct}%` }}
                  />
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">{balance.taken}</span> {t('hr.taken')}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">{balance.entitled}</span> {t('hr.entitled')}
                  </span>
                </div>
              </div>

              {/* Pending indicator */}
              {balance.pending > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <TrendingDown className="h-3 w-3" />
                  <span>{balance.pending} {t('hr.pending')}</span>
                </div>
              )}

              {/* Carry Forward */}
              {balance.carriedForward > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{balance.carriedForward} {t('hr.carriedFwd')}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default LeaveBalanceCard
