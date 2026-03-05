/**
 * Performance Review Type Definitions
 * Phase 10: HR Module
 *
 * Employee appraisals and goal tracking
 */

import type { StatusBadgeVariant } from '@/types/common.types'

/** Review period */
export type ReviewPeriod = 'quarterly' | 'semi_annual' | 'annual'

/** Review status */
export type ReviewStatus = 'draft' | 'self_assessment' | 'manager_review' | 'completed'

/** Rating scale */
export type RatingScore = 1 | 2 | 3 | 4 | 5

/** Review status config */
export const REVIEW_STATUS_CONFIG: Record<ReviewStatus, { key: string; variant: StatusBadgeVariant }> = {
  draft: { key: 'status.draft', variant: 'neutral' },
  self_assessment: { key: 'status.selfAssessment', variant: 'warning' },
  manager_review: { key: 'status.managerReview', variant: 'info' },
  completed: { key: 'status.completed', variant: 'success' },
}

/** Rating labels */
export const RATING_LABELS: Record<RatingScore, { key: string; color: string }> = {
  1: { key: 'status.ratingPoor', color: 'text-red-600' },
  2: { key: 'status.ratingBelowAverage', color: 'text-orange-500' },
  3: { key: 'status.ratingAverage', color: 'text-amber-500' },
  4: { key: 'status.ratingGood', color: 'text-blue-600' },
  5: { key: 'status.ratingExcellent', color: 'text-green-600' },
}

/** Rating category */
export interface RatingCategory {
  id: string
  name: string
  description: string
  weight: number
}

/** Default rating categories */
export const DEFAULT_RATING_CATEGORIES: RatingCategory[] = [
  { id: 'cat_1', name: 'Job Knowledge', description: 'Understanding of role responsibilities and technical expertise', weight: 20 },
  { id: 'cat_2', name: 'Quality of Work', description: 'Accuracy, thoroughness, and attention to detail', weight: 20 },
  { id: 'cat_3', name: 'Communication', description: 'Verbal and written communication effectiveness', weight: 15 },
  { id: 'cat_4', name: 'Teamwork', description: 'Ability to collaborate and work with others', weight: 15 },
  { id: 'cat_5', name: 'Initiative', description: 'Self-motivation and proactive problem solving', weight: 15 },
  { id: 'cat_6', name: 'Attendance & Punctuality', description: 'Regularity and time management', weight: 15 },
]

/** Individual category rating */
export interface CategoryRating {
  categoryId: string
  categoryName: string
  weight: number
  selfRating?: RatingScore
  managerRating?: RatingScore
  comments?: string
}

/** Goal */
export interface PerformanceGoal {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
  progress: number
}

/** Performance review */
export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  employeePhoto?: string
  departmentName: string
  designationName: string
  reviewerId: string
  reviewerName: string
  period: ReviewPeriod
  periodLabel: string
  year: number
  startDate: string
  endDate: string
  status: ReviewStatus

  // Ratings
  categoryRatings: CategoryRating[]
  overallSelfRating?: number
  overallManagerRating?: number
  overallRating?: number

  // Comments
  selfComments?: string
  managerComments?: string
  strengths?: string
  areasOfImprovement?: string

  // Goals
  previousGoals: PerformanceGoal[]
  newGoals: PerformanceGoal[]

  completedAt?: string
  createdAt: string
  updatedAt: string
}

/** Performance review form data */
export interface PerformanceReviewFormData {
  employeeId: string
  period: ReviewPeriod
  year: number
  startDate: string
  endDate: string
  categoryRatings: {
    categoryId: string
    managerRating: RatingScore
    comments?: string
  }[]
  managerComments: string
  strengths: string
  areasOfImprovement: string
  newGoals: {
    title: string
    description: string
    targetDate: string
  }[]
}

/** Performance filters */
export interface PerformanceFilters {
  employeeId?: string
  departmentId?: string
  period?: ReviewPeriod
  year?: number
  status?: ReviewStatus
  page?: number
  pageSize?: number
}
