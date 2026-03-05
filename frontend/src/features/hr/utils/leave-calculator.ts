/**
 * Leave Calculator
 * Phase 10: HR Module
 *
 * Leave accrual, balance, and entitlement calculations per UAE Labor Law
 */

import type { LeaveBalance, LeaveTypeId, LeaveRequest } from '../types/leave.types'
import { UAE_LEAVE_TYPES, SICK_LEAVE_TIERS } from '../types/leave.types'

/**
 * Calculate months of service from join date to a given date
 */
function getMonthsOfService(joinDate: string, asOfDate: string): number {
  const start = new Date(joinDate)
  const end = new Date(asOfDate)
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const dayDiff = end.getDate() - start.getDate()
  return months + (dayDiff >= 0 ? 0 : -1)
}

/**
 * Calculate annual leave accrual
 * - Less than 6 months: 0 days
 * - 6 months to 1 year: 2 days per month
 * - 1+ year: 30 days per year (2.5 days per month)
 */
export function calculateAnnualLeaveAccrual(joinDate: string, asOfDate: string): number {
  const months = getMonthsOfService(joinDate, asOfDate)
  if (months < 6) return 0
  if (months < 12) return months * 2
  return months * 2.5
}

/**
 * Calculate leave balance for an employee
 */
export function calculateLeaveBalance(
  joinDate: string,
  leavesTaken: LeaveRequest[],
  carriedForward: Record<LeaveTypeId, number> = {} as Record<LeaveTypeId, number>,
  asOfDate: string = new Date().toISOString().split('T')[0]
): LeaveBalance[] {
  const months = getMonthsOfService(joinDate, asOfDate)

  return UAE_LEAVE_TYPES.map((leaveType) => {
    let entitled = 0

    if (leaveType.id === 'annual') {
      entitled = calculateAnnualLeaveAccrual(joinDate, asOfDate)
    } else if (leaveType.id === 'sick') {
      entitled = months >= 3 ? leaveType.daysPerYear : 0
    } else {
      entitled = leaveType.daysPerYear
    }

    const taken = leavesTaken
      .filter((l) => l.leaveTypeId === leaveType.id && (l.status === 'approved' || l.status === 'pending'))
      .reduce((sum, l) => {
        if (l.status === 'approved') return sum + l.totalDays
        return sum
      }, 0)

    const pending = leavesTaken
      .filter((l) => l.leaveTypeId === leaveType.id && l.status === 'pending')
      .reduce((sum, l) => sum + l.totalDays, 0)

    const cf = carriedForward[leaveType.id] || 0
    const balance = Math.max(0, entitled + cf - taken)

    return {
      leaveTypeId: leaveType.id,
      leaveTypeName: leaveType.name,
      entitled: Math.round(entitled * 10) / 10,
      taken,
      pending,
      balance: Math.round(balance * 10) / 10,
      carriedForward: cf,
    }
  })
}

/**
 * Calculate working days between two dates (excluding weekends - Fri/Sat in UAE)
 */
export function calculateWorkingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  let count = 0
  const current = new Date(start)

  while (current <= end) {
    const day = current.getDay()
    // UAE weekend: Saturday (6) and Sunday (0) — updated to new weekend since 2022
    if (day !== 0 && day !== 6) {
      count++
    }
    current.setDate(current.getDate() + 1)
  }

  return count
}

/**
 * Calculate sick leave pay based on UAE tiers
 */
export function calculateSickLeavePay(
  sickDaysTaken: number,
  dailySalary: number
): { fullPayDays: number; halfPayDays: number; unpaidDays: number; totalPay: number } {
  let fullPayDays = 0
  let halfPayDays = 0
  let unpaidDays = 0

  for (const tier of SICK_LEAVE_TIERS) {
    const tierDays = tier.to - tier.from + 1
    const daysInTier = Math.min(Math.max(sickDaysTaken - tier.from + 1, 0), tierDays)
    if (daysInTier <= 0) continue

    if (tier.payPercentage === 100) fullPayDays += daysInTier
    else if (tier.payPercentage === 50) halfPayDays += daysInTier
    else unpaidDays += daysInTier
  }

  const totalPay = fullPayDays * dailySalary + halfPayDays * dailySalary * 0.5

  return {
    fullPayDays,
    halfPayDays,
    unpaidDays,
    totalPay: Math.round(totalPay * 100) / 100,
  }
}

/**
 * Calculate leave encashment amount
 */
export function calculateLeaveEncashment(pendingDays: number, basicSalary: number): number {
  const dailyRate = basicSalary / 30
  return Math.round(pendingDays * dailyRate * 100) / 100
}
