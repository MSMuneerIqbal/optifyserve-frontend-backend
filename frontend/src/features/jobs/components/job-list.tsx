/**
 * Job List Component
 * Phase 11: Jobs/Service Management Module
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/utils'
import {
  Search, Plus, MoreHorizontal, Eye, Edit, Trash2, UserPlus, MapPin,
  Download, Briefcase, Clock,
} from 'lucide-react'
import { JobStatusBadge, JobPriorityBadge } from './job-status-badge'
import { SERVICE_TYPE_CONFIG } from '../types/job.types'
import type { JobListItem, JobFilters, JobStatus, JobPriority, ServiceType } from '../types/job.types'
import { formatDuration } from '../utils/schedule-calculator'

interface JobListProps {
  jobs: JobListItem[]
  isLoading: boolean
  onViewJob: (job: JobListItem) => void
  onEditJob: (job: JobListItem) => void
  onDeleteJob: (job: JobListItem) => void
  onAssignTechnician: (job: JobListItem) => void
  onAddJob: () => void
  onFiltersChange?: (filters: JobFilters) => void
  onExport?: () => void
}

export function JobList({
  jobs, isLoading, onViewJob, onEditJob, onDeleteJob, onAssignTechnician,
  onAddJob, onFiltersChange, onExport,
}: JobListProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [serviceTypeFilter, _setServiceTypeFilter] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const filtersRef = useRef(onFiltersChange)
  filtersRef.current = onFiltersChange

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    filtersRef.current?.({
      search: debouncedSearch || undefined,
      status: (statusFilter || undefined) as JobStatus | undefined,
      priority: (priorityFilter || undefined) as JobPriority | undefined,
      serviceType: (serviceTypeFilter || undefined) as ServiceType | undefined,
    })
  }, [debouncedSearch, statusFilter, priorityFilter, serviceTypeFilter])

  const filteredJobs = useCallback(() => {
    let result = [...jobs]
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase()
      result = result.filter(j =>
        j.jobNumber.toLowerCase().includes(s) ||
        j.title.toLowerCase().includes(s) ||
        j.customerName.toLowerCase().includes(s)
      )
    }
    if (statusFilter) result = result.filter(j => j.status === statusFilter)
    if (priorityFilter) result = result.filter(j => j.priority === priorityFilter)
    if (serviceTypeFilter) result = result.filter(j => j.serviceType === serviceTypeFilter)
    return result
  }, [jobs, debouncedSearch, statusFilter, priorityFilter, serviceTypeFilter])()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {t('jobs.jobsTitle')}
            <Badge variant="secondary" className="ms-1">{filteredJobs.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport} className="hidden sm:flex">
                <Download className="h-4 w-4 me-1.5" />{t('common.export')}
              </Button>
            )}
            <Button size="sm" onClick={onAddJob}>
              <Plus className="h-4 w-4 me-1.5" />{t('jobs.newJob')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('jobs.searchJobs')}
              className="ps-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                <SelectItem value="new">{t('status.new')}</SelectItem>
                <SelectItem value="assigned">{t('status.assigned')}</SelectItem>
                <SelectItem value="scheduled">{t('status.scheduled')}</SelectItem>
                <SelectItem value="in_progress">{t('status.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="invoiced">{t('status.invoiced')}</SelectItem>
                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9 w-[120px] hidden sm:flex">
                <SelectValue placeholder={t('common.priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allPriority')}</SelectItem>
                <SelectItem value="low">{t('common.low')}</SelectItem>
                <SelectItem value="medium">{t('common.medium')}</SelectItem>
                <SelectItem value="high">{t('common.high')}</SelectItem>
                <SelectItem value="urgent">{t('common.urgent')}</SelectItem>
                <SelectItem value="emergency">{t('common.emergency')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('jobs.job')}</TableHead>
                <TableHead>{t('jobs.customer')}</TableHead>
                <TableHead>{t('jobs.service')}</TableHead>
                <TableHead>{t('jobs.schedule')}</TableHead>
                <TableHead>{t('jobs.technician')}</TableHead>
                <TableHead>{t('common.priority')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    {t('jobs.noJobs')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewJob(job)}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{job.jobNumber}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">{job.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{job.customerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{job.serviceAddress.area}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {t(SERVICE_TYPE_CONFIG[job.serviceType]?.key)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(job.scheduledDate)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{job.scheduledTime} ({formatDuration(job.estimatedDuration)})
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{job.assignedTechnicianName || <span className="text-muted-foreground italic">{t('jobs.unassigned')}</span>}</p>
                    </TableCell>
                    <TableCell>
                      <JobPriorityBadge priority={job.priority} />
                    </TableCell>
                    <TableCell>
                      <JobStatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewJob(job) }}>
                            <Eye className="h-4 w-4 me-2" />{t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditJob(job) }}>
                            <Edit className="h-4 w-4 me-2" />{t('common.edit')}
                          </DropdownMenuItem>
                          {!job.assignedTechnicianName && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAssignTechnician(job) }}>
                              <UserPlus className="h-4 w-4 me-2" />{t('jobs.assignTech')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteJob(job) }}>
                            <Trash2 className="h-4 w-4 me-2" />{t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('jobs.noJobs')}</p>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => onViewJob(job)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{job.jobNumber}</span>
                      <JobPriorityBadge priority={job.priority} />
                    </div>
                    <p className="font-medium text-sm mt-1 truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.customerName}</p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{job.serviceAddress.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{formatDate(job.scheduledDate)} {job.scheduledTime}
                  </span>
                </div>
                {job.assignedTechnicianName && (
                  <p className="text-xs mt-1">
                    <span className="text-muted-foreground">{t('jobs.tech')}: </span>
                    <span className="font-medium">{job.assignedTechnicianName}</span>
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default JobList
