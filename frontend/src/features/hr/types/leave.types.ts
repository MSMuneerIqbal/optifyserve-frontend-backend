/**
 * Leave Management Type Definitions
 * Phase 10: HR Module
 *
 * UAE Labor Law compliant leave types and balances
 */

import type { StatusBadgeVariant } from '@/types/common.types'

/** Leave type identifiers */
export type LeaveTypeId = 'annual' | 'sick' | 'maternity' | 'paternity' | 'compassionate' | 'hajj' | 'unpaid' | 'study' | 'emergency'

/** Leave request status */
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

/** Leave duration type */
export type LeaveDuration = 'full-day' | 'half-day-morning' | 'half-day-afternoon'

/** Leave status config */
export const LEAVE_STATUS_CONFIG: Record<LeaveStatus, { key: string; variant: StatusBadgeVariant }> = {
  pending: { key: 'status.pending', variant: 'warning' },
  approved: { key: 'status.approved', variant: 'success' },
  rejected: { key: 'status.rejected', variant: 'error' },
  cancelled: { key: 'status.cancelled', variant: 'neutral' },
}

/** Leave type definition (UAE Labor Law) */
export interface LeaveType {
  id: LeaveTypeId
  name: string
  daysPerYear: number
  isPaid: boolean
  payPercentage: number
  description: string
  requiresMedicalCertificate: boolean
  minServiceDaysRequired: number
  carryForward: boolean
  maxCarryForwardDays: number
  encashable: boolean
}

/** UAE Leave types as per labor law */
export const UAE_LEAVE_TYPES: LeaveType[] = [
  {
    id: 'annual',
    name: 'Annual Leave',
    daysPerYear: 30,
    isPaid: true,
    payPercentage: 100,
    description: '30 days per year after 1 year of service. 2 days per month if less than 1 year.',
    requiresMedicalCertificate: false,
    minServiceDaysRequired: 0,
    carryForward: true,
    maxCarryForwardDays: 15,
    encashable: true,
  },
  {
    id: 'sick',
    name: 'Sick Leave',
    daysPerYear: 90,
    isPaid: true,
    payPercentage: 100,
    description: 'First 15 days full pay, next 30 days half pay, next 45 days unpaid. After probation.',
    requiresMedicalCertificate: true,
    minServiceDaysRequired: 90,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
  {
    id: 'maternity',
    name: 'Maternity Leave',
    daysPerYear: 60,
    isPaid: true,
    payPercentage: 100,
    description: '60 days: 45 days full pay + 15 days half pay. After 1 year of service.',
    requiresMedicalCertificate: true,
    minServiceDaysRequired: 365,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
  {
    id: 'paternity',
    name: 'Paternity Leave',
    daysPerYear: 5,
    isPaid: true,
    payPercentage: 100,
    description: '5 working days within 6 months of child birth.',
    requiresMedicalCertificate: true,
    minServiceDaysRequired: 0,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
  {
    id: 'emergency',
    name: 'Emergency Leave',
    daysPerYear: 5,
    isPaid: true,
    payPercentage: 100,
    description: 'Up to 5 days per year for family emergencies.',
    requiresMedicalCertificate: false,
    minServiceDaysRequired: 0,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
  {
    id: 'unpaid',
    name: 'Unpaid Leave',
    daysPerYear: 30,
    isPaid: false,
    payPercentage: 0,
    description: 'Unpaid leave subject to manager approval.',
    requiresMedicalCertificate: false,
    minServiceDaysRequired: 0,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
  {
    id: 'hajj',
    name: 'Hajj Leave',
    daysPerYear: 30,
    isPaid: false,
    payPercentage: 0,
    description: '30 days unpaid Hajj leave once during employment.',
    requiresMedicalCertificate: false,
    minServiceDaysRequired: 365,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
  {
    id: 'compassionate',
    name: 'Compassionate Leave',
    daysPerYear: 5,
    isPaid: true,
    payPercentage: 100,
    description: '3-5 days for death of spouse or relative.',
    requiresMedicalCertificate: false,
    minServiceDaysRequired: 0,
    carryForward: false,
    maxCarryForwardDays: 0,
    encashable: false,
  },
]

/** Leave balance for an employee */
export interface LeaveBalance {
  leaveTypeId: LeaveTypeId
  leaveTypeName: string
  entitled: number
  taken: number
  pending: number
  balance: number
  carriedForward: number
}

/** Leave request */
export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeePhoto?: string
  departmentName: string
  leaveTypeId: LeaveTypeId
  leaveTypeName: string
  startDate: string
  endDate: string
  duration: LeaveDuration
  totalDays: number
  reason: string
  attachmentUrl?: string
  status: LeaveStatus
  approverId?: string
  approverName?: string
  approverComments?: string
  approvedAt?: string
  appliedAt: string
  createdAt: string
  updatedAt: string
}

/** Leave application form data */
export interface LeaveApplicationFormData {
  leaveTypeId: LeaveTypeId
  startDate: string
  endDate: string
  duration: LeaveDuration
  reason: string
  attachmentUrl?: string
}

/** Leave approval form data */
export interface LeaveApprovalFormData {
  status: 'approved' | 'rejected'
  comments?: string
}

/** Leave filters */
export interface LeaveFilters {
  employeeId?: string
  departmentId?: string
  leaveTypeId?: LeaveTypeId
  status?: LeaveStatus
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

/** Leave calendar entry */
export interface LeaveCalendarEntry {
  employeeId: string
  employeeName: string
  departmentName: string
  leaveTypeId: LeaveTypeId
  startDate: string
  endDate: string
  status: LeaveStatus
}

/** Sick leave pay tiers as per UAE law */
export const SICK_LEAVE_TIERS = [
  { from: 1, to: 15, payPercentage: 100, key: 'status.fullPay' },
  { from: 16, to: 45, payPercentage: 50, key: 'status.halfPay' },
  { from: 46, to: 90, payPercentage: 0, key: 'status.unpaid' },
] as const
