/**
 * Attendance Type Definitions
 * Phase 10: HR Module
 *
 * Check-in/check-out tracking with overtime calculations
 */

import type { StatusBadgeVariant } from '@/types/common.types'

/** Attendance status */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave' | 'holiday' | 'weekend' | 'work-from-home'

/** Shift types */
export type ShiftType = 'morning' | 'evening' | 'night' | 'general'

/** Attendance status config */
export const ATTENDANCE_STATUS_CONFIG: Record<AttendanceStatus, { key: string; variant: StatusBadgeVariant; color: string }> = {
  present: { key: 'status.present', variant: 'success', color: 'bg-green-500' },
  absent: { key: 'status.absent', variant: 'error', color: 'bg-red-500' },
  late: { key: 'status.late', variant: 'warning', color: 'bg-amber-500' },
  'half-day': { key: 'status.halfDay', variant: 'info', color: 'bg-blue-500' },
  'on-leave': { key: 'status.onLeave', variant: 'neutral', color: 'bg-purple-500' },
  holiday: { key: 'status.holiday', variant: 'neutral', color: 'bg-teal-500' },
  weekend: { key: 'status.weekend', variant: 'neutral', color: 'bg-slate-400' },
  'work-from-home': { key: 'status.workFromHome', variant: 'info', color: 'bg-indigo-500' },
}

/** Shift definition */
export interface Shift {
  id: string
  name: string
  type: ShiftType
  startTime: string
  endTime: string
  breakDurationMinutes: number
  graceMinutes: number
  isRamadan: boolean
  ramadanStartTime?: string
  ramadanEndTime?: string
}

/** Attendance record */
export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  employeePhoto?: string
  departmentName: string
  date: string
  shift: ShiftType
  checkInTime?: string
  checkOutTime?: string
  checkInLocation?: { lat: number; lng: number }
  checkOutLocation?: { lat: number; lng: number }
  status: AttendanceStatus
  workingHours: number
  overtimeHours: number
  lateMinutes: number
  earlyDepartureMinutes: number
  notes?: string
  isManualEntry: boolean
  approvedBy?: string
  createdAt: string
}

/** Attendance summary for a month */
export interface AttendanceSummary {
  employeeId: string
  employeeName: string
  month: number
  year: number
  totalWorkingDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  halfDays: number
  leaveDays: number
  holidays: number
  weekends: number
  totalWorkingHours: number
  totalOvertimeHours: number
  averageCheckIn: string
  averageCheckOut: string
}

/** Daily attendance for calendar view */
export interface DailyAttendance {
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  workingHours?: number
  overtime?: number
}

/** Attendance filters */
export interface AttendanceFilters {
  employeeId?: string
  departmentId?: string
  branchId?: string
  date?: string
  startDate?: string
  endDate?: string
  status?: AttendanceStatus
  month?: number
  year?: number
  page?: number
  pageSize?: number
}

/** Check-in/Check-out form data */
export interface CheckInOutData {
  employeeId: string
  time: string
  location?: { lat: number; lng: number }
  notes?: string
}

/** Manual attendance entry form data */
export interface ManualAttendanceData {
  employeeId: string
  date: string
  checkInTime: string
  checkOutTime: string
  shift: ShiftType
  notes?: string
}

/** Attendance regularization request */
export interface AttendanceRegularization {
  id: string
  employeeId: string
  employeeName: string
  date: string
  reason: string
  requestedCheckIn: string
  requestedCheckOut: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  comments?: string
  createdAt: string
}

/** Default shifts */
export const DEFAULT_SHIFTS: Shift[] = [
  { id: 'shift_1', name: 'Morning Shift', type: 'morning', startTime: '08:00', endTime: '17:00', breakDurationMinutes: 60, graceMinutes: 15, isRamadan: false, ramadanStartTime: '09:00', ramadanEndTime: '15:00' },
  { id: 'shift_2', name: 'Evening Shift', type: 'evening', startTime: '14:00', endTime: '22:00', breakDurationMinutes: 60, graceMinutes: 15, isRamadan: false },
  { id: 'shift_3', name: 'Night Shift', type: 'night', startTime: '22:00', endTime: '06:00', breakDurationMinutes: 60, graceMinutes: 15, isRamadan: false },
  { id: 'shift_4', name: 'General Shift', type: 'general', startTime: '09:00', endTime: '18:00', breakDurationMinutes: 60, graceMinutes: 15, isRamadan: false, ramadanStartTime: '09:00', ramadanEndTime: '15:00' },
]
