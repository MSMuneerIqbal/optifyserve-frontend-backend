/**
 * Job Workflow Utilities
 * Phase 11: Jobs/Service Management Module
 *
 * Status transitions and validation
 */

import type { JobStatus } from '../types/job.types'

/** Valid status transitions */
const STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  pending: ['scheduled', 'cancelled'],
  scheduled: ['in-progress', 'cancelled'],
  'in-progress': ['on-hold', 'completed', 'cancelled'],
  'on-hold': ['in-progress', 'cancelled'],
  completed: ['invoiced'],
  invoiced: [],
  cancelled: [],
}

/** Check if a status transition is valid */
export function canTransition(from: JobStatus, to: JobStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false
}

/** Get available next statuses from current status */
export function getNextStatuses(current: JobStatus): JobStatus[] {
  return STATUS_TRANSITIONS[current] ?? []
}

/** Check if job is in a terminal state */
export function isTerminalStatus(status: JobStatus): boolean {
  return status === 'invoiced' || status === 'cancelled'
}

/** Check if job can be edited */
export function canEditJob(status: JobStatus): boolean {
  return !['completed', 'invoiced', 'cancelled'].includes(status)
}

/** Check if technician can be assigned */
export function canAssignTechnician(status: JobStatus): boolean {
  return ['pending', 'scheduled'].includes(status)
}

/** Check if service report can be created */
export function canCreateServiceReport(status: JobStatus): boolean {
  return status === 'in-progress'
}

/** Check if job can be cancelled */
export function canCancelJob(status: JobStatus): boolean {
  return !['completed', 'invoiced', 'cancelled'].includes(status)
}

/** Calculate job progress percentage based on status */
export function getJobProgress(status: JobStatus): number {
  const progressMap: Record<JobStatus, number> = {
    pending: 0,
    scheduled: 25,
    'in-progress': 50,
    'on-hold': 50,
    completed: 85,
    invoiced: 100,
    cancelled: 0,
  }
  return progressMap[status]
}

/** Generate next job number */
export function generateJobNumber(sequence: number): string {
  const year = new Date().getFullYear()
  return `JOB-${year}-${String(sequence).padStart(3, '0')}`
}

/** Generate service report number */
export function generateReportNumber(sequence: number): string {
  const year = new Date().getFullYear()
  return `SR-${year}-${String(sequence).padStart(3, '0')}`
}
