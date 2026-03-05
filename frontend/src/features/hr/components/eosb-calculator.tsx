/**
 * EOSB Calculator Component
 * Phase 10: HR Module
 *
 * End of Service Benefits calculator with UAE Labor Law compliance
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCurrency } from '@/contexts/currency-context'
import { Calculator, TrendingUp, Calendar, Banknote, FileText, Loader2 } from 'lucide-react'
import type { EOSBCalculation, EOSBFormData, TerminationReason } from '../types/eosb.types'
import { TERMINATION_REASON_KEYS } from '../types/eosb.types'

function createEosbFormSchema(t: (key: string) => string) {
  return z.object({
    employeeId: z.string().min(1, t('validation.employeeRequired')),
    terminationDate: z.string().min(1, t('validation.terminationDateRequired')),
    terminationReason: z.enum(['employer_termination', 'resignation', 'contract_expiry', 'retirement', 'death'] as const),
    pendingLeaveBalance: z.coerce.number().min(0).optional(),
  })
}

interface EOSBCalculatorProps {
  employees: { id: string; name: string; joinDate: string; basicSalary: number; contractType: 'limited' | 'unlimited' }[]
  onCalculate: (data: EOSBFormData) => Promise<EOSBCalculation>
  isCalculating: boolean
}

export function EOSBCalculatorComponent({ employees, onCalculate, isCalculating }: EOSBCalculatorProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const eosbFormSchema = useMemo(() => createEosbFormSchema(t), [t])
  const [result, setResult] = useState<EOSBCalculation | null>(null)

  type EOSBFormValues = z.infer<ReturnType<typeof createEosbFormSchema>>
  const form = useForm<EOSBFormValues>({
    resolver: zodResolver(eosbFormSchema) as unknown as import('react-hook-form').Resolver<EOSBFormValues>,
    defaultValues: {
      employeeId: '',
      terminationDate: new Date().toISOString().split('T')[0],
      terminationReason: 'employer_termination',
      pendingLeaveBalance: 0,
    },
  })

  const selectedEmployee = employees.find((e) => e.id === form.watch('employeeId'))

  const handleSubmit = async (data: z.infer<typeof eosbFormSchema>) => {
    const calculation = await onCalculate({
      employeeId: data.employeeId,
      terminationDate: data.terminationDate,
      terminationReason: data.terminationReason as TerminationReason,
      pendingLeaveBalance: data.pendingLeaveBalance,
    })
    setResult(calculation)
  }

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            {t('hr.eosbGratuityCalculator')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('hr.eosbDescription')}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="employeeId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('hr.employee')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder={t('hr.selectEmployee')} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="terminationDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('hr.terminationDate')} *</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="terminationReason" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('hr.reason')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.entries(TERMINATION_REASON_KEYS) as [TerminationReason, string][]).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="pendingLeaveBalance" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('hr.pendingLeaveDays')}</FormLabel>
                    <FormControl><Input type="number" {...field} min={0} step={0.5} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Selected Employee Info */}
              {selectedEmployee && (
                <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-lg text-sm">
                  <span><strong>{t('hr.joinDate')}:</strong> {selectedEmployee.joinDate}</span>
                  <span><strong>{t('hr.basicSalary')}:</strong> {formatAmount(selectedEmployee.basicSalary)}</span>
                  <span><strong>{t('hr.contractType')}:</strong> {selectedEmployee.contractType}</span>
                </div>
              )}

              <Button type="submit" disabled={isCalculating} className="w-full sm:w-auto">
                {isCalculating ? (
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4 me-2" />
                )}
                {t('hr.calculateEOSB')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Calculation Result */}
      {result && (
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5 rounded-t-lg">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('hr.eosbCalculationResult')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Service Period */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />{t('hr.servicePeriod')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoCard label={t('hr.totalService')} value={result.yearsDisplay} />
                <InfoCard label={t('hr.dailySalary')} value={formatAmount(result.dailySalary)} />
                <InfoCard label={t('hr.contractType')} value={result.contractType === 'limited' ? t('hr.limited') : t('hr.unlimited')} />
                <InfoCard label={t('hr.reason')} value={TERMINATION_REASON_KEYS[result.terminationReason]} />
              </div>
            </div>

            <Separator />

            {/* Gratuity Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" />{t('hr.gratuityBreakdown')}
              </h4>
              <div className="space-y-2 text-sm">
                <CalcRow
                  label={t('hr.first5Years')}
                  days={result.first5YearsDays}
                  amount={result.first5YearsAmount}
                />
                {result.after5YearsDays > 0 && (
                  <CalcRow
                    label={t('hr.after5Years')}
                    days={result.after5YearsDays}
                    amount={result.after5YearsAmount}
                  />
                )}
                {result.partialYearDays > 0 && (
                  <CalcRow
                    label={t('hr.partialYear')}
                    days={result.partialYearDays}
                    amount={result.partialYearAmount}
                  />
                )}
                <Separator />
                <CalcRow label={t('hr.totalGratuityDays')} days={result.totalGratuityDays} amount={result.grossGratuity} bold />

                {result.gratuityMultiplier < 1 && (
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded text-amber-800">
                    <span className="text-sm">{t(result.multiplierReason)}</span>
                    <span className="font-medium">x {result.gratuityMultiplier}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Settlement Summary */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <Banknote className="h-4 w-4" />{t('hr.settlementSummary')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('hr.netGratuity')}</span>
                  <span className="font-medium">{formatAmount(result.netGratuity)}</span>
                </div>
                {result.leaveEncashmentAmount > 0 && (
                  <div className="flex justify-between">
                    <span>{t('hr.leaveEncashment')} ({result.pendingLeaveBalance} {t('hr.days')})</span>
                    <span className="font-medium">{formatAmount(result.leaveEncashmentAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                  <span className="font-semibold text-base">{t('hr.totalSettlement')}</span>
                  <span className="font-bold text-xl text-emerald-600">
                    {formatAmount(result.totalSettlement)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 bg-muted/50 rounded-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm mt-0.5">{value}</p>
    </div>
  )
}

function CalcRow({ label, days, amount, bold }: { label: string; days: number; amount: number; bold?: boolean }) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  return (
    <div className={`flex justify-between items-center ${bold ? 'font-semibold' : ''}`}>
      <span>{label}</span>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="text-xs">{days.toFixed(1)} {t('hr.days')}</Badge>
        <span className="min-w-[100px] text-end">{formatAmount(amount)}</span>
      </div>
    </div>
  )
}

export default EOSBCalculatorComponent
