/**
 * Attendance Calculator
 * Phase 10: HR Module
 *
 * Working hours, overtime, and late tracking calculations
 */

import type { ShiftType } from '../types/attendance.types'
import { DEFAULT_SHIFTS } from '../types/attendance.types'

/**
 * Parse time string (HH:mm) to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Calculate working hours between check-in and check-out
 */
export function calculateWorkingHours(
  checkIn: string,
  checkOut: string,
  breakMinutes: number = 60
): number {
  const inMinutes = timeToMinutes(checkIn)
  let outMinutes = timeToMinutes(checkOut)

  // Handle overnight shift
  if (outMinutes < inMinutes) {
    outMinutes += 24 * 60
  }

  const totalMinutes = outMinutes - inMinutes - breakMinutes
  return Math.max(0, Math.round((totalMinutes / 60) * 100) / 100)
}

/**
 * Calculate overtime hours
 * Standard: 8 hours/day (6 hours during Ramadan)
 */
export function calculateOvertimeHours(
  workingHours: number,
  isRamadan: boolean = false
): number {
  const standardHours = isRamadan ? 6 : 8
  return Math.max(0, Math.round((workingHours - standardHours) * 100) / 100)
}

/**
 * Calculate late minutes based on shift start time
 */
export function calculateLateMinutes(
  checkInTime: string,
  shiftType: ShiftType,
  graceMinutes: number = 15
): number {
  const shift = DEFAULT_SHIFTS.find((s) => s.type === shiftType)
  if (!shift) return 0

  const shiftStart = timeToMinutes(shift.startTime)
  const checkIn = timeToMinutes(checkInTime)

  const lateMinutes = checkIn - shiftStart - graceMinutes
  return Math.max(0, lateMinutes)
}

/**
 * Calculate early departure minutes
 */
export function calculateEarlyDeparture(
  checkOutTime: string,
  shiftType: ShiftType
): number {
  const shift = DEFAULT_SHIFTS.find((s) => s.type === shiftType)
  if (!shift) return 0

  const shiftEnd = timeToMinutes(shift.endTime)
  const checkOut = timeToMinutes(checkOutTime)

  const earlyMinutes = shiftEnd - checkOut
  return Math.max(0, earlyMinutes)
}

/**
 * Determine if a date is a weekend in UAE
 * UAE weekend: Saturday and Sunday (since Jan 2022)
 */
export function isUAEWeekend(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const day = d.getDay()
  return day === 0 || day === 6 // Sunday or Saturday
}

/**
 * UAE public holidays (approximate for current year)
 */
export function getUAEPublicHolidays(year: number): { date: string; name: string }[] {
  return [
    { date: `${year}-01-01`, name: 'New Year\'s Day' },
    { date: `${year}-03-30`, name: 'Eid Al Fitr (approx)' },
    { date: `${year}-03-31`, name: 'Eid Al Fitr (approx)' },
    { date: `${year}-04-01`, name: 'Eid Al Fitr (approx)' },
    { date: `${year}-06-06`, name: 'Eid Al Adha (approx)' },
    { date: `${year}-06-07`, name: 'Eid Al Adha (approx)' },
    { date: `${year}-06-08`, name: 'Eid Al Adha (approx)' },
    { date: `${year}-06-27`, name: 'Islamic New Year (approx)' },
    { date: `${year}-09-05`, name: 'Prophet\'s Birthday (approx)' },
    { date: `${year}-11-30`, name: 'Commemoration Day' },
    { date: `${year}-12-02`, name: 'UAE National Day' },
    { date: `${year}-12-03`, name: 'UAE National Day' },
  ]
}

/**
 * Check if a date is a UAE public holiday
 */
export function isUAEPublicHoliday(date: string): boolean {
  const year = new Date(date).getFullYear()
  const holidays = getUAEPublicHolidays(year)
  return holidays.some((h) => h.date === date)
}

/**
 * Count working days in a month
 */
export function getWorkingDaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month, 0).getDate()
  let workingDays = 0

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dateStr = date.toISOString().split('T')[0]
    if (!isUAEWeekend(date) && !isUAEPublicHoliday(dateStr)) {
      workingDays++
    }
  }

  return workingDays
}
