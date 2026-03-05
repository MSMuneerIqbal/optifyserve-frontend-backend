/**
 * Distance Calculator Utilities
 * Phase 12: Dispatcher Module
 *
 * Re-exports from jobs module and adds dispatcher-specific helpers
 */

import { calculateDistance, estimateTravelTime, formatDistance, formatTravelTime, calculateETA } from '@/features/jobs/utils/eta-calculator'
import type { Coordinates, DistanceResult } from '../types/location.types'

// Re-export core functions
export { calculateDistance, estimateTravelTime, formatDistance, formatTravelTime, calculateETA }

/** Calculate distance result between two coordinate pairs */
export function getDistanceResult(from: Coordinates, to: Coordinates): DistanceResult {
  const distanceKm = calculateDistance(from.lat, from.lng, to.lat, to.lng)
  const estimatedMinutes = estimateTravelTime(distanceKm)
  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    estimatedMinutes,
    formattedDistance: formatDistance(distanceKm),
    formattedDuration: formatTravelTime(estimatedMinutes),
  }
}

/** Sort locations by distance from a reference point */
export function sortByDistance<T extends { latitude: number; longitude: number }>(
  items: T[],
  from: Coordinates
): (T & { distanceKm: number })[] {
  return items
    .map(item => ({
      ...item,
      distanceKm: calculateDistance(from.lat, from.lng, item.latitude, item.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

/** Find nearest item from a list of locations */
export function findNearest<T extends { latitude: number; longitude: number }>(
  items: T[],
  from: Coordinates
): (T & { distanceKm: number }) | null {
  const sorted = sortByDistance(items, from)
  return sorted[0] ?? null
}
