/**
 * Lead Card Component
 * Phase 5: CRM Module - Lead Management
 *
 * Draggable card for Kanban board
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  GripVertical,
  Phone,
  Mail,
  Calendar,
  Clock,
  Globe,
  Users,
  PhoneCall,
  Presentation,
  MessageCircle,
  Share2,
  Mail as MailIcon,
} from 'lucide-react'
import { formatDistanceToNow, format, differenceInDays } from 'date-fns'
import type { Lead, LeadSource, LeadPriority } from '../types/lead.types'

interface LeadCardProps {
  lead: Lead
  onClick?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  isDragging?: boolean
}

// Source badge configuration (labels resolved via i18n)
const sourceConfig: Record<LeadSource, { labelKey: string; className: string; icon: typeof Globe }> = {
  website: { labelKey: 'status.website', className: 'bg-blue-100 text-blue-800', icon: Globe },
  referral: { labelKey: 'status.referral', className: 'bg-green-100 text-green-800', icon: Users },
  'cold-call': { labelKey: 'status.coldCall', className: 'bg-orange-100 text-orange-800', icon: PhoneCall },
  exhibition: { labelKey: 'status.exhibition', className: 'bg-purple-100 text-purple-800', icon: Presentation },
  whatsapp: { labelKey: 'status.whatsapp', className: 'bg-emerald-100 text-emerald-800', icon: MessageCircle },
  'social-media': { labelKey: 'status.social', className: 'bg-pink-100 text-pink-800', icon: Share2 },
  'email-campaign': { labelKey: 'status.email', className: 'bg-primary/10 text-primary', icon: MailIcon },
}

// Priority badge configuration (labels resolved via i18n)
const priorityConfig: Record<LeadPriority, { labelKey: string; className: string }> = {
  low: { labelKey: 'status.low', className: 'bg-gray-100 text-gray-700' },
  medium: { labelKey: 'status.medium', className: 'bg-blue-100 text-blue-700' },
  high: { labelKey: 'status.high', className: 'bg-amber-100 text-amber-700' },
  urgent: { labelKey: 'status.urgent', className: 'bg-red-100 text-red-700' },
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function LeadCard({
  lead,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: LeadCardProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const source = sourceConfig[lead.source]
  const priority = priorityConfig[lead.priority]
  const SourceIcon = source.icon

  // Calculate days until expected close
  const daysUntilClose = useMemo(() => {
    if (!lead.expectedCloseDate) return null
    return differenceInDays(new Date(lead.expectedCloseDate), new Date())
  }, [lead.expectedCloseDate])

  // Format last activity time
  const lastActivity = useMemo(() => {
    const date = lead.lastContactDate || lead.updatedAt
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }, [lead.lastContactDate, lead.updatedAt])

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50',
        isDragging && 'opacity-50 rotate-2 shadow-lg scale-105'
      )}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <CardContent className="p-3">
        {/* Header: Drag handle + Name + Company */}
        <div className="flex items-start gap-2">
          <div
            className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{lead.name}</p>
            {lead.company && (
              <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
            )}
          </div>
          {lead.priority !== 'low' && (
            <Badge className={cn('text-[10px] px-1.5 py-0', priority.className)}>
              {t(priority.labelKey)}
            </Badge>
          )}
        </div>

        {/* Source Badge */}
        <div className="mt-2 flex items-center gap-2">
          <Badge className={cn('text-[10px] px-1.5 py-0 flex items-center gap-1', source.className)}>
            <SourceIcon className="h-3 w-3" />
            {t(source.labelKey)}
          </Badge>
        </div>

        {/* Contact Info */}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.phone}</span>
          </span>
          <span className="flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate max-w-[80px]">{lead.email.split('@')[0]}</span>
          </span>
        </div>

        {/* Estimated Value */}
        <div className="mt-2">
          <p className="text-sm font-semibold text-emerald-600">
            {formatAmount(lead.estimatedValue.min)} - {formatAmount(lead.estimatedValue.max)}
          </p>
        </div>

        {/* Expected Close Date */}
        {lead.expectedCloseDate && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{format(new Date(lead.expectedCloseDate), 'MMM d, yyyy')}</span>
            {daysUntilClose !== null && (
              <Badge
                className={cn(
                  'text-[10px] px-1.5 py-0',
                  daysUntilClose <= 7
                    ? 'bg-red-100 text-red-700'
                    : daysUntilClose <= 14
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                )}
              >
                {daysUntilClose === 0
                  ? t('crm.todayLabel')
                  : daysUntilClose < 0
                  ? t('crm.dOverdue', { count: Math.abs(daysUntilClose) })
                  : t('crm.dLeft', { count: daysUntilClose })}
              </Badge>
            )}
          </div>
        )}

        {/* Tags */}
        {lead.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {lead.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{lead.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer: Assigned user + Last activity */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          {lead.assignedTo ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarImage src={lead.assignedTo.avatar} />
                <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                  {getInitials(lead.assignedTo.name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate max-w-[60px]">{lead.assignedTo.name.split(' ')[0]}</span>
            </div>
          ) : (
            <span className="text-amber-600">{t('crm.unassigned')}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {lastActivity}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default LeadCard
