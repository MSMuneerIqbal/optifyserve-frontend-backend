/**
 * Employee Form Component
 * Phase 10: HR Module
 *
 * Multi-step employee creation/edit form in a Dialog.
 * Tabs: Personal, Employment, Documents, Salary, Address & Emergency
 */

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Resolver } from 'react-hook-form'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import type { Employee, EmployeeFormData, Gender, MaritalStatus, ContractType } from '../types/employee.types'
import { UAE_NATIONALITIES, UAE_BANKS, RELATIONSHIPS } from '../types/employee.types'
import { UAE_EMIRATES } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

function createEmployeeFormSchema(t: (key: string) => string) {
  return z.object({
    firstName: z.string().min(2, t('validation.firstNameMin')),
    lastName: z.string().min(2, t('validation.lastNameMin')),
    email: z.string().email(t('validation.validEmail')),
    phone: z.string().min(10, t('validation.validPhone')),
    alternatePhone: z.string().optional(),
    dateOfBirth: z.string().min(1, t('validation.dateOfBirthRequired')),
    gender: z.enum(['male', 'female'] as [Gender, ...Gender[]]),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'] as [MaritalStatus, ...MaritalStatus[]]),
    nationality: z.string().min(1, t('validation.nationalityRequired')),
    joinDate: z.string().min(1, t('validation.joinDateRequired')),
    contractType: z.enum(['limited', 'unlimited'] as [ContractType, ...ContractType[]]),
    contractStartDate: z.string().min(1, t('validation.contractStartDateRequired')),
    contractEndDate: z.string().optional(),
    departmentId: z.string().min(1, t('validation.departmentRequired')),
    designationId: z.string().min(1, t('validation.designationRequired')),
    branchId: z.string().min(1, t('validation.branchRequired')),
    reportingManagerId: z.string().optional(),
    emiratesId: z.object({ number: z.string().min(15, t('validation.emiratesIdMin15')).max(18), expiryDate: z.string().min(1, t('validation.expiryDateRequired')) }),
    passport: z.object({ number: z.string().min(5, t('validation.passportNumberRequired')), nationality: z.string().min(1, t('validation.required')), issueDate: z.string().min(1, t('validation.required')), expiryDate: z.string().min(1, t('validation.required')), placeOfIssue: z.string().min(1, t('validation.required')) }),
    visa: z.object({ number: z.string().min(1, t('validation.visaNumberRequired')), type: z.enum(['employment', 'residence', 'visit', 'transit']), issueDate: z.string().min(1, t('validation.required')), expiryDate: z.string().min(1, t('validation.required')), sponsoredBy: z.string().min(1, t('validation.required')) }),
    laborCard: z.object({ number: z.string().min(1, t('validation.laborCardNumberRequired')), issueDate: z.string().min(1, t('validation.required')), expiryDate: z.string().min(1, t('validation.required')) }),
    salary: z.object({ basicSalary: z.coerce.number().min(1, t('validation.basicSalaryRequired')), housingAllowance: z.coerce.number().min(0), transportAllowance: z.coerce.number().min(0), mobileAllowance: z.coerce.number().min(0), otherAllowances: z.coerce.number().min(0) }),
    bankDetails: z.object({ bankName: z.string().min(1, t('validation.bankNameRequired')), accountNumber: z.string().min(1, t('validation.accountNumberRequired')), iban: z.string().min(1, t('validation.ibanRequired')), branchName: z.string().optional() }),
    address: z.object({ street: z.string().min(1, t('validation.streetRequired')), building: z.string().optional(), flatNumber: z.string().optional(), area: z.string().min(1, t('validation.areaRequired')), city: z.string().min(1, t('validation.cityRequired')), emirate: z.string().min(1, t('validation.emirateRequired')), poBox: z.string().optional() }),
    emergencyContact: z.object({ name: z.string().min(1, t('validation.emergencyContactNameRequired')), relationship: z.string().min(1, t('validation.relationshipRequired')), phone: z.string().min(10, t('validation.validPhone')), alternatePhone: z.string().optional() }),
  })
}

type EmployeeFormValues = z.infer<ReturnType<typeof createEmployeeFormSchema>>

const TABS = ['personal', 'employment', 'documents', 'salary', 'address'] as const
type TabId = (typeof TABS)[number]

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  employee?: Employee
  onSubmit: (data: EmployeeFormData) => void
  isLoading: boolean
  departments: { id: string; name: string }[]
  designations: { id: string; name: string }[]
  branches: { id: string; name: string }[]
}

