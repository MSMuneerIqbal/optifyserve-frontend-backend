/**
 * Technician Matching Utilities
 * Phase 11: Jobs/Service Management Module
 *
 * Match technicians to jobs based on skills, distance, workload
 */

import type { ServiceType } from '../types/job.types'
import type { TechnicianListItem, TechnicianAssignmentSuggestion, SkillLevel } from '../types/technician.types'
import { calculateDistance } from './eta-calculator'

/** Skill level scores */
const SKILL_LEVEL_SCORES: Record<SkillLevel, number> = {
  beginner: 40,
  intermediate: 70,
  expert: 100,
}

/** Calculate match score for a technician and job */
export function calculateMatchScore(
  technician: TechnicianListItem & { skills?: { serviceType: ServiceType; level: SkillLevel }[] },
  jobServiceType: ServiceType,
  jobLat: number,
  jobLng: number,
  maxDistanceKm: number = 50
): TechnicianAssignmentSuggestion {
  let score = 0
  const reasons: string[] = []

  // 1. Availability (30 points)
  const isAvailable = technician.status === 'available'
  if (isAvailable) {
    score += 30
    reasons.push('Currently available')
  } else if (technician.status === 'busy') {
    score += 10
    reasons.push('Currently busy')
  }

  // 2. Skill match (30 points)
  const matchingSkill = technician.skills?.find(s => s.serviceType === jobServiceType)
  const skillMatch = !!matchingSkill || technician.primarySkill === jobServiceType
  let skillLevel: SkillLevel = 'beginner'

  if (matchingSkill) {
    skillLevel = matchingSkill.level
    const skillScore = (SKILL_LEVEL_SCORES[matchingSkill.level] / 100) * 30
    score += skillScore
    reasons.push(`${matchingSkill.level} in ${jobServiceType}`)
  } else if (technician.primarySkill === jobServiceType) {
    score += 25
    skillLevel = 'intermediate'
    reasons.push(`Primary skill match`)
  }

  // 3. Distance (20 points)
  let distanceKm = maxDistanceKm
  let estimatedTravelMinutes = 60
  if (technician.currentLocation) {
    distanceKm = calculateDistance(
      technician.currentLocation.latitude,
      technician.currentLocation.longitude,
      jobLat,
      jobLng
    )
    estimatedTravelMinutes = Math.round(distanceKm * 3) // ~20 km/h in city
    const distanceScore = Math.max(0, 20 * (1 - distanceKm / maxDistanceKm))
    score += distanceScore
    reasons.push(`${distanceKm.toFixed(1)} km away`)
  }

  // 4. Workload (10 points)
  const workloadScore = Math.max(0, 10 - technician.activeJobCount * 3)
  score += workloadScore
  reasons.push(`${technician.activeJobCount} active jobs`)

  // 5. Rating (10 points)
  if (technician.avgRating > 0) {
    const ratingScore = (technician.avgRating / 5) * 10
    score += ratingScore
    reasons.push(`${technician.avgRating.toFixed(1)} avg rating`)
  }

  return {
    technician,
    score: Math.round(Math.min(100, score)),
    distanceKm: Math.round(distanceKm * 10) / 10,
    estimatedTravelMinutes,
    skillMatch,
    skillLevel,
    currentWorkload: technician.activeJobCount,
    isAvailable,
    reasons,
  }
}

/** Get top N technician suggestions for a job */
export function getTopSuggestions(
  technicians: (TechnicianListItem & { skills?: { serviceType: ServiceType; level: SkillLevel }[] })[],
  jobServiceType: ServiceType,
  jobLat: number,
  jobLng: number,
  count: number = 3
): TechnicianAssignmentSuggestion[] {
  const suggestions = technicians
    .filter(t => t.isActive)
    .map(t => calculateMatchScore(t, jobServiceType, jobLat, jobLng))
    .sort((a, b) => b.score - a.score)

  return suggestions.slice(0, count)
}
