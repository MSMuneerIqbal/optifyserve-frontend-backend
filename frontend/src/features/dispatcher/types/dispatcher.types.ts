/**
 * Dispatcher Type Definitions
 * Phase 12: Dispatcher Command Center
 */

import type { JobPriority, ServiceType, ServiceAddress, JobStatus } from '@/features/jobs/types/job.types'
import type { TechnicianStatus, SkillLevel, GpsLocation } from '@/features/jobs/types/technician.types'

/** Technician location for map display */
export interface TechnicianLocation {
  id: string
  name: string
  phone: string
  photo?: string
  status: TechnicianStatus
  currentLocation: GpsLocation
  activeJobCount: number
  primarySkill: ServiceType
  avgRating: number
  currentJobId?: string
  currentJobTitle?: string
  vehiclePlateNumber?: string
}

/** Job location for map display */
export interface JobLocation {
  id: string
  jobNumber: string
  title: string
  customerName: string
  customerPhone: string
  serviceType: ServiceType
  priority: JobPriority
  status: JobStatus
  serviceAddress: ServiceAddress
  scheduledDate: string
  scheduledTime: string
  estimatedDuration: number
  assignedTechnicianId?: string
  assignedTechnicianName?: string
}

/** Technician utilization data */
export interface TechnicianUtilization {
  id: string
  name: string
  photo?: string
  status: TechnicianStatus
  primarySkill: ServiceType
  activeJobCount: number
  completedToday: number
  totalCapacity: number // max jobs per day
  utilizationPercent: number
  avgRating: number
  nextAvailableAt?: string
}

/** Assignment suggestion with enhanced data */
export interface DispatcherAssignmentSuggestion {
  technicianId: string
  technicianName: string
  technicianPhone: string
  photo?: string
  status: TechnicianStatus
  primarySkill: ServiceType
  skillLevel: SkillLevel
  avgRating: number
  activeJobCount: number
  distanceKm: number
  estimatedTravelMinutes: number
  estimatedArrivalTime: string
  score: number // 0-100
  skillMatch: boolean
  isAvailable: boolean
  isBestMatch: boolean
  reasons: string[]
  currentLocation?: GpsLocation
}

/** Dispatcher dashboard data */
export interface DispatcherData {
  technicians: TechnicianLocation[]
  unassignedJobs: JobLocation[]
  activeJobs: JobLocation[]
  utilization: TechnicianUtilization[]
  stats: DispatcherStats
}

/** Dispatcher summary stats */
export interface DispatcherStats {
  totalTechnicians: number
  availableTechnicians: number
  busyTechnicians: number
  offDutyTechnicians: number
  totalUnassignedJobs: number
  urgentUnassignedJobs: number
  jobsCompletedToday: number
  avgResponseTime: number // minutes
}

/** Map configuration */
export interface MapConfig {
  center: { lat: number; lng: number }
  zoom: number
  mapTypeId?: string
}

/** Dispatcher filters */
export interface DispatcherFilters {
  technicianStatus?: TechnicianStatus
  jobPriority?: JobPriority
  serviceType?: ServiceType
  showOnlyUnassigned?: boolean
}

/** Default map config centered on Dubai */
export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: { lat: 25.2048, lng: 55.2708 },
  zoom: 11,
}

/** Map marker types */
export type MapMarkerType = 'technician' | 'job-unassigned' | 'job-active' | 'job-urgent'

/** Map marker colors */
export const MARKER_COLORS: Record<MapMarkerType, string> = {
  'technician': '#22c55e',        // green
  'job-unassigned': '#ef4444',    // red
  'job-active': '#3b82f6',        // blue
  'job-urgent': '#f97316',        // orange
}

/** Technician status marker colors */
export const TECH_MARKER_COLORS: Record<TechnicianStatus, string> = {
  available: '#22c55e',   // green
  busy: '#f59e0b',        // yellow/amber
  offline: '#94a3b8',     // gray
  'en-route': '#3b82f6',  // blue
  'on-leave': '#a855f7',  // purple
}
