/**
 * Attendance Page
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/page-header'
// Tabs available for future tabbed view
import { AttendanceCheckIn } from '../components/attendance-check-in'
import { AttendanceList } from '../components/attendance-list'
import { AttendanceCalendar } from '../components/attendance-calendar'
import { sampleAttendanceRecords, sampleDepartments } from '@/data/employees.data'
import { toast } from 'sonner'
import type { AttendanceFilters } from '../types/attendance.types'
import type { DailyAttendance } from '../types/attendance.types'

export function AttendancePage() {
  const { t } = useTranslation()
  const now = new Date()
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0])
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth() + 1)
  const [calendarYear, setCalendarYear] = useState(now.getFullYear())
  const [filters, setFilters] = useState<AttendanceFilters>({ date: selectedDate })
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  const isLoading = false

  const records = sampleAttendanceRecords.filter((r) => {
    if (filters.date && r.date !== filters.date) return false
    if (filters.departmentId && filters.departmentId !== 'all' && !r.departmentName.toLowerCase().includes(filters.departmentId.toLowerCase())) return false
    if (filters.status && r.status !== filters.status) return false
    return true
  })
  const departments = sampleDepartments

  const calendarData: DailyAttendance[] = []
  const isLoadingCalendar = false
  const isCheckingIn = false
  const isCheckingOut = false

  const handleCheckIn = () => {
    toast.success(t('hr.checkedIn'))
    setIsCheckedIn(true)
  }

  const handleCheckOut = () => {
    toast.success(t('hr.checkedOut'))
    setIsCheckedIn(false)
  }

  const handlePrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarMonth(12)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarMonth(1)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader title={t('hr.attendanceTitle')} description={t('hr.attendanceDescription')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Check In Widget */}
        <div className="lg:col-span-1">
          <AttendanceCheckIn
            isCheckedIn={isCheckedIn}
            lastCheckIn={isCheckedIn ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isCheckingIn={isCheckingIn}
            isCheckingOut={isCheckingOut}
            employeeName="Current User"
          />
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2">
          <AttendanceCalendar
            month={calendarMonth}
            year={calendarYear}
            data={calendarData}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            isLoading={isLoadingCalendar}
          />
        </div>
      </div>

      {/* Attendance Records */}
      <AttendanceList
        records={records}
        isLoading={isLoading}
        departments={departments.map((d) => ({ id: d.id, name: d.name }))}
        onDateChange={(date) => { setSelectedDate(date); setFilters((f) => ({ ...f, date })) }}
        onDepartmentChange={(deptId) => setFilters((f) => ({ ...f, departmentId: deptId === 'all' ? undefined : deptId }))}
        onStatusChange={(status) => setFilters((f) => ({ ...f, status: status === 'all' ? undefined : status as AttendanceFilters['status'] }))}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default AttendancePage
