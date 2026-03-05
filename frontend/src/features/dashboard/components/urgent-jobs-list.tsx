/**
 * Urgent Jobs List Component
 * Phase 3: Dashboard Module
 *
 * Displays urgent/delayed jobs requiring attention
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MapPin,
  Clock,
  User,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UrgentJob } from '../types/dashboard.types'
import { Link } from 'react-router-dom'

interface UrgentJobsListProps {
  jobs: UrgentJob[]
  isLoading?: boolean
}

// Status badge variants
const statusConfig: Record<
  string,
  { key: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
  pending: {
    key: 'common.pending',
    variant: 'secondary',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  delayed: {
    key: 'common.overdue',
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  'on-site': {
    key: 'common.onSite',
    variant: 'default',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  completed: {
    key: 'common.completed',
    variant: 'default',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  cancelled: {
    key: 'common.cancelled',
    variant: 'outline',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

// Priority badge variants
const priorityConfig: Record<
  string,
  { key: string; className: string }
> = {
  urgent: {
    key: 'dashboard.urgentPriority',
    className: 'bg-red-500 text-white',
  },
  high: {
    key: 'dashboard.highPriority',
    className: 'bg-orange-500 text-white',
  },
  medium: {
    key: 'dashboard.mediumPriority',
    className: 'bg-yellow-500 text-white',
  },
  low: {
    key: 'dashboard.lowPriority',
    className: 'bg-gray-400 text-white',
  },
}

interface JobCardProps {
  job: UrgentJob
}

function JobCard({ job }: JobCardProps) {
  const { t } = useTranslation()
  const status = statusConfig[job.status] || statusConfig.pending
  const priority = priorityConfig[job.priority] || priorityConfig.medium

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors group">
      <div className="flex items-start gap-2">
        {/* Priority indicator */}
        <div
          className={cn(
            'w-1 min-h-[60px] self-stretch rounded-full flex-shrink-0',
            job.priority === 'urgent' && 'bg-red-500',
            job.priority === 'high' && 'bg-orange-500',
            job.priority === 'medium' && 'bg-yellow-500',
            job.priority === 'low' && 'bg-gray-400'
          )}
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Header row */}
          <div className="flex items-center flex-wrap gap-1.5">
            <Badge variant="outline" className="font-mono text-xs">
              {job.jobNumber}
            </Badge>
            <Badge className={cn('text-xs', priority.className)}>
              {t(priority.key)}
            </Badge>
            <Badge className={cn('text-xs', status.className)}>
              {t(status.key)}
            </Badge>
          </div>

          {/* Customer and service */}
          <div>
            <p className="font-semibold text-sm truncate">{job.customer}</p>
            <p className="text-xs text-muted-foreground truncate">{job.serviceType}</p>
          </div>

          {/* Address */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{job.address}, {job.emirate}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{job.address}, {job.emirate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Technician and time */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {job.assignedTechnician ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <Avatar className="h-5 w-5 flex-shrink-0">
                  <AvatarImage src={job.assignedTechnician.avatar} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {getInitials(job.assignedTechnician.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {job.assignedTechnician.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                <span className="text-xs font-medium">{t('dashboard.unassigned')}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Clock className="h-3 w-3" />
              <span
                className={cn(
                  job.status === 'delayed' && 'text-red-600 font-medium'
                )}
              >
                {job.timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UrgentJobsList({ jobs, isLoading }: UrgentJobsListProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {t('dashboard.urgentJobs')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse text-muted-foreground">
            {t('dashboard.loadingJobs')}
          </div>
        </CardContent>
      </Card>
    )
  }

  const urgentCount = jobs.filter(
    (j) => j.status === 'delayed' || j.priority === 'urgent'
  ).length

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {t('dashboard.urgentJobs')}
            {urgentCount > 0 && (
              <Badge variant="destructive" className="ms-2">
                {urgentCount}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/jobs" className="flex items-center gap-1">
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium text-foreground">{t('dashboard.allClear')}</p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noUrgentJobs')}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full max-h-[500px]">
            <div className="divide-y">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default UrgentJobsList
