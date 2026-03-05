/**
 * Dispatcher Command Center Page
 * Phase 12: Dispatcher Module
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw, List, CheckSquare, Radio } from 'lucide-react'
import { DispatcherMap } from '../components/dispatcher-map'
import { UnassignedJobsList } from '../components/unassigned-jobs-list'
import { AssignedJobsList } from '../components/assigned-jobs-list'
import { TechnicianUtilization } from '../components/technician-utilization'
import { JobAssignmentModal } from '../components/job-assignment-modal'
import { DispatcherStatsBar } from '../components/dispatcher-stats-bar'
import { toast } from 'sonner'
import {
  sampleTechnicianLocations,
  sampleUnassignedJobs,
  sampleActiveJobs,
  sampleTechnicianUtilization,
  sampleDispatcherStats,
} from '@/data/dispatcher.data'
import type { TechnicianLocation, JobLocation, DispatcherStats, DispatcherAssignmentSuggestion } from '../types/dispatcher.types'

export function DispatcherPage() {
  const { t } = useTranslation()
  const [selectedJobId, setSelectedJobId] = useState<string>()
  const [selectedTechId, setSelectedTechId] = useState<string>()
  const [assigningJob, setAssigningJob] = useState<JobLocation | null>(null)
  const [showMobilePanel, setShowMobilePanel] = useState(false)
  const [leftPanelTab, setLeftPanelTab] = useState<'unassigned' | 'assigned'>('unassigned')
  const [isRefetching, setIsRefetching] = useState(false)
  const [isTracking] = useState(true)
  const [nextRefreshIn, setNextRefreshIn] = useState(30)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isLoading = false
  const isAssigning = false
  const isLoadingSuggestions = false
  const suggestions: DispatcherAssignmentSuggestion[] = []

  const technicianLocations = sampleTechnicianLocations
  const unassignedJobs = sampleUnassignedJobs
  const assignedJobs = sampleActiveJobs
  const utilizationData = sampleTechnicianUtilization

  // Build a data object matching the old hook's shape
  const data = {
    technicians: technicianLocations,
    unassignedJobs: unassignedJobs,
    activeJobs: assignedJobs,
    utilization: utilizationData,
    stats: sampleDispatcherStats as DispatcherStats,
  }

  // Simulated refresh (no-op with toast)
  const refetch = useCallback(() => {
    setIsRefetching(true)
    setNextRefreshIn(30)
    setTimeout(() => setIsRefetching(false), 500)
    toast.info(t('dispatcher.dataRefreshed'))
  }, [])

  // Countdown timer for live indicator
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setNextRefreshIn((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const handleTechnicianClick = (tech: TechnicianLocation) => {
    setSelectedTechId(tech.id)
    setSelectedJobId(undefined)
  }

  const handleJobClick = (job: JobLocation) => {
    setSelectedJobId(job.id)
    setSelectedTechId(undefined)
  }

  const handleAssignJob = (job: JobLocation) => {
    setAssigningJob(job)
  }

  const handleAssign = (_technicianId: string, _notifyWhatsApp?: boolean) => {
    if (!assigningJob) return
    toast.success(t('dispatcher.jobAssigned'))
    setAssigningJob(null)
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          title={t('dispatcher.title')}
          description={t('dispatcher.description')}
        />
        <div className="flex items-center gap-2">
          {/* Tracking indicator */}
          {isTracking && (
            <Badge variant="outline" className="text-xs gap-1.5 hidden sm:flex">
              <Radio className="h-3 w-3 text-green-500 animate-pulse" />
              Live · {nextRefreshIn}s
            </Badge>
          )}
          {/* Mobile toggle for left panel */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowMobilePanel(!showMobilePanel)}
          >
            {showMobilePanel ? t('dispatcher.showMap') : t('dispatcher.showJobs')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 me-1.5 ${isRefetching ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      {data?.stats && (
        <DispatcherStatsBar stats={data.stats} isRefetching={isRefetching} />
      )}

      {/* Main Layout: Left Panel + Map */}
      <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[400px]">
        {/* Left Panel - Jobs Tabs */}
        <div className={`w-full lg:w-80 lg:shrink-0 lg:block ${showMobilePanel ? 'block' : 'hidden'}`}>
          <Tabs value={leftPanelTab} onValueChange={(v) => setLeftPanelTab(v as 'unassigned' | 'assigned')}>
            <TabsList className="w-full grid grid-cols-2 mb-2">
              <TabsTrigger value="unassigned" className="text-xs sm:text-sm gap-1">
                <List className="h-3 w-3" />
                {t('dispatcher.unassigned')}
                {(data?.unassignedJobs?.length ?? 0) > 0 && (
                  <Badge variant="destructive" className="h-4 min-w-4 px-1 text-xs">
                    {data?.unassignedJobs?.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="assigned" className="text-xs sm:text-sm gap-1">
                <CheckSquare className="h-3 w-3" />
                {t('status.active')}
                {(data?.activeJobs?.length ?? 0) > 0 && (
                  <Badge variant="secondary" className="h-4 min-w-4 px-1 text-xs">
                    {data?.activeJobs?.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unassigned" className="mt-0">
              <UnassignedJobsList
                jobs={data?.unassignedJobs ?? []}
                isLoading={isLoading}
                onAssignJob={handleAssignJob}
                onSelectJob={handleJobClick}
                selectedJobId={selectedJobId}
              />
            </TabsContent>

            <TabsContent value="assigned" className="mt-0">
              <AssignedJobsList
                jobs={data?.activeJobs ?? []}
                isLoading={isLoading}
                onSelectJob={handleJobClick}
                selectedJobId={selectedJobId}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Map */}
        <div className={`flex-1 min-w-0 lg:block ${showMobilePanel ? 'hidden' : 'block'}`}>
          <DispatcherMap
            technicians={data?.technicians ?? []}
            unassignedJobs={data?.unassignedJobs ?? []}
            activeJobs={data?.activeJobs ?? []}
            isLoading={isLoading}
            onTechnicianClick={handleTechnicianClick}
            onJobClick={handleJobClick}
            selectedTechnicianId={selectedTechId}
            selectedJobId={selectedJobId}
          />
        </div>
      </div>

      {/* Bottom Panel - Technician Utilization */}
      <div className="border-t pt-4">
        <TechnicianUtilization
          utilization={data?.utilization ?? []}
          isLoading={isLoading}
        />
      </div>

      {/* Assignment Modal */}
      <JobAssignmentModal
        isOpen={!!assigningJob}
        onClose={() => setAssigningJob(null)}
        job={assigningJob}
        suggestions={suggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        isAssigning={isAssigning}
        onAssign={handleAssign}
      />
    </div>
  )
}

export default DispatcherPage
