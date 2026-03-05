/**
 * Location Type Definitions
 * Phase 12: Dispatcher Module
 */

/** Basic coordinate pair */
export interface Coordinates {
  lat: number
  lng: number
}

/** Distance calculation result */
export interface DistanceResult {
  distanceKm: number
  estimatedMinutes: number
  formattedDistance: string
  formattedDuration: string
}

/** Geocoding result */
export interface GeocodingResult {
  coordinates: Coordinates
  formattedAddress: string
  emirate?: string
  area?: string
}

/** Route between two points */
export interface RouteInfo {
  origin: Coordinates
  destination: Coordinates
  distanceKm: number
  durationMinutes: number
  polyline?: string
}
