/**
 * Lead Types
 * Phase 5: CRM Module - Lead Management
 */

/**
 * Lead source categories
 */
export type LeadSource = 'website' | 'referral' | 'cold-call' | 'exhibition' | 'whatsapp' | 'social-media' | 'email-campaign'

/**
 * Lead pipeline stages
 */
export type LeadStage = 'new' | 'follow-up' | 'qualified' | 'closed-won' | 'closed-lost'

/**
 * Follow-up types
 */
export type FollowUpType = 'call' | 'email' | 'meeting' | 'whatsapp' | 'site-visit'

/**
 * Follow-up status
 */
export type FollowUpStatus = 'scheduled' | 'completed' | 'missed' | 'rescheduled'

/**
 * Lead priority levels
 */
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent'

/**
 * Assigned user for lead
 */
export interface AssignedUser {
  id: string
  name: string
  email?: string
  avatar?: string
}

/**
 * Service interest for lead
 */
export interface ServiceInterest {
  id: string
  name: string
  category: string
}

/**
 * Lead entity
 */
export interface Lead {
  id: string
  leadNumber: string
  name: string
  company?: string
  email: string
  phone: string
  alternatePhone?: string
  source: LeadSource
  stage: LeadStage
  priority: LeadPriority
  estimatedValue: {
    min: number
    max: number
    currency: string
  }
  expectedCloseDate?: string
  probability: number // 0-100
  assignedTo?: AssignedUser
  serviceInterests: ServiceInterest[]
  tags: string[]
  notes?: string
  address?: {
    street?: string
    city?: string
    emirate?: string
  }
  lastContactDate?: string
  nextFollowUpDate?: string
  lostReason?: string
  convertedCustomerId?: string
  createdAt: string
  updatedAt: string
}

/**
 * Follow-up entry
 */
export interface FollowUp {
  id: string
  leadId: string
  date: string
  time?: string
  type: FollowUpType
  notes: string
  outcome?: string
  status: FollowUpStatus
  reminder?: boolean
  reminderDate?: string
  createdBy: AssignedUser
  createdAt: string
  updatedAt: string
}

/**
 * Lead form data for create/update
 */
export interface LeadFormData {
  name: string
  company?: string
  email: string
  phone: string
  alternatePhone?: string
  source: LeadSource
  priority: LeadPriority
  estimatedValue: {
    min: number
    max: number
  }
  expectedCloseDate?: string
  probability?: number
  assignedToId?: string
  serviceInterests?: string[]
  tags?: string[]
  notes?: string
  address?: {
    street?: string
    city?: string
    emirate?: string
  }
}

/**
 * Follow-up form data
 */
export interface FollowUpFormData {
  date: string
  time?: string
  type: FollowUpType
  notes: string
  reminder?: boolean
  reminderDate?: string
}

/**
 * Lead filters
 */
export interface LeadFilters {
  search?: string
  stage?: LeadStage
  source?: LeadSource
  priority?: LeadPriority
  assignedTo?: string
  dateFrom?: string
  dateTo?: string
  minValue?: number
  maxValue?: number
}

/**
 * Stage summary for kanban headers
 */
export interface StageSummary {
  stage: LeadStage
  count: number
  totalValue: number
}

/**
 * Lead conversion data
 */
export interface LeadConversionData {
  leadId: string
  createQuotation: boolean
  quotationNotes?: string
}

/**
 * Lost reason options
 */
export const LOST_REASONS = [
  'Price too high',
  'Went with competitor',
  'Project cancelled',
  'Budget constraints',
  'No response',
  'Requirements changed',
  'Timeline mismatch',
  'Other',
] as const

export type LostReason = typeof LOST_REASONS[number]
