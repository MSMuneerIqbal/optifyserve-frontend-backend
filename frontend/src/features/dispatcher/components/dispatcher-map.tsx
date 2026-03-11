/**
 * Dispatcher Map Component
 * Phase 12: Dispatcher Command Center
 *
 * Interactive map showing technician and job locations.
 * Supports zoom and click-to-drag panning.
 */

import { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MapPin, User, Briefcase, Phone,
  Navigation, ZoomIn, ZoomOut, Maximize2,
  Star, AlertTriangle, Move,
} from 'lucide-react'
import { TECHNICIAN_STATUS_CONFIG } from '@/features/jobs/types/technician.types'
import { JOB_PRIORITY_CONFIG, SERVICE_TYPE_CONFIG } from '@/features/jobs/types/job.types'
import { TECH_MARKER_COLORS } from '../types/dispatcher.types'
import type { TechnicianLocation, JobLocation } from '../types/dispatcher.types'

interface DispatcherMapProps {
  technicians: TechnicianLocation[]
  unassignedJobs: JobLocation[]
  activeJobs: JobLocation[]
  isLoading: boolean
  onTechnicianClick: (tech: TechnicianLocation) => void
  onJobClick: (job: JobLocation) => void
  selectedTechnicianId?: string
  selectedJobId?: string
}

/** Convert GPS coordinates to approximate relative position on map */
function toMapPosition(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
): { x: number; y: number } {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100
  return {
    x: Math.max(3, Math.min(97, x)),
    y: Math.max(3, Math.min(97, y)),
  }
}

