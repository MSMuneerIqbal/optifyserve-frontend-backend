import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'

interface CurrencyDisplayProps {
  amount: number
  showColor?: boolean
  compact?: boolean
  showSymbol?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base font-medium',
}

export function CurrencyDisplay({
  amount,
  showColor = false,
  compact = false,
  showSymbol = true,
  className,
  size = 'md',
}: CurrencyDisplayProps) {
  const { formatAmount, formatCompact } = useCurrency()

  const formattedAmount = compact
    ? formatCompact(amount)
    : formatAmount(amount, showSymbol)

  const colorClass = showColor
    ? amount > 0
      ? 'text-green-600'
      : amount < 0
        ? 'text-red-600'
        : 'text-foreground'
    : ''

  return (
    <span className={cn('tabular-nums', sizeClasses[size], colorClass, className)}>
      {formattedAmount}
    </span>
  )
}

// Balance display with positive/negative styling
export function BalanceDisplay({
  amount,
  label,
  className,
}: {
  amount: number
  label?: string
  className?: string
}) {
  const { formatAmount } = useCurrency()
  const isPositive = amount > 0
  const isNegative = amount < 0

  return (
    <div className={cn('flex flex-col', className)}>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <span
        className={cn(
          'text-lg font-semibold tabular-nums',
          isPositive && 'text-green-600',
          isNegative && 'text-red-600'
        )}
      >
        {isNegative ? '-' : ''}
        {formatAmount(Math.abs(amount))}
      </span>
    </div>
  )
}

// VAT amount display
export function VATDisplay({
  subtotal,
  vatAmount,
  total,
  className,
}: {
  subtotal: number
  vatAmount: number
  total: number
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t('sales.subtotal')}</span>
        <CurrencyDisplay amount={subtotal} />
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">{t('sales.vatAmount')}</span>
        <CurrencyDisplay amount={vatAmount} />
      </div>
      <div className="flex justify-between border-t pt-2">
        <span className="font-medium">{t('common.total')}</span>
        <CurrencyDisplay amount={total} size="lg" />
      </div>
    </div>
  )
}

// Compact currency for cards/stats
export function CompactCurrencyDisplay({
  amount,
  trend,
  trendDirection,
  className,
}: {
  amount: number
  trend?: number
  trendDirection?: 'up' | 'down'
  className?: string
}) {
  const { formatCompact } = useCurrency()
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className="text-2xl font-bold tabular-nums">{formatCompact(amount)}</span>
      {trend !== undefined && (
        <span
          className={cn(
            'text-xs font-medium',
            trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {trendDirection === 'up' ? '+' : '-'}
          {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  )
}

export default CurrencyDisplay
