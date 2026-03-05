/**
 * Payslip Preview / Print Component
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCurrency } from '@/contexts/currency-context'
import { Printer } from 'lucide-react'
import type { Payslip } from '../types/payroll.types'
import { MONTH_NAME_KEYS, PAYSLIP_STATUS_CONFIG } from '../types/payroll.types'

interface PayslipPreviewProps {
  isOpen: boolean
  onClose: () => void
  payslip: Payslip | null
}

export function PayslipPreview({ isOpen, onClose, payslip }: PayslipPreviewProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()

  if (!payslip) return null

  const handlePrint = () => {
    window.print()
  }

  const config = PAYSLIP_STATUS_CONFIG[payslip.status]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t('hr.payslip')} - {t(MONTH_NAME_KEYS[payslip.month - 1])} {payslip.year}</DialogTitle>
            <Badge variant="secondary">{t(config.key)}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 print:text-black" id="payslip-content">
          {/* Company Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-lg font-bold">{t('hr.payslipCompanyHeader')}</h2>
            <p className="text-sm text-muted-foreground">{t('hr.monthlySalarySlip')}</p>
            <p className="text-sm font-medium mt-1">{t(MONTH_NAME_KEYS[payslip.month - 1])} {payslip.year}</p>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t('hr.employeeName')}</p>
              <p className="font-medium">{payslip.employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('hr.employeeId')}</p>
              <p className="font-medium">{payslip.employeeIdNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.department')}</p>
              <p className="font-medium">{payslip.departmentName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('hr.designation')}</p>
              <p className="font-medium">{payslip.designationName}</p>
            </div>
          </div>

          {/* Working Days */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 bg-muted/50 rounded text-center">
              <p className="text-xs text-muted-foreground">{t('hr.workingDays')}</p>
              <p className="font-bold text-lg">{payslip.totalWorkingDays}</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded text-center">
              <p className="text-xs text-muted-foreground">{t('hr.present')}</p>
              <p className="font-bold text-lg text-green-600">{payslip.presentDays}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded text-center">
              <p className="text-xs text-muted-foreground">{t('hr.absent')}</p>
              <p className="font-bold text-lg text-red-600">{payslip.absentDays}</p>
            </div>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings */}
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-2">{t('hr.earnings')}</h4>
              <div className="space-y-1.5 text-sm">
                <PayRow label={t('hr.basicSalary')} amount={payslip.basicSalary} />
                <PayRow label={t('hr.housingAllowance')} amount={payslip.housingAllowance} />
                <PayRow label={t('hr.transportAllowance')} amount={payslip.transportAllowance} />
                <PayRow label={t('hr.mobileAllowance')} amount={payslip.mobileAllowance} />
                {payslip.otherAllowances > 0 && <PayRow label={t('hr.otherAllowances')} amount={payslip.otherAllowances} />}
                {payslip.overtimeAmount > 0 && (
                  <PayRow label={`${t('hr.overtime')} (${payslip.overtimeHours}h)`} amount={payslip.overtimeAmount} />
                )}
                <Separator />
                <PayRow label={t('hr.totalEarnings')} amount={payslip.totalEarnings} bold className="text-green-600" />
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-2">{t('hr.deductions')}</h4>
              <div className="space-y-1.5 text-sm">
                {payslip.absenceDeduction > 0 && <PayRow label={t('hr.absenceDeduction')} amount={payslip.absenceDeduction} />}
                {payslip.lateDeduction > 0 && <PayRow label={t('hr.lateDeduction')} amount={payslip.lateDeduction} />}
                {payslip.loanRepayment > 0 && <PayRow label={t('hr.loanRepayment')} amount={payslip.loanRepayment} />}
                {payslip.advanceRecovery > 0 && <PayRow label={t('hr.advanceRecovery')} amount={payslip.advanceRecovery} />}
                {payslip.otherDeductions > 0 && <PayRow label={t('hr.otherDeductions')} amount={payslip.otherDeductions} />}
                {payslip.totalDeductions === 0 && (
                  <p className="text-muted-foreground italic">{t('hr.noDeductions')}</p>
                )}
                <Separator />
                <PayRow label={t('hr.totalDeductions')} amount={payslip.totalDeductions} bold className="text-red-600" />
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
            <p className="text-sm text-emerald-700">{t('hr.netSalary')}</p>
            <p className="text-3xl font-bold text-emerald-600">{formatAmount(payslip.netSalary)}</p>
          </div>

          {/* Payment Details */}
          {payslip.bankName && (
            <div className="text-sm space-y-1">
              <h4 className="font-medium">{t('hr.paymentDetails')}</h4>
              <p className="text-muted-foreground">
                {t('common.bankName')}: {payslip.bankName} | {t('common.accountNumber')}: {payslip.accountNumber}
                {payslip.iban && ` | ${t('hr.ibanLabel')}: ${payslip.iban}`}
              </p>
              <p className="text-muted-foreground">{t('hr.paymentMethod')}: {payslip.paymentMethod?.replace('_', ' ')}</p>
            </div>
          )}
        </div>

        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={onClose}>{t('common.close')}</Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 me-2" />
            {t('common.print')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PayRow({ label, amount, bold, className }: { label: string; amount: number; bold?: boolean; className?: string }) {
  const { formatAmount } = useCurrency()
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold' : ''} ${className || ''}`}>
      <span>{label}</span>
      <span>{formatAmount(amount)}</span>
    </div>
  )
}

export default PayslipPreview
