/**
 * Job Scheduling Page
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
import { toast } from 'sonner'
import { JobCalendar } from '../components/job-calendar'
import { sampleScheduledJobs } from '@/data/jobs.data'
import type { ScheduledJob } from '../types/job-scheduling.types'

export function JobSchedulingPage() {
  const { t } = useTranslation()
  const isLoading = false
  const scheduledJobs = sampleScheduledJobs

  const handleJobClick = (job: ScheduledJob) => {
    toast.info(t('jobs.jobClickedInfo', { title: job.title, time: job.scheduledTime, duration: job.estimatedDuration }))
  }

  const handleDateClick = (date: string) => {
    toast.info(t('jobs.dateSelected', { date }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('jobs.scheduleTitle')}
        description={t('jobs.scheduleDescription')}
      />

      <JobCalendar
        scheduledJobs={scheduledJobs}
        isLoading={isLoading}
        onJobClick={handleJobClick}
        onDateClick={handleDateClick}
      />
    </div>
  )
}

export default JobSchedulingPage
