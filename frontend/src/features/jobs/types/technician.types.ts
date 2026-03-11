/**
 * Technician Type Definitions
 * Phase 11: Jobs/Service Management Module
 */

import type { ServiceType } from './job.types'

/** Technician skill level */
export type SkillLevel = 'beginner' | 'intermediate' | 'expert'

/** Technician availability status */
export type TechnicianStatus = 'available' | 'busy' | 'on-leave' | 'offline' | 'en-route'

/** Technician skill */
export interface TechnicianSkill {
  serviceType: ServiceType
  level: SkillLevel
  yearsExperience: number
  certifications?: string[]
}

/** GPS location */
export interface GpsLocation {
  latitude: number
  longitude: number
  lastUpdated: string
  accuracy?: number
}

/** Technician working schedule */
export interface WorkingSchedule {
  workingDays: number[] // 0=Sunday, 1=Monday, ... 6=Saturday (UAE: Sun-Thu = [0,1,2,3,4])
  startTime: string // "08:00"
  endTime: string   // "18:00"
}

/** Technician performance metrics */
export interface TechnicianPerformance {
  jobsCompletedToday: number
  jobsCompletedWeek: number
  jobsCompletedMonth: number
  jobsCompletedTotal: number
  avgJobDuration: number // minutes
  avgCustomerRating: number
  totalRatings: number
  onTimeCompletionRate: number // percentage
  firstTimeFixRate: number // percentage
  revenueGenerated: number
}

/** Vehicle details */
export interface VehicleInfo {
  plateNumber: string
  make: string
  model: string
  year: number
  color: string
}

/** Technician status display config */
export const TECHNICIAN_STATUS_CONFIG: Record<TechnicianStatus, { key: string; color: string; dotColor: string }> = {
  available: { key: 'status.available', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
  busy: { key: 'status.busy', color: 'bg-orange-100 text-orange-800', dotColor: 'bg-orange-500' },
  'on-leave': { key: 'status.onLeave', color: 'bg-purple-100 text-purple-800', dotColor: 'bg-purple-400' },
  offline: { key: 'status.offline', color: 'bg-slate-100 text-slate-800', dotColor: 'bg-slate-400' },
  'en-route': { key: 'status.enRoute', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-400' },
}

/** Skill level display config */
export const SKILL_LEVEL_CONFIG: Record<SkillLevel, { key: string; color: string }> = {
  beginner: { key: 'status.beginner', color: 'bg-blue-100 text-blue-700' },
  intermediate: { key: 'status.intermediate', color: 'bg-amber-100 text-amber-700' },
  expert: { key: 'status.expert', color: 'bg-green-100 text-green-700' },
}

/** Technician profile */
export interface Technician {
  id: string
  employeeId: string
  name: string
  phone: string
  email: string
  photo?: string

  // Organization
  branchId: string
  branchName: string

  // Skills
  skills: TechnicianSkill[]
  primarySkill: ServiceType

  // Availability
  status: TechnicianStatus
  currentLocation?: GpsLocation
  workingSchedule: WorkingSchedule

  // Vehicle
  vehicle?: VehicleInfo

  // Performance
  performance: TechnicianPerformance

  // Active jobs
  activeJobCount: number
  currentJobId?: string

  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Technician list item (lightweight) */
export interface TechnicianListItem {
  id: string
  employeeId: string
  name: string
  phone: string
  photo?: string
  branchName: string
  primarySkill: ServiceType
  status: TechnicianStatus
  activeJobCount: number
  avgRating: number
  totalJobs: number
  currentLocation?: GpsLocation
  isActive: boolean
}

/** Technician form data */
export interface TechnicianFormData {
  employeeId: string
  name: string
  phone: string
  email: string
  branchId: string
  skills: {
    serviceType: ServiceType
    level: SkillLevel
    yearsExperience: number
  }[]
  primarySkill: ServiceType
  workingDays: number[]
  startTime: string
  endTime: string
  vehiclePlateNumber?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: number
  vehicleColor?: string
}

/** Technician filters */
export interface TechnicianFilters {
  search?: string
  status?: TechnicianStatus
  branchId?: string
  skill?: ServiceType
  isActive?: boolean
}

/** Assignment suggestion for dispatcher */
export interface TechnicianAssignmentSuggestion {
  technician: TechnicianListItem
  score: number // 0-100
  distanceKm: number
  estimatedTravelMinutes: number
  skillMatch: boolean
  skillLevel: SkillLevel
  currentWorkload: number
  isAvailable: boolean
  reasons: string[]
}
