/**
 * Payslip Generator / List Component
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { Eye, FileText } from 'lucide-react'
import type { Payslip } from '../types/payroll.types'
import { PAYSLIP_STATUS_CONFIG } from '../types/payroll.types'

interface PayslipGeneratorProps {
  payslips: Payslip[]
  isLoading: boolean
  onViewPayslip: (payslip: Payslip) => void
}

export function PayslipGenerator({ payslips, isLoading, onViewPayslip }: PayslipGeneratorProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const totalDeductions = payslips.reduce((sum, p) => sum + p.totalDeductions, 0)
  const totalNet = payslips.reduce((sum, p) => sum + p.netSalary, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('hr.payslips')}
          <Badge variant="secondary" className="ms-2">{payslips.length} {t('hr.employees')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('hr.employee')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('common.department')}</TableHead>
                <TableHead className="text-end">{t('hr.basic')}</TableHead>
                <TableHead className="text-end hidden sm:table-cell">{t('hr.allowances')}</TableHead>
                <TableHead className="text-end hidden lg:table-cell">{t('hr.overtime')}</TableHead>
                <TableHead className="text-end hidden sm:table-cell">{t('hr.deductions')}</TableHead>
                <TableHead className="text-end">{t('hr.netSalary')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : payslips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    {t('hr.noPayslipsGenerated')}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {payslips.map((payslip) => {
                    const config = PAYSLIP_STATUS_CONFIG[payslip.status]
                    const allowances = payslip.housingAllowance + payslip.transportAllowance + payslip.mobileAllowance + payslip.otherAllowances
                    return (
                      <TableRow key={payslip.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewPayslip(payslip)}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{payslip.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{payslip.employeeIdNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{payslip.departmentName}</TableCell>
                        <TableCell className="text-end text-sm">{formatAmount(payslip.basicSalary)}</TableCell>
                        <TableCell className="text-end text-sm hidden sm:table-cell">{formatAmount(allowances)}</TableCell>
                        <TableCell className="text-end text-sm hidden lg:table-cell">
                          {payslip.overtimeAmount > 0 ? (
                            <span className="text-amber-600">{formatAmount(payslip.overtimeAmount)}</span>
                          ) : '-'}
                        </TableCell>
                        <TableCell className="text-end text-sm hidden sm:table-cell text-red-600">
                          {payslip.totalDeductions > 0 ? `-${formatAmount(payslip.totalDeductions)}` : '-'}
                        </TableCell>
                        <TableCell className="text-end font-semibold text-sm text-emerald-600">
                          {formatAmount(payslip.netSalary)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-xs',
                              payslip.status === 'paid' && 'bg-green-100 text-green-800',
                              payslip.status === 'generated' && 'bg-blue-100 text-blue-800',
                              payslip.status === 'draft' && 'bg-slate-100 text-slate-800',
                            )}
                          >
                            {t(config.key)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onViewPayslip(payslip) }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  {/* Summary Row */}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>{t('common.total')}</TableCell>
                    <TableCell className="hidden md:table-cell"></TableCell>
                    <TableCell className="text-end text-sm">{formatAmount(payslips.reduce((s, p) => s + p.basicSalary, 0))}</TableCell>
                    <TableCell className="text-end text-sm hidden sm:table-cell">
                      {formatAmount(payslips.reduce((s, p) => s + p.housingAllowance + p.transportAllowance + p.mobileAllowance + p.otherAllowances, 0))}
                    </TableCell>
                    <TableCell className="text-end text-sm hidden lg:table-cell text-amber-600">
                      {formatAmount(payslips.reduce((s, p) => s + p.overtimeAmount, 0))}
                    </TableCell>
                    <TableCell className="text-end text-sm hidden sm:table-cell text-red-600">
                      -{formatAmount(totalDeductions)}
                    </TableCell>
                    <TableCell className="text-end text-emerald-600">
                      {formatAmount(totalNet)}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default PayslipGenerator
