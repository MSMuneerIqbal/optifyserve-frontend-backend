/**
 * Employee Detail Panel
 * Phase 10: HR Module
 *
 * Slide-out panel showing complete employee profile
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/status-badge'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDate, getInitials } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'
import { formatEmiratesId } from '../utils/emirates-id-validator'
import { Phone, Mail, MapPin, Briefcase, CreditCard, FileText, Shield, AlertTriangle, Pencil, User, Banknote, Heart, Globe } from 'lucide-react'
import type { Employee } from '../types/employee.types'
import { EMPLOYEE_STATUS_CONFIG } from '../types/employee.types'

interface EmployeeDetailPanelProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
  onEdit: (employee: Employee) => void
  isLoading?: boolean
}

export function EmployeeDetailPanel({ employee, isOpen, onClose, onEdit, isLoading }: EmployeeDetailPanelProps) {
  const { t } = useTranslation()
  const { formatAmount } = useCurrency()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isOpen) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0">
        {isLoading || !employee ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner text={t('common.loading')} />
          </div>
        ) : (
          <>
            <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-white">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg sm:text-xl font-semibold">{getInitials(employee.fullName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-lg sm:text-xl font-semibold truncate">{employee.fullName}</SheetTitle>
                  <p className="text-sm text-muted-foreground">{employee.designationName}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{employee.employeeId}</Badge>
                    <StatusBadge variant={EMPLOYEE_STATUS_CONFIG[employee.status].variant}>{t(EMPLOYEE_STATUS_CONFIG[employee.status].key)}</StatusBadge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => onEdit(employee)} className="shrink-0">
                  <Pencil className="h-4 w-4 me-1" />{t('common.edit')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" asChild><a href={`tel:${employee.phone}`}><Phone className="h-4 w-4 me-1" />{t('common.call')}</a></Button>
                <Button variant="outline" size="sm" asChild><a href={`mailto:${employee.email}`}><Mail className="h-4 w-4 me-1" />{t('common.email')}</a></Button>
                <Button variant="outline" size="sm" asChild><a href={`https://wa.me/${employee.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a></Button>
              </div>
            </SheetHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4 sm:p-6">
              <TabsList className="w-full grid grid-cols-3 sm:grid-cols-5 mb-4">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">{t('common.overview')}</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs sm:text-sm">{t('hr.documentsTab')}</TabsTrigger>
                <TabsTrigger value="salary" className="text-xs sm:text-sm">{t('hr.salaryTab')}</TabsTrigger>
                <TabsTrigger value="address" className="text-xs sm:text-sm hidden sm:flex">{t('common.address')}</TabsTrigger>
                <TabsTrigger value="emergency" className="text-xs sm:text-sm hidden sm:flex">{t('hr.emergencyContact')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><User className="h-4 w-4" />{t('hr.personalInfo')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.email')} value={employee.email} />
                    <InfoRow label={t('common.phone')} value={employee.phone} />
                    <InfoRow label={t('hr.dateOfBirth')} value={formatDate(employee.dateOfBirth)} />
                    <InfoRow label={t('hr.gender')} value={employee.gender === 'male' ? t('hr.male') : t('hr.female')} />
                    <InfoRow label={t('hr.maritalStatus')} value={employee.maritalStatus} />
                    <InfoRow label={t('hr.nationality')} value={employee.nationality} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Briefcase className="h-4 w-4" />{t('hr.employmentDetails')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.department')} value={employee.departmentName} />
                    <InfoRow label={t('hr.designation')} value={employee.designationName} />
                    <InfoRow label={t('hr.branch')} value={employee.branchName} />
                    <InfoRow label={t('hr.joinDate')} value={formatDate(employee.joinDate)} />
                    <InfoRow label={t('hr.contractType')} value={employee.contractType === 'limited' ? t('hr.limited') : t('hr.unlimited')} />
                    <InfoRow label={t('hr.contractStartDate')} value={formatDate(employee.contractStartDate)} />
                    {employee.contractEndDate && <InfoRow label={t('hr.contractEndDate')} value={formatDate(employee.contractEndDate)} />}
                    {employee.reportingManagerName && <InfoRow label={t('hr.reportingManager')} value={employee.reportingManagerName} />}
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3"><p className="text-xs text-muted-foreground">{t('hr.totalSalary')}</p><p className="text-lg font-semibold text-emerald-600">{formatAmount(employee.salary.totalSalary)}</p></Card>
                  <Card className="p-3"><p className="text-xs text-muted-foreground">{t('hr.basicSalary')}</p><p className="text-lg font-semibold">{formatAmount(employee.salary.basicSalary)}</p></Card>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><CreditCard className="h-4 w-4" />{t('hr.emiratesId')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.number')} value={formatEmiratesId(employee.emiratesId.number)} />
                    <InfoRow label={t('common.expiry')} value={formatDate(employee.emiratesId.expiryDate)} alert={isExpiringSoon(employee.emiratesId.expiryDate)} />
                    <InfoRow label={t('common.verified')} value={employee.emiratesId.verified ? t('common.yes') : t('common.no')} />
                  </CardContent>
                </Card>
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4" />{t('hr.passport')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.number')} value={employee.passport.number} />
                    <InfoRow label={t('hr.nationality')} value={employee.passport.nationality} />
                    <InfoRow label={t('hr.issueDate')} value={formatDate(employee.passport.issueDate)} />
                    <InfoRow label={t('common.expiry')} value={formatDate(employee.passport.expiryDate)} alert={isExpiringSoon(employee.passport.expiryDate)} />
                    <InfoRow label={t('hr.placeOfIssue')} value={employee.passport.placeOfIssue} />
                  </CardContent>
                </Card>
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Shield className="h-4 w-4" />{t('hr.uaeVisa')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.number')} value={employee.visa.number} />
                    <InfoRow label={t('common.type')} value={employee.visa.type} />
                    <InfoRow label={t('common.expiry')} value={formatDate(employee.visa.expiryDate)} alert={isExpiringSoon(employee.visa.expiryDate)} />
                    <InfoRow label={t('hr.sponsoredBy')} value={employee.visa.sponsoredBy} />
                    <InfoRow label={t('common.status')} value={employee.visa.status} />
                  </CardContent>
                </Card>
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4" />{t('hr.laborCard')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.number')} value={employee.laborCard.number} />
                    <InfoRow label={t('hr.issueDate')} value={formatDate(employee.laborCard.issueDate)} />
                    <InfoRow label={t('common.expiry')} value={formatDate(employee.laborCard.expiryDate)} alert={isExpiringSoon(employee.laborCard.expiryDate)} />
                    <InfoRow label={t('common.status')} value={employee.laborCard.status} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="salary" className="space-y-4">
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Banknote className="h-4 w-4" />{t('hr.salaryStructure')}</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <SalaryRow label={t('hr.basicSalary')} amount={employee.salary.basicSalary} />
                    <SalaryRow label={t('hr.housingAllowance')} amount={employee.salary.housingAllowance} />
                    <SalaryRow label={t('hr.transportAllowance')} amount={employee.salary.transportAllowance} />
                    <SalaryRow label={t('hr.mobileAllowance')} amount={employee.salary.mobileAllowance} />
                    <SalaryRow label={t('hr.otherAllowances')} amount={employee.salary.otherAllowances} />
                    <Separator />
                    <div className="flex justify-between font-semibold"><span>{t('hr.totalSalary')}</span><span className="text-emerald-600">{formatAmount(employee.salary.totalSalary)}</span></div>
                  </CardContent>
                </Card>
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><CreditCard className="h-4 w-4" />{t('hr.bankDetails')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.bankName')} value={employee.bankDetails.bankName} />
                    <InfoRow label={t('common.accountNumber')} value={employee.bankDetails.accountNumber} />
                    <InfoRow label="IBAN" value={employee.bankDetails.iban} />
                    {employee.bankDetails.branchName && <InfoRow label={t('hr.branch')} value={employee.bankDetails.branchName} />}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4" />{t('hr.residentialAddress')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.street')} value={employee.address.street} />
                    {employee.address.building && <InfoRow label={t('hr.buildingName')} value={employee.address.building} />}
                    {employee.address.flatNumber && <InfoRow label={t('hr.flatVilla')} value={employee.address.flatNumber} />}
                    <InfoRow label={t('hr.areaCommunity')} value={employee.address.area} />
                    <InfoRow label={t('common.city')} value={employee.address.city} />
                    <InfoRow label={t('common.emirate')} value={employee.address.emirate} />
                    {employee.address.poBox && <InfoRow label={t('hr.poBox')} value={employee.address.poBox} />}
                    <InfoRow label={t('common.country')} value={employee.address.country} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4">
                <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Heart className="h-4 w-4" />{t('hr.emergencyContact')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <InfoRow label={t('common.name')} value={employee.emergencyContact.name} />
                    <InfoRow label={t('hr.relationship')} value={employee.emergencyContact.relationship} />
                    <InfoRow label={t('common.phone')} value={employee.emergencyContact.phone} />
                    {employee.emergencyContact.alternatePhone && <InfoRow label={t('common.alternatePhone')} value={employee.emergencyContact.alternatePhone} />}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-medium capitalize ${alert ? 'text-amber-600' : ''}`}>
        {alert && <AlertTriangle className="h-3 w-3 inline me-1" />}
        {value || '-'}
      </p>
    </div>
  )
}

function SalaryRow({ label, amount }: { label: string; amount: number }) {
  const { formatAmount } = useCurrency()
  return (<div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{formatAmount(amount)}</span></div>)
}

function isExpiringSoon(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntil <= 30 && daysUntil >= 0
}

export default EmployeeDetailPanel
