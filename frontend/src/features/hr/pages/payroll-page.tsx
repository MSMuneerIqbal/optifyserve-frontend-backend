/**
 * Payroll Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { PayrollForm } from '../components/payroll-form'
import { PayslipGenerator } from '../components/payslip-generator'
import { PayslipPreview } from '../components/payslip-preview'
import { sampleDepartments, samplePayslips } from '@/data/employees.data'
import { toast } from 'sonner'
import type { Payslip } from '../types/payroll.types'

export function PayrollPage() {
  const { t } = useTranslation()
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)

  const isLoading = false
  const isSubmitting = false

  const departments = sampleDepartments
  const payslips: Payslip[] = samplePayslips
  const branches: Array<{ id: string; name: string }> = []

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title={t('hr.payrollTitle')} description={t('hr.payrollDescription')} />

      <PayrollForm
        onProcess={(_data) => toast.success(t('hr.payrollProcessed'))}
        isProcessing={isSubmitting}
        departments={departments.map((d) => ({ id: d.id, name: d.name }))}
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
      />

      <PayslipGenerator
        payslips={payslips}
        isLoading={isLoading}
        onViewPayslip={setSelectedPayslip}
      />

      <PayslipPreview
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        payslip={selectedPayslip}
      />
    </div>
  )
}

export default PayrollPage