const defaultValues: EmployeeFormValues = {
  firstName: '', lastName: '', email: '', phone: '', alternatePhone: '', dateOfBirth: '', gender: 'male', maritalStatus: 'single', nationality: '',
  joinDate: '', contractType: 'unlimited', contractStartDate: '', contractEndDate: '', departmentId: '', designationId: '', branchId: '', reportingManagerId: '',
  emiratesId: { number: '', expiryDate: '' },
  passport: { number: '', nationality: '', issueDate: '', expiryDate: '', placeOfIssue: '' },
  visa: { number: '', type: 'employment', issueDate: '', expiryDate: '', sponsoredBy: '' },
  laborCard: { number: '', issueDate: '', expiryDate: '' },
  salary: { basicSalary: 0, housingAllowance: 0, transportAllowance: 0, mobileAllowance: 0, otherAllowances: 0 },
  bankDetails: { bankName: '', accountNumber: '', iban: '', branchName: '' },
  address: { street: '', building: '', flatNumber: '', area: '', city: '', emirate: '', poBox: '' },
  emergencyContact: { name: '', relationship: '', phone: '', alternatePhone: '' },
}

export function EmployeeForm({ isOpen, onClose, employee, onSubmit, isLoading, departments, designations, branches }: EmployeeFormProps) {
  const { t } = useTranslation()
  const isEditing = !!employee
  const [activeTab, setActiveTab] = useState<TabId>('personal')

  const TAB_LABELS: Record<TabId, string> = {
    personal: t('hr.personalTab'),
    employment: t('hr.employmentTab'),
    documents: t('hr.documentsTab'),
    salary: t('hr.salaryTab'),
    address: t('hr.addressEmergency'),
  }

  const employeeFormSchema = useMemo(() => createEmployeeFormSchema(t), [t])
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema) as Resolver<EmployeeFormValues>,
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (employee) {
      form.reset({
        firstName: employee.firstName, lastName: employee.lastName, email: employee.email, phone: employee.phone,
        alternatePhone: employee.alternatePhone ?? '', dateOfBirth: employee.dateOfBirth, gender: employee.gender,
        maritalStatus: employee.maritalStatus, nationality: employee.nationality, joinDate: employee.joinDate,
        contractType: employee.contractType, contractStartDate: employee.contractStartDate,
        contractEndDate: employee.contractEndDate ?? '', departmentId: employee.departmentId,
        designationId: employee.designationId, branchId: employee.branchId,
        reportingManagerId: employee.reportingManagerId ?? '',
        emiratesId: { number: employee.emiratesId.number, expiryDate: employee.emiratesId.expiryDate },
        passport: { number: employee.passport.number, nationality: employee.passport.nationality, issueDate: employee.passport.issueDate, expiryDate: employee.passport.expiryDate, placeOfIssue: employee.passport.placeOfIssue },
        visa: { number: employee.visa.number, type: employee.visa.type, issueDate: employee.visa.issueDate, expiryDate: employee.visa.expiryDate, sponsoredBy: employee.visa.sponsoredBy },
        laborCard: { number: employee.laborCard.number, issueDate: employee.laborCard.issueDate, expiryDate: employee.laborCard.expiryDate },
        salary: { basicSalary: employee.salary.basicSalary, housingAllowance: employee.salary.housingAllowance, transportAllowance: employee.salary.transportAllowance, mobileAllowance: employee.salary.mobileAllowance, otherAllowances: employee.salary.otherAllowances },
        bankDetails: { bankName: employee.bankDetails.bankName, accountNumber: employee.bankDetails.accountNumber, iban: employee.bankDetails.iban, branchName: employee.bankDetails.branchName ?? '' },
        address: { street: employee.address.street, building: employee.address.building ?? '', flatNumber: employee.address.flatNumber ?? '', area: employee.address.area, city: employee.address.city, emirate: employee.address.emirate, poBox: employee.address.poBox ?? '' },
        emergencyContact: { name: employee.emergencyContact.name, relationship: employee.emergencyContact.relationship, phone: employee.emergencyContact.phone, alternatePhone: employee.emergencyContact.alternatePhone ?? '' },
      })
    } else {
      form.reset(defaultValues)
      setActiveTab('personal')
    }
  }, [employee, form])

  const salaryValues = form.watch('salary')
  const totalSalary = (salaryValues.basicSalary || 0) + (salaryValues.housingAllowance || 0) + (salaryValues.transportAllowance || 0) + (salaryValues.mobileAllowance || 0) + (salaryValues.otherAllowances || 0)
  const contractType = form.watch('contractType')

  const currentTabIndex = TABS.indexOf(activeTab)
  const isFirstTab = currentTabIndex === 0
  const isLastTab = currentTabIndex === TABS.length - 1

  const handlePrevious = () => { if (!isFirstTab) setActiveTab(TABS[currentTabIndex - 1]) }
  const handleNext = () => { if (!isLastTab) setActiveTab(TABS[currentTabIndex + 1]) }

  const handleFormSubmit = (values: EmployeeFormValues) => {
    const formData: EmployeeFormData = {
      firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone,
      alternatePhone: values.alternatePhone || undefined, dateOfBirth: values.dateOfBirth, gender: values.gender,
      maritalStatus: values.maritalStatus, nationality: values.nationality, joinDate: values.joinDate,
      contractType: values.contractType, contractStartDate: values.contractStartDate,
      contractEndDate: values.contractEndDate || undefined, departmentId: values.departmentId,
      designationId: values.designationId, branchId: values.branchId,
      reportingManagerId: values.reportingManagerId || undefined,
      emiratesId: values.emiratesId, passport: values.passport, visa: values.visa, laborCard: values.laborCard,
      salary: values.salary,
      bankDetails: { bankName: values.bankDetails.bankName, accountNumber: values.bankDetails.accountNumber, iban: values.bankDetails.iban, branchName: values.bankDetails.branchName || undefined },
      address: { street: values.address.street, building: values.address.building || undefined, flatNumber: values.address.flatNumber || undefined, area: values.address.area, city: values.address.city, emirate: values.address.emirate, poBox: values.address.poBox || undefined },
      emergencyContact: { name: values.emergencyContact.name, relationship: values.emergencyContact.relationship, phone: values.emergencyContact.phone, alternatePhone: values.emergencyContact.alternatePhone || undefined },
    }
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>{isEditing ? t('hr.editEmployee') : t('hr.addNewEmployee')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col min-h-0 flex-1">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)} className="flex flex-col min-h-0 flex-1">
              <div className="px-6 pt-2 shrink-0 border-b">
                <TabsList className="w-full justify-start gap-1 h-auto bg-transparent p-0 overflow-x-auto flex-nowrap">
                  {TABS.map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="text-xs sm:text-sm whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-3 py-2">
                      {TAB_LABELS[tab]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-5">

                  {/* TAB 1: Personal */}
                  <TabsContent value="personal" className="mt-0 space-y-5">
                    <div className="space-y-1"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.personalInfo')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>{t('hr.firstName')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderFirstName')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>{t('hr.lastName')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderLastName')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>{t('common.email')} *</FormLabel><FormControl><Input type="email" placeholder={t('hr.placeholderEmployeeEmail')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>{t('common.phone')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderMobile')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="alternatePhone" render={({ field }) => (<FormItem><FormLabel>{t('common.alternatePhone')}</FormLabel><FormControl><Input placeholder={t('hr.placeholderLandline')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>{t('hr.dateOfBirth')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>{t('hr.gender')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectGender')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">{t('hr.male')}</SelectItem><SelectItem value="female">{t('hr.female')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>{t('hr.maritalStatus')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectStatus')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="single">{t('hr.single')}</SelectItem><SelectItem value="married">{t('hr.married')}</SelectItem><SelectItem value="divorced">{t('hr.divorced')}</SelectItem><SelectItem value="widowed">{t('hr.widowed')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{t('hr.nationality')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectNationality')} /></SelectTrigger></FormControl><SelectContent>{UAE_NATIONALITIES.map((nat) => (<SelectItem key={nat} value={nat}>{nat}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                    </div>
                  </TabsContent>

                  {/* TAB 2: Employment */}
                  <TabsContent value="employment" className="mt-0 space-y-5">
                    <div className="space-y-1"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.employmentDetails')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="joinDate" render={({ field }) => (<FormItem><FormLabel>{t('hr.joinDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="contractType" render={({ field }) => (<FormItem><FormLabel>{t('hr.contractType')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectContractType')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="unlimited">{t('hr.unlimited')}</SelectItem><SelectItem value="limited">{t('hr.limited')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="contractStartDate" render={({ field }) => (<FormItem><FormLabel>{t('hr.contractStartDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      {contractType === 'limited' && (<FormField control={form.control} name="contractEndDate" render={({ field }) => (<FormItem><FormLabel>{t('hr.contractEndDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                    </div>
                    <div className="space-y-1 pt-2"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.positionReporting')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="departmentId" render={({ field }) => (<FormItem><FormLabel>{t('common.department')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectDepartment')} /></SelectTrigger></FormControl><SelectContent>{departments.map((dept) => (<SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="designationId" render={({ field }) => (<FormItem><FormLabel>{t('hr.designation')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectDesignation')} /></SelectTrigger></FormControl><SelectContent>{designations.map((des) => (<SelectItem key={des.id} value={des.id}>{des.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="branchId" render={({ field }) => (<FormItem><FormLabel>{t('hr.branch')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectBranch')} /></SelectTrigger></FormControl><SelectContent>{branches.map((branch) => (<SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="reportingManagerId" render={({ field }) => (<FormItem><FormLabel>{t('hr.reportingManager')}</FormLabel><FormControl><Input placeholder={t('hr.managerIdOptional')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </TabsContent>

                  {/* TAB 3: Documents */}
                  <TabsContent value="documents" className="mt-0 space-y-5">
                    <div className="space-y-1"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.emiratesId')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="emiratesId.number" render={({ field }) => (<FormItem><FormLabel>{t('hr.emiratesIdNumber')} *</FormLabel><FormControl><Input placeholder="784-XXXX-XXXXXXX-X" maxLength={18} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="emiratesId.expiryDate" render={({ field }) => (<FormItem><FormLabel>{t('common.expiryDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="space-y-1 pt-2"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.passport')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="passport.number" render={({ field }) => (<FormItem><FormLabel>{t('hr.passportNumber')} *</FormLabel><FormControl><Input placeholder="A12345678" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="passport.nationality" render={({ field }) => (<FormItem><FormLabel>{t('hr.nationalityOnPassport')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectNationality')} /></SelectTrigger></FormControl><SelectContent>{UAE_NATIONALITIES.map((nat) => (<SelectItem key={nat} value={nat}>{nat}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="passport.issueDate" render={({ field }) => (<FormItem><FormLabel>{t('hr.issueDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="passport.expiryDate" render={({ field }) => (<FormItem><FormLabel>{t('common.expiryDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="passport.placeOfIssue" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{t('hr.placeOfIssue')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderPlaceOfIssue')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="space-y-1 pt-2"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.uaeVisa')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="visa.number" render={({ field }) => (<FormItem><FormLabel>{t('hr.visaNumber')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderVisaNumber')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="visa.type" render={({ field }) => (<FormItem><FormLabel>{t('hr.visaType')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectVisaType')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="employment">{t('hr.employment')}</SelectItem><SelectItem value="residence">{t('hr.residence')}</SelectItem><SelectItem value="visit">{t('hr.visit')}</SelectItem><SelectItem value="transit">{t('hr.transit')}</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="visa.issueDate" render={({ field }) => (<FormItem><FormLabel>{t('hr.issueDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="visa.expiryDate" render={({ field }) => (<FormItem><FormLabel>{t('common.expiryDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="visa.sponsoredBy" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{t('hr.sponsoredBy')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderSponsor')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="space-y-1 pt-2"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.laborCard')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="laborCard.number" render={({ field }) => (<FormItem><FormLabel>{t('hr.laborCardNumber')} *</FormLabel><FormControl><Input placeholder="XXXXXXXXXXXXXXX" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="laborCard.issueDate" render={({ field }) => (<FormItem><FormLabel>{t('hr.issueDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="laborCard.expiryDate" render={({ field }) => (<FormItem><FormLabel>{t('common.expiryDate')} *</FormLabel><FormControl><Input type="date" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </TabsContent>

                  {/* TAB 4: Salary */}
                  <TabsContent value="salary" className="mt-0 space-y-5">
                    <div className="space-y-1"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.salaryStructure')} (AED)</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="salary.basicSalary" render={({ field }) => (<FormItem><FormLabel>{t('hr.basicSalary')} *</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="5000" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="salary.housingAllowance" render={({ field }) => (<FormItem><FormLabel>{t('hr.housingAllowance')}</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="0" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="salary.transportAllowance" render={({ field }) => (<FormItem><FormLabel>{t('hr.transportAllowance')}</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="0" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="salary.mobileAllowance" render={({ field }) => (<FormItem><FormLabel>{t('hr.mobileAllowance')}</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="0" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="salary.otherAllowances" render={({ field }) => (<FormItem><FormLabel>{t('hr.otherAllowances')}</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="0" className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium">{t('hr.totalSalary')}</span>
                        <div className="h-10 px-3 flex items-center rounded-md border bg-muted text-base font-semibold text-green-700">
                          AED {totalSalary.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 pt-2"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.bankDetails')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="bankDetails.bankName" render={({ field }) => (<FormItem><FormLabel>{t('common.bankName')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectBank')} /></SelectTrigger></FormControl><SelectContent>{UAE_BANKS.map((bank) => (<SelectItem key={bank} value={bank}>{bank}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="bankDetails.accountNumber" render={({ field }) => (<FormItem><FormLabel>{t('common.accountNumber')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderAccountNumber')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="bankDetails.iban" render={({ field }) => (<FormItem><FormLabel>IBAN *</FormLabel><FormControl><Input placeholder={t('hr.placeholderIBAN')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="bankDetails.branchName" render={({ field }) => (<FormItem><FormLabel>{t('hr.branchName')}</FormLabel><FormControl><Input placeholder={t('hr.placeholderBranchName')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </TabsContent>

                  {/* TAB 5: Address & Emergency */}
                  <TabsContent value="address" className="mt-0 space-y-5">
                    <div className="space-y-1"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.residentialAddress')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="address.street" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{t('common.street')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderStreet')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="address.building" render={({ field }) => (<FormItem><FormLabel>{t('hr.buildingName')}</FormLabel><FormControl><Input placeholder={t('hr.placeholderBuilding')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="address.flatNumber" render={({ field }) => (<FormItem><FormLabel>{t('hr.flatVilla')}</FormLabel><FormControl><Input placeholder={t('hr.placeholderFlat')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="address.area" render={({ field }) => (<FormItem><FormLabel>{t('hr.areaCommunity')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderArea')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>{t('common.city')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderCity')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="address.emirate" render={({ field }) => (<FormItem><FormLabel>{t('common.emirate')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('common.selectEmirate')} /></SelectTrigger></FormControl><SelectContent>{UAE_EMIRATES.map((emirate) => (<SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="address.poBox" render={({ field }) => (<FormItem><FormLabel>{t('hr.poBox')}</FormLabel><FormControl><Input placeholder={t('hr.placeholderPoBox')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="space-y-1 pt-2"><h3 className="text-sm font-medium text-muted-foreground">{t('hr.emergencyContact')}</h3><Separator /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="emergencyContact.name" render={({ field }) => (<FormItem><FormLabel>{t('hr.contactNameLabel')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderContactName')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="emergencyContact.relationship" render={({ field }) => (<FormItem><FormLabel>{t('hr.relationship')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-10 text-base"><SelectValue placeholder={t('hr.selectRelationship')} /></SelectTrigger></FormControl><SelectContent>{RELATIONSHIPS.map((rel) => (<SelectItem key={rel} value={rel}>{rel}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="emergencyContact.phone" render={({ field }) => (<FormItem><FormLabel>{t('common.phone')} *</FormLabel><FormControl><Input placeholder={t('hr.placeholderMobile')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="emergencyContact.alternatePhone" render={({ field }) => (<FormItem><FormLabel>{t('common.alternatePhone')}</FormLabel><FormControl><Input placeholder={t('hr.placeholderLandline')} className="h-10 text-base" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </TabsContent>

                </div>
              </div>

              <DialogFooter className="px-6 py-4 border-t shrink-0 flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2 me-auto">
                  <Button type="button" variant="outline" onClick={handlePrevious} disabled={isFirstTab} size="sm">{t('common.previous')}</Button>
                  <Button type="button" variant="outline" onClick={handleNext} disabled={isLastTab} size="sm">{t('common.next')}</Button>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                    {isEditing ? t('hr.updateEmployee') : t('hr.createEmployee')}
                  </Button>
                </div>
              </DialogFooter>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeForm
