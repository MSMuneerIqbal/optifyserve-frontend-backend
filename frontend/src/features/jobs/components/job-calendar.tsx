/**
 * Job Calendar Component
 * Phase 11: Jobs/Service Management Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { JobStatusBadge, JobPriorityBadge } from './job-status-badge'
import { getDaysInMonth, getFirstDayOfMonth, formatTimeTo12Hr } from '../utils/schedule-calculator'
import type { ScheduledJob, CalendarView } from '../types/job-scheduling.types'

interface JobCalendarProps {
  scheduledJobs: ScheduledJob[]
  isLoading: boolean
  onJobClick: (job: ScheduledJob) => void
  onDateClick?: (date: string) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function JobCalendar({ scheduledJobs, isLoading, onJobClick, onDateClick }: JobCalendarProps) {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('month')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const navigateMonth = (direction: -1 | 1) => {
    setCurrentDate(new Date(year, month + direction, 1))
  }

  const goToToday = () => setCurrentDate(new Date())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = getFirstDayOfMonth(year, month)

  const getJobsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return scheduledJobs.filter(j => j.scheduledDate === dateStr)
  }

  const today = new Date()
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  // Generate calendar grid
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7
  const cells: (number | null)[] = []
  for (let i = 0; i < totalCells; i++) {
    const day = i - firstDayOfWeek + 1
    cells.push(day > 0 && day <= daysInMonth ? day : null)
  }

  // Week view
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const navigateWeek = (direction: -1 | 1) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + direction * 7)
    setCurrentDate(d)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {t('jobs.scheduleTitle')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={view} onValueChange={(v) => setView(v as CalendarView)}>
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">{t('common.month')}</SelectItem>
                <SelectItem value="week">{t('common.week')}</SelectItem>
                <SelectItem value="day">{t('common.day')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={goToToday}>{t('common.today')}</Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => view === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-sm font-medium">
            {view === 'week'
              ? `Week of ${currentDate.toLocaleDateString('en-GB')}`
              : `${MONTHS[month]} ${year}`
            }
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => view === 'week' ? navigateWeek(1) : navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : view === 'month' ? (
          <div>
            <div className="grid grid-cols-7 gap-px mb-1">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px">
              {cells.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="min-h-[80px] sm:min-h-[100px] bg-muted/30 rounded" />
                }

                const dayJobs = getJobsForDate(day)
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

                return (
                  <div
                    key={day}
                    className={cn(
                      'min-h-[80px] sm:min-h-[100px] p-1 rounded border cursor-pointer hover:bg-muted/50 transition-colors',
                      isToday(day) && 'border-primary/70 bg-primary/5',
                    )}
                    onClick={() => onDateClick?.(dateStr)}
                  >
                    <span className={cn(
                      'text-xs font-medium',
                      isToday(day) && 'text-primary',
                    )}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayJobs.slice(0, 3).map((job) => (
                        <div
                          key={job.id}
                          className="text-xs px-1 py-0.5 rounded bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20"
                          title={`${formatTimeTo12Hr(job.scheduledTime)} - ${job.title}`}
                          onClick={(e) => { e.stopPropagation(); onJobClick(job) }}
                        >
                          {formatTimeTo12Hr(job.scheduledTime)} {job.title}
                        </div>
                      ))}
                      {dayJobs.length > 3 && (
                        <p className="text-xs text-muted-foreground px-1">+{dayJobs.length - 3} more</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : view === 'week' ? (
          <div>
            <div className="grid grid-cols-7 gap-2">
              {getWeekDates().map((date) => {
                const day = date.getDate()
                const m = date.getMonth()
                const y = date.getFullYear()
                const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayJobs = scheduledJobs.filter(j => j.scheduledDate === dateStr)
                const isTodayDate = date.toDateString() === today.toDateString()

                return (
                  <div key={dateStr} className={cn('min-h-[200px] border rounded p-2', isTodayDate && 'border-primary/70')}>
                    <div className="text-center mb-2">
                      <p className="text-xs text-muted-foreground">{WEEKDAYS[date.getDay()]}</p>
                      <p className={cn('text-sm font-medium', isTodayDate && 'text-primary')}>{day}</p>
                    </div>
                    <div className="space-y-1">
                      {dayJobs.map((job) => (
                        <div
                          key={job.id}
                          className="text-xs p-1.5 rounded bg-primary/5 border border-primary/10 cursor-pointer hover:bg-primary/10"
                          onClick={() => onJobClick(job)}
                        >
                          <p className="font-medium truncate">{job.title}</p>
                          <p className="text-muted-foreground">{formatTimeTo12Hr(job.scheduledTime)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">
              {currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {(() => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
              const dayJobs = scheduledJobs.filter(j => j.scheduledDate === dateStr).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
              if (dayJobs.length === 0) {
                return <p className="text-center text-muted-foreground py-8">{t('jobs.noJobsScheduled')}</p>
              }
              return dayJobs.map(job => (
                <Card
                  key={job.id}
                  className="p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => onJobClick(job)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTimeTo12Hr(job.scheduledTime)} ({job.estimatedDuration}min)
                      </p>
                      {job.technicianName && (
                        <p className="text-xs mt-1">{t('jobs.tech')}: <span className="font-medium">{job.technicianName}</span></p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <JobPriorityBadge priority={job.priority} />
                      <JobStatusBadge status={job.status} />
                    </div>
                  </div>
                </Card>
              ))
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default JobCalendar
