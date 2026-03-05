/**
 * Schedule Calculator Utilities
 * Phase 11: Jobs/Service Management Module
 *
 * Time slot generation and scheduling logic
 */

import type { TimeSlot, ScheduledJob } from '../types/job-scheduling.types'
import { SCHEDULE_CONFIG } from '../types/job-scheduling.types'

/** Generate time slots for a day */
export function generateTimeSlots(
  startHour: number = SCHEDULE_CONFIG.startHour,
  endHour: number = SCHEDULE_CONFIG.endHour,
  slotMinutes: number = SCHEDULE_CONFIG.slotDuration
): TimeSlot[] {
  const slots: TimeSlot[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += slotMinutes) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const label = `${displayHour}:${String(min).padStart(2, '0')} ${period}`

      slots.push({
        time: timeStr,
        label,
        isAvailable: true,
      })
    }
  }

  return slots
}

/** Check if a time slot is available for a technician */
export function isSlotAvailable(
  existingJobs: ScheduledJob[],
  date: string,
  time: string,
  durationMinutes: number,
  bufferMinutes: number = SCHEDULE_CONFIG.defaultBufferTime
): boolean {
  const slotStart = parseTimeToMinutes(time)
  const slotEnd = slotStart + durationMinutes + bufferMinutes

  return !existingJobs.some(job => {
    if (job.scheduledDate !== date) return false
    const jobStart = parseTimeToMinutes(job.scheduledTime)
    const jobEnd = jobStart + job.estimatedDuration + bufferMinutes
    return slotStart < jobEnd && slotEnd > jobStart
  })
}

/** Parse time string "HH:MM" to minutes from midnight */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/** Format minutes to time string */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/** Format duration in minutes to human-readable */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/** Calculate end time from start time and duration */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMinutes = parseTimeToMinutes(startTime)
  return minutesToTime(startMinutes + durationMinutes)
}

/** Get days in a month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Get first day of the week for a month (0=Sunday) */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

/** Format time to 12-hour format */
export function formatTimeTo12Hr(time: string): string {
  const minutes = parseTimeToMinutes(time)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHour}:${String(mins).padStart(2, '0')} ${period}`
}
