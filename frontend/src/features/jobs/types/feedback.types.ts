/**
 * Customer Feedback Type Definitions
 * Phase 11: Jobs/Service Management Module
 */

/** Feedback rating (1-5 stars) */
export type FeedbackRating = 1 | 2 | 3 | 4 | 5

/** Feedback category */
export type FeedbackCategory = 'service_quality' | 'professionalism' | 'timeliness' | 'cleanliness'

/** Category rating */
export interface CategoryFeedback {
  category: FeedbackCategory
  rating: FeedbackRating
}

/** Customer feedback */
export interface CustomerFeedback {
  id: string
  jobId: string
  jobNumber: string
  customerId: string
  customerName: string
  technicianId: string
  technicianName: string

  // Ratings
  overallRating: FeedbackRating
  categoryRatings: CategoryFeedback[]

  // Comments
  comments?: string
  wouldRecommend: boolean

  submittedAt: string
  createdAt: string
}

/** Feedback form data */
export interface FeedbackFormData {
  jobId: string
  overallRating: FeedbackRating
  categoryRatings: {
    category: FeedbackCategory
    rating: FeedbackRating
  }[]
  comments?: string
  wouldRecommend: boolean
}

/** Feedback summary */
export interface FeedbackSummary {
  totalFeedbacks: number
  avgOverallRating: number
  avgByCategory: { category: FeedbackCategory; label: string; avgRating: number }[]
  recommendRate: number
  ratingDistribution: { rating: FeedbackRating; count: number; percentage: number }[]
}

/** Feedback category labels */
export const FEEDBACK_CATEGORY_KEYS: Record<FeedbackCategory, string> = {
  service_quality: 'status.serviceQuality',
  professionalism: 'status.professionalism',
  timeliness: 'status.timeliness',
  cleanliness: 'status.cleanliness',
}

/** Rating labels */
export const RATING_LABELS: Record<FeedbackRating, { key: string; color: string }> = {
  1: { key: 'status.ratingPoor', color: 'text-red-600' },
  2: { key: 'status.ratingFair', color: 'text-orange-500' },
  3: { key: 'status.ratingAverage', color: 'text-amber-500' },
  4: { key: 'status.ratingGood', color: 'text-blue-600' },
  5: { key: 'status.ratingExcellent', color: 'text-green-600' },
}
