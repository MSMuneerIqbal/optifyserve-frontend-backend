/**
 * Leave List Component
 * Phase 10: HR Module
 *
 * Table listing leave requests with manager and employee views.
 * Managers can approve/reject; employees can cancel pending requests.
 */

import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatDate, getInitials } from '@/lib/utils'
import { Check, X, Ban, CalendarDays } from 'lucide-react'
import type { LeaveRequest, LeaveStatus } from '../types/leave.types'
import { LEAVE_STATUS_CONFIG } from '../types/leave.types'

// ---------------------------------------------------------------------------
// Status colour map (badge classes)
// ---------------------------------------------------------------------------

const STATUS_BADGE_CLASS: Record<LeaveStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
  cancelled: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LeaveListProps {
  requests: LeaveRequest[]
  isLoading: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCancel: (id: string) => void
  isManager: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeaveList({
  requests,
  isLoading,
  onApprove,
  onReject,
  onCancel,
  isManager,
}: LeaveListProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-md border bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('hr.employee')}</TableHead>
            <TableHead>{t('hr.leaveType')}</TableHead>
            <TableHead>{t('hr.startDate')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('hr.endDate')}</TableHead>
            <TableHead className="hidden sm:table-cell">{t('hr.days')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            <TableHead className="text-end">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  <span className="text-sm">{t('hr.loadingLeaveRequests')}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 opacity-40" />
                  <p className="font-medium">{t('hr.noLeaveRequestsFound')}</p>
                  <p className="text-sm">{t('hr.leaveRequestsAppearHere')}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => {
              const config = LEAVE_STATUS_CONFIG[request.status]
              const isPending = request.status === 'pending'

              return (
                <TableRow key={request.id} className="min-h-[52px]">
                  {/* Employee */}
                  <TableCell>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {request.employeePhoto && (
                          <AvatarImage src={request.employeePhoto} alt={request.employeeName} />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(request.employeeName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{request.employeeName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {request.departmentName}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Leave Type */}
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-medium whitespace-nowrap">
                      {request.leaveTypeName}
                    </Badge>
                  </TableCell>

                  {/* Start Date */}
                  <TableCell>
                    <span className="text-sm whitespace-nowrap">{formatDate(request.startDate)}</span>
                  </TableCell>

                  {/* End Date - hidden on mobile */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm whitespace-nowrap">{formatDate(request.endDate)}</span>
                  </TableCell>

                  {/* Days - hidden on mobile */}
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm font-medium">
                      {request.totalDays} {request.totalDays === 1 ? t('hr.day') : t('hr.days')}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={cn('text-xs font-medium', STATUS_BADGE_CLASS[request.status])}
                    >
                      {t(config.key)}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      {isManager && isPending && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title={t('common.approve')}
                            onClick={() => onApprove(request.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">{t('common.approve')}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title={t('common.reject')}
                            onClick={() => onReject(request.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">{t('common.reject')}</span>
                          </Button>
                        </>
                      )}

                      {!isManager && isPending && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          title={t('hr.cancelRequest')}
                          onClick={() => onCancel(request.id)}
                        >
                          <Ban className="h-4 w-4" />
                          <span className="sr-only">{t('common.cancel')}</span>
                        </Button>
                      )}

                      {!isPending && (
                        <span className="text-xs text-muted-foreground px-2">—</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default LeaveList
