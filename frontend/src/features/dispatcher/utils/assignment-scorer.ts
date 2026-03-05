/**
 * Assignment Scorer Utilities
 * Phase 12: Dispatcher Module
 *
 * Enhanced scoring for dispatcher job assignment suggestions
 */

import type { TechnicianLocation, JobLocation, DispatcherAssignmentSuggestion } from '../types/dispatcher.types'
import { calculateDistance, estimateTravelTime, calculateETA, formatDistance, formatTravelTime } from './distance-calculator'

/** Weight configuration for scoring factors */
const SCORE_WEIGHTS = {
  availability: 30,
  skillMatch: 30,
  distance: 20,
  workload: 10,
  rating: 10,
} as const

/** Calculate assignment score for a technician to a job */
export function scoreAssignment(
  tech: TechnicianLocation,
  job: JobLocation,
  maxDistanceKm: number = 50
): DispatcherAssignmentSuggestion {
  let score = 0
  const reasons: string[] = []

  // 1. Availability (30 points)
  const isAvailable = tech.status === 'available'
  if (isAvailable) {
    score += SCORE_WEIGHTS.availability
    reasons.push('Currently available')
  } else if (tech.status === 'busy') {
    score += SCORE_WEIGHTS.availability * 0.3
    reasons.push('Currently busy - may become available')
  } else if (tech.status === 'on_break') {
    score += SCORE_WEIGHTS.availability * 0.5
    reasons.push('On break - will be available soon')
  }

  // 2. Skill match (30 points)
  const skillMatch = tech.primarySkill === job.serviceType
  if (skillMatch) {
    score += SCORE_WEIGHTS.skillMatch
    reasons.push(`Primary skill: ${job.serviceType.replace(/_/g, ' ')}`)
  } else {
    score += SCORE_WEIGHTS.skillMatch * 0.2
    reasons.push('Different primary skill')
  }

  // 3. Distance (20 points)
  const distanceKm = calculateDistance(
    tech.currentLocation.latitude,
    tech.currentLocation.longitude,
    job.serviceAddress.latitude,
    job.serviceAddress.longitude
  )
  const estimatedTravelMinutes = estimateTravelTime(distanceKm)
  const distanceScore = Math.max(0, SCORE_WEIGHTS.distance * (1 - distanceKm / maxDistanceKm))
  score += distanceScore
  reasons.push(`${formatDistance(distanceKm)} away (${formatTravelTime(estimatedTravelMinutes)})`)

  // 4. Workload (10 points)
  const workloadScore = Math.max(0, SCORE_WEIGHTS.workload - tech.activeJobCount * 3)
  score += workloadScore
  if (tech.activeJobCount === 0) {
    reasons.push('No active jobs')
  } else {
    reasons.push(`${tech.activeJobCount} active job${tech.activeJobCount > 1 ? 's' : ''}`)
  }

  // 5. Rating (10 points)
  if (tech.avgRating > 0) {
    const ratingScore = (tech.avgRating / 5) * SCORE_WEIGHTS.rating
    score += ratingScore
    reasons.push(`${tech.avgRating.toFixed(1)} rating`)
  }

  const finalScore = Math.round(Math.min(100, score))

  return {
    technicianId: tech.id,
    technicianName: tech.name,
    technicianPhone: tech.phone,
    photo: tech.photo,
    status: tech.status,
    primarySkill: tech.primarySkill,
    skillLevel: skillMatch ? 'expert' : 'intermediate',
    avgRating: tech.avgRating,
    activeJobCount: tech.activeJobCount,
    distanceKm: Math.round(distanceKm * 10) / 10,
    estimatedTravelMinutes,
    estimatedArrivalTime: calculateETA(estimatedTravelMinutes),
    score: finalScore,
    skillMatch,
    isAvailable,
    isBestMatch: false, // set after sorting
    reasons,
    currentLocation: tech.currentLocation,
  }
}

/** Get top N assignment suggestions for a job, sorted by score */
export function getAssignmentSuggestions(
  technicians: TechnicianLocation[],
  job: JobLocation,
  count: number = 3
): DispatcherAssignmentSuggestion[] {
  const suggestions = technicians
    .filter(t => t.status !== 'off_duty' && t.status !== 'on_leave')
    .map(t => scoreAssignment(t, job))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)

  // Mark best match
  if (suggestions.length > 0) {
    suggestions[0].isBestMatch = true
  }

  return suggestions
}
