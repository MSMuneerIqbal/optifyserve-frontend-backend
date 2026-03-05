import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { StatusBadgeVariant } from '@/types/common.types'

interface StatusBadgeProps {
  variant: StatusBadgeVariant
  children: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  success: 'bg-green-100 text-green-700 hover:bg-green-100',
  warning: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  error: 'bg-red-100 text-red-700 hover:bg-red-100',
  info: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  neutral: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
}

const dotColors: Record<StatusBadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-500',
}

export function StatusBadge({
  variant,
  children,
  size = 'md',
  className,
  dot = false,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-medium',
        variantStyles[variant],
        size === 'sm' ? 'px-1.5 py-0 text-xs' : 'px-2 py-0.5 text-xs',
        className
      )}
    >
      {dot && (
        <span
          className={cn('me-1.5 inline-block h-1.5 w-1.5 rounded-full', dotColors[variant])}
        />
      )}
      {children}
    </Badge>
  )
}

// Pre-configured status badges for common statuses
export function ActiveStatusBadge() {
  const { t } = useTranslation()
  return (
    <StatusBadge variant="success" dot>
      {t('status.active')}
    </StatusBadge>
  )
}

export function InactiveStatusBadge() {
  const { t } = useTranslation()
  return (
    <StatusBadge variant="neutral" dot>
      {t('status.inactive')}
    </StatusBadge>
  )
}

export function PendingStatusBadge() {
  const { t } = useTranslation()
  return (
    <StatusBadge variant="warning" dot>
      {t('status.pending')}
    </StatusBadge>
  )
}

export function BlockedStatusBadge() {
  const { t } = useTranslation()
  return (
    <StatusBadge variant="error" dot>
      {t('status.blocked')}
    </StatusBadge>
  )
}

// Invoice status badges
export function InvoiceStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const statusMap: Record<string, { variant: StatusBadgeVariant; key: string }> = {
    draft: { variant: 'neutral', key: 'status.draft' },
    sent: { variant: 'info', key: 'status.sent' },
    'partially-paid': { variant: 'warning', key: 'status.partiallyPaid' },
    paid: { variant: 'success', key: 'status.paid' },
    overdue: { variant: 'error', key: 'status.overdue' },
    cancelled: { variant: 'neutral', key: 'status.cancelled' },
  }

  const config = statusMap[status]

  return <StatusBadge variant={config?.variant || 'neutral'}>{config ? t(config.key) : status}</StatusBadge>
}

// Lead stage badges
export function LeadStageBadge({ stage }: { stage: string }) {
  const { t } = useTranslation()
  const stageMap: Record<string, { variant: StatusBadgeVariant; key: string }> = {
    new: { variant: 'info', key: 'status.newLeads' },
    'follow-up': { variant: 'warning', key: 'status.followUp' },
    qualified: { variant: 'success', key: 'status.qualified' },
    'closed-won': { variant: 'success', key: 'status.closedWon' },
    'closed-lost': { variant: 'error', key: 'status.closedLost' },
  }

  const config = stageMap[stage]

  return <StatusBadge variant={config?.variant || 'neutral'}>{config ? t(config.key) : stage}</StatusBadge>
}

// Job status badges
export function JobStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const statusMap: Record<string, { variant: StatusBadgeVariant; key: string }> = {
    pending: { variant: 'warning', key: 'status.pending' },
    scheduled: { variant: 'info', key: 'status.scheduled' },
    'in-progress': { variant: 'info', key: 'status.inProgress' },
    'on-hold': { variant: 'warning', key: 'status.onHold' },
    completed: { variant: 'success', key: 'status.completed' },
    cancelled: { variant: 'neutral', key: 'status.cancelled' },
  }

  const config = statusMap[status]

  return <StatusBadge variant={config?.variant || 'neutral'} dot>{config ? t(config.key) : status}</StatusBadge>
}

export default StatusBadge
