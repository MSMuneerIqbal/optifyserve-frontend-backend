/**
 * Leave Management Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { LeaveList } from '../components/leave-list'
import { LeaveApplicationForm } from '../components/leave-application-form'
import { LeaveApprovalModal } from '../components/leave-approval-modal'
import { LeaveBalanceCard } from '../components/leave-balance-card'
import { sampleLeaveRequests, sampleLeaveBalances } from '@/data/employees.data'
import { toast } from 'sonner'
import { CalendarPlus } from 'lucide-react'
import type { LeaveRequest, LeaveFilters, LeaveApplicationFormData } from '../types/leave.types'

export function LeavesPage() {
  const { t } = useTranslation()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [approvalRequest, setApprovalRequest] = useState<LeaveRequest | null>(null)
  const [filters] = useState<LeaveFilters>({})

  const isLoading = false
  const isSubmitting = false

  const list = sampleLeaveRequests
  const balances = sampleLeaveBalances

  const handleApplyLeave = (_data: LeaveApplicationFormData) => {
    toast.success(t('hr.leaveSubmitted'))
    setIsFormOpen(false)
  }

  const handleApprove = (_id: string, _comments?: string) => {
    toast.success(t('hr.leaveApproved'))
    setApprovalRequest(null)
  }

  const handleReject = (_id: string, _comments: string) => {
    toast.success(t('hr.leaveRejected'))
    setApprovalRequest(null)
  }

  // Apply filters
  let filteredList = [...list]
  if (filters.status) {
    filteredList = filteredList.filter((r) => r.status === filters.status)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={t('hr.leavesTitle')}
        description={t('hr.leavesDescription')}
        actions={
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-10"
          >
            <CalendarPlus className="h-4 w-4 me-2" />
            {t('hr.applyLeave')}
          </button>
        }
      />

      {/* Leave Balance */}
      <LeaveBalanceCard balances={balances} />

      {/* Leave Requests */}
      <LeaveList
        requests={filteredList}
        isLoading={isLoading}
        onApprove={(id) => {
          const req = list.find((r) => r.id === id)
          if (req) setApprovalRequest(req)
        }}
        onReject={(id) => {
          const req = list.find((r) => r.id === id)
          if (req) setApprovalRequest(req)
        }}
        onCancel={(_id) => toast.success(t('hr.leaveCancelled'))}
        isManager={true}
      />

      {/* Apply Leave Form */}
      <LeaveApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleApplyLeave}
        isLoading={isSubmitting}
        leaveBalances={balances}
      />

      {/* Approval Modal */}
      <LeaveApprovalModal
        isOpen={!!approvalRequest}
        onClose={() => setApprovalRequest(null)}
        request={approvalRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default LeavesPage
