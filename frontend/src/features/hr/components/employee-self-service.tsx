/**
 * Employee Self-Service Portal
 * Phase 10: HR Module
 *
 * Employee view for personal info, payslips, leave, attendance
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Separator available for future use
import { formatDate, getInitials } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import {
  User, Calendar, FileText, Clock, DollarSign, Mail, Phone,
  MapPin, Building2, Briefcase, CalendarDays, Download,
} from 'lucide-react'
import type { Employee } from '../types/employee.types'
import type { LeaveBalance } from '../types/leave.types'
import type { Payslip } from '../types/payroll.types'
// DailyAttendance type available for attendance tab
import { MONTH_NAME_KEYS } from '../types/payroll.types'

interface EmployeeSelfServiceProps {
  employee: Employee
  leaveBalances: LeaveBalance[]
  recentPayslips: Payslip[]
  attendanceSummary: {
    present: number
    absent: number
    late: number
    totalHours: number
  }
  onApplyLeave: () => void
  onCheckIn: () => void
  onCheckOut: () => void
  onViewPayslip: (payslip: Payslip) => void
  isCheckedIn: boolean
}

export function EmployeeSelfService({
  employee,
  leaveBalances,
  recentPayslips,
  attendanceSummary,
  onApplyLeave,
  onCheckIn,
  onCheckOut,
  onViewPayslip,
  isCheckedIn,
}: EmployeeSelfServiceProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {getInitials(employee.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-start flex-1">
              <h2 className="text-xl font-bold">{employee.fullName}</h2>
              <p className="text-sm text-muted-foreground">{employee.designationName} - {employee.departmentName}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="outline">{employee.employeeId}</Badge>
                <Badge variant="outline">{employee.branchName}</Badge>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{employee.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{employee.phone}</span>
              </div>
            </div>

            {/* Quick Check In/Out */}
            <div className="shrink-0">
              {!isCheckedIn ? (
                <Button onClick={onCheckIn} className="bg-green-600 hover:bg-green-700">
                  <Clock className="h-4 w-4 me-2" />{t('hr.checkIn')}
                </Button>
              ) : (
                <Button variant="destructive" onClick={onCheckOut}>
                  <Clock className="h-4 w-4 me-2" />{t('hr.checkOut')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('hr.presentThisMonth')}</p>
          <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('hr.absent')}</p>
          <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('hr.annualLeaveBalance')}</p>
          <p className="text-2xl font-bold text-primary">
            {leaveBalances.find((b) => b.leaveTypeId === 'annual')?.balance.toFixed(1) || '0'}
          </p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">{t('hr.monthlySalary')}</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatAmount(employee.salary.totalSalary)}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 sm:grid-cols-4">
          <TabsTrigger value="overview">
            <User className="h-4 w-4 me-1.5 hidden sm:block" />{t('common.overview')}
          </TabsTrigger>
          <TabsTrigger value="leaves">
            <CalendarDays className="h-4 w-4 me-1.5 hidden sm:block" />{t('hr.leaves')}
          </TabsTrigger>
          <TabsTrigger value="payslips">
            <DollarSign className="h-4 w-4 me-1.5 hidden sm:block" />{t('hr.payslips')}
          </TabsTrigger>
          <TabsTrigger value="info" className="hidden sm:flex">
            <FileText className="h-4 w-4 me-1.5" />{t('hr.myInfo')}
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{t('hr.employmentDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <InfoRow icon={Building2} label={t('common.department')} value={employee.departmentName} />
                <InfoRow icon={Briefcase} label={t('hr.designation')} value={employee.designationName} />
                <InfoRow icon={MapPin} label={t('hr.branch')} value={employee.branchName} />
                <InfoRow icon={Calendar} label={t('hr.joinDate')} value={formatDate(employee.joinDate)} />
                <InfoRow icon={FileText} label={t('hr.contractType')} value={employee.contractType === 'limited' ? t('hr.limited') : t('hr.unlimited')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{t('hr.leaveBalance')}</CardTitle>
                  <Button size="sm" variant="outline" onClick={onApplyLeave}>{t('hr.applyLeave')}</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {leaveBalances.slice(0, 4).map((balance) => (
                  <div key={balance.leaveTypeId} className="flex items-center justify-between text-sm">
                    <span>{balance.leaveTypeName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{balance.taken}/{balance.entitled}</span>
                      <Badge variant="outline" className="text-xs min-w-[40px] text-center">
                        {balance.balance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaves */}
        <TabsContent value="leaves" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('hr.myLeaveBalances')}</h3>
            <Button size="sm" onClick={onApplyLeave}>{t('hr.applyLeave')}</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {leaveBalances.map((balance) => {
              const pct = balance.entitled > 0 ? (balance.balance / balance.entitled) * 100 : 0
              return (
                <Card key={balance.leaveTypeId} className="p-3">
                  <p className="text-xs font-medium truncate">{balance.leaveTypeName}</p>
                  <p className="text-xl font-bold mt-1">{balance.balance}</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {balance.taken} {t('hr.taken')} / {balance.entitled} {t('hr.entitled')}
                  </p>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Payslips */}
        <TabsContent value="payslips" className="space-y-4">
          <h3 className="text-sm font-medium">{t('hr.recentPayslips')}</h3>
          <div className="space-y-2">
            {recentPayslips.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">{t('hr.noPayslipsAvailable')}</Card>
            ) : (
              recentPayslips.map((payslip) => (
                <Card key={payslip.id} className="p-3 sm:p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => onViewPayslip(payslip)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{t(MONTH_NAME_KEYS[payslip.month - 1])} {payslip.year}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('hr.net')}: {formatAmount(payslip.netSalary)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={payslip.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                        {payslip.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Personal Info */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{t('hr.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <SimpleRow label={t('common.fullName')} value={employee.fullName} />
              <SimpleRow label={t('common.email')} value={employee.email} />
              <SimpleRow label={t('common.phone')} value={employee.phone} />
              <SimpleRow label={t('hr.nationality')} value={employee.nationality} />
              <SimpleRow label={t('hr.dateOfBirth')} value={formatDate(employee.dateOfBirth)} />
              <SimpleRow label={t('hr.gender')} value={employee.gender === 'male' ? t('hr.male') : t('hr.female')} />
              <SimpleRow label={t('hr.maritalStatus')} value={employee.maritalStatus} />
              <SimpleRow label={t('hr.emiratesId')} value={employee.emiratesId.number} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 flex justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  )
}

function SimpleRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  )
}

export default EmployeeSelfService
