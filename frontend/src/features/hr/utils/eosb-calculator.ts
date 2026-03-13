/**
 * DISPLAY-ONLY — Uses JS floating-point math. Do NOT use for authoritative
 * financial totals. Backend must recompute all monetary values with decimal.js.
 *
 * EOSB (End of Service Benefits) Calculator
 * Phase 10: HR Module
 *
 * Calculates gratuity as per UAE Labor Law Article 132
 *
 * Rules:
 * - Less than 1 year: No gratuity
 * - Unlimited contract (termination by employer):
 *   * 1-5 years: 21 days salary per year
 *   * 5+ years: 30 days salary per year (for years after 5)
 * - Unlimited contract (resignation by employee):
 *   * < 1 year: No gratuity
 *   * 1-3 years: 1/3 of gratuity
 *   * 3-5 years: 2/3 of gratuity
 *   * 5+ years: Full gratuity
 * - Limited contract: Full gratuity after 1 year
 * - Total gratuity cannot exceed 2 years' salary
 */

import type { EOSBCalculation, TerminationReason } from '../types/eosb.types'
import { UNLIMITED_RESIGNATION_MULTIPLIERS } from '../types/eosb.types'

interface EOSBInput {
  joinDate: string
  terminationDate: string
  contractType: 'limited' | 'unlimited'
  terminationReason: TerminationReason
  lastBasicSalary: number
  pendingLeaveBalance?: number
}

/**
 * Calculate service period between two dates
 */
function calculateServicePeriod(joinDate: string, terminationDate: string): { years: number; months: number; days: number; totalYears: number } {
  const start = new Date(joinDate)
  const end = new Date(terminationDate)

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const totalYears = years + months / 12 + days / 365

  return { years, months, days, totalYears }
}

/**
 * Get gratuity multiplier for unlimited contract resignations
 */
function getResignationMultiplier(totalYears: number): { multiplier: number; reason: string } {
  for (const rule of UNLIMITED_RESIGNATION_MULTIPLIERS) {
    if (totalYears >= rule.minYears && totalYears < rule.maxYears) {
      return { multiplier: rule.multiplier, reason: rule.key }
    }
  }
  return { multiplier: 1, reason: 'status.fullGratuity' }
}

/**
 * Calculate EOSB/Gratuity as per UAE Labor Law
 */
export function calculateEOSB(input: EOSBInput): EOSBCalculation {
  const { joinDate, terminationDate, contractType, terminationReason, lastBasicSalary, pendingLeaveBalance = 0 } = input

  const service = calculateServicePeriod(joinDate, terminationDate)
  const dailySalary = lastBasicSalary / 30

  // Build years display string
  const parts: string[] = []
  if (service.years > 0) parts.push(`${service.years} year${service.years > 1 ? 's' : ''}`)
  if (service.months > 0) parts.push(`${service.months} month${service.months > 1 ? 's' : ''}`)
  if (service.days > 0) parts.push(`${service.days} day${service.days > 1 ? 's' : ''}`)
  const yearsDisplay = parts.join(', ') || '0 days'

  // No gratuity for less than 1 year of service
  if (service.totalYears < 1) {
    const leaveEncashment = pendingLeaveBalance * dailySalary
    return {
      employeeId: '',
      employeeName: '',
      joinDate,
      terminationDate,
      contractType,
      terminationReason,
      lastBasicSalary,
      dailySalary,
      totalYears: service.years,
      totalMonths: service.months,
      totalDays: service.days,
      yearsDisplay,
      first5YearsDays: 0,
      first5YearsAmount: 0,
      after5YearsDays: 0,
      after5YearsAmount: 0,
      partialYearDays: 0,
      partialYearAmount: 0,
      totalGratuityDays: 0,
      grossGratuity: 0,
      gratuityMultiplier: 0,
      multiplierReason: 'status.noGratuityLessThan1Year',
      netGratuity: 0,
      pendingLeaveBalance,
      leaveEncashmentAmount: leaveEncashment,
      totalSettlement: leaveEncashment,
    }
  }

  // Calculate gratuity days
  let first5YearsDays = 0
  let after5YearsDays = 0
  let partialYearDays = 0

  const fullYears = service.years
  const remainingMonths = service.months
  const remainingDays = service.days

  if (fullYears <= 5) {
    // All years within first 5: 21 days per year
    first5YearsDays = fullYears * 21
    // Partial year: prorated at 21 days
    partialYearDays = (remainingMonths / 12 + remainingDays / 365) * 21
  } else {
    // First 5 years: 21 days per year
    first5YearsDays = 5 * 21 // 105 days
    // Years after 5: 30 days per year
    const yearsAfter5 = fullYears - 5
    after5YearsDays = yearsAfter5 * 30
    // Partial year: prorated at 30 days
    partialYearDays = (remainingMonths / 12 + remainingDays / 365) * 30
  }

  const first5YearsAmount = first5YearsDays * dailySalary
  const after5YearsAmount = after5YearsDays * dailySalary
  const partialYearAmount = partialYearDays * dailySalary
  const totalGratuityDays = first5YearsDays + after5YearsDays + partialYearDays
  let grossGratuity = first5YearsAmount + after5YearsAmount + partialYearAmount

  // Cap at 2 years' salary
  const maxGratuity = lastBasicSalary * 24
  if (grossGratuity > maxGratuity) {
    grossGratuity = maxGratuity
  }

  // Determine multiplier based on contract type and termination reason
  let gratuityMultiplier = 1
  let multiplierReason = 'status.fullGratuity'

  if (contractType === 'unlimited' && terminationReason === 'resignation') {
    const result = getResignationMultiplier(service.totalYears)
    gratuityMultiplier = result.multiplier
    multiplierReason = result.reason
  } else if (contractType === 'limited') {
    // Limited contract: full gratuity regardless of reason after 1 year
    gratuityMultiplier = 1
    multiplierReason = 'status.fullGratuityLimited'
  } else {
    // Employer termination, contract expiry, retirement, death: full gratuity
    gratuityMultiplier = 1
    multiplierReason = 'status.fullGratuity'
  }

  const netGratuity = Math.round(grossGratuity * gratuityMultiplier * 100) / 100
  const leaveEncashmentAmount = Math.round(pendingLeaveBalance * dailySalary * 100) / 100
  const totalSettlement = Math.round((netGratuity + leaveEncashmentAmount) * 100) / 100

  return {
    employeeId: '',
    employeeName: '',
    joinDate,
    terminationDate,
    contractType,
    terminationReason,
    lastBasicSalary,
    dailySalary: Math.round(dailySalary * 100) / 100,
    totalYears: service.years,
    totalMonths: service.months,
    totalDays: service.days,
    yearsDisplay,
    first5YearsDays: Math.round(first5YearsDays * 100) / 100,
    first5YearsAmount: Math.round(first5YearsAmount * 100) / 100,
    after5YearsDays: Math.round(after5YearsDays * 100) / 100,
    after5YearsAmount: Math.round(after5YearsAmount * 100) / 100,
    partialYearDays: Math.round(partialYearDays * 100) / 100,
    partialYearAmount: Math.round(partialYearAmount * 100) / 100,
    totalGratuityDays: Math.round(totalGratuityDays * 100) / 100,
    grossGratuity: Math.round(grossGratuity * 100) / 100,
    gratuityMultiplier,
    multiplierReason,
    netGratuity,
    pendingLeaveBalance,
    leaveEncashmentAmount,
    totalSettlement,
  }
}