export function DispatcherMap({
  technicians,
  unassignedJobs,
  activeJobs,
  isLoading,
  onTechnicianClick,
  onJobClick,
  selectedTechnicianId,
  selectedJobId,
}: DispatcherMapProps) {
  const { t } = useTranslation()
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)

  // Drag state refs (avoid re-renders during drag)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const panStartX = useRef(0)
  const panStartY = useRef(0)
  const hasMoved = useRef(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // --- Mouse drag handlers ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only left-click
    if (e.button !== 0) return
    isDragging.current = true
    hasMoved.current = false
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    panStartX.current = panX
    panStartY.current = panY
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'grabbing'
    }
  }, [panX, panY])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current

    // Only consider it a drag if moved more than 4px (prevents accidental drags on clicks)
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMoved.current = true
    }

    setPanX(panStartX.current + dx)
    setPanY(panStartY.current + dy)
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'grab'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false
    if (mapContainerRef.current) {
      mapContainerRef.current.style.cursor = 'grab'
    }
  }, [])

  // --- Touch drag handlers ---
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    isDragging.current = true
    hasMoved.current = false
    dragStartX.current = e.touches[0].clientX
    dragStartY.current = e.touches[0].clientY
    panStartX.current = panX
    panStartY.current = panY
  }, [panX, panY])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragStartX.current
    const dy = e.touches[0].clientY - dragStartY.current

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMoved.current = true
    }

    setPanX(panStartX.current + dx)
    setPanY(panStartY.current + dy)
  }, [])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  // --- Wheel zoom ---
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)))
  }, [])

  // Reset view
  const handleResetView = useCallback(() => {
    setZoom(1)
    setPanX(0)
    setPanY(0)
  }, [])

  // Wrapper for marker clicks — suppress if user was dragging
  const handleMarkerClick = useCallback((callback: () => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!hasMoved.current) {
        callback()
      }
    }
  }, [])

  // Calculate bounds from all points
  const allLats = [
    ...technicians.map(t => t.currentLocation.latitude),
    ...unassignedJobs.map(j => j.serviceAddress.latitude),
    ...activeJobs.map(j => j.serviceAddress.latitude),
  ]
  const allLngs = [
    ...technicians.map(t => t.currentLocation.longitude),
    ...unassignedJobs.map(j => j.serviceAddress.longitude),
    ...activeJobs.map(j => j.serviceAddress.longitude),
  ]

  const bounds = {
    minLat: Math.min(...(allLats.length ? allLats : [24.8])) - 0.05,
    maxLat: Math.max(...(allLats.length ? allLats : [25.5])) + 0.05,
    minLng: Math.min(...(allLngs.length ? allLngs : [55.0])) - 0.05,
    maxLng: Math.max(...(allLngs.length ? allLngs : [55.6])) + 0.05,
  }

  if (isLoading) {
    return (
      <Card className="relative flex items-center justify-center bg-slate-100" style={{ height: '100%', minHeight: 300 }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </Card>
    )
  }

  return (
    <Card
      ref={mapContainerRef}
      className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 select-none"
      style={{ height: '100%', minHeight: 300, cursor: 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Map Grid Background - moves with pan */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          backgroundPosition: `${panX}px ${panY}px`,
        }}
      />

      {/* Map Labels */}
      <div className="absolute top-3 start-3 z-20 space-y-1 pointer-events-none">
        <Badge variant="outline" className="bg-white/90 text-xs">
          <MapPin className="h-3 w-3 me-1 text-primary" />
          {t('dispatcher.uaeDispatcherMap')}
        </Badge>
        {zoom > 1 && (
          <Badge variant="outline" className="bg-white/90 text-xs">
            <Move className="h-3 w-3 me-1" />
            {t('dispatcher.dragToPan')}
          </Badge>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 start-3 z-20 pointer-events-none">
        <Card className="p-2 bg-white/95 shadow-sm">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>{t('dispatcher.availableTech')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>{t('dispatcher.busyTech')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-300" />
              <span>{t('dispatcher.unassignedJob')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-300" />
              <span>{t('dispatcher.activeJob')}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-3 end-3 z-20 flex flex-col gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white/90"
          onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.min(3, prev + 0.25)) }}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white/90"
          onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.max(0.5, prev - 0.25)) }}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white/90"
          onClick={(e) => { e.stopPropagation(); handleResetView() }}
          title={t('dispatcher.resetView')}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom level indicator */}
      {zoom !== 1 && (
        <div className="absolute bottom-3 end-3 z-20 pointer-events-none">
          <Badge variant="outline" className="bg-white/90 text-xs font-mono">
            {Math.round(zoom * 100)}%
          </Badge>
        </div>
      )}

      {/* Map Content Container - transforms with zoom and pan */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging.current ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* Technician Markers */}
        {technicians.map(tech => {
          const pos = toMapPosition(
            tech.currentLocation.latitude,
            tech.currentLocation.longitude,
            bounds
          )
          const isSelected = selectedTechnicianId === tech.id
          const isHovered = hoveredMarker === `tech-${tech.id}`
          const markerColor = TECH_MARKER_COLORS[tech.status]

          return (
            <div
              key={`tech-${tech.id}`}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={handleMarkerClick(() => onTechnicianClick(tech))}
              onMouseEnter={() => setHoveredMarker(`tech-${tech.id}`)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              {/* Pulse ring for available technicians */}
              {tech.status === 'available' && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: markerColor, margin: '-4px' }}
                />
              )}

              {/* Marker */}
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform cursor-pointer',
                  isSelected && 'ring-2 ring-primary ring-offset-1',
                  (isHovered || isSelected) && 'scale-125'
                )}
                style={{ width: 32, height: 32, backgroundColor: markerColor }}
              >
                <User className="h-4 w-4 text-white" />
              </div>

              {/* Tooltip */}
              {(isHovered || isSelected) && (
                <Card
                  className="absolute bottom-full start-1/2 -translate-x-1/2 mb-2 p-2 bg-white shadow-lg z-30 min-w-[160px] max-w-[calc(100vw-16px)] pointer-events-none"
                  style={{ transform: `translate(-50%, 0) scale(${1 / zoom})`, transformOrigin: 'bottom center' }}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{tech.name}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge className={cn('text-xs', TECHNICIAN_STATUS_CONFIG[tech.status].color)}>
                        {t(TECHNICIAN_STATUS_CONFIG[tech.status].key)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span>{tech.activeJobCount} {t('dispatcher.activeJobs')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-amber-400" />
                      <span>{tech.avgRating.toFixed(1)}</span>
                    </div>
                    {tech.vehiclePlateNumber && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Navigation className="h-3 w-3" />
                        <span>{tech.vehiclePlateNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{tech.phone}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )
        })}

        {/* Unassigned Job Markers */}
        {unassignedJobs.map(job => {
          const pos = toMapPosition(
            job.serviceAddress.latitude,
            job.serviceAddress.longitude,
            bounds
          )
          const isSelected = selectedJobId === job.id
          const isHovered = hoveredMarker === `job-${job.id}`
          const isUrgent = job.priority === 'emergency'

          return (
            <div
              key={`job-${job.id}`}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={handleMarkerClick(() => onJobClick(job))}
              onMouseEnter={() => setHoveredMarker(`job-${job.id}`)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              {/* Urgent pulse */}
              {isUrgent && (
                <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-40" style={{ margin: '-4px' }} />
              )}

              <div
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 shadow-lg transition-transform cursor-pointer',
                  isUrgent ? 'border-red-300 bg-red-500' : 'border-orange-300 bg-orange-500',
                  isSelected && 'ring-2 ring-primary ring-offset-1',
                  (isHovered || isSelected) && 'scale-125'
                )}
                style={{ width: 28, height: 28 }}
              >
                {isUrgent ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-white" />
                ) : (
                  <MapPin className="h-3.5 w-3.5 text-white" />
                )}
              </div>

              {/* Tooltip */}
              {(isHovered || isSelected) && (
                <Card
                  className="absolute bottom-full start-1/2 mb-2 p-2 bg-white shadow-lg z-30 min-w-[160px] max-w-[calc(100vw-16px)] pointer-events-none"
                  style={{ transform: `translate(-50%, 0) scale(${1 / zoom})`, transformOrigin: 'bottom center' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-muted-foreground">{job.jobNumber}</span>
                      <Badge className={cn('text-xs', JOB_PRIORITY_CONFIG[job.priority].color)}>
                        {t(JOB_PRIORITY_CONFIG[job.priority].key)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.customerName}</p>
                    <Badge variant="outline" className="text-xs">
                      {t(SERVICE_TYPE_CONFIG[job.serviceType].key)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {job.serviceAddress.area}, {job.serviceAddress.building}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )
        })}

        {/* Active Job Markers */}
        {activeJobs.map(job => {
          const pos = toMapPosition(
            job.serviceAddress.latitude,
            job.serviceAddress.longitude,
            bounds
          )
          const isHovered = hoveredMarker === `active-${job.id}`

          return (
            <div
              key={`active-${job.id}`}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={handleMarkerClick(() => onJobClick(job))}
              onMouseEnter={() => setHoveredMarker(`active-${job.id}`)}
              onMouseLeave={() => setHoveredMarker(null)}
            >
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 border-blue-300 bg-blue-500 shadow-lg transition-transform cursor-pointer',
                  isHovered && 'scale-125'
                )}
                style={{ width: 24, height: 24 }}
              >
                <Briefcase className="h-3 w-3 text-white" />
              </div>

              {isHovered && (
                <Card
                  className="absolute bottom-full start-1/2 mb-2 p-2 bg-white shadow-lg z-30 min-w-[140px] max-w-[calc(100vw-16px)] pointer-events-none"
                  style={{ transform: `translate(-50%, 0) scale(${1 / zoom})`, transformOrigin: 'bottom center' }}
                >
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-muted-foreground">{job.jobNumber}</span>
                    <p className="text-xs font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('dispatcher.assigned')}: {job.assignedTechnicianName}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
