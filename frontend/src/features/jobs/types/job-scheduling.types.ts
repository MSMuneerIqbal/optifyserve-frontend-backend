/**
 * Job Scheduling Type Definitions
 * Phase 11: Jobs/Service Management Module
 */

import type { JobPriority, ServiceType, JobStatus } from './job.types'

/** Calendar view type */
export type CalendarView = 'day' | 'week' | 'month'

/** Time slot (30-minute intervals) */
export interface TimeSlot {
  time: string // "08:00", "08:30", etc.
  label: string // "8:00 AM"
  isAvailable: boolean
  jobId?: string
}

/** Scheduled job for calendar display */
export interface ScheduledJob {
  id: string
  jobNumber: string
  title: string
  customerName: string
  serviceType: ServiceType
  priority: JobPriority
  status: JobStatus
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number // minutes
  technicianId?: string
  technicianName?: string
  branchName: string
  emirate: string
  color: string // for calendar display
}

/** Appointment for scheduling */
export interface Appointment {
  id: string
  jobId: string
  jobNumber: string
  technicianId: string
  technicianName: string
  date: string
  startTime: string
  endTime: string
  duration: number
  bufferTime: number // travel buffer in minutes
  status: 'confirmed' | 'tentative' | 'cancelled'
  customerName: string
  serviceType: ServiceType
}

/** Calendar day data */
export interface CalendarDay {
  date: string
  dayOfWeek: number
  isToday: boolean
  isWeekend: boolean
  isHoliday: boolean
  jobs: ScheduledJob[]
  totalJobs: number
}

/** Scheduling filters */
export interface SchedulingFilters {
  technicianId?: string
  branchId?: string
  serviceType?: ServiceType
  view: CalendarView
  date: string // current date for the view
}

/** Time slot generation config */
export const SCHEDULE_CONFIG = {
  startHour: 8, // 8 AM
  endHour: 20,  // 8 PM
  slotDuration: 30, // 30 minutes
  defaultBufferTime: 30, // 30 min travel buffer
  emergencyHours: { start: 0, end: 24 }, // 24/7 for emergency
} as const
