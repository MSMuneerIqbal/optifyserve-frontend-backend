/**
 * ETA Calculator Utilities
 * Phase 11: Jobs/Service Management Module
 *
 * Distance and estimated time calculations
 */

/** Calculate distance between two GPS coordinates using Haversine formula */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/** Convert degrees to radians */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/** Estimate travel time in minutes based on distance */
export function estimateTravelTime(
  distanceKm: number,
  averageSpeedKmh: number = 30 // UAE city average with traffic
): number {
  return Math.round((distanceKm / averageSpeedKmh) * 60)
}

/** Calculate ETA from current time and travel time */
export function calculateETA(travelMinutes: number): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() + travelMinutes)
  return now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** Format distance for display */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(1)} km`
}

/** Format travel time for display */
export function formatTravelTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/** Validate GPS coordinates */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

/** UAE center coordinates (Dubai) */
export const UAE_CENTER = {
  latitude: 25.2048,
  longitude: 55.2708,
} as const

/** Emirate center coordinates for defaults */
export const EMIRATE_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  dubai: { latitude: 25.2048, longitude: 55.2708 },
  abu_dhabi: { latitude: 24.4539, longitude: 54.3773 },
  sharjah: { latitude: 25.3463, longitude: 55.4209 },
  ajman: { latitude: 25.4052, longitude: 55.5136 },
  ras_al_khaimah: { latitude: 25.7895, longitude: 55.9432 },
  umm_al_quwain: { latitude: 25.5647, longitude: 55.5553 },
  fujairah: { latitude: 25.1288, longitude: 56.3264 },
}
