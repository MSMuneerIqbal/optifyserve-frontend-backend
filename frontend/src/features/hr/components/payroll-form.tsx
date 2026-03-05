/**
 * Payroll Processing Form
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Loader2, PlayCircle, DollarSign } from 'lucide-react'
import type { PayrollProcessingData } from '../types/payroll.types'
import { MONTH_NAME_KEYS } from '../types/payroll.types'

interface PayrollFormProps {
  onProcess: (data: PayrollProcessingData) => void
  isProcessing: boolean
  departments: { id: string; name: string }[]
  branches: { id: string; name: string }[]
}

export function PayrollForm({ onProcess, isProcessing, departments, branches }: PayrollFormProps) {
  const { t } = useTranslation()
  const currentDate = new Date()
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const [year, setYear] = useState(currentDate.getFullYear())
  const [departmentId, setDepartmentId] = useState<string>('')
  const [branchId, setBranchId] = useState<string>('')

  const handleProcess = () => {
    onProcess({
      month,
      year,
      departmentId: departmentId || undefined,
      branchId: branchId || undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          {t('hr.processPayroll')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('hr.processPayrollDescription')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('hr.month')} *</Label>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTH_NAME_KEYS.map((key, i) => (
                  <SelectItem key={i} value={String(i + 1)}>{t(key)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('hr.year')} *</Label>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026, 2027].map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('common.department')} ({t('common.optional')})</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger><SelectValue placeholder={t('hr.allDepartments')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hr.allDepartments')}</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('hr.branch')} ({t('common.optional')})</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger><SelectValue placeholder={t('hr.allBranches')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('hr.allBranches')}</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full sm:w-auto" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 me-2" />
              )}
              {t('hr.processPayroll')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('hr.processMonthlyPayroll')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('hr.processPayrollConfirm', { month: t(MONTH_NAME_KEYS[month - 1]), year })}
                {departmentId && departmentId !== 'all' && ` ${t('hr.filteredByDepartment')}`}
                {branchId && branchId !== 'all' && ` ${t('hr.filteredByBranch')}`}
                {' '}{t('hr.processPayrollCalcNote')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleProcess}>{t('hr.processPayroll')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default PayrollForm
