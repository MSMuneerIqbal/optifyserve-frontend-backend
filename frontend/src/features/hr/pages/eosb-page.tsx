/**
 * EOSB Page
 * Phase 10: HR Module
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EOSBCalculatorComponent } from '../components/eosb-calculator'
import { sampleEmployees, sampleEOSBRecords } from '@/data/employees.data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { TERMINATION_REASON_KEYS } from '../types/eosb.types'
import type { EOSBFormData, EOSBCalculation } from '../types/eosb.types'
import { FileText } from 'lucide-react'

export function EOSBPage() {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const isLoadingRecords = false
  const isCalculating = false

  const records = sampleEOSBRecords

  const employees = sampleEmployees.map((e) => ({
    id: e.id,
    name: e.fullName,
    joinDate: e.joinDate,
    basicSalary: e.salary.totalSalary * 0.6,
    contractType: 'unlimited' as const,
  }))

  const handleCalculate = (_data: EOSBFormData): Promise<EOSBCalculation> => {
    toast.success(t('hr.eosbCalculated'))
    return Promise.resolve({
      employeeId: _data.employeeId,
      employeeName: 'Employee',
      joinDate: '2020-01-01',
      terminationDate: _data.terminationDate,
      contractType: 'unlimited',
      terminationReason: _data.terminationReason,
      lastBasicSalary: 6000,
      dailySalary: 200,
      totalYears: 5,
      totalMonths: 60,
      totalDays: 1826,
      yearsDisplay: '5 years, 0 months',
      first5YearsDays: 105,
      first5YearsAmount: 21000,
      after5YearsDays: 0,
      after5YearsAmount: 0,
      partialYearDays: 0,
      partialYearAmount: 0,
      totalGratuityDays: 105,
      grossGratuity: 21000,
      gratuityMultiplier: 1,
      multiplierReason: 'status.fullEntitlementEmployerTermination',
      netGratuity: 21000,
      pendingLeaveBalance: 15,
      leaveEncashmentAmount: 3000,
      totalSettlement: 24000,
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title={t('hr.eosbTitle')}
        description={t('hr.eosbDescription')}
      />

      <EOSBCalculatorComponent
        employees={employees}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
      />

      {/* EOSB Records */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('hr.previousCalculations')}
            <Badge variant="secondary" className="ms-2">{records.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hr.employee')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('hr.reason')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('hr.yrs')}</TableHead>
                  <TableHead className="text-end">{t('hr.gratuity')}</TableHead>
                  <TableHead className="text-end hidden sm:table-cell">{t('hr.leaveEncashment')}</TableHead>
                  <TableHead className="text-end">{t('common.total')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRecords ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {t('hr.noEOSBCalc')}
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium text-sm">{record.employeeName}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {t(TERMINATION_REASON_KEYS[record.terminationReason])}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {record.yearsOfService.toFixed(1)} {t('hr.yrs')}
                      </TableCell>
                      <TableCell className="text-end text-sm">{formatAmount(record.netGratuity)}</TableCell>
                      <TableCell className="text-end text-sm hidden sm:table-cell">{formatAmount(record.leaveEncashment)}</TableCell>
                      <TableCell className="text-end font-semibold text-sm text-emerald-600">
                        {formatAmount(record.totalSettlement)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs',
                            record.status === 'paid' && 'bg-green-100 text-green-800',
                            record.status === 'approved' && 'bg-blue-100 text-blue-800',
                            record.status === 'calculated' && 'bg-slate-100 text-slate-800',
                          )}
                        >
                          {t(`status.${record.status}`)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EOSBPage
