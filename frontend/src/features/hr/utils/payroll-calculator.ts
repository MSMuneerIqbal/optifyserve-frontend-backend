/**
 * Payroll Calculator
 * Phase 10: HR Module
 *
 * Salary, overtime, and deduction calculations
 */

/** Overtime calculation as per UAE Labor Law */
export interface OvertimeResult {
  weekdayHours: number
  weekdayAmount: number
  weekendHours: number
  weekendAmount: number
  totalHours: number
  totalAmount: number
}

/**
 * Calculate overtime pay
 * - Weekday overtime: 1.25x hourly rate
 * - Weekend/Holiday overtime: 1.5x hourly rate
 * - Hourly rate = Basic Salary / 30 / 8
 */
export function calculateOvertime(
  basicSalary: number,
  weekdayOvertimeHours: number,
  weekendOvertimeHours: number
): OvertimeResult {
  const hourlyRate = basicSalary / 30 / 8

  const weekdayAmount = weekdayOvertimeHours * hourlyRate * 1.25
  const weekendAmount = weekendOvertimeHours * hourlyRate * 1.5
  const totalHours = weekdayOvertimeHours + weekendOvertimeHours
  const totalAmount = weekdayAmount + weekendAmount

  return {
    weekdayHours: weekdayOvertimeHours,
    weekdayAmount: Math.round(weekdayAmount * 100) / 100,
    weekendHours: weekendOvertimeHours,
    weekendAmount: Math.round(weekendAmount * 100) / 100,
    totalHours,
    totalAmount: Math.round(totalAmount * 100) / 100,
  }
}

/**
 * Calculate absence deduction
 * Daily rate = Total Salary / 30
 */
export function calculateAbsenceDeduction(totalSalary: number, absentDays: number): number {
  const dailyRate = totalSalary / 30
  return Math.round(absentDays * dailyRate * 100) / 100
}

/**
 * Calculate late deduction
 * Per UAE practice: deduction based on hours late
 * Hourly rate = Total Salary / 30 / 8
 */
export function calculateLateDeduction(totalSalary: number, lateTotalMinutes: number): number {
  const hourlyRate = totalSalary / 30 / 8
  const lateHours = lateTotalMinutes / 60
  return Math.round(lateHours * hourlyRate * 100) / 100
}

/** Payslip calculation input */
export interface PayslipInput {
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  mobileAllowance: number
  otherAllowances: number
  weekdayOvertimeHours: number
  weekendOvertimeHours: number
  absentDays: number
  lateTotalMinutes: number
  loanRepayment: number
  advanceRecovery: number
  otherDeductions: number
  totalWorkingDays: number
  presentDays: number
  leaveDays: number
}

/** Payslip calculation result */
export interface PayslipCalculation {
  // Earnings
  basicSalary: number
  housingAllowance: number
  transportAllowance: number
  mobileAllowance: number
  otherAllowances: number
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

  // Details
  overtimeHours: number
  overtimeRate: number
}

/**
 * Calculate complete payslip
 */
export function calculatePayslip(input: PayslipInput): PayslipCalculation {
  const totalSalary = input.basicSalary + input.housingAllowance + input.transportAllowance + input.mobileAllowance + input.otherAllowances

  const overtime = calculateOvertime(input.basicSalary, input.weekdayOvertimeHours, input.weekendOvertimeHours)
  const absenceDeduction = calculateAbsenceDeduction(totalSalary, input.absentDays)
  const lateDeduction = calculateLateDeduction(totalSalary, input.lateTotalMinutes)

  const totalEarnings = totalSalary + overtime.totalAmount
  const totalDeductions = absenceDeduction + lateDeduction + input.loanRepayment + input.advanceRecovery + input.otherDeductions
  const netSalary = totalEarnings - totalDeductions

  return {
    basicSalary: input.basicSalary,
    housingAllowance: input.housingAllowance,
    transportAllowance: input.transportAllowance,
    mobileAllowance: input.mobileAllowance,
    otherAllowances: input.otherAllowances,
    overtimeAmount: overtime.totalAmount,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    absenceDeduction: Math.round(absenceDeduction * 100) / 100,
    lateDeduction: Math.round(lateDeduction * 100) / 100,
    loanRepayment: input.loanRepayment,
    advanceRecovery: input.advanceRecovery,
    otherDeductions: input.otherDeductions,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    overtimeHours: overtime.totalHours,
    overtimeRate: Math.round((input.basicSalary / 30 / 8) * 100) / 100,
  }
}
