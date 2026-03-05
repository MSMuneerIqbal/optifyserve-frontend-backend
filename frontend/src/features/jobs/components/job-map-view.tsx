/**
 * Job Map View Component (Placeholder for Phase 12 Dispatcher)
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'
import { JobPriorityBadge } from './job-status-badge'
import { EMIRATE_KEYS } from '../types/job.types'
import type { JobListItem } from '../types/job.types'

interface JobMapViewProps {
  jobs: JobListItem[]
  isLoading: boolean
  onJobClick: (job: JobListItem) => void
}

export function JobMapView({ jobs, isLoading, onJobClick }: JobMapViewProps) {
  const { t } = useTranslation()
  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  // Group jobs by emirate
  const jobsByEmirate = jobs.reduce<Record<string, JobListItem[]>>((acc, job) => {
    const emirate = job.serviceAddress.emirate
    if (!acc[emirate]) acc[emirate] = []
    acc[emirate].push(job)
    return acc
  }, {})

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t('jobs.jobLocations')}
          <Badge variant="secondary" className="ms-1">{jobs.length}</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {t('jobs.mapAvailableInDispatcher')}
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t('jobs.noJobsWithLocations')}</p>
        ) : (
          <div className="space-y-4">
            {/* Map placeholder */}
            <div className="relative h-48 sm:h-64 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('jobs.googleMapsIntegration')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('jobs.jobsAcrossEmirates', { jobCount: jobs.length, emirateCount: Object.keys(jobsByEmirate).length })}
                </p>
              </div>
            </div>

            {/* Jobs by Emirate */}
            <div className="space-y-3">
              {Object.entries(jobsByEmirate).map(([emirate, emirateJobs]) => (
                <div key={emirate}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">{t(EMIRATE_KEYS[emirate as keyof typeof EMIRATE_KEYS]) || emirate}</p>
                    <Badge variant="outline" className="text-xs">{emirateJobs.length}</Badge>
                  </div>
                  <div className="space-y-1.5 ms-6">
                    {emirateJobs.map(job => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between gap-2 p-2 rounded border hover:bg-muted/50 cursor-pointer text-sm"
                        onClick={() => onJobClick(job)}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{job.jobNumber}</span>
                            <JobPriorityBadge priority={job.priority} />
                          </div>
                          <p className="text-sm truncate">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.serviceAddress.area}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            openInMaps(job.serviceAddress.latitude, job.serviceAddress.longitude)
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default JobMapView
