/**
 * Attendance Calendar View
 * Phase 10: HR Module
 *
 * Monthly calendar showing attendance status per day
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import type { DailyAttendance, AttendanceStatus } from '../types/attendance.types'
import { ATTENDANCE_STATUS_CONFIG } from '../types/attendance.types'
import { MONTH_NAME_KEYS } from '../types/payroll.types'

interface AttendanceCalendarProps {
  month: number
  year: number
  data: DailyAttendance[]
  onPrevMonth: () => void
  onNextMonth: () => void
  isLoading: boolean
}

const DAY_NAME_KEYS = [
  'status.daySun', 'status.dayMon', 'status.dayTue', 'status.dayWed',
  'status.dayThu', 'status.dayFri', 'status.daySat',
]
const DAY_NAME_SHORT_KEYS = [
  'status.daySunShort', 'status.dayMonShort', 'status.dayTueShort', 'status.dayWedShort',
  'status.dayThuShort', 'status.dayFriShort', 'status.daySatShort',
]

export function AttendanceCalendar({ month, year, data, onPrevMonth, onNextMonth, isLoading }: AttendanceCalendarProps) {
  const { t } = useTranslation()
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const getStatusForDay = (day: number): DailyAttendance | undefined => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return data.find((d) => d.date === dateStr)
  }

  const getStatusColor = (status?: AttendanceStatus): string => {
    if (!status) return ''
    switch (status) {
      case 'present': return 'bg-green-500'
      case 'absent': return 'bg-red-500'
      case 'late': return 'bg-amber-500'
      case 'half_day': return 'bg-blue-500'
      case 'on_leave': return 'bg-purple-500'
      case 'holiday': return 'bg-teal-500'
      case 'weekend': return 'bg-slate-300'
      default: return ''
    }
  }

  // Count stats
  const stats = data.reduce(
    (acc, d) => {
      if (d.status === 'present') acc.present++
      else if (d.status === 'absent') acc.absent++
      else if (d.status === 'late') acc.late++
      else if (d.status === 'on_leave') acc.leave++
      return acc
    },
    { present: 0, absent: 0, late: 0, leave: 0 }
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('hr.attendanceCalendar')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {t(MONTH_NAME_KEYS[month - 1])} {year}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_NAME_KEYS.map((dayKey, i) => (
                <div key={dayKey} className="text-center text-xs font-medium text-muted-foreground py-1">
                  <span className="hidden sm:inline">{t(dayKey)}</span>
                  <span className="sm:hidden">{t(DAY_NAME_SHORT_KEYS[i])}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for first week */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayData = getStatusForDay(day)
                const statusColor = getStatusColor(dayData?.status)

                return (
                  <div
                    key={day}
                    className={cn(
                      'aspect-square rounded-md flex flex-col items-center justify-center',
                      'text-xs sm:text-sm relative cursor-default',
                      'hover:bg-muted/50 transition-colors',
                      dayData?.status === 'weekend' && 'bg-slate-50',
                    )}
                    title={dayData ? `${t(ATTENDANCE_STATUS_CONFIG[dayData.status].key)}${dayData.checkIn ? ` | In: ${dayData.checkIn}` : ''}${dayData.checkOut ? ` | Out: ${dayData.checkOut}` : ''}` : undefined}
                  >
                    <span className="font-medium">{day}</span>
                    {statusColor && (
                      <div className={cn('w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-0.5', statusColor)} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span>{t('hr.present')} ({stats.present})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>{t('hr.absent')} ({stats.absent})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{t('hr.late')} ({stats.late})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>{t('hr.leave')} ({stats.leave})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>{t('hr.weekend')}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default AttendanceCalendar
