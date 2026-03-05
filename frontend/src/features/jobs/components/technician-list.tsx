/**
 * Technician List Component
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
import { cn } from '@/lib/utils'
import {
  Search, Plus, MoreHorizontal, Eye, Edit, Trash2,
  Users, Star, Phone, Wrench,
} from 'lucide-react'
import type { TechnicianListItem, TechnicianFilters, TechnicianStatus } from '../types/technician.types'

const STATUS_CONFIG: Record<TechnicianStatus, { labelKey: string; color: string }> = {
  available: { labelKey: 'status.available', color: 'bg-green-100 text-green-700' },
  busy: { labelKey: 'status.busy', color: 'bg-blue-100 text-blue-700' },
  on_leave: { labelKey: 'status.onLeave', color: 'bg-amber-100 text-amber-700' },
  off_duty: { labelKey: 'status.offDuty', color: 'bg-slate-100 text-slate-700' },
  on_break: { labelKey: 'status.onBreak', color: 'bg-purple-100 text-purple-700' },
}

interface TechnicianListProps {
  technicians: TechnicianListItem[]
  isLoading: boolean
  onViewTechnician: (tech: TechnicianListItem) => void
  onEditTechnician: (tech: TechnicianListItem) => void
  onDeleteTechnician: (tech: TechnicianListItem) => void
  onAddTechnician: () => void
  onFiltersChange?: (filters: TechnicianFilters) => void
}

export function TechnicianList({
  technicians, isLoading, onViewTechnician, onEditTechnician, onDeleteTechnician,
  onAddTechnician, onFiltersChange,
}: TechnicianListProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
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
      status: (statusFilter || undefined) as TechnicianStatus | undefined,
    })
  }, [debouncedSearch, statusFilter])

  const filteredTechs = useCallback(() => {
    let result = [...technicians]
    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(s) ||
        t.employeeId.toLowerCase().includes(s) ||
        t.phone.includes(s)
      )
    }
    if (statusFilter) result = result.filter(t => t.status === statusFilter)
    return result
  }, [technicians, debouncedSearch, statusFilter])()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('jobs.techniciansTitle')}
            <Badge variant="secondary" className="ms-1">{filteredTechs.length}</Badge>
          </CardTitle>
          <Button size="sm" onClick={onAddTechnician}>
            <Plus className="h-4 w-4 me-1.5" />{t('jobs.addTechnician')}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('jobs.searchTechnicians')}
              className="ps-9 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allStatus')}</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <SelectItem key={key} value={key}>{t(val.labelKey)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('jobs.technician')}</TableHead>
                <TableHead>{t('common.phone')}</TableHead>
                <TableHead>{t('jobs.skills')}</TableHead>
                <TableHead>{t('jobs.activeJobs')}</TableHead>
                <TableHead>{t('jobs.rating')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="w-10"></TableHead>
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
              ) : filteredTechs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {t('jobs.noTechnicians')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTechs.map((tech) => (
                  <TableRow key={tech.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewTechnician(tech)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />{tech.phone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        <Wrench className="h-3 w-3 me-1" />{tech.primarySkill.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{tech.activeJobCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {tech.avgRating.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-xs', STATUS_CONFIG[tech.status].color)}>
                        {t(STATUS_CONFIG[tech.status].labelKey)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewTechnician(tech) }}>
                            <Eye className="h-4 w-4 me-2" />{t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditTechnician(tech) }}>
                            <Edit className="h-4 w-4 me-2" />{t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteTechnician(tech) }}>
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
          ) : filteredTechs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('jobs.noTechnicians')}</p>
          ) : (
            filteredTechs.map((tech) => (
              <Card key={tech.id} className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => onViewTechnician(tech)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                      {tech.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.employeeId}</p>
                    </div>
                  </div>
                  <Badge className={cn('text-xs shrink-0', STATUS_CONFIG[tech.status].color)}>
                    {t(STATUS_CONFIG[tech.status].labelKey)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />{tech.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />{tech.avgRating.toFixed(1)}
                  </span>
                  <span>{tech.activeJobCount} {t('jobs.activeJobs')}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TechnicianList
