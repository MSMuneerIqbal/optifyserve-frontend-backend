/**
 * Payroll Type Definitions
 * Phase 10: HR Module
 *
 * Salary structures, payslips, and UAE-compliant payroll
 */

import type { StatusBadgeVariant } from '@/types/common.types'

/** Payroll run status */
export type PayrollStatus = 'draft' | 'processing' | 'completed' | 'cancelled'

/** Payslip status */
export type PayslipStatus = 'draft' | 'generated' | 'paid' | 'cancelled'

/** Payroll status config */
export const PAYROLL_STATUS_CONFIG: Record<PayrollStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  processing: { key: 'status.processing', variant: 'warning' },
  completed: { key: 'status.completed', variant: 'success' },
  cancelled: { key: 'status.cancelled', variant: 'error' },
}

/** Payslip status config */
export const PAYSLIP_STATUS_CONFIG: Record<PayslipStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  generated: { key: 'status.generated', variant: 'info' },
  paid: { key: 'status.paid', variant: 'success' },
  cancelled: { key: 'status.cancelled', variant: 'error' },
}

/** Allowance types */
export type AllowanceType = 'housing' | 'transport' | 'mobile' | 'food' | 'education' | 'other'

/** Deduction types */
export type DeductionType = 'absence' | 'late' | 'loan' | 'advance' | 'other'

/** Salary component */
export interface SalaryComponent {
  id: string
  name: string
  type: 'allowance' | 'deduction'
  subType: AllowanceType | DeductionType
  amount: number
  isFixed: boolean
  isRecurring: boolean
  description?: string
}

/** Payslip */
export interface Payslip {
  id: string
  payrollRunId: string
  employeeId: string
  employeeName: string
  employeeIdNumber: string
  departmentName: string
  designationName: string
  month: number
  year: number

  // Earnings
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  mobileAllowance: number
  otherAllowances: number
  overtimeHours: number
  overtimeRate: number
  overtimeAmount: number
  totalEarnings: number

  // Deductions
  absenceDeduction: number
  lateDeduction: number
  loanRepayment: number
  advanceRecovery: number
  otherDeductions: number
  totalDeductions: number

  // Net
  netSalary: number

  // Working days
  totalWorkingDays: number
  presentDays: number
  absentDays: number
  leaveDays: number

  // Payment
  paymentMethod: 'bank_transfer' | 'cash' | 'cheque'
  paymentDate?: string
  bankName?: string
  accountNumber?: string
  iban?: string

  status: PayslipStatus
  generatedAt: string
  paidAt?: string
}

/** Payroll run */
export interface PayrollRun {
  id: string
  month: number
  year: number
  branchId?: string
  branchName?: string
  departmentId?: string
  departmentName?: string
  totalEmployees: number
  totalEarnings: number
  totalDeductions: number
  totalNetSalary: number
  status: PayrollStatus
  processedBy?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

/** Payroll processing form data */
export interface PayrollProcessingData {
  month: number
  year: number
  branchId?: string
  departmentId?: string
}

/** Payslip filters */
export interface PayslipFilters {
  employeeId?: string
  departmentId?: string
  branchId?: string
  month?: number
  year?: number
  status?: PayslipStatus
  page?: number
  pageSize?: number
}

/** Payroll summary */
export interface PayrollSummary {
  month: number
  year: number
  totalEmployees: number
  totalBasicSalary: number
  totalAllowances: number
  totalOvertime: number
  totalEarnings: number
  totalDeductions: number
  totalNetSalary: number
  byDepartment: {
    departmentName: string
    employeeCount: number
    totalNetSalary: number
  }[]
}

/** Month names for display */
export const MONTH_NAME_KEYS = [
  'status.january', 'status.february', 'status.march', 'status.april', 'status.may', 'status.june',
  'status.july', 'status.august', 'status.september', 'status.october', 'status.november', 'status.december',
] as const
