/**
 * Recent Activity Component
 * Phase 3: Dashboard Module
 *
 * Displays timeline of recent activities across the system
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FileText,
  DollarSign,
  CheckCircle2,
  UserPlus,
  Send,
  Target,
  Package,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import type { RecentActivity, ActivityType } from '../types/dashboard.types'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  activities: RecentActivity[]
  isLoading?: boolean
}

// Activity type configuration
const activityConfig: Record<
  ActivityType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  invoice_created: {
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  payment_received: {
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  job_completed: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  customer_added: {
    icon: UserPlus,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  quotation_sent: {
    icon: Send,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  lead_converted: {
    icon: Target,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  stock_alert: {
    icon: Package,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
}

interface ActivityItemProps {
  activity: RecentActivity
  isLast: boolean
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const { formatAmount } = useCurrency()
  const config = activityConfig[activity.type] || {
    icon: Activity,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  }
  const Icon = config.icon

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Format time ago
  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), {
    addSuffix: true,
  })

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Timeline line and icon */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0',
            config.bgColor
          )}
        >
          <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', config.color)} />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-border my-2" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 pb-4', !isLast && 'pb-6')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{activity.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {activity.description}
            </p>

            {/* Metadata badges */}
            {activity.metadata && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activity.metadata.amount && (
                  <Badge variant="secondary" className="text-xs font-medium">
                    {formatAmount(activity.metadata.amount)}
                  </Badge>
                )}
                {activity.metadata.reference && (
                  <Badge variant="outline" className="text-xs font-mono">
                    {activity.metadata.reference}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            {timeAgo}
          </span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={activity.user.avatar} />
            <AvatarFallback className="text-[8px] bg-muted">
              {getInitials(activity.user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {activity.user.name}
          </span>
        </div>
      </div>
    </div>
  )
}

export function RecentActivityFeed({ activities, isLoading }: RecentActivityProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <div className="animate-pulse text-muted-foreground">
            {t('dashboard.loadingActivities')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          {t('dashboard.recentActivity')}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <Activity className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noRecentActivity')}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] sm:h-[350px] pr-4">
            <div className="space-y-0">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isLast={index === activities.length - 1}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivityFeed
