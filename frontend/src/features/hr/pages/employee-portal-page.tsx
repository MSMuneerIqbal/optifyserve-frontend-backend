/**
 * Employee Self-Service Portal Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { EmployeeSelfService } from '../components/employee-self-service'
import { LeaveApplicationForm } from '../components/leave-application-form'
import { PayslipPreview } from '../components/payslip-preview'
import { sampleEmployees, sampleLeaveBalances, samplePayslips } from '@/data/employees.data'
import { toast } from 'sonner'
import type { Payslip } from '../types/payroll.types'
import type { Employee } from '../types/employee.types'

export function EmployeePortalPage() {
  const { t } = useTranslation()
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false)
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  const isLoading = false

  // Use first employee as the "current user"
  const employee = sampleEmployees[0]
  const balances = sampleLeaveBalances
  const payslips = samplePayslips.filter((p) => p.employeeId === employee.id)

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title={t('hr.portalTitle')} description={t('hr.portalDescription')} />
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          {t('hr.loadingPortal')}
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <PageHeader title={t('hr.portalTitle')} description={t('hr.portalDescription')} />
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          {t('hr.noEmployeeData')}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title={t('hr.portalTitle')} description={t('hr.portalDescription')} />

      <EmployeeSelfService
        employee={employee as Employee}
        leaveBalances={balances}
        recentPayslips={payslips.slice(0, 6)}
        attendanceSummary={{ present: 18, absent: 1, late: 2, totalHours: 152 }}
        onApplyLeave={() => setIsLeaveFormOpen(true)}
        onCheckIn={() => { setIsCheckedIn(true); toast.success(t('hr.checkedIn')) }}
        onCheckOut={() => { setIsCheckedIn(false); toast.success(t('hr.checkedOut')) }}
        onViewPayslip={setSelectedPayslip}
        isCheckedIn={isCheckedIn}
      />

      <LeaveApplicationForm
        isOpen={isLeaveFormOpen}
        onClose={() => setIsLeaveFormOpen(false)}
        onSubmit={() => { toast.success(t('hr.leaveApplicationSubmitted')); setIsLeaveFormOpen(false) }}
        isLoading={false}
        leaveBalances={balances}
      />

      <PayslipPreview
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  )
}

export default EmployeePortalPage
