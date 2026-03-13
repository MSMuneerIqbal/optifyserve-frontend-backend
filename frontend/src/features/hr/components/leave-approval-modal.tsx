/**
 * Leave Approval Modal
 * Phase 10: HR Module
 *
 * Dialog for managers to approve or reject a leave request.
 * Rejection requires a comment; approval allows an optional comment.
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Check, X, CalendarDays, User, Clock, FileText } from 'lucide-react'
import { cn, formatDate, getInitials } from '@/lib/utils'
import type { LeaveRequest } from '../types/leave.types'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LeaveApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  request: LeaveRequest | null
  onApprove: (id: string, comments?: string) => void
  onReject: (id: string, comments: string) => void
  isLoading: boolean
}

// ---------------------------------------------------------------------------
// Detail Row helper
// ---------------------------------------------------------------------------

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center gap-1.5 w-32 flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeaveApprovalModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
  isLoading,
}: LeaveApprovalModalProps) {
  const { t } = useTranslation()
  const [comments, setComments] = useState('')
  const [rejectError, setRejectError] = useState('')

  // Reset state when the modal opens with a new request
  useEffect(() => {
    if (isOpen) {
      setComments('')
      setRejectError('')
    }
  }, [isOpen, request?.id])

  if (!request) return null

  const handleApprove = () => {
    onApprove(request.id, comments.trim() || undefined)
  }

  const handleReject = () => {
    if (!comments.trim()) {
      setRejectError(t('hr.pleaseProvideRejectReason'))
      return
    }
    setRejectError('')
    onReject(request.id, comments.trim())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            {t('hr.leaveApproval')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {request.employeePhoto && (
                <AvatarImage src={request.employeePhoto} alt={request.employeeName} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(request.employeeName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{request.employeeName}</p>
              <p className="text-xs text-muted-foreground">{request.departmentName}</p>
            </div>
            <Badge variant="outline" className="ms-auto text-xs">
              {request.leaveTypeName}
            </Badge>
          </div>

          <Separator />

          {/* Leave Details */}
          <div className="space-y-3">
            <DetailRow
              icon={CalendarDays}
              label={t('hr.startDate')}
              value={formatDate(request.startDate)}
            />
            <DetailRow
              icon={CalendarDays}
              label={t('hr.endDate')}
              value={formatDate(request.endDate)}
            />
            <DetailRow
              icon={Clock}
              label={t('hr.duration')}
              value={
                <span>
                  <strong>{request.totalDays}</strong>{' '}
                  {request.totalDays === 1 ? t('hr.day') : t('hr.days')}
                  {request.duration !== 'full-day' && (
                    <span className="ms-1 text-muted-foreground text-xs">
                      ({request.duration === 'half-day-morning' ? t('hr.morning') : t('hr.afternoon')})
                    </span>
                  )}
                </span>
              }
            />
            <DetailRow
              icon={User}
              label={t('hr.appliedOn')}
              value={formatDate(request.appliedAt)}
            />
          </div>

          {/* Reason */}
          {request.reason && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('hr.reason')}</p>
                </div>
                <p className="text-sm leading-relaxed text-foreground bg-muted/50 p-3 rounded-md">
                  {request.reason}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Manager Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              {t('hr.comments')}{' '}
              <span className="text-muted-foreground font-normal">({t('hr.requiredForRejection')})</span>
            </Label>
            <Textarea
              id="comments"
              placeholder={t('hr.commentsPlaceholder')}
              value={comments}
              onChange={(e) => {
                setComments(e.target.value)
                if (rejectError && e.target.value.trim()) setRejectError('')
              }}
              rows={3}
              className={cn('resize-none', rejectError && 'border-red-400 focus-visible:ring-red-400')}
            />
            {rejectError && (
              <p className="text-xs text-red-600">{rejectError}</p>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="sm:me-auto"
          >
            {t('common.cancel')}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            disabled={isLoading}
            onClick={handleReject}
          >
            {isLoading ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="me-2 h-4 w-4" />
            )}
            {t('common.reject')}
          </Button>

          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
            onClick={handleApprove}
          >
            {isLoading ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="me-2 h-4 w-4" />
            )}
            {t('common.approve')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveApprovalModal
