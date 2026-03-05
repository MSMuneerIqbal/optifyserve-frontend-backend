/**
 * Technician Availability Component
 * Phase 11: Jobs/Service Management Module
 */

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { generateTimeSlots, formatTimeTo12Hr, parseTimeToMinutes } from '../utils/schedule-calculator'
import type { ScheduledJob } from '../types/job-scheduling.types'

interface TechnicianAvailabilityProps {
  technicianName: string
  date: string
  scheduledJobs: ScheduledJob[]
  workStartHour?: number
  workEndHour?: number
}

export function TechnicianAvailability({
  technicianName, date, scheduledJobs, workStartHour = 8, workEndHour = 18,
}: TechnicianAvailabilityProps) {
  const { t } = useTranslation()
  const slots = generateTimeSlots(workStartHour, workEndHour, 60)

  const isSlotBooked = (slotTime: string) => {
    return scheduledJobs.some(job => {
      if (job.scheduledDate !== date) return false
      const jobStartMin = parseTimeToMinutes(job.scheduledTime)
      const jobEndMin = jobStartMin + job.estimatedDuration
      const slotMin = parseTimeToMinutes(slotTime)
      return slotMin >= jobStartMin && slotMin < jobEndMin
    })
  }

  const getJobAtSlot = (slotTime: string) => {
    return scheduledJobs.find(job => {
      if (job.scheduledDate !== date) return false
      return job.scheduledTime === slotTime
    })
  }

  const availableSlots = slots.filter(s => !isSlotBooked(s.time)).length
  const totalSlots = slots.length

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium">{technicianName}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <Badge variant={availableSlots > 2 ? 'default' : availableSlots > 0 ? 'secondary' : 'destructive'}>
          {availableSlots}/{totalSlots} {t('status.available')}
        </Badge>
      </div>

      <div className="space-y-1">
        {slots.map((slot) => {
          const booked = isSlotBooked(slot.time)
          const job = getJobAtSlot(slot.time)

          return (
            <div
              key={slot.time}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded text-xs',
                booked ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
              )}
            >
              <Clock className="h-3 w-3 shrink-0" />
              <span className="font-mono w-20">{formatTimeTo12Hr(slot.time)}</span>
              {booked ? (
                <>
                  <XCircle className="h-3 w-3 shrink-0" />
                  <span className="truncate">{job?.title || t('jobs.booked')}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 shrink-0" />
                  <span>{t('status.available')}</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default TechnicianAvailability
