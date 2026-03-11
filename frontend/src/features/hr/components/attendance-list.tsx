/**
 * Attendance Records List
 * Phase 10: HR Module
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getInitials } from '@/lib/utils'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance.types'
import { ATTENDANCE_STATUS_CONFIG } from '../types/attendance.types'

interface AttendanceListProps {
  records: AttendanceRecord[]
  isLoading: boolean
  departments: { id: string; name: string }[]
  onDateChange: (date: string) => void
  onDepartmentChange: (departmentId: string) => void
  onStatusChange: (status: string) => void
  selectedDate: string
}

export function AttendanceList({
  records,
  isLoading,
  departments,
  onDateChange,
  onDepartmentChange,
  onStatusChange,
  selectedDate,
}: AttendanceListProps) {
  const { t } = useTranslation()
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecords = records.filter((r) =>
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Summary stats
  const summary = {
    present: records.filter((r) => r.status === 'present').length,
    absent: records.filter((r) => r.status === 'absent').length,
    late: records.filter((r) => r.status === 'late').length,
    onLeave: records.filter((r) => r.status === 'on-leave').length,
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('hr.present')}</p>
          <p className="text-2xl font-bold text-green-600">{summary.present}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('hr.absent')}</p>
          <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('hr.late')}</p>
          <p className="text-2xl font-bold text-amber-600">{summary.late}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">{t('hr.onLeave')}</p>
          <p className="text-2xl font-bold text-purple-600">{summary.onLeave}</p>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('hr.searchEmployee')}
                className="ps-9 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="h-10 w-auto"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10"
              >
                <Filter className="h-4 w-4 me-1.5" />
                <span className="hidden sm:inline">{t('common.filters')}</span>
                <ChevronDown className={cn('h-4 w-4 ms-1.5 transition-transform', showFilters && 'rotate-180')} />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t">
              <Select onValueChange={onDepartmentChange}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder={t('hr.allDepartments')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hr.allDepartments')}</SelectItem>
                  {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={onStatusChange}>
                <SelectTrigger className="w-[160px] h-10">
                  <SelectValue placeholder={t('hr.allStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('hr.allStatus')}</SelectItem>
                  {(Object.entries(ATTENDANCE_STATUS_CONFIG) as [AttendanceStatus, { key: string }][]).map(([k, val]) => (
                    <SelectItem key={k} value={k}>{t(val.key)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('hr.employee')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('common.department')}</TableHead>
                  <TableHead>{t('hr.checkIn')}</TableHead>
                  <TableHead>{t('hr.checkOut')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('hr.workingHrs')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('hr.overtime')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {t('hr.noAttendanceRecords')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{getInitials(record.employeeName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">
                            {record.employeeName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{record.departmentName}</TableCell>
                      <TableCell>
                        <span className="text-sm font-mono text-green-600">
                          {record.checkInTime || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono text-red-600">
                          {record.checkOutTime || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm font-mono">{record.workingHours.toFixed(1)}h</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {record.overtimeHours > 0 ? (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                            +{record.overtimeHours.toFixed(1)}h
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs',
                            record.status === 'present' && 'bg-green-100 text-green-800',
                            record.status === 'absent' && 'bg-red-100 text-red-800',
                            record.status === 'late' && 'bg-amber-100 text-amber-800',
                            record.status === 'on-leave' && 'bg-purple-100 text-purple-800',
                            record.status === 'half-day' && 'bg-blue-100 text-blue-800',
                          )}
                        >
                          {t(ATTENDANCE_STATUS_CONFIG[record.status].key)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendanceList
